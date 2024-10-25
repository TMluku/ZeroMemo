import PropTypes from "prop-types";
import CardSwipe from "./SwipeCards.jsx";

export default function Matching({onAddItem, itemList}) {
    return (
        <div className={"matching"}>
            <CardSwipe
                onAddItem={onAddItem}
                itemList={itemList}
            />
        </div>
    )
}

Matching.propTypes = {
    onAddItem: PropTypes.func.isRequired,
    itemList: PropTypes.array.isRequired,
}

