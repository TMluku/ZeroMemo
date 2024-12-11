import React, {useEffect, useState} from 'react';
import TinderCard from 'react-tinder-card';
import * as PropTypes from 'prop-types';
import './SwipeCards.css';

const groceryItemsName = [
    'いちご',
    'きゅうり',
    'じゃがいも',
    'にんじん',
    'ほうれん草',
    'みかん',
    'キャベツ',
    'トマト',
    'バナナ',
    'パン',
    'ピーマン',
    'りんご',
    'レタス',
    '卵',
    '牛乳',
    '肉',
    '玉ねぎ',
    'もやし',
    'グラノーラ',
    'コーヒー',
    'ハム,ベーコン,ソーセージ',
    'パスタ',
    'プロテイン',
    'ヨーグルト',
    '水',
    '米',
    '納豆',
    '豆腐',
    'ツナ缶',
];

const seasoningItemsName = [
    'ルー',
    '料理酒',
    'みりん',
    'マヨネーズ',
    'しょうがチューブ',
    'にんにくチューブ',
    'オイスターソース',
    'オリーブオイル',
    'ケチャップ',
    'コショウ',
    'ドレッシング',
    'ポン酢',
    'サラダ油',
    'ごま油',
    'ラード',
    'ラー油',
    '味の素',
    '和風だし',
    '砂糖',
    '塩',
    '酢',
    '醤油',
    '味噌',
    '鶏がらスープの素',
    '片栗粉',
];

const condimentItemsName = [
    'はちみつ',
    'ジャム',
    'バター',
    'マーガリン',
];

const necessaryItemsName = [
    'アルミホイル',
    'キッチンペーパー',
    'ゴミ袋',
    'サランラップ',
    'シャンプー',
    'スポンジ',
    'ティッシュペーパー',
    'トイレットペーパー',
    'フリーザーパック',
    'ボディシート',
    'ボディソープ',
    'リンス',
    '洗剤（衣類用）',
    '洗剤（食器用）',
    '電池',
    'リップクリーム',
    '乳液',
    '化粧水',
    '洗顔フォーム',
    '鎮痛剤',
    'トイレ洗浄',
    'マスク',
    '殺虫剤',
    '消臭剤',
    '衣類用漂白剤',
]

const itemNameToItem = (name, categories) => {
    const url = `./${name}.png`;
    return {categories, name, url};
}

