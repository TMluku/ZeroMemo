import {HistoryItem} from "./Home.tsx";
import './History.css'

interface HistoryProps {
    historyItems: HistoryItem[],
}

export default function History({historyItems,}: HistoryProps) {
    const itemsGroupByDate = historyItems.reduce((
        acc: { [date: string]: HistoryItem[] },
        historyItem: HistoryItem,
    ) => {
        console.log(historyItem);
        // date is YYYY-MM-DD
        const date = historyItem.date.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(historyItem);
        return acc;
    }, {});
    return (
        <>
            <div>
                {Object.keys(itemsGroupByDate)
                    .sort()
                    .map((date) => (
                    <div key={date}>
                        <h2>{date}</h2>
                        <ul>
                            {itemsGroupByDate[date].map((historyItem, i) => (
                                <li key={i}>
                                    {historyItem.item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}