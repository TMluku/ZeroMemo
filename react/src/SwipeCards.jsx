import {useState} from "react";
import TinderCard from "react-tinder-card";
import * as PropTypes from "prop-types";
import './SwipeCards.css';
import milk from '../public/牛乳.png';

function SwipeCards({onAddItem}) {
    const [people] = useState(Array
        .from({length: 20}, (v, k) => k)
        .map(k => ({name: (k + 1).toString(), url: milk}))
    );

    const outOfFrame = (dir, name) => {
        console.log(name + ' left the screen! Direction: ' + dir)
        if (dir === 'right') {
            onAddItem({id: 0, category: '食料品', name: name, selected: false});
        }
    }

    return (
        <div>
            <div className="cardContainer">
                {people.map((person) => (
                    <TinderCard
                        className={'swipe'}
                        key={person.name}
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
