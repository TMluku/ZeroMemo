import PropTypes from 'prop-types';


export default function Todos({category, items, onAddItem, onDeleteItems, onToggleListSelected}) {
    const list = items.filter((item) => item.category === category)
    return (
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
                                <li className={`todoListLi ${item.selected ? 'selected' : ''}`}>
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
                    追加
                </button>
            </div>
            <div className="todoListButtonField">
                <button onClick={() => onDeleteItems(false)}>
                    選んだ要素を削除
                </button>
            </div>
            <div className="todoListButtonField">
                <button
                    className={'buttonWarning'}
                    onClick={() => onDeleteItems(true)}>
                    全ての要素を削除
                </button>
            </div>
        </div>
    );
}

Todos.propTypes = {
    category: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItems: PropTypes.func.isRequired,
    onToggleListSelected: PropTypes.func.isRequired,
};

