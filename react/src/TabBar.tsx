import './TabBar.css'

interface TabBarProps {
  tab: "swipe" | "todo" | "cards" | "history";
  setTab: (tab: "swipe" | "todo" | "cards" | "history") => void;
  todoListLength: number;
  floatingIcon: number;
}

export const TabBar: React.FC<TabBarProps> = ({tab, setTab, todoListLength, floatingIcon}) => {
  return (
    <div className="ContentTabsBar">
      <div
        className={'Tab ' + (tab === "swipe" ? 'TabSelected' : '')}
        onClick={() => setTab("swipe")}
      >
        探す
      </div>
      <div
        className={'Tab ' + (tab === "todo" ? 'TabSelected' : '')}
        onClick={() => setTab("todo")}
      >
        メモ
        <div
          className={'TabBadge'}
          style={{display: todoListLength === 0 ? 'none' : 'block'}}
        >
          {todoListLength}
        </div>
        <div
          className={'TabFloatingIcon' + (floatingIcon === 1 ? ' TabFloatingIconActive' : '')}
        >
          +1
        </div>
      </div>
      <div
        className={'Tab ' + (tab === "cards" ? 'TabSelected' : '')}
        onClick={() => setTab("cards")}
      >
        カード
      </div>
      <div
        className={'Tab ' + (tab === "history" ? 'TabSelected' : '')}
        onClick={() => setTab("history")}
      >
        履歴
      </div>
    </div>
  );
}
