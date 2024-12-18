import {useState} from "react";
import {Card} from "./Home.tsx";

const categoryList = ['食料品', '調味料', '日用品'];

interface AppendageProps {
  onAppendCard: (card: Card) => void
}

export default function Appendage({onAppendCard}: AppendageProps) {
  const [name, setName] = useState("")
  const [categorySelected, setCategorySelected] = useState(new Array(categoryList.length).fill(false));
  // image
  const [imgBase64, setImgBase64] = useState("");

  return (
    <div>
      <h2>カード追加</h2>
      <input
        type="text"
        placeholder="商品名"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div>
        {categoryList.map((category, i) => (
          <div key={i}>
            <input
              id={category}
              type="checkbox"
              checked={categorySelected[i]}
              onChange={e => {
                const newCategorySelected = categorySelected.slice();
                newCategorySelected[i] = e.target.checked;
                setCategorySelected(newCategorySelected);
              }}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) {
              return;
            }
            const reader = new FileReader();
            reader.onload = () => setImgBase64(reader.result as string);
            reader.readAsDataURL(file);

            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              // resize to 150x150
              canvas.width = 150;
              canvas.height = 150;
              ctx?.drawImage(img, 0, 0, 150, 150);
              setImgBase64(canvas.toDataURL('image/png'));
            }
          }}
        />
        <canvas id="canvas">
        </canvas>
      </div>
      <button onClick={() => {
        if (name === "" || categorySelected.every(c => !c)) {
          return;
        }
        onAppendCard?.(new Card(name, "", imgBase64, categoryList.filter((_, i) => categorySelected[i])));
      }}
      >
        追加
      </button>
    </div>
  );
}
