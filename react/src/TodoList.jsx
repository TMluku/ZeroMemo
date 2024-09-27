import {useState} from 'react'
import './TodoList.css'

export default function TodoList() {
    const localStorageTodoList = JSON.parse(localStorage.getItem('todoList') || '[]');
    const [itemCategory, setItemCategory] = useState("食料品");
    const [itemList, setItemList] = useState(itemLists["食料品"]);
    const [todoList, setTodoList] = useState(localStorageTodoList);
    const [todoListSelected, setTodoListSelected] = useState(Array(todoList.length).fill(false));
    const [matchingItem, setMatchingItem] = useState("牛乳");
    const [matchingIndex, setMatchingIndex] = useState(1);
    const [mode, setMode] = useState("matching");

    function addtodoList(item) {
        const newTodoList = [...todoList, item];
        setTodoList(newTodoList);
        setTodoListSelected([...todoListSelected, false]);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
    }

    function changeTodoListSelected(index) {
        const newTodoListSelected = [...todoListSelected];
        newTodoListSelected[index] = !newTodoListSelected[index];
        setTodoListSelected(newTodoListSelected);
    }

    function deleteSelectedTodoList() {
        const newTodoList = todoList.filter((_, index) => !todoListSelected[index]);
        const newTodoListSelected = todoListSelected.filter((_, index) => !todoListSelected[index]);
        setTodoList(newTodoList);
        setTodoListSelected(newTodoListSelected);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
    }

    function selectMatchingItem(selected) {
        if (selected) {
            addtodoList(matchingItem)
        }
        setMatchingIndex((matchingIndex + 1) % itemList.length);
        setMatchingItem(itemList[matchingIndex])
    }

    function changeCategory() {
        const newCategory = itemCategory === "食料品" ? "日用品" : "食料品";
        setItemCategory(newCategory);
        setItemList(itemLists[newCategory]);
        setMatchingItem(itemLists[newCategory][matchingIndex]);
    }

    function changeMode() {
        setMode(mode === "matching" ? "todoList" : "matching")
    }

    return (
        <>
            <div className='TodoList'>
                <div>
                    <button onClick={changeMode}>
                        モード切替 「{mode === "matching" ? "マッチング" : "リスト"}」
                    </button>
                </div>
                <div hidden={mode !== "matching"}>
                    <button onClick={changeCategory}>
                        カテゴリ切替 「{itemCategory === "食料品" ? "食料品" : "日用品"}」
                    </button>
                </div>
                <div className="matchingItem"
                     style={{display: mode === "matching" ? "block" : "none"}}
                >
                <img
                    src={`./${matchingItem}.png`} alt={matchingItem} width={150}
                    onError={(e) => {e.target.src = './150.png'}}
                />

                    <h3>
                        {matchingItem}
                    </h3>
                    <button onClick={() => selectMatchingItem(true)} className="buttonGood">
                        欲しい
                    </button>
                    <button onClick={() => selectMatchingItem(false)} className="buttonWarning">
                        いらない
                    </button>
                </div>
                <div className='todoListdiv'
                     style={{display: mode === "todoList" ? "block" : "none"}}
                >
                    <p style={{display: todoList.length === 0 ? "block" : "none"}}>
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
                    <input type='text' id='item'/>
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

const itemLists = {
    "食料品": [
        "牛乳",
        "パン",
        "卵",
        "キャベツ",
        "にんじん",
        "じゃがいも",
        "玉ねぎ",
        "ほうれん草",
        "レタス",
        "トマト",
        "ピーマン",
        "きゅうり",
        "バナナ",
        "リンゴ",
        "みかん",
        "ぶどう",
        "いちご",
        "鶏肉",
        "牛肉",
        "豚肉",
        "ハム",
        "ベーコン",
        "ソーセージ",
        "魚（サバ、サケ、マグロなど）",
        "刺身",
        "エビ",
        "イカ",
        "貝（ホタテ、アサリなど）",
        "米",
        "パスタ",
        "うどん",
        "そば",
        "ラーメン",
        "そうめん",
        "冷凍餃子",
        "冷凍ピザ",
        "冷凍パスタ",
        "冷凍野菜",
        "冷凍フライドポテト",
        "冷凍コロッケ",
        "チーズ",
        "ヨーグルト",
        "バター",
        "マーガリン",
        "マヨネーズ",
        "ケチャップ",
        "醤油",
        "味噌",
        "みりん",
        "料理酒",
        "塩",
        "砂糖",
        "酢",
        "油（サラダ油、オリーブオイルなど）",
        "カレー粉",
        "カレールー",
        "シチュールー",
        "ポン酢",
        "ドレッシング",
        "インスタントラーメン",
        "カップ麺",
        "お菓子（チョコレート、クッキーなど）",
        "スナック菓子",
        "アイスクリーム",
        "プリン",
        "ゼリー",
        "お茶",
        "コーヒー",
        "紅茶",
        "ジュース",
        "炭酸飲料",
        "ビール",
        "ワイン",
        "日本酒",
        "焼酎",
        "ウイスキー",
        "豆腐",
        "納豆",
        "漬物",
        "キムチ",
        "もやし",
        "枝豆",
        "コーン缶",
        "ツナ缶",
        "トマト缶",
        "ホールトマト",
        "レトルトカレー",
        "レトルトパスタソース",
        "ジャム",
        "はちみつ",
        "食パン",
        "ロールパン",
        "クロワッサン",
        "シリアル",
        "グラノーラ",
        "ピーナッツバター",
        "ドライフルーツ",
        "ナッツ",
        "海苔",
        "ふりかけ",
        "ベビーチーズ",
        "クラッカー",
        "ポテトチップス"
    ],
    "日用品": [
        "シャンプー",
        "リンス",
        "ボディソープ",
        "洗剤（食器用）",
        "洗剤（衣類用）",
        "トイレットペーパー",
        "ティッシュペーパー",
        "生理用品",
        "歯ブラシ",
        "歯磨き粉",
        "コンタクトレンズの液",
        "バンドエイド",
        "風邪薬",
        "鎮痛剤",
        "食品ラップ",
        "アルミホイル",
        "ゴミ袋",
        "スポンジ",
        "クリーナー",
        "洗濯ネット",
        "カイロ",
        "冷却シート",
        "ペットフード",
        "トイレシート（ペット用）",
        "サランラップ",
        "キッチンペーパー",
        "包丁",
        "まな板",
        "フリーザーバッグ",
        "お弁当箱",
        "お箸",
        "ストロー",
        "タオル",
        "カレンダー",
        "付箋",
        "ボールペン",
        "ノート",
        "書類ホルダー",
        "鍵（家用）",
        "鍵（車用）",
        "充電器",
        "モバイルバッテリー",
        "ヘッドフォン",
        "スマートフォンケース",
        "サンダル",
        "靴下",
        "下着",
        "上着",
        "ジャケット",
        "帽子",
        "スカーフ",
        "手袋",
        "ベルト",
        "財布",
        "香水",
        "リップクリーム",
        "ファンデーション",
        "ネイル用品",
        "ヘアゴム",
        "ヘアピン",
        "サングラス",
        "日焼け止め",
        "虫除けスプレー",
        "サプリメント",
        "プロテイン",
        "ヨガマット",
        "トレーニングウェア",
        "本",
        "雑誌",
        "スケッチブック",
        "絵の具",
        "トランクケース",
        "パスポートケース",
        "洗車スポンジ",
        "車用クリーナー",
        "植木鉢",
        "培養土",
        "観葉植物",
        "園芸用ハサミ",
        "収納ボックス",
        "プラスチック容器",
        "使い捨てカップ",
        "使い捨てフォーク",
        "使い捨てスプーン",
        "旅行用シャンプーボトル",
        "旅行用リンスボトル",
        "おもちゃ（子供用）",
        "ボードゲーム",
        "トランプ",
        "DVD",
        "音楽CD",
        "バースデーカード",
        "ギフトバッグ",
        "ラッピングペーパー",
        "クリスマスツリー",
        "クリスマス飾り",
        "ハロウィン装飾",
        "電池（単三）",
        "電池（単四）",
        "懐中電灯",
        "LEDランプ",
        "リモコン用電池",
        "延長コード",
        "マルチタップ",
        "ガムテープ"
    ]
}
