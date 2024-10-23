import {useState} from "react";
import TinderCard from "react-tinder-card";
import * as PropTypes from "prop-types";
import './SwipeCards.css';

const item_names = [
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

const items = item_names.map(name => ({
    name: name,
    url: `./${name}.png`,
}));

function SwipeCards({onAddItem}) {
    const [cards] = useState(items);
    const [left, setLeft] = useState(cards.length)

    const outOfFrame = (dir, name) => {
        if (dir === 'right') {
            onAddItem({id: 0, category: '食料品', name: name, selected: false});
        }
        setLeft(left - 1)
    }

    return (
        <div>
            <h2>
                のこり{left}個
            </h2>
            <div className="cardContainer">
                {cards.map((card, i) => (
                    <TinderCard
                        className={'swipe'}
                        key={i}
                        onCardLeftScreen={(dir) => outOfFrame(dir, card.name)}
                        preventSwipe={['up', 'down']}
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
        </div>
    );
}

SwipeCards.propTypes = {onAddItem: PropTypes.func.isRequired};

export default SwipeCards;
