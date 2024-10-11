import PropTypes from "prop-types";
import {useState} from "react";
import itemLists from "./assets/items.json";

export default function Matching({onAddItem}) {
    const [category, setCategory] = useState("食料品")
    const [itemIndex, setItemIndex] = useState(0)
    const itemList = itemLists["itemList"]
    const [matchingItem, setMatchingItem] = useState(itemList[category][itemIndex])

    function changeCategory() {
        const newCategory = category === "食料品" ? "日用品" : "食料品"
        setCategory(newCategory)
        setItemIndex(0)
        setMatchingItem(itemList[newCategory][0])
    }

    function selectMatchingItem(isSelected) {
        if (isSelected) {
            const item = {
                category: category,
                name: matchingItem,
                selected: false
            }
            onAddItem(item)
        }
        const nextIndex = itemIndex === itemList[category].length - 1 ? 0 : itemIndex + 1
        setItemIndex(nextIndex)
        setMatchingItem(itemList[category][nextIndex])
    }

    return (
        <div className={"matching"}>

            <div>
                <button onClick={changeCategory}>
                    カテゴリ切替 「{category === "食料品" ? "食料品" : "日用品"}」
                </button>
            </div>
            <div className="matchingItem">
                <img
                    src={`./${matchingItem}.png`} alt={matchingItem} width={150}
                    onError={(e) => {
                        e.target.src = './150.png'
                    }}
                />
                <h3>
                    {matchingItem}
                </h3>
                <button onClick={() => selectMatchingItem(true)} className="buttonGood">
                    欲しい
                </button>
                <button onClick={() => selectMatchingItem(false)} className="buttonWarning">
                    いらない
                </button>
            </div>
        </div>
    )
}

Matching.propTypes = {
    onAddItem: PropTypes.func.isRequired
}

