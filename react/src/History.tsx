import './History.css'
import {useState} from "react";
import {Item} from "./models/Item.tsx";
import {HistoryItem} from "./models/HistoryItem.tsx";
import {useProgress} from "./UseProgress.tsx";
import {TouchApp} from "@mui/icons-material";

interface HistoryProps {
  historyItems: HistoryItem[],
  onAddItem: (item: Item) => void
}

export default function History({historyItems, onAddItem}: HistoryProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [year, setYear] = useState(parseInt(selectedDate.split('-')[0]));
  const [month, setMonth] = useState(parseInt(selectedDate.split('-')[1]));

  const {
    progress,
    setProgress,
  } = useProgress();

  const itemsGroupByDate = historyItems.reduce((
    acc: { [date: string]: HistoryItem[] },
    historyItem: HistoryItem,
  ) => {
    // date is YYYY-MM-DD
    const date = historyItem.date.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(historyItem);
    return acc;
  }, {});
  const dates = Object.keys(itemsGroupByDate).sort();
  const calendar = (year: number, month: number) => {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);
    const firstDay = firstDate.getDay();
    const lastDay = lastDate.getDate();
    const calendar = [];
    let date = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push('');
        } else if (date > lastDay) {
          week.push('');
          date++;
        } else {
          // 1桁の場合は0埋め
          week.push(('0' + date).slice(-2));
          date++;
        }
      }
      calendar.push(week);
    }
    return calendar
  }

  function getItems(date: string) {
    return <div>
      <h2>{date}</h2>
      {
        itemsGroupByDate[date] === undefined
          ? <h3>履歴なし</h3>
          :
          <ul>
            {itemsGroupByDate[date].map((historyItem, i) => (
              <li key={i}>
                <p>{historyItem.item.name}
                  <button
                    onClick={() => {
                      if (progress === 301) {
                        setProgress(400);
                      }
                      const item = structuredClone(historyItem.item);
                      item.selected = false;
                      onAddItem(item);
                    }}
                  >
                    メモに追加
                    {progress == 301 && (
                      <TouchApp
                        className="TouchAppOnboardingItem"
                        fontSize="large"
                        color="primary"
                      />
                    )}
                  </button>
                </p>
              </li>
            ))}
          </ul>
      }
    </div>;
  }

  function dateClasses(date: string): string {
    const classes = ['HistoryCalendarDate'];
    if (!dates.includes(date)) {
      classes.push('HistoryCalendarDateNoItem');
    }
    // 選択中の日付に枠線をつけ
    if (date === selectedDate) {
      classes.push('HistoryCalendarDateSelected');
    }
    return classes.join(' ');
  }

  return (
    <>
      <h2>
        {progress === 301 ? '過去に追加したアイテムを再度メモに追加できます' : '日付'}
      </h2>
      {/*年月選択*/}
      <div className="select">
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          {[...Array(100)].map((_, i) => (
            <option key={i} value={year - 50 + i}>{year - 50 + i}</option>
          ))}
        </select>
        年
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        月
      </div>
      <div className="HistoryCalendar">
        <table className="HistoryCalendarTable">
          <thead>
          <tr>
            <th>日</th>
            <th>月</th>
            <th>火</th>
            <th>水</th>
            <th>木</th>
            <th>金</th>
            <th>土</th>
          </tr>
          </thead>
          <tbody>
          {calendar(year, month).map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                const date = `${year}-${('0' + month).slice(-2)}-${day}`;
                return (
                  <td
                    key={j}
                    className={dateClasses(date)}
                    onClick={() => {
                      if (dates.includes(date)) {
                        setSelectedDate(date)
                      }
                    }}
                  >
                    {day}
                  </td>
                );
              })}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      {
        getItems(selectedDate)
      }
    </>
  )
    ;
}