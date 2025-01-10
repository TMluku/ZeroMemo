import {Component, CSSProperties} from 'react'
import './TodoList.css'
import TodoList from './TodoList.js';
import SwipeCards from './SwipeCards.js';
import './Modal.css';
import './Home.css';
import card_list from './assets/cardList.json';
import Appendage from "./Appendage.tsx";
import demo from './assets/walkthrough.mp4';

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

export class Card {
  name: string;
  imgBase64: string;
  url: string;
  categories: string[];
  invisible: boolean;

  constructor(name: string, url: string, imgBase64: string, categories: string[]) {
    this.name = name;
    this.url = url;
    this.imgBase64 = imgBase64;
    this.categories = categories;
    this.invisible = false;
  }

  toBackgroundStyle(): CSSProperties {
    if (this.imgBase64 === '') {
      return {backgroundImage: `url(${this.url})`};
    } else {
      return {backgroundImage: `url(${this.imgBase64})`};
    }
  }
}

interface HomeState {
  todoList: Item[];
  nextTodoId: number;
  tab: number;
  floatingIcon: number;
  rejectedDateList: {
    [key: string]: Date
  };
  userPrefers: {
    [key: string]: number
  };
  cardList: Card[];
  demoModal: boolean;
  trashModal: boolean;
}

export default class Home extends Component<object, HomeState> {

  handleAddItem = (item: Item) => {
    item.id = this.state.nextTodoId;
    const todoList = [...this.state.todoList, item];
    localStorage.setItem('todoListV2', JSON.stringify(todoList));
    const nextTodoId = this.state.nextTodoId + 1;
    this.setState({todoList, nextTodoId,});
  };

  handleItemNotification = () => {
    if (this.state.floatingIcon === 0) {
      this.setState({floatingIcon: 1});
      setTimeout(() => {
        this.setState({floatingIcon: 0});
      }, 1000);
    }
  };


  handleReject = (item: string, date: Date) => {
    const rejectedDateList = {...this.state.rejectedDateList, [item]: date};
    this.setState({rejectedDateList});
    localStorage.setItem('rejectedDateList', JSON.stringify(rejectedDateList));
  };

  handleChangeItem = (newItem: Item) => {
    const todoList = this.state.todoList.map((item) => item.id === newItem.id ? newItem : item);
    this.setState({todoList});
    localStorage.setItem('todoListV2', JSON.stringify(todoList));
  };

  handleDeleteItemsByCategory = (category: string, all: boolean) => {
    const todoList = this.state.todoList.filter((item) => !(item.selected || all) || !item.categories.includes(category));
    this.setState({todoList});
    localStorage.setItem('todoListV2', JSON.stringify(todoList));
  }

  handleModifyOrAddUserPrefers = (item: string, diff: (score: number) => number) => {
    const score = this.state.userPrefers[item] || 0;
    const userPrefers = {...this.state.userPrefers, [item]: diff(score)};
    this.setState({userPrefers});
    localStorage.setItem('userPrefer', JSON.stringify(userPrefers));
  }

  handleAppendCard = (card: Card) => {
    const cardList = [...this.state.cardList, card];
    this.setState({cardList});
    localStorage.setItem('cardList', JSON.stringify(cardList));
  }

  handleEditCard = (card: Card) => {
    const cardList = this.state.cardList.map((c) => c.name === card.name ? card : c);
    this.setState({cardList});
    localStorage.setItem('cardList', JSON.stringify(cardList));
  }

