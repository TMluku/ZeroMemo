import {useState} from 'react'
import './TodoList.css'
import TodoList from './TodoList.js';
import SwipeCards from './SwipeCards.js';
import './Modal.css';
import './Home.css';

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
  url: string;
  imgBase64: string;
  categories: string[];

  constructor(name: string, url: string, categories: string[]) {
    this.name = name;
    this.url = url;
    this.imgBase64 = '';
    this.categories = categories;
  }

  static fromItem = (name: string, categories: string[]) => {
    const url = `./${name}.png`;
    return new Card(name, url, categories);
  }
}


export default function Home() {
  const localStorageTodoList: Item[] = JSON.parse(localStorage.getItem('todoListV2') || '[]');
  const [todoList, setTodoList] = useState(localStorageTodoList);
  const [nextTodoId, setNextTodoId] = useState(todoList.map((item) => item.id).reduce((a, b) => Math.max(a, b), 0) + 1);
  const [tab, setTab] = useState(0);
  const [floatingIcon, setFloatingIcon] = useState(0);

  const localStorageRejectedDateList = JSON.parse(localStorage.getItem('rejectedDateList') || '{}') as {
    [key: string]: Date
  }
  const [rejectedDateList, setRejectedDateList] = useState(localStorageRejectedDateList);

  const [userPrefers, setUserPrefers] = useState(JSON.parse(localStorage.getItem('userPrefer') || '{}'));
  const [demoModal, setDemoModal] = useState((localStorage.getItem('demoModal') || 'true') === 'true');
  const [trashModal, setTrashModal] = useState(false);

  function handleAddItem(item: Item) {
    item.id = nextTodoId;
    const newTodoList = [...todoList, item];
    setTodoList(newTodoList);
    localStorage.setItem('todoListV2', JSON.stringify(newTodoList));
    setNextTodoId(nextTodoId + 1);
  }

  function handleItemNotification() {
    if (floatingIcon === 0) {
      setFloatingIcon(1);
      setTimeout(() => setFloatingIcon(0), 1000);
    }
  }


  function handleReject(item: string, date: Date) {
    const newRejectedList = {...rejectedDateList, [item]: date};
    setRejectedDateList(newRejectedList);
    localStorage.setItem('rejectedDateList', JSON.stringify(newRejectedList));
  }

  function handleChangeItem(newItem: Item) {
    const newTodoList = todoList.map((item) => item.id === newItem.id ? newItem : item);
    setTodoList(newTodoList);
    localStorage.setItem('todoListV2', JSON.stringify(newTodoList));
  }

  function handleDeleteItemsByCategory(category: string, all: boolean) {
    const newTodoList = todoList.filter((item) => !(item.selected || all) || !item.categories.includes(category));
    setTodoList(newTodoList);
    localStorage.setItem('todoListV2', JSON.stringify(newTodoList));
  }

  function handleModifyOrAddUserPrefers(item: string, diff: (score: number) => number) {
    const score = userPrefers[item] || 0;
    const newUserPrefers = {...userPrefers, [item]: diff(score)};
    setUserPrefers(newUserPrefers);
    localStorage.setItem('userPrefer', JSON.stringify(newUserPrefers));
  }

  return (<>
    <div
      className="TodoList"
      style={{display: tab === 0 ? 'block' : 'none'}}
    >
      <SwipeCards
        onAddItem={(item: Item) => {
          handleAddItem(item)
          handleItemNotification()
        }}
        onRejectItem={handleReject}
        onAddUserPrefers={handleModifyOrAddUserPrefers}
        itemList={todoList}
        userPrefers={userPrefers}
        rejectedDateList={rejectedDateList}
        timeout={0}
      />
    </div>
    <div
      className="TodoList"
      style={{display: tab === 1 ? 'block' : 'none'}}
    >
      <TodoList
        items={todoList}
        onAddItem={(item) => handleAddItem(item)}
        onDeleteItemsByCategory={handleDeleteItemsByCategory}
        onToggleListSelected={handleChangeItem}
      />
    </div>

    <div className="TabBar">
      <div
        className={'Tab ' + (tab === 0 ? 'TabSelected' : '')}
        onClick={() => setTab(0)}
      >
        探す
      </div>
      <div
        className={'Tab ' + (tab === 1 ? 'TabSelected' : '')}
        onClick={() => setTab(1)}
      >
        メモ
        <div
          className={'TabBadge'}
          style={{display: todoList.length === 0 ? 'none' : 'block'}}
        >
          {todoList.length}
        </div>
        <div
          className={'TabFloatingIcon' + (floatingIcon === 1 ? ' TabFloatingIconActive' : '')}
        >
          +1
        </div>
      </div>
    </div>

    <button
      onClick={() => setTrashModal(true)}
      style={{display: tab === 0 ? '' : 'none'}}
    >
      ゴミ箱 🗑️
    </button>

    <div className={'Modal ' + (demoModal ? 'ModalActive' : '')}>
      <div className="ModalContent">
        <div className="ModalClose" onClick={() => {
          setDemoModal(false)
          localStorage.setItem('demoModal', 'false')
        }}>
          ×
        </div>
        <h2>デモンストレーション</h2>
        <div className="modalWalkthroughVideo">
          {demoModal ? <video
            src={'./assets/walkthrough.mp4'}
            autoPlay
            muted
            height={300}
          /> : <></>}
        </div>
        <button
          onClick={() => {
            setDemoModal(false)
            localStorage.setItem('demoModal', 'false')
          }}
        >
          了解
        </button>
      </div>
    </div>

    <div className={'Modal ' + (trashModal ? 'ModalActive' : '')}>
      <div className="ModalContent">
        <div className="ModalClose" onClick={() => {
          setTrashModal(false)
        }}>
          ×
        </div>
        <h2>ゴミ箱</h2>
        <div className="TrashList">
          <ul className="TrashListUL">
            {
              Object.entries(userPrefers)
                .filter(([, score]) => score < -100)
                .map(([item,]) => (
                  <li
                    className={'TrashListLI'}
                    key={item}>
                    <div className={'TodoListItemName'}>
                      {item}
                    </div>
                    <div className={'TodoListItemButton'}>
                      <button
                        className={'TrashListButton'}
                        onClick={() =>
                          handleModifyOrAddUserPrefers(item, () => 0)
                        }
                      >もどす
                      </button>
                    </div>
                  </li>
                ))
            }
          </ul>
        </div>
        <button
          onClick={() => {
            setTrashModal(false)
          }}
        >
          完了
        </button>
      </div>
    </div>
  </>)
}

