import React, {useState} from 'react';
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
]

export default function SwipeCards({onAddItem, onRejectItem, itemList, rejectedDateList}) {
    const makeItems = (category) => {
        const anyCategory = category === 'すべて';
        const itemsSet = new Set(itemList.map(item => item.name));
        const date = new Date();
        const filterFunc = (item) => {
            return !itemsSet.has(item) && (!rejectedDateList[item] || date.getTime() - rejectedDateList[item].getTime() > 1000 * 60 * 60);
        }
        const groceryItems = anyCategory || category === '食料品' ? groceryItemsName
            .filter(filterFunc)
            .map(name => ({
                categories: ['食料品'], name: name, url: `./${name}.png`,
            })) : [];
        const necessaryItems = anyCategory || category === '日用品' ? necessaryItemsName
            .filter(filterFunc)
            .map(name => ({
                categories: ['日用品'], name: name, url: `./${name}.png`,
            })) : [];
        const seasoningItems = anyCategory || category === '調味料' ? seasoningItemsName
            .filter(filterFunc)
            .map(name => ({
                categories: ['調味料'], name: name, url: `./${name}.png`,
            })) : [];
        const condimentItems = anyCategory || category === '調味料' || category === '食料品' ? condimentItemsName
            .filter(filterFunc)
            .map(name => ({
                categories: ['調味料', '食料品'], name: name, url: `./${name}.png`,
            })) : [];

        const items = [...groceryItems, ...necessaryItems, ...seasoningItems, ...condimentItems];

        const itemLength = category === 'すべて' ? 20 : items.length;

        return items
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)
            .slice(0, itemLength);
    }

    const updateList = (category) => {
        const shuffleItems = makeItems(category);
        setCards(shuffleItems);
        updateCurrentIndex(shuffleItems.length - 1);
        childRefs.forEach((childRef) => {
            childRef.current.restoreCard()
        })
    }

    function updateTab(category) {
        if (tabCategory === category) {
            return;
        }
        setTabCategory(category);
        updateList(category);
    }

    const tabsCategories = ['すべて', '食料品', '調味料', '日用品'];
    const [tabCategory, setTabCategory] = useState('すべて');

    const shuffledItems = makeItems(tabCategory);
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
            onAddItem({id: 0, categories: card.categories, name: card.name, selected: false});
        }
        if (dir === 'left') {
            onRejectItem(card.name);
        }
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < cards.length) {
            await childRefs[currentIndex].current.swipe(dir);
        }
    }


    return (<div>
        <div className="cardCategoryTabs">
            {tabsCategories.map((category, i) => (<div
                key={i}
                onClick={() => updateTab(category)}
                className={`cardCategoryTab ${tabCategory === category ? 'cardCategoryTabActive' : ''}`}
            >
                {category}
            </div>))}
        </div>
        <h4 className="cardLeft">
            のこり{currentIndex + 1}枚
        </h4>
        <div className="cardContainer">
            {cards.map((card, i) => (<TinderCard
                ref={childRefs[i]}
                className={'swipe'}
                key={i}
                preventSwipe={['up', 'down']}
                onSwipe={(dir) => swiped(dir, card, i)}
            >
                <div
                    style={{backgroundImage: `url(${card.url})`}}
                    className={'card'}
                >
                    <h3>{card.name}</h3>
                </div>
            </TinderCard>))}
        </div>
        <div className="swipeCardButtons">
            <button
                onClick={() => swipe('left')}
            >
                Not yet
            </button>
            <button
                onClick={() => swipe('right')}
                className="buttonGood"
            >
                Need!
            </button>
        </div>
    </div>);
}

SwipeCards.propTypes = {
    onAddItem: PropTypes.func.isRequired,
    onRejectItem: PropTypes.func.isRequired,
    itemList: PropTypes.array.isRequired,
    rejectedDateList: PropTypes.object.isRequired,
}
