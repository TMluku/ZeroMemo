import PropTypes from 'prop-types';
import CardSwipe from './SwipeCards.jsx';

export default function Matching({onAddItem, onRejectItem, itemList, rejectedDateList}) {
    return (
        <div className={'matching'}>
            <CardSwipe
                onAddItem={onAddItem}
                onRejectItem={onRejectItem}
                itemList={itemList}
                rejectedDateList={rejectedDateList}
            />
        </div>
    )
}

Matching.propTypes = {
    onAddItem: PropTypes.func.isRequired,
    onRejectItem: PropTypes.func.isRequired,
    itemList: PropTypes.array.isRequired,
    rejectedDateList: PropTypes.object.isRequired,
}

