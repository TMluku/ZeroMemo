import {CSSProperties} from "react";

export class Card {
  name: string;
  imgBase64: string;
  url: string;
  categories: string[];
  invisible: boolean;

  constructor(name: string, url: string, imgBase64: string, categories: string[], visible: boolean = false) {
    this.name = name;
    this.url = url;
    this.imgBase64 = imgBase64;
    this.categories = categories;
    this.invisible = visible;
  }

  toBackgroundStyle(): CSSProperties {
    if (this.imgBase64 === '') {
      return {backgroundImage: `url(${this.url})`};
    } else {
      return {backgroundImage: `url(${this.imgBase64})`};
    }
  }
}