  constructor(props: object) {
    super(props);

    const todoList: Item[] = JSON.parse(localStorage.getItem('todoListV2') || '[]');
    const nextTodoId = todoList.map((item) => item.id).reduce((a, b) => Math.max(a, b), 0) + 1;
    const rejectedDateListRaw = JSON.parse(localStorage.getItem('rejectedDateList') || '{}') as {
      [key: string]: string
    }
    const rejectedDateList: { [key: string]: Date } = Object.fromEntries(
      Object.entries(rejectedDateListRaw).map(([key, value]) => [key, new Date(value)])
    );
    const userPrefers = JSON.parse(localStorage.getItem('userPrefer') || '{}');
    const cardList = JSON.parse(localStorage.getItem('cardList') || '[]')
      .map((card: Card) => new Card(card.name, card.url, card.imgBase64, card.categories));
    if (cardList.length === 0) {
      const cards = card_list as { name: string, categories: string[] }[];
      cardList.push(...cards.map((card) => new Card(card.name, `./${card.name}.png`, '', card.categories)));
      localStorage.setItem('cardList', JSON.stringify(cardList));
    }
    const demoModal = (localStorage.getItem('demoModal') || 'true') === 'true';

    this.state = {
      todoList,
      nextTodoId,
      tab: 0,
      floatingIcon: 0,
      rejectedDateList,
      userPrefers,
      cardList,
      demoModal,
      trashModal: false,
    };

    this.handleAddItem.bind(this);
    this.handleItemNotification.bind(this);
    this.handleReject.bind(this);
    this.handleChangeItem.bind(this);
    this.handleDeleteItemsByCategory.bind(this);
    this.handleModifyOrAddUserPrefers.bind(this);
  }

  render() {
    return (<>
      <div
        className="Matching"
        style={{display: this.state.tab === 0 ? 'block' : 'none'}}
      >
        <SwipeCards
          onAddItem={(item: Item) => {
            this.handleAddItem(item)
            this.handleItemNotification()
          }}
          cardList={this.state.cardList}
          onRejectItem={this.handleReject}
          onAddUserPrefers={this.handleModifyOrAddUserPrefers}
          itemList={this.state.todoList}
          userPrefers={this.state.userPrefers}
          rejectedDateList={this.state.rejectedDateList}
          timeout={60*60*1000}
        />
      </div>
      <div
        className="TodoList"
        style={{display: this.state.tab === 1 ? 'block' : 'none'}}
      >
        <TodoList
          items={this.state.todoList}
          onAddItem={(item) => this.handleAddItem(item)}
          onDeleteItemsByCategory={this.handleDeleteItemsByCategory}
          onToggleListSelected={this.handleChangeItem}
        />
      </div>
      <div
        className="Appendage"
        style={{display: this.state.tab === 2 ? 'block' : 'none'}}
      >
        <Appendage
          onAppendCard={this.handleAppendCard}
          onEditCard={this.handleEditCard}
          cardList={this.state.cardList}
        />
      </div>

      <div className="TabBar">
        <div
          className={'Tab ' + (this.state.tab === 0 ? 'TabSelected' : '')}
          onClick={() => this.setState({tab: 0})}
        >
          探す
        </div>
        <div
          className={'Tab ' + (this.state.tab === 1 ? 'TabSelected' : '')}
          onClick={() => this.setState({tab: 1})}
        >
          メモ
          <div
            className={'TabBadge'}
            style={{display: this.state.todoList.length === 0 ? 'none' : 'block'}}
          >
            {this.state.todoList.length}
          </div>
          <div
            className={'TabFloatingIcon' + (this.state.floatingIcon === 1 ? ' TabFloatingIconActive' : '')}
          >
            +1
          </div>
        </div>
        <div
          className={'Tab ' + (this.state.tab === 2 ? 'TabSelected' : '')}
          onClick={() => this.setState({tab: 2})}
        >
          カード追加
        </div>
      </div>

      <div className={'Modal ' + (this.state.demoModal ? 'ModalActive' : '')}>
        <div className="ModalContent">
          <div className="ModalClose" onClick={() => {
            this.setState({demoModal: false})
            localStorage.setItem('demoModal', 'false')
          }}>
            ×
          </div>
          <h2>デモンストレーション</h2>
          <div className="modalWalkthroughVideo">
            {this.state.demoModal ? <video
              src={demo}
              autoPlay
              muted
              height={300}
            /> : <></>}
          </div>
          <button
            onClick={() => {
              this.setState({demoModal: false})
              localStorage.setItem('demoModal', 'false')
            }}
          >
            了解
          </button>
        </div>
      </div>
    </>)
  }
}

