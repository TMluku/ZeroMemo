import { useState } from 'react'
import './TodoList.css'

export default function TodoList() {
    const [todoList, setTodoList] = useState(["魚", "卵", "ハッピーターン"]);
    function addtodoList(item) {
        setTodoList([...todoList, item]);
    }
    return (
        <>
            <div className='TodoList'>
                <h2>買い物リスト</h2>
                <div className='todoListdiv'>
                    <ul className='todoListul'>
                        {
                            todoList.map((item, index)=>(
                                <li key={index}>
                                    <label>
                                        <input type='checkbox' />
                                        {item}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <input type='text' id='item' />
                <button onClick={()=>addtodoList(document.getElementById('item').value)}>
                    追加
                </button>
            </div>
        </>
    )
}