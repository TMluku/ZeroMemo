import {useState} from 'react'
import './TodoList.css'
import Todos from './Todos.jsx';
import Matching from './Matching.jsx';

export default function TodoList() {
    const localStorageTodoList = JSON.parse(localStorage.getItem('todoList') || '[]');
    const [todoList, setTodoList] = useState(localStorageTodoList);
    const [nextTodoId, setNextTodoId] = useState(todoList.map((item) => item.id).reduce((a, b) => Math.max(a, b), 0) + 1);

    function handleAddTodoList(item) {
        item.id = nextTodoId;
        const newTodoList = [...todoList, item];
        setTodoList(newTodoList);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
        setNextTodoId(nextTodoId + 1);
    }

    function handleChangeTodoList(changedItem) {
        const newTodoList = todoList.map((item) => item.id === changedItem.id ? changedItem : item);
        setTodoList(newTodoList);
        localStorage.setItem('todoList', JSON.stringify(newTodoList));
    }


    function handleDeleteTodoList(category) {
        return (force) => {
            const newTodoList = todoList.filter((item) => !(item.selected || force) || item.category !== category);
            setTodoList(newTodoList);
            localStorage.setItem('todoList', JSON.stringify(newTodoList));
        }
    }

    return (
        <div className='TodoList'>
            <Matching
                onAddItem={handleAddTodoList}
                itemList={todoList}
            />
            <div className='todoListColumn'>
                <Todos
                    category="食料品"
                    items={todoList}
                    onAddItem={handleAddTodoList}
                    onDeleteItems={handleDeleteTodoList('食料品')}
                    onToggleListSelected={handleChangeTodoList}
                />
                <Todos
                    category="日用品"
                    items={todoList}
                    onAddItem={handleAddTodoList}
                    onDeleteItems={handleDeleteTodoList('日用品')}
                    onToggleListSelected={handleChangeTodoList}
                />
            </div>
        </div>
    )
}

