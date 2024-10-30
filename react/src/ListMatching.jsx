import * as PropTypes from 'prop-types';
import itemLists from './assets/items.json';

export function ListMatching({onAddItem}) {
    const itemList = itemLists['itemList']
    return (
        <div>
            <h2>リストから選ぶ</h2>
            <p>
                以下のリストから選択し、追加ボタンを押してください。
            </p>
            <div>
                <select>
                    {
                        Object.keys(itemList).map((category) => (
                            <optgroup key={category} label={category}>
                                {
                                    itemList[category].map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))
                                }
                            </optgroup>
                        ))
                    }
                </select>
                <button
                    onClick={() => {
                        const category = document.querySelector('select').selectedOptions[0].parentNode.label
                        const name = document.querySelector('select').selectedOptions[0].value
                        const item = {
                            category: category,
                            name: name,
                            selected: false
                        }
                        onAddItem(item)
                    }}
                    className="buttonGood"
                >
                    追加
                </button>
            </div>
        </div>
    )
}

ListMatching.propTypes = {onAddItem: PropTypes.func};
