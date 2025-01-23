import {useState} from "react";
import "./Cards.css";
import "./Modal.css";
import {TouchApp, Visibility, VisibilityOff} from "@mui/icons-material";
import {Card} from "./models/Card.tsx";
import Modal from "./Modal.tsx";
import {useProgress} from "./UseProgress.tsx";

const categoryList = ["食料品", "調味料", "日用品"];

interface AppendageProps {
  onAppendCard: (card: Card) => void,
  onEditCard: (card: Card) => void
  cardList: Card[],
}

export default function Cards({
                                onAppendCard,
                                onEditCard,
                                cardList
                              }: AppendageProps) {
  const [name, setName] = useState("");
  const [categorySelected, setCategorySelected] = useState(
    new Array(categoryList.length).fill(false)
  );
  const [imgBase64, setImgBase64] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabCategory, setTabCategory] = useState(categoryList[0]); // 現在のタブのカテゴリ

  const openModal = () => {
    setIsModalOpen(true);
  }
  const closeModal = () => {
    if (progress === 203) {
      setProgress(300);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setCategorySelected(new Array(categoryList.length).fill(false));
    setImgBase64("");
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const addCard = () => {
    if (name === "" || categorySelected.every((c) => !c)) {
      alert("商品名とカテゴリーを入力してください。");
      return;
    }
    if (cardList.some((c) => c.name === name)) {
      alert("同じ名前のカードは追加できません。");
      return;
    }
    onAppendCard(
      new Card(
        name,
        "",
        imgBase64,
        categoryList.filter((_, i) => categorySelected[i])
      )
    );
    closeModal();
  };

  const updateTab = (category: string) => setTabCategory(category);

  // 現在のタブのカテゴリに一致するカードのみをフィルタリング
  const filteredCards = cardList.filter((card) =>
    card.categories.includes(tabCategory)
  );

  const {
    progress,
    setProgress,
  } = useProgress();

  return (
    <>
      {/* カテゴリのタブ */}
      <div className="CategoryTabsBar">
        {categoryList.map((category, i) => (
          <div
            key={i}
            onClick={() => updateTab(category)}
            className={`CategoryTab ${
              tabCategory === category ? "CategoryTabActive" : ""
            }`}
          >
            {category}
          </div>
        ))}
      </div>

      <div className="CardsTitle">
        <h3>
          {((p) => {
            switch (p) {
              case 201:
                return "タップしてカードの非表示/表示を切り替え";
              case 202:
                return "非表示のカードは出現しなくなります";
              case 203:
                return "タップして新規にカードを追加";
              case 300:
                return "下のタブの履歴をタップ";
              default:
                return `${tabCategory}のカード数: ${filteredCards.length}
            （うち非表示: ${filteredCards.filter((c) => c.invisible).length}）`
            }
          })(progress)}
        </h3>
      </div>

      {/* カードの表示部分 */}
      <div className="CardsContainer">
        <div className="CardsGrid">
          {/* ＋ボタンのカード */}
          <div className="CardsCard CardsCardPlus" onClick={openModal}>
            ＋
            {progress === 203 && (
              <TouchApp
                className="TouchAppOnboarding"
                fontSize="large"
                color="primary"
              />
            )}
          </div>

          {/* 現在のカテゴリに一致するカードを表示 */}
          {filteredCards
            .slice()
            .reverse()
            .map((card, i) => (
              <div
                className={
                  'CardsCard'
                  + (card.invisible ? ' CardsCardInvisible' : '')
                }
                key={i}
                onClick={() => {
                  if (progress === 201) {
                    setProgress(202);
                  } else if (progress === 202) {
                    setProgress(203);
                  }
                  card.invisible = !card.invisible;
                  onEditCard(card);
                }}
              >
                <img
                  className="CardsCardImage"
                  src={card.imgBase64 || card.url}
                  alt={card.name}
                />
                <h3 className="CardsCardTitle">
                  {card.name}
                </h3>
                <div
                  className="CardsCardVisibilityToggle"
                >
                  {card.invisible ?
                    <VisibilityOff color="disabled" fontSize="small"/> :
                    <Visibility color="disabled" fontSize="small"/>
                  }
                </div>

                {(progress == 201 || progress == 202) && i === 0 && (
                  <TouchApp
                    className="TouchAppOnboarding"
                    fontSize="large"
                    color="primary"
                  />
                )}
              </div>
            ))}
        </div>

        {/* モーダル */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <h2>カードを追加</h2>
          <input
            type="text"
            placeholder="商品名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            {categoryList.map((category, i) => (
              <span key={i}>
                    <input
                      id={category}
                      type="checkbox"
                      checked={categorySelected[i]}
                      onChange={(e) => {
                        const newCategorySelected = categorySelected.slice();
                        newCategorySelected[i] = e.target.checked;
                        setCategorySelected(newCategorySelected);
                      }}
                    />
                    <label htmlFor={category}>{category}</label>
                  </span>
            ))}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);

                const canvas = document.getElementById(
                  "canvas"
                ) as HTMLCanvasElement;
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                  canvas.width = 150;
                  canvas.height = 150;
                  ctx?.drawImage(img, 0, 0, 150, 150);
                  setImgBase64(canvas.toDataURL("image/png"));
                };
              }}
            />
            <div className="AppendageCardPreview">
              <canvas id="canvas"/>
            </div>
          </div>
          <button onClick={addCard}>追加</button>
          <button onClick={closeModal}>キャンセル</button>
        </Modal>
      </div>
    </>
  );
}
