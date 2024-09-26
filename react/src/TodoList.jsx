import { useState } from 'react'
import './TodoList.css'

export default function TodoList() {
    const [todoList, setTodoList] = useState(["魚", "卵", "ハッピーターン"]);
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
            </div>
        </>
    )
}