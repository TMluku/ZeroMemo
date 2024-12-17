import React, {useState} from 'react';
import TinderCard from 'react-tinder-card';
import './SwipeCards.css';
import {Card, Item} from "./Home";

interface SwipeCardsProps {
  onAddItem: (item: Item) => void,
  onRejectItem: (item: string, date: Date) => void,
  onAddUserPrefers: (item: string, modifyFunction: (score: number) => number) => void,
  timeout: number,
  itemList: Item[],
  userPrefers: { [key: string]: number },
  rejectedDateList: { [key: string]: Date },
  cardList: Card[]
}

export default function SwipeCards({
                                     onAddItem,
                                     onRejectItem,
                                     onAddUserPrefers,
                                     timeout = 0,
                                     itemList,
                                     userPrefers,
                                     rejectedDateList,
                                     cardList
                                   }: SwipeCardsProps) {

  const getUserPrefers = (name: string) => {
    return userPrefers[name] || 0;
  }

  const makeCardList = (category: string, revival: boolean) => {
    const itemsSet = new Set(itemList.map(item => item.name));
    const date = new Date();
    const filterFunc = revival ?
      (card: Card) => {
        return !itemsSet.has(card.name)
          && card.categories.includes(category)
          && getUserPrefers(card.name) > -100;
      } :
      (card: Card) => {
        return !itemsSet.has(card.name)
          && card.categories.includes(category)
          && (rejectedDateList[card.name] === undefined || date.getTime() - rejectedDateList[card.name].getTime() > timeout)
          && getUserPrefers(card.name) > -100;
      }

    const cards = cardList.filter(card => card.categories.includes(category) && filterFunc(card));

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
    const shuffleItems = makeCardList(category, revival);
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

  const shuffledItems = makeCardList(tabCategory, false);
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
              style={card.toBackgroundStyle()}
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

