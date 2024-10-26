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
    'ハム',
    'ピーマン',
    'りんご',
    'レタス',
    '卵',
    '牛乳',
    '牛肉',
    '玉ねぎ',
    '豚肉',
    '鶏肉',
    'みりん',
    'もやし',
    'グラノーラ',
    'コーヒー',
    'ハム,ベーコン,ソーセージ',
    'パスタ',
    'プロテイン',
    'マヨネーズ',
    'ヨーグルト',
    'ルー',
    '味噌',
    '料理酒',
    '水',
    '油（サラダ油、オリーブオイルなど）',
    '米',
    '納豆',
    '肉',
    '豆腐',
    '醤油',
    '野菜',
]

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
]

export default function SwipeCards({onAddItem, itemList}) {
    const makeItems = (category) => {
        const anyCategory = category === 'すべて';
        const itemsSet = new Set(itemList.map(item => item.name));
        const groceryItems = anyCategory || category === '食料品'
            ? groceryItemsName
                .filter(name => !itemsSet.has(name))
                .map(name => ({
                    category: '食料品',
                    name: name,
                    url: `./${name}.png`,
                }))
            : [];
        const necessaryItems = anyCategory || category === '日用品'
            ? necessaryItemsName
                .filter(name => !itemsSet.has(name))
                .map(name => ({
                    category: '日用品',
                    name: name,
                    url: `./${name}.png`,
                }))
            : [];

        const items = groceryItems.concat(necessaryItems);

        return items
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value).slice(0, 20)
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

    const tabsCategories = ['すべて', '食料品', '日用品'];
    const [tabCategory, setTabCategory] = useState('すべて');

    const shuffledItems = makeItems(tabCategory);
    const [cards, setCards] = useState(shuffledItems);

    const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
    const currentIndexRef = React.useRef(currentIndex);

    const childRefs = React.useMemo(
        () =>
            Array(cards.length)
                .fill(0)
                .map(() => React.createRef()),
        [cards.length]
    );

    const updateCurrentIndex = (index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    }

    const canSwipe = currentIndex >= 0;

    const swiped = (dir, card, index) => {
        updateCurrentIndex(index - 1);
        if (dir === 'right') {
            onAddItem({id: 0, category: card.category, name: card.name, selected: false});
        }
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < cards.length) {
            await childRefs[currentIndex].current.swipe(dir);
        }
    }


    return (
        <div>
            <div className="cardCategoryTabs">
                {tabsCategories.map((category, i) => (
                    <div
                        key={i}
                        onClick={() => updateTab(category)}
                        className={`cardCategoryTab ${tabCategory === category ? 'cardCategoryTabActive' : ''}`}
                    >
                        {category}
                    </div>
                ))}
            </div>
            <h4 className="cardLeft">
                のこり{currentIndex + 1}枚
            </h4>
            <div className="cardContainer">
                {cards.map((card, i) => (
                    <TinderCard
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
                    </TinderCard>
                ))}
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
        </div>
    );
}

SwipeCards.propTypes = {onAddItem: PropTypes.func.isRequired};
SwipeCards.propTypes = {itemList: PropTypes.array.isRequired};
