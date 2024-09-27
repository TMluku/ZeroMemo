import './App.css'
import Matchinglist from './Matchinglist.jsx';
import TodoList from "./TodoList.jsx";
import {useState} from "react";

function App() {
    const [mode, setMode] = useState("unit")

    function changeMode() {
        setMode(mode === "unit" ? "bulk" : "unit")
    }

    return (
        <>
            <header className="header">
                <h1>ゼロメモ！</h1>
            </header>
            <button onClick={changeMode}>
                製品切替 「{mode === "unit" ? "単品マッチ" : "リストマッチ"}」
            </button>
            {/*<div hidden={mode !== "bulk"}>*/}
            {/*    <Matchinglist/>*/}
            {/*</div>*/}
            <div hidden={mode !== "unit"}>
                <TodoList/>
            </div>
        </>
    )
}

export default App
