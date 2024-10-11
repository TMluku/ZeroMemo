import {useState} from 'react'
import './TodoList.css'
import Todos from "./Todos.jsx";

export default function TodoList() {
    const localStorageTodoList = JSON.parse(localStorage.getItem('todoList') || '[]');
    const [todoList, setTodoList] = useState(localStorageTodoList);
    const [nextTodoId, setNextTodoId] = useState(todoList.map((item) => item.id).reduce((a, b) => Math.max(a, b), 0) + 1);

    function handleAddTodoList(item) {
        item.id = nextTodoId;
        const newTodoList = [...todoList, item];
        setTodoList(newTodoList);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
        setNextTodoId(nextTodoId + 1);
    }

    function handleChangeTodoList(changedItem) {
        const newTodoList = todoList.map((item) => item.id === changedItem.id ? changedItem : item);
        setTodoList(newTodoList);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
    }


    function handleDeleteTodoList(category) {
        const newTodoList = todoList.filter((item) => !item.selected || item.category !== category);
        setTodoList(newTodoList);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
    }

    return (
        <div className='TodoList'>
            {/*<div>*/}
            {/*    <button onClick={changeMode}>*/}
            {/*        モード切替 「{mode === "matching" ? "マッチング" : "リスト"}」*/}
            {/*    </button>*/}
            {/*</div>*/}
            {/*<div hidden={mode !== "matching"}>*/}
            {/*    <button onClick={changeCategory}>*/}
            {/*        カテゴリ切替 「{itemCategory === "食料品" ? "食料品" : "日用品"}」*/}
            {/*    </button>*/}
            {/*</div>*/}
            {/*<div className="matchingItem"*/}
            {/*     style={{display: mode === "matching" ? "block" : "none"}}*/}
            {/*>*/}
            {/*    <img*/}
            {/*        src={`./${matchingItem}.png`} alt={matchingItem} width={150}*/}
            {/*        onError={(e) => {*/}
            {/*            e.target.src = './150.png'*/}
            {/*        }}*/}
            {/*    />*/}

            {/*    <h3>*/}
            {/*        {matchingItem}*/}
            {/*    </h3>*/}
            {/*    <button onClick={() => selectMatchingItem(true)} className="buttonGood">*/}
            {/*        欲しい*/}
            {/*    </button>*/}
            {/*    <button onClick={() => selectMatchingItem(false)} className="buttonWarning">*/}
            {/*        いらない*/}
            {/*    </button>*/}
            {/*</div>*/}
            <div
                className='todoListColumn'
            >
            </div>
            <Todos
                category="食料品"
                items={todoList}
                onAddItem={handleAddTodoList}
                onDeleteItems={handleDeleteTodoList}
                onToggleListSelected={handleChangeTodoList}
            />
            <Todos
                category="日用品"
                items={todoList}
                onAddItem={handleAddTodoList}
                onDeleteItems={handleDeleteTodoList}
                onToggleListSelected={handleChangeTodoList}
            />
        </div>
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
