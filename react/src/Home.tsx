import {Component} from 'react'
import './TodoList.css'
import TodoList from './TodoList.js';
import SwipeCards from './SwipeCards.js';
import './Modal.css';
import './Home.css';
import card_list from './assets/cardList.json';
import Cards from "./Cards.tsx";
import demo from './assets/walkthrough.mp4';
import History from "./History.tsx";
import {Item} from "./models/Item.tsx";
import {Card} from "./models/Card.tsx";
import {HistoryItem} from "./models/HistoryItem.tsx";
import Modal from "./Modal.tsx";

interface HomeState {
  todoList: Item[];
  nextTodoId: number;
  tab: "swipe" | "todo" | "cards" | "history";
  floatingIcon: number;
  rejectedDateList: {
    [key: string]: Date
  };
  userPrefers: {
    [key: string]: number
  };
  cardList: Card[];
  historyList: HistoryItem[];
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

  handleDeleteItems = (ids: number[]) => {
    const todoList = this.state.todoList.filter((item) => !ids.includes(item.id));
    this.setState({todoList});
    localStorage.setItem('todoListV2', JSON.stringify(todoList));
  }

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

  handleAppendHistories = (histories: HistoryItem[]) => {
    const historyList = [...this.state.historyList, ...histories];
    this.setState({historyList});
    localStorage.setItem('historyList', JSON.stringify(historyList));
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
      .map((card: Card) => new Card(card.name, card.url, card.imgBase64, card.categories, card.invisible));
    if (cardList.length === 0) {
      const cards = card_list as { name: string, categories: string[] }[];
      cardList.push(...cards.map((card) => new Card(card.name, `./${card.name}.png`, '', card.categories)));
      localStorage.setItem('cardList', JSON.stringify(cardList));
    }
    const historyList = JSON.parse(localStorage.getItem('historyList') || '[]')
      .map((historyItem: { item: Item, date: string }) =>
        new HistoryItem(
          new Item(historyItem.item.id, historyItem.item.name, historyItem.item.categories, historyItem.item.selected),
          new Date(historyItem.date)
        )
      );
    const demoModal = (localStorage.getItem('demoModal') || 'true') === 'true';

    this.state = {
      todoList,
      nextTodoId,
      tab: "swipe",
      floatingIcon: 0,
      rejectedDateList,
      userPrefers,
      cardList,
      historyList,
      demoModal,
      trashModal: false,
    };

    this.handleAddItem.bind(this);
    this.handleItemNotification.bind(this);
    this.handleReject.bind(this);
    this.handleChangeItem.bind(this);
    this.handleDeleteItems.bind(this);
    this.handleDeleteItemsByCategory.bind(this);
    this.handleModifyOrAddUserPrefers.bind(this);
  }

  render() {
    const contents = {
      "swipe":
        <SwipeCards
          onAddItem={(item: Item) => {
            this.handleAddItem(item)
            this.handleItemNotification()
            this.handleAppendHistories([new HistoryItem(item, new Date())])
          }}
          cardList={this.state.cardList}
          onRejectItem={this.handleReject}
          onAddUserPrefers={this.handleModifyOrAddUserPrefers}
          itemList={this.state.todoList}
          userPrefers={this.state.userPrefers}
          rejectedDateList={this.state.rejectedDateList}
          timeout={1000 * 60 * 60}
        />,
      "todo":
        <TodoList
          items={this.state.todoList}
          onAddItem={(item) => this.handleAddItem(item)}
          onDeleteItems={this.handleDeleteItems}
          onToggleListSelected={this.handleChangeItem}
        />,
      "cards":
        <Cards
          onAppendCard={this.handleAppendCard}
          onEditCard={this.handleEditCard}
          cardList={this.state.cardList}
        />,
      "history":
        <History
          historyItems={this.state.historyList}
          onAddItem={(item) => {
            this.handleAddItem(item)
            this.handleItemNotification()
            this.handleAppendHistories([new HistoryItem(item, new Date())])
          }}
        />,
    }
    return (<>
      <main id="Home">
        <section className="MainContent">
          {contents[this.state.tab]}
        </section>

        <div className="ContentTabsBar">
          <div
            className={'Tab ' + (this.state.tab === "swipe" ? 'TabSelected' : '')}
            onClick={() => this.setState({tab: "swipe"})}
          >
            探す
          </div>
          <div
            className={'Tab ' + (this.state.tab === "todo" ? 'TabSelected' : '')}
            onClick={() => this.setState({tab: "todo"})}
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
            className={'Tab ' + (this.state.tab === "cards" ? 'TabSelected' : '')}
            onClick={() => this.setState({tab: "cards"})}
          >
            カード
          </div>
          <div
            className={'Tab ' + (this.state.tab === "history" ? 'TabSelected' : '')}
            onClick={() => this.setState({tab: "history"})}
          >
            履歴
          </div>
        </div>
      </main>

      <Modal
        isOpen={this.state.demoModal}
        onClose={() => {
          this.setState({demoModal: false})
          localStorage.setItem('demoModal', 'false')
        }}
      >
        <h2>デモンストレーション</h2>
        <div className="modalWalkthroughVideo">
          <video
            src={demo}
            autoPlay
            muted
            height={300}
          />
        </div>
        <button
          onClick={() => {
            this.setState({demoModal: false})
            localStorage.setItem('demoModal', 'false')
          }}
        >
          了解
        </button>
      </Modal>
    </>)
  }
}

