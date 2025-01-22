import './TabBar.css'
import {useProgress} from "./UseProgress.tsx";
import {TouchApp} from "@mui/icons-material";

interface TabBarProps {
  tab: "swipe" | "todo" | "cards" | "history",
  setTab: (tab: "swipe" | "todo" | "cards" | "history") => void,
  todoListLength: number,
  floatingIconActive: boolean[],
}

export function TabBar(props: TabBarProps) {
  const {
    tab,
    setTab,
    todoListLength,
    floatingIconActive,
  } = props;
  const {
    progress,
    progressVisibility,
    setProgress,
  } = useProgress();
  return (
    <div
      className="ContentTabsBar"
      style={progressVisibility(3)}
    >
      <div
        className={'Tab ' + (tab === "swipe" ? 'TabSelected' : '')}
        onClick={() => setTab("swipe")}
      >
        探す
      </div>
      <div
        className={'Tab ' + (tab === "todo" ? 'TabSelected' : '')}
        onClick={() => {
          if (progress === 100) {
            setProgress(101);
          }
          setTab("todo")
        }}
      >
        メモ
        <div
          className={'TabBadge'}
          style={{display: todoListLength === 0 ? 'none' : 'block'}}
        >
          {todoListLength}
        </div>
        {floatingIconActive.map((active, i) => (
          <div
            key={i}
            className={'TabFloatingIcon' + (active ? ' TabFloatingIconActive' : '')}
          >
            +1
          </div>
        ))}
        {progress === 100 && (
          <TouchApp
            className="TouchAppOnboardingTab"
            fontSize="large"
            color="primary"
          />
        )}
      </div>
      <div
        className={'Tab ' + (tab === "cards" ? 'TabSelected' : '')}
        onClick={() => {
          if (progress === 200) {
            setProgress(201);
          }
          setTab("cards")
        }}
        style={progressVisibility(200)}
      >
        カード
        {progress === 200 && (
          <TouchApp
            className="TouchAppOnboardingTab"
            fontSize="large"
            color="primary"
          />
        )}
      </div>
      <div
        className={'Tab ' + (tab === "history" ? 'TabSelected' : '')}
        onClick={() => {
          if (progress === 300) {
            setProgress(301);
          }
          setTab("history")
        }}
        style={progressVisibility(300)}
      >
        履歴
        {progress === 300 && (
          <TouchApp
            className="TouchAppOnboardingTab"
            fontSize="large"
            color="primary"
          />
        )}
      </div>
    </div>
  );
}
