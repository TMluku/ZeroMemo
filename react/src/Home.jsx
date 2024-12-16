import {useState} from 'react'
import './TodoList.css'
import TodoList from './TodoList.jsx';
import SwipeCards from './SwipeCards.jsx';
import './Modal.css';
import './Home.css';
import demo from './assets/walkthrough.mp4';

export default function Home() {
    const localStorageTodoList = JSON.parse(localStorage.getItem('todoListV2') || '[]');
    const [todoList, setTodoList] = useState(localStorageTodoList);
    const [nextTodoId, setNextTodoId] = useState(todoList.map((item) => item.id).reduce((a, b) => Math.max(a, b), 0) + 1);
    const [tab, setTab] = useState(0);
    const [floatingIcon, setFloatingIcon] = useState(0);
    const localStorageRejectedDateList =
        Object.fromEntries(
            Object.entries(
                JSON.parse(localStorage.getItem('rejectedDateList') || '{}')
            ).map(([_, date]) => [_, new Date(date)])
        );
    const [userPrefers, setUserPrefers] = useState(JSON.parse(localStorage.getItem('userPrefer') || '{}'));
    const [rejectedDateList, setRejectedDateList] = useState(localStorageRejectedDateList);
    const [demoModal, setDemoModal] = useState((localStorage.getItem('demoModal') || 'true') === 'true');
    const [trashModal, setTrashModal] = useState(false);

    function handleAddTodoList(item, notification) {
        item.id = nextTodoId;
        const newTodoList = [...todoList, item];
        setTodoList(newTodoList);
        localStorage.setItem('todoListV2', JSON.stringify(newTodoList));
        setNextTodoId(nextTodoId + 1);

        if (notification && floatingIcon === 0) {
            setFloatingIcon(1);
            setTimeout(() => setFloatingIcon(0), 1000);
        }
    }

    function handleReject(item, date) {
        const newRejectedList = {...rejectedDateList, [item]: date};
        setRejectedDateList(newRejectedList);
        localStorage.setItem('rejectedDateList', JSON.stringify(newRejectedList));
    }

    function handleChangeTodoList(changedItem) {
        const newTodoList = todoList.map((item) => item.id === changedItem.id ? changedItem : item);
        setTodoList(newTodoList);
        localStorage.setItem('todoListV2', JSON.stringify(newTodoList));
    }


    function handleDeleteTodoList(category) {
        return (force) => {
            const newTodoList = todoList.filter((item) => !(item.selected || force) || !item.categories.includes(category));
            setTodoList(newTodoList);
            localStorage.setItem('todoListV2', JSON.stringify(newTodoList));
        }
    }

    function handleModifyOrAddUserPrefers(item, diff) {
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
                onAddItem={(item) => handleAddTodoList(item, true)}
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
                onAddItem={(item) => handleAddTodoList(item, false)}
                onDeleteItems={handleDeleteTodoList}
                onToggleListSelected={handleChangeTodoList}
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
                        src={demo}
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

