import {Item} from "./Item.tsx";

export class HistoryItem {
  item: Item;
  date: Date;

  constructor(item: Item, date: Date) {
    this.item = item;
    this.date = date;
  }
}