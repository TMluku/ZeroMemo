import { useState } from 'react'
import './Matchinglist.css'

export default function Matchinglist() {
    const [todoList, setTodoList] = useState([]);
    const [todoListSelected, setTodoListSelected] = useState([]);
    const [itemListSelected, setItemListSelected] = useState(new Array(itemList.length).fill(false));
    const [mode, setMode] = useState("matching");

    function addtodoList(item) {
        setTodoList([...todoList, item]);
        setTodoListSelected([...todoListSelected, false]);
    }

    function addBulkTodoList(items) {
        const selectedTail = Array(items.length).fill(false)
        setTodoList(todoList.concat(items));
        setTodoListSelected(todoListSelected.concat(selectedTail));

    }

    function changeTodoListSelected(index) {
        const newTodoListSelected = [...todoListSelected];
        newTodoListSelected[index] = !newTodoListSelected[index];
        setTodoListSelected(newTodoListSelected);
    }
    function changeItemListSelected(index) {
        const newItemListSelected = [...itemListSelected];
        newItemListSelected[index] = !newItemListSelected[index];
        setItemListSelected(newItemListSelected);
    }

    function deleteSelectedTodoList() {
        const newTodoList = todoList.filter((_, index) => !todoListSelected[index]);
        const newTodoListSelected = todoListSelected.filter((_, index) => !todoListSelected[index]);
        setTodoList(newTodoList);
        setTodoListSelected(newTodoListSelected);
    }

    function changeMode() {
        setMode(mode === "matching" ? "todoList" : "matching")
    }

    return (
        <>
            <div className='TodoList'>
                <button onClick={changeMode}>
                    モード切替 「{mode === "matching" ? "マッチング" : "リスト"}」
                </button>
                <div className="matchingItem"
                    style={{ display: mode === "matching" ? "block" : "none" }}
                >
                    <ul className='itemListul'>
                        {
                            itemList.map((item, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={itemListSelected[index]}
                                            onChange={() => changeItemListSelected(index)}
                                        />
                                        {item}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                    <button
                        onClick={() => {
                            addBulkTodoList(
                                itemList.filter((_, index) => itemListSelected[index])
                            )
                        }}
                        className="buttonGood"
                    >
                        選択したものを追加
                    </button>
                </div>
                <div className='todoListdiv'
                    style={{ display: mode === "todoList" ? "block" : "none" }}
                >
                    <p style={{ display: todoList.length === 0 ? "block" : "none" }}>
                        -- まだ何も追加されていません --
                    </p>
                    <ul className='todoListul'>
                        {
                            todoList.map((item, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={todoListSelected[index]}
                                            onChange={() => changeTodoListSelected(index)}
                                        />
                                        {item}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                    <input type='text' id='item' />
                    <button
                        onClick={() => {
                            if (document.getElementById('item').value === '') return
                            addtodoList(document.getElementById('item').value)
                            document.getElementById('item').value = ''
                        }}
                        className="buttonGood"
                    >
                        追加
                    </button>
                    <button onClick={() => deleteSelectedTodoList()} className="buttonWarning">
                        選んだ要素を削除
                    </button>
                </div>
            </div>
        </>
    )
}

const itemList = [
    "牛乳",
    "卵",
    "パン",
    "トイレットペーパー",
    "洗剤",
    "歯磨き粉",
    "シャンプー",
    "ティッシュペーパー",
    "砂糖",
    "バター",
    " 野菜（人参、玉ねぎなど）",
    "フルーツ（りんご、バナナなど）",
    "調味料（塩、胡椒）",
    "醤油",
    "油（サラダ油、オリーブオイル）",
    "パスタ",
    "米",
    "シリアル",
    "お菓子",
    "飲み物（ジュース、炭酸水）",
    "つまようじ",
    "ラップ",
    "ゴミ袋",
    "洗濯洗剤",
    "柔軟剤",
    "ティーバッグ",
    "コーヒーフィルター",
    "缶詰（トマト、ツナなど）",
    "ハンドソープ",
    "掃除用具（スポンジ、ブラシ）",
    "アルミホイル",
    "サランラップ",
    "爪楊枝",
    "電池",
    "メモ帳",
    "使い捨てカップ",
    "髭剃り",
    "ふきん",
    "マスク",
    "レトルト食品",
    "インスタントラーメン",
    "チーズ",
    "ヨーグルト",
    "スナック菓子",
    "ジャム",
    "冷凍食品",
    "豆腐",
    "納豆",
    "薬（風邪薬、絆創膏）",
]
