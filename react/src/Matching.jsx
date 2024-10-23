import PropTypes from "prop-types";
import CardSwipe from "./SwipeCards.jsx";

export default function Matching({onAddItem}) {
    return (
        <div className={"matching"}>
            <h2>
                右にスワイプして追加
            </h2>
            <CardSwipe
                onAddItem={onAddItem}
            />
        </div>
    )
}

Matching.propTypes = {
    onAddItem: PropTypes.func.isRequired
}

