import {useState} from "react";
import TinderCard from "react-tinder-card";
import reactLogo from './assets/react.svg';
import * as PropTypes from "prop-types";

function SwipeCards({onAddItem}) {
    const [people] = useState([
        {name: "1", url: reactLogo},
        {name: "2", url: reactLogo},
        {name: "3", url: reactLogo},
        {name: "4", url: reactLogo},
    ]);

    const outOfFrame = (dir, name) => {
        console.log(name + ' left the screen! Direction: ' + dir)
        if (dir === 'right') {
            onAddItem({id: 0, category: '食料品', name: name, selected: false});
        }
    }

    return (
        <div style={styles.appContainer}>
            <div className="cardContainer" style={styles.cardContainer}>
                {people.map((person) => (
                    <TinderCard
                        key={person.name}
                        onCardLeftScreen={(dir) => outOfFrame(dir, person.name)}
                        preventSwipe={['up', 'down']}
                    >
                        <div
                            style={{...styles.card, backgroundImage: `url(${person.url})`}}
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

const styles = {
    appContainer: {
        display: "flex",
        flexDirection:
            "column",
        alignItems:
            "center",
        height:
            "100vh",
    }
    ,
    cardContainer: {
        display: "flex",
        justifyContent:
            "center",
        position:
            "relative",
        marginBottom:
            "20px",
    }
    ,
    card: {
        backgroundSize: "cover",
        backgroundPosition:
            "center",
        width:
            "300px",
        height:
            "400px",
        borderRadius:
            "20px",
        display:
            "flex",
        justifyContent:
            "center",
        alignItems:
            "center",
        boxShadow:
            "0 10px 20px rgba(0,0,0,0.2)",
        color:
            "#fff",
        textShadow:
            "0px 0px 10px rgba(0,0,0,0.5)",
    }
    ,
    buttons: {
        display: "flex",
        justifyContent:
            "center",
        gap:
            "10px",
    }
    ,
};

export default SwipeCards;
