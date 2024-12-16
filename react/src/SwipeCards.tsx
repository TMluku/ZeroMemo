import React, {useState} from 'react';
import TinderCard from 'react-tinder-card';
import './SwipeCards.css';
import {Card, Item} from "./Home";

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

interface SwipeCardsProps {
  onAddItem: (item: Item) => void;
  onRejectItem: (item: string, date: Date) => void;
  onAddUserPrefers: (item: string, modifyFunction: (score: number) => number) => void;
  timeout: number;
  itemList: Item[];
  userPrefers: { [key: string]: number };
  rejectedDateList: { [key: string]: Date };
}

export default function SwipeCards({
                                     onAddItem,
                                     onRejectItem,
                                     onAddUserPrefers,
                                     timeout = 0,
                                     itemList,
                                     userPrefers,
                                     rejectedDateList,
                                   }: SwipeCardsProps) {

  const getUserPrefers = (name: string) => {
    return userPrefers[name] || 0;
  }

  const makeItems = (category: string, revival: boolean) => {
    const itemsSet = new Set(itemList.map(item => item.name));
    const date = new Date();
    const filterFunc = revival ?
      (item: string) => {
        return !itemsSet.has(item) && getUserPrefers(item) > -100;
      } :
      (item: string) => {
        return !itemsSet.has(item) && (!rejectedDateList[item] || date.getTime() - rejectedDateList[item].getTime() > timeout) && getUserPrefers(item) > -100;
      }
    const groceryCards = category === '食料品' ? groceryItemsName
      .filter(filterFunc)
      .map(name => Card.fromItem(name, ['食料品'])) : [];
    const necessaryCards = category === '日用品' ? necessaryItemsName
      .filter(filterFunc)
      .map(name => Card.fromItem(name, ['日用品'])) : [];
    const seasoningCards = category === '調味料' ? seasoningItemsName
      .filter(filterFunc)
      .map(name => Card.fromItem(name, ['調味料'])) : [];
    const condimentCards = category === '調味料' || category === '食料品' ? condimentItemsName
      .filter(filterFunc)
      .map(name => Card.fromItem(name, ['食料品', '調味料'])) : [];

    const cards = [...groceryCards, ...necessaryCards, ...seasoningCards, ...condimentCards];

    return cards
      .map(value => ({value, prefer: getUserPrefers(value.name), sort: Math.random()}))
      .sort((a, b) => {
        if (a.prefer !== b.prefer) {
          return a.prefer - b.prefer;
        }
        return a.sort - b.sort
      })
      .map(({value}) => value);
  }

  const updateList = (category: string, revival: boolean) => {
    const shuffleItems = makeItems(category, revival);
    setCards(shuffleItems);
    updateCurrentIndex(shuffleItems.length - 1);
    childRefs.forEach((childRef) => {
      childRef.current.restoreCard()
    })
  }

  function updateTab(category: string) {
    setTabCategory(category);
    updateList(category, false);
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

  const updateCurrentIndex = (index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
  }

  const canSwipe = currentIndex >= 0;

  const swiped = (dir: 'up' | 'down' | 'left' | 'right', card: Card, index: number) => {
    updateCurrentIndex(index - 1);
    if (dir === 'right') {
      const score =
        card.categories.includes('調味料') ||
        card.categories.includes('日用品') ? -1 : 1;
      onAddUserPrefers(card.name, (s: number) => s + score);
      onAddItem({id: 0, categories: card.categories, name: card.name, selected: false});
    }
    if (dir === 'left') {
      onAddUserPrefers(card.name, (s: number) => s);
      onRejectItem(card.name, new Date());
    }
    if (dir === 'down') {
      onAddUserPrefers(card.name, () => -999999);
    }
  }

  const swipe = async (dir: 'up' | 'down' | 'left' | 'right') => {
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
              style={{backgroundImage: `url(data:image/png;base64,${card.imgBase64})`}}
              className={'card'}
            >
              <h3>{card.name}</h3>
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
              if (confirm('このカードをゴミ箱に移しますか？\nゴミ箱にあるカードは表示されなくなります。\nゴミ箱のカードはいつでももどすことができます。')) {
                swipe('down');
              }
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

