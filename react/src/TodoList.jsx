import {useState} from 'react'
import './TodoList.css'
import Todos from './Todos.jsx';
import Matching from './Matching.jsx';

export default function TodoList() {
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

    function handleReject(item) {
        const date = new Date();
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

    return (
        <>
            <div className='TodoList'>
                <div
                    style={{display: tab === 0 ? 'block' : 'none'}}
                >
                    <Matching
                        onAddItem={(item) => handleAddTodoList(item, true)}
                        onRejectItem={handleReject}
                        itemList={todoList}
                        rejectedDateList={rejectedDateList}
                    />
                </div>
                <div
                    style={{display: tab === 1 ? 'block' : 'none'}}
                >
                    <Todos
                        items={todoList}
                        onAddItem={(item) => handleAddTodoList(item, false)}
                        onDeleteItems={handleDeleteTodoList}
                        onToggleListSelected={handleChangeTodoList}
                    />
                </div>
            </div>
            <div className='TabBar'>
                <div
                    className='Tab'
                    onClick={() => setTab(0)}
                >
                    Matching!
                </div>
                <div
                    className='Tab'
                    onClick={() => setTab(1)}
                >
                    List
                    <div
                        className={
                            'TabFloatingIcon'
                            + (floatingIcon === 1 ? ' TabFloatingIconActive' : '')
                        }
                    >
                        +1
                    </div>
                </div>
            </div>
        </>
    )
}

