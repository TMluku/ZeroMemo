import React, {useState} from 'react';

import {Item} from "./models/Item.tsx";


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
            <div className='TodoListDiv'>
                <ul className='TodoListUl'>
                    {
                        list
                            .map((item) => (
                                <label key={item.id}>
                                    <li className={`TodoListLi ${item.selected ? 'TodoListLiSelected' : ''}`}>
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
                <div className="TodoListButtonField">
                    <button
                        disabled={list.filter((item) => item.selected).length === 0}
                        onClick={() => {
                            deleteItems(list.filter((item) => item.selected && item.categories.includes(category)))
                        }}
                    >
                        削除 ✅
                    </button>
                </div>
                <div className="TodoListButtonField">
                    <button
                        className={'buttonWarning'}
                        onClick={() => {
                            if (allDoneConfirm) {
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


