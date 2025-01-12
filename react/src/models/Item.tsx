export class Item {
  id: number;
  name: string;
  categories: string[];
  selected: boolean;

  constructor(id: number, name: string, categories: string[], selected: boolean) {
    this.id = id;
    this.name = name;
    this.categories = categories;
    this.selected = selected;
  }
}