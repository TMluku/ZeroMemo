import React, {useState} from "react";
import TinderCard from "react-tinder-card";
import * as PropTypes from "prop-types";
import './SwipeCards.css';

const grocery_items_name = [
    "いちご",
    "きゅうり",
    "じゃがいも",
    "にんじん",
    "ほうれん草",
    "みかん",
    "キャベツ",
    "トマト",
    "バナナ",
    "パン",
    "ハム",
    "ピーマン",
    "りんご",
    "レタス",
    "卵",
    "牛乳",
    "牛肉",
    "玉ねぎ",
    "豚肉",
    "鶏肉",
]

export default function SwipeCards({onAddItem, itemList}) {
    const items = grocery_items_name
        .filter(name => !itemList.some(item => item.name === name))
        .map(name => ({
            category: '食料品',
            name: name,
            url: `./${name}.png`,
        }));
    const [cards] = useState(items);

    const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
    const currentIndexRef = React.useRef(currentIndex);

    const childRefs = React.useMemo(
        () =>
            Array(cards.length)
                .fill(0)
                .map(() => React.createRef()),
        [cards.length]
    );

    const updateCurrentIndex = (index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    }

    const canSwipe = currentIndex >= 0;

    const swiped = (dir, card, index) => {
        updateCurrentIndex(index - 1);
        if (dir === 'right') {
            onAddItem({id: 0, category: card.category, name: card.name, selected: false});
        }
    }

    const outOfFrame = (index) => {
        currentIndexRef.current >= index && childRefs[index].current.restoreCard();
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < cards.length) {
            await childRefs[currentIndex].current.swipe(dir);
        }
    }

    return (
        <div>
            <h2>
                のこり{currentIndex + 1}枚
            </h2>
            <div className="cardContainer">
                {cards.map((card, i) => (
                    <TinderCard
                        ref={childRefs[i]}
                        className={'swipe'}
                        key={i}
                        onCardLeftScreen={() => outOfFrame(i)}
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => swiped(dir, card, i)}
                    >
                        <div
                            style={{backgroundImage: `url(${card.url})`}}
                            className={'card'}
                        >
                            <h3>{card.name}</h3>
                        </div>
                    </TinderCard>
                ))}
            </div>
            <button onClick={() => swipe('left')}>Not yet</button>
            <button onClick={() => swipe('right')}>Need!</button>
        </div>
    );
}

SwipeCards.propTypes = {onAddItem: PropTypes.func.isRequired};
SwipeCards.propTypes = {itemList: PropTypes.array.isRequired};
