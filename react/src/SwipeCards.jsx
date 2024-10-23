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
    const [people] = useState(items);

    const outOfFrame = (dir, name) => {
        console.log(name + ' left the screen! Direction: ' + dir)
        if (dir === 'right') {
            onAddItem({id: 0, category: '食料品', name: name, selected: false});
        }
    }

    return (
        <div>
            <div className="cardContainer">
                {people.map((person, i) => (
                    <TinderCard
                        className={'swipe'}
                        key={i}
                        onCardLeftScreen={(dir) => outOfFrame(dir, person.name)}
                        preventSwipe={['up', 'down']}
                    >
                        <div
                            style={{backgroundImage: `url(${person.url})`}}
                            className={'card'}
                        >
                            <h3>{person.name}</h3>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    );
}

SwipeCards.propTypes = {onAddItem: PropTypes.func.isRequired};

export default SwipeCards;
