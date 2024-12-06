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
    const [rejectedDateList, setRejectedDateList] = useState(localStorageRejectedDateList);
    const [modal, setModal] = useState((localStorage.getItem('modal') || 'true') === 'true');

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

    return (<>
        <div
            className='TodoList'
            style={{display: tab === 0 ? 'block' : 'none'}}
        >
            <SwipeCards
                onAddItem={(item) => handleAddTodoList(item, true)}
                onRejectItem={handleReject}
                itemList={todoList}
                rejectedDateList={rejectedDateList}
            />
            <button
                className='ModalButton'
                onClick={() => setModal(true)}
            >
                デモ動画を見る
            </button>
        </div>
        <div
            className='TodoList'
            style={{display: tab === 1 ? 'block' : 'none'}}
        >
            <TodoList
                items={todoList}
                onAddItem={(item) => handleAddTodoList(item, false)}
                onDeleteItems={handleDeleteTodoList}
                onToggleListSelected={handleChangeTodoList}
            />
        </div>
        <div className='TabBar'>
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
        <div className={'Modal ' + (modal ? 'ModalActive' : '')}>
            <div className='ModalContent'>
                <div className='ModalClose' onClick={() => {
                    setModal(false)
                    localStorage.setItem('modal', 'false')
                }}>
                    ×
                </div>
                <h2>デモンストレーション</h2>
                <div className='modalWalkthroughVideo'>
                    {modal ? <video
                        src={demo}
                        autoPlay
                        loop
                        height={300}
                    /> : <></>}
                </div>
                <button
                    onClick={() => {
                        setModal(false)
                        localStorage.setItem('modal', 'false')
                    }}
                >
                    了解
                </button>
            </div>
        </div>
    </>)
}