export default function SwipeCards({
                                       onAddItem,
                                       onRejectItem,
                                       onAddUserPrefers,
                                       timeout = 1000 * 60,
                                       itemList,
                                       userPrefers,
                                       rejectedDateList
                                   }) {

    const getUserPrefers = (name) => {
        return userPrefers[name] || 0;
    }

    const makeItems = (category, revival) => {
        const anyCategory = category === 'すべて';
        const itemsSet = new Set(itemList.map(item => item.name));
        const date = new Date();
        const filterFunc = revival ?
            (item) => {
                return !itemsSet.has(item) && getUserPrefers(item) > -100;
            } :
            (item) => {
                return !itemsSet.has(item) && (!rejectedDateList[item] || date.getTime() - rejectedDateList[item].getTime() > timeout) && getUserPrefers(item) > -100;
            }
        const groceryItems = anyCategory || category === '食料品' ? groceryItemsName
            .filter(filterFunc)
            .map(name => itemNameToItem(name, ['食料品'])) : [];
        const necessaryItems = anyCategory || category === '日用品' ? necessaryItemsName
            .filter(filterFunc)
            .map(name => itemNameToItem(name, ['日用品'])) : [];
        const seasoningItems = anyCategory || category === '調味料' ? seasoningItemsName
            .filter(filterFunc)
            .map(name => itemNameToItem(name, ['調味料'])) : [];
        const condimentItems = anyCategory || category === '調味料' || category === '食料品' ? condimentItemsName
            .filter(filterFunc)
            .map(name => itemNameToItem(name, ['調味料', '食料品'])) : [];

        const items = [...groceryItems, ...necessaryItems, ...seasoningItems, ...condimentItems];

        const itemLength = category === 'すべて' ? 20 : items.length;

        return items
            .map(value => ({value, prefer: getUserPrefers(value.name), sort: Math.random()}))
            .sort((a, b) => {
                if (a.prefer !== b.prefer) {
                    return a.prefer - b.prefer;
                }
                return a.sort - b.sort
            })
            .map(({value}) => value)
            .slice(0, itemLength);
    }

    const updateList = (category, revival) => {
        const shuffleItems = makeItems(category, revival);
        setCards(shuffleItems);
        updateCurrentIndex(shuffleItems.length - 1);
        childRefs.forEach((childRef) => {
            childRef.current.restoreCard()
        })
    }

    function updateTab(category) {
        setTabCategory(category);
        updateList(category);
    }

    const tabsCategories = ['食料品', '調味料', '日用品'];
    const [tabCategory, setTabCategory] = useState(tabsCategories[0]);

    const shuffledItems = makeItems(tabCategory, false);
    const [cards, setCards] = useState(shuffledItems);

    const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
    const currentIndexRef = React.useRef(currentIndex);

    const childRefs = React.useMemo(() => Array(cards.length)
        .fill(0)
        .map(() => React.createRef()), [cards.length]);

    const updateCurrentIndex = (index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    }

    const canSwipe = currentIndex >= 0;

    const swiped = (dir, card, index) => {
        updateCurrentIndex(index - 1);
        if (dir === 'right') {
            const score =
                card.categories.includes('調味料') ||
                card.categories.includes('日用品') ? -1 : 1;
            onAddUserPrefers(card.name, (s) => s + score);
            onAddItem({id: 0, categories: card.categories, name: card.name, selected: false});
        }
        if (dir === 'left') {
            onAddUserPrefers(card.name, (s) => s * 1);
            onRejectItem(card.name, new Date());
        }
        if (dir === 'down') {
            onAddUserPrefers(card.name, () => -999999);
        }
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < cards.length) {
            await childRefs[currentIndex].current.swipe(dir);
        }
    }

    function undoSwipe() {
        if (currentIndexRef.current < cards.length - 1) {
            updateCurrentIndex(currentIndexRef.current + 1);
            childRefs[currentIndexRef.current].current.restoreCard();
        }
    }

    return (
        <>
            <div className="cardCategoryTabs">
                {tabsCategories.map((category, i) => (<div
                    key={i}
                    onClick={() => updateTab(category)}
                    className={`cardCategoryTab ${tabCategory === category ? 'cardCategoryTabActive' : ''}`}
                >
                    {category}
                </div>))}
            </div>
            <div className="matching">
                <h4 className="cardLeft">
                    のこり{currentIndex + 1}枚
                </h4>
                <div className="cardContainer">
                    <button
                        className="reloadCardButton"
                        onClick={() => {
                            updateList(tabCategory, true)
                        }}
                    >
                        ↻
                    </button>
                    {cards.map((card, i) => (<TinderCard
                        ref={childRefs[i]}
                        className={'swipe'}
                        key={i}
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => swiped(dir, card, i)}
                        // onCardLeftScreen={(dir) => swiped(dir, card, i)}
                    >
                        <div
                            style={{backgroundImage: `url(${card.url})`}}
                            className={'card'}
                        >
                            <h3>{card.name} : {Math.floor(getUserPrefers(card.name))}</h3>
                        </div>
                    </TinderCard>))}
                </div>
                <div className="swipeCardButtons">
                    <button
                        onClick={undoSwipe}
                        className="buttonUndo"
                    >
                        一つ戻す ↩️
                    </button>
                    <button
                        onClick={() => {
                            confirm('このカードをゴミ箱に移しますか？\nゴミ箱にあるカードは表示されなくなります。\nゴミ箱のカードはいつでももどすことができます。') && swipe('down');
                        }}
                        className="buttonWarning"
                    >
                        ゴミ箱へ 🚮
                    </button>
                </div>
            </div>
        </>
    );
}

SwipeCards.propTypes = {
    onAddItem: PropTypes.func.isRequired,
    onRejectItem: PropTypes.func.isRequired,
    onAddUserPrefers: PropTypes.func.isRequired,
    timeout: PropTypes.number.isRequired,
    itemList: PropTypes.array.isRequired,
    userPrefers: PropTypes.object.isRequired,
    rejectedDateList: PropTypes.object.isRequired,
}
