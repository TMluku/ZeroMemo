import PropTypes from 'prop-types';
import {useState} from 'react';


export default function Todos({items, onAddItem, onDeleteItems, onToggleListSelected}) {
    const [category, setCategory] = useState('食料品');
    const tabsCategories = ['食料品', '日用品'];
    const deleteItems = onDeleteItems(category);
    const list = items.filter((item) => item.category === category)
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
                    </div>
                ))}
            </div>
            <div className='todoListDiv'>
                <h2 className='todoListHeader'>
                    {category}
                </h2>
                <p style={{display: list.length === 0 ? 'block' : 'none', textAlign: 'center'}}>
                    -- 未記入 --
                </p>
                <ul className='todoListUl'>
                    {
                        list
                            .filter((item) => item.category === category)
                            .toReversed()
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
                </ul>
                <div className="todoListButtonField">
                    <input type='text' id={category} size={6}/>
                    <button
                        onClick={() => {
                            if (document.getElementById(category).value === '') return
                            const newItem = {
                                id: 0,
                                category: category,
                                name: document.getElementById(category).value,
                                selected: false,
                            }
                            onAddItem(newItem)
                            document.getElementById(category).value = ''
                        }}
                        className="buttonGood"
                    >
                        Add
                    </button>
                </div>
                <div className="todoListButtonField">
                    <button
                        disabled={list.filter((item) => item.selected).length === 0}
                        onClick={() => deleteItems(false)}
                    >
                        Done!
                    </button>
                </div>
                <div className="todoListButtonField">
                    <button
                        className={'buttonWarning'}
                        onClick={() => deleteItems(true)}>
                        All Done!
                    </button>
                </div>
            </div>
        </>
    );
}

Todos.propTypes = {
    items: PropTypes.array.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItems: PropTypes.func.isRequired,
    onToggleListSelected: PropTypes.func.isRequired,
};

