import { useState } from "react";
import { Card } from "./Home.tsx";
import "./Appendage.css";

const categoryList = ["食料品", "調味料", "日用品"];

interface AppendageProps {
  onAppendCard: (card: Card) => void;
  cardList: Card[];
}

export default function Appendage({ onAppendCard, cardList }: AppendageProps) {
  const [name, setName] = useState("");
  const [categorySelected, setCategorySelected] = useState(
    new Array(categoryList.length).fill(false)
  );
  const [imgBase64, setImgBase64] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabCategory, setTabCategory] = useState(categoryList[0]); // 現在のタブのカテゴリ

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
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
    onAppendCard?.(
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

  return (
    <>
      {/* カテゴリのタブ */}
      <div className="cardCategoryTabs">
        {categoryList.map((category, i) => (
          <div
            key={i}
            onClick={() => updateTab(category)}
            className={`cardCategoryTab ${
              tabCategory === category ? "cardCategoryTabActive" : ""
            }`}
          >
            {category}
          </div>
        ))}
      </div>

      {/* カードの表示部分 */}
      <div className="cardsContainer">
        <div className="cardGrid">
          {/* ＋ボタンのカード */}
          <div className="AppendageCard plusCard" onClick={openModal}>
            ＋
          </div>

          {/* 現在のカテゴリに一致するカードを表示 */}
          {filteredCards
            .slice()
            .reverse()
            .map((card, i) => (
              <div className="AppendageCard" key={i}>
                <h3 className="cardTitle">
                  {card.name}
                </h3>
                <img
                  className="cardImage"
                  src={card.imgBase64 || card.url}
                  alt={card.name}
                />
              </div>
            ))}
        </div>

        {/* モーダル */}
        {isModalOpen && (
          <div className="modal">
            <div className="modalContent">
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
                    reader.onload = () => setImgBase64(reader.result as string);
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
                  <canvas id="canvas"></canvas>
                </div>
              </div>
              <button onClick={addCard}>追加</button>
              <button onClick={closeModal}>キャンセル</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
