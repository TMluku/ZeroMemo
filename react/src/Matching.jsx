import PropTypes from "prop-types";
import {useState} from "react";

export default function Matching({onAddItem}) {
    const [category, setCategory] = useState("食料品")
    const [itemIndex, setItemIndex] = useState(0)
    const [matchingItem, setMatchingItem] = useState(itemLists[category][itemIndex])

    function changeCategory() {
        const newCategory = category === "食料品" ? "日用品" : "食料品"
        setCategory(newCategory)
        setItemIndex(0)
        setMatchingItem(itemLists[newCategory][0])
    }

    function selectMatchingItem(isSelected) {
        if (isSelected) {
            const item = {
                category: category,
                name: matchingItem,
                selected: false
            }
            onAddItem(item)
        }
        const nextIndex = itemIndex === itemLists[category].length - 1 ? 0 : itemIndex + 1
        setItemIndex(nextIndex)
        setMatchingItem(itemLists[category][nextIndex])
    }

    return (
        <div className={"matching"}>

            <div>
                <button onClick={changeCategory}>
                    カテゴリ切替 「{category === "食料品" ? "食料品" : "日用品"}」
                </button>
            </div>
            <div className="matchingItem">
                <img
                    src={`./${matchingItem}.png`} alt={matchingItem} width={150}
                    onError={(e) => {
                        e.target.src = './150.png'
                    }}
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
        </div>
    )
}

Matching.propTypes = {
    onAddItem: PropTypes.func.isRequired
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
