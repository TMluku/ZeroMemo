import React from 'react';
import SwipeCards from './SwipeCards.js';
import TodoList from './TodoList.js';
import Cards from './Cards.tsx';
import History from './History.tsx';
import {Item} from './models/Item.tsx';
import {Card} from './models/Card.tsx';
import {HistoryItem} from './models/HistoryItem.tsx';

interface MainContentProps {
  tab: "swipe" | "todo" | "cards" | "history";
  todoList: Item[];
  cardList: Card[];
  historyList: HistoryItem[];
  userPrefers: { [key: string]: number };
  rejectedDateList: { [key: string]: Date };
  onAddItem: (item: Item) => void;
  onRejectItem: (item: string, date: Date) => void;
  onAddUserPrefers: (item: string, diff: (score: number) => number) => void;
  onDeleteItems: (ids: number[]) => void;
  onToggleListSelected: (item: Item) => void;
  onAppendCard: (card: Card) => void;
  onEditCard: (card: Card) => void;
  onAppendHistories: (histories: HistoryItem[]) => void;
  onItemNotification: () => void;
}

const Content: React.FC<MainContentProps> = ({
                                               tab,
                                               todoList,
                                               cardList,
                                               historyList,
                                               userPrefers,
                                               rejectedDateList,
                                               onAddItem,
                                               onRejectItem,
                                               onAddUserPrefers,
                                               onDeleteItems,
                                               onToggleListSelected,
                                               onAppendCard,
                                               onEditCard,
                                               onAppendHistories,
                                               onItemNotification
                                             }) => {
  const contents = {
    "swipe":
      <SwipeCards
        onAddItem={(item: Item) => {
          onAddItem(item);
          onItemNotification();
          onAppendHistories([new HistoryItem(item, new Date())]);
        }}
        cardList={cardList}
        onRejectItem={onRejectItem}
        onAddUserPrefers={onAddUserPrefers}
        itemList={todoList}
        userPrefers={userPrefers}
        rejectedDateList={rejectedDateList}
        timeout={1000 * 60 * 60}
      />,
    "todo":
      <TodoList
        items={todoList}
        onAddItem={onAddItem}
        onDeleteItems={onDeleteItems}
        onToggleListSelected={onToggleListSelected}
      />,
    "cards":
      <Cards
        onAppendCard={onAppendCard}
        onEditCard={onEditCard}
        cardList={cardList}
      />,
    "history":
      <History
        historyItems={historyList}
        onAddItem={(item) => {
          onAddItem(item);
          onItemNotification();
          onAppendHistories([new HistoryItem(item, new Date())]);
        }}
      />,
  };

  return (
    <section className="Content">
      {contents[tab]}
    </section>
  );
};

export default Content;