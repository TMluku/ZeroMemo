import {useState} from 'react'
import './TodoList.css'

export default function TodoList() {
    const [todoList, setTodoList] = useState([]);
    const [matchingItem, setMatchingItem] = useState("牛乳");
    const [matchingIndex, setMatchingIndex] = useState(1);

    function addtodoList(item) {
        setTodoList([...todoList, item]);
    }

    function selectMatchingItem(selected) {
        if (selected) {
            addtodoList(matchingItem)
        }
        setMatchingIndex((matchingIndex + 1) % matchingList.length);
        setMatchingItem(matchingList[matchingIndex])
    }

    return (
        <>
            <div className='TodoList'>
                <h2>
                    マッチングアイテム
                </h2>
                <div className="matchingItem">
                    <p>
                        {matchingItem}
                    </p>
                    <button onClick={() => selectMatchingItem(true)} className="matchingButtonYes">
                        欲しい
                    </button>
                    <button onClick={() => selectMatchingItem(false)} className="matchingButtonNo">
                        いらない
                    </button>
                </div>
                <h2>買い物リスト</h2>
                <div className='todoListdiv'>
                    <ul className='todoListul'>
                        {
                            todoList.map((item, index) => (
                                <li key={index}>
                                    <label>
                                        <input type='checkbox'/>
                                        {item}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <input type='text' id='item'/>
                <button onClick={() => addtodoList(document.getElementById('item').value)}>
                    追加
                </button>
            </div>
        </>
    )
}

const matchingList = [
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
