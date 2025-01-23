import React, {useState} from 'react';

import {Item} from "./models/Item.tsx";
import {useProgress} from "./UseProgress.tsx";
import {TouchApp} from "@mui/icons-material";


interface TodoListProps {
  items: Item[],
  onAddItem: (item: Item) => void,
  onToggleListSelected: (item: Item) => void,
  onDeleteItems: (ids: number[]) => void
}

export default function TodoList({
                                   items,
                                   onAddItem,
                                   onToggleListSelected,
                                   onDeleteItems,
                                 }: TodoListProps) {
  const [category, setCategory] = useState('食料品');
  const [allDoneConfirm, setAllDoneConfirm] = useState(false);
  const [allDoneTimeOut, setAllDoneTimeOut] = useState<number | undefined>(undefined);
  const tabsCategories = ['食料品', '調味料', '日用品'];
  const deleteItems = (items: Item[]) => {
    const ids = items.map((item) => item.id);
    onDeleteItems(ids);
  }
  const list = items.filter((item) => item.categories.includes(category));

  const {
    progress,
    progressVisibility,
    setProgress,
  } = useProgress();
  return (
    <>
      <div className="CategoryTabsBar">
        {tabsCategories.map((cat, i) => (
          <div
            key={i}
            onClick={() => setCategory(cat)}
            className={`CategoryTab ${cat === category ? 'CategoryTabActive' : ''}`}
          >
            {cat}
            <span className={'CategoryTabNumber'}>
                            {' (' + items.filter((item) => item.categories.includes(cat)).length + ')'}
                        </span>
          </div>
        ))}
      </div>
      <h3 style={{marginBottom: '0'}}>
        {((p) => {
          switch (p) {
            case 101:
              return 'タップしてアイテムを解決';
            case 102:
              return '削除ボタンで解決したアイテムを削除';
            case 200:
              return '下のタブのカードをタップ';
            default:
              return 'メモ';
          }
        })(progress)}
      </h3>
      <div className='TodoListDiv'>
        <ul className='TodoListUl'>
          {
            list
              .map((item, i) => (
                <label key={item.id}>
                  <li className={`TodoListLi ${item.selected ? 'TodoListLiSelected' : ''}`}>
                    <input
                      type='checkbox'
                      checked={item.selected}
                      onChange={() => {
                        const newItem = structuredClone(item);
                        newItem.selected = !item.selected;
                        if (progress === 101) {
                          setProgress(102);
                        }
                        onToggleListSelected(newItem)
                      }}
                    />
                    {item.name}
                    {i === 0 && progress === 101 && (
                      <TouchApp
                        className="TouchAppOnboardingItem"
                        fontSize="large"
                        color="primary"
                      />
                    )}
                  </li>
                </label>
              ))
          }
          <label key='new'>
            <li className='TodoListLi'>
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
        <div
          className="TodoListButtonField"
          style={progressVisibility(102)}
        >
          <button
            disabled={list.filter((item) => item.selected).length === 0}
            onClick={() => {
              if (progress === 102) {
                setProgress(200);
              }
              deleteItems(list.filter((item) => item.selected && item.categories.includes(category)))
            }}
          >
            削除 ✅
            {progress == 102 && (
              <TouchApp
                className="TouchAppOnboardingItem"
                fontSize="large"
                color="primary"
              />
            )}
          </button>
        </div>
        <div
          className="TodoListButtonField"
          style={progressVisibility(102)}
        >
          <button
            className={'buttonWarning'}
            onClick={() => {
              if (allDoneConfirm) {
                if (progress === 102) {
                  setProgress(200);
                }
                deleteItems(list.filter((item) => item.categories.includes(category)))
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


