import React, {useState} from 'react';
import {Item} from "./Home";


interface TodoListProps {
  items: Item[]
  onAddItem: (item: Item) => void
  onDeleteItemsByCategory: (category: string, all: boolean) => void
  onToggleListSelected: (item: Item) => void
}

export default function TodoList({items, onAddItem, onDeleteItemsByCategory, onToggleListSelected}: TodoListProps) {
  const [category, setCategory] = useState('食料品');
  const [allDoneConfirm, setAllDoneConfirm] = useState(false);
  const [allDoneTimeOut, setAllDoneTimeOut] = useState<number | undefined>(undefined);
  const tabsCategories = ['食料品', '調味料', '日用品'];
  const deleteItems = (all: boolean) => onDeleteItemsByCategory(category, all);
  const list = items.filter((item) => item.categories.includes(category));
  return (
    <>
      <div className="cardCategoryTabs">
        {tabsCategories.map((cat, i) => (
          <div
            key={i}
            onClick={() => setCategory(cat)}
            className={`cardCategoryTab ${cat === category ? 'cardCategoryTabActive' : ''}`}
          >
            {cat}
            <span className={'cardCategoryTabNumber'}>
                            {' (' + items.filter((item) => item.categories.includes(cat)).length + ')'}
                        </span>
          </div>
        ))}
      </div>
      <h2>メモ</h2>
      <div className='todoListDiv'>
        <h3 className='todoListHeader'>
          {category}
        </h3>
        <ul className='todoListUl'>
          {
            list
              .map((item) => (
                <label key={item.id}>
                  <li className={`todoListLi ${item.selected ? 'todoListLiSelected' : ''}`}>
                    <input
                      type='checkbox'
                      checked={item.selected}
                      onChange={() => {
                        const newItem = structuredClone(item);
                        newItem.selected = !item.selected;
                        onToggleListSelected(newItem)
                      }}
                    />
                    {item.name}
                  </li>
                </label>
              ))
          }
          <label key='new'>
            <li className='todoListLi'>
              <input type='checkbox' disabled/>
              <input
                type='text'
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    const newItem = {
                      id: 0,
                      categories: [category],
                      name: e.currentTarget.value,
                      selected: false,
                    }
                    onAddItem(newItem)
                    e.currentTarget.value = ''
                  }
                }}
              />
            </li>
          </label>
        </ul>
        <div className="todoListButtonField">
          <button
            disabled={list.filter((item) => item.selected).length === 0}
            onClick={() => deleteItems(false)}
          >
            削除 ✅
          </button>
        </div>
        <div className="todoListButtonField">
          <button
            className={'buttonWarning'}
            onClick={() => {
              if (allDoneConfirm) {
                deleteItems(true)
                clearTimeout(allDoneTimeOut)
                setAllDoneConfirm(false)
                setAllDoneTimeOut(undefined)
              } else {
                setAllDoneConfirm(true)
                const timeOut = setTimeout(() => {
                  setAllDoneConfirm(false)
                }, 3000)
                setAllDoneTimeOut(timeOut)
              }
            }}
          >
            {allDoneConfirm ? 'もう一度押下して全削除' : '全削除'}
          </button>
        </div>
      </div>
    </>
  );
}


