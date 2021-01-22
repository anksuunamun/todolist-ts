import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from './App';

type PropsType = {
    title: string,
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (newFilterValue: FilterValuesType) => void
    addTask: (text: string) => void
}

export function Todolist(props: PropsType) {

    const tasks = props.tasks.map(
        task => {
            const onClickHandler = () => {
                props.removeTask(task.id)
            }
            return <li key={task.id}><input type="checkbox" checked={task.isDone}/>
                <span>{task.title}</span>
                <button onClick={onClickHandler}>remove
                </button>
            </li>

        }
    )
    const [title, setTitle] = useState<string>(' ')

    function addTask() {
        props.addTask(title);
        setTitle('')
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }

    function onKeyPressHandler(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            addTask()
        }
    }

    const onAllClickHandler = () => {
        props.changeFilter('all')
    }
    const onActiveClickHandler = () => {
        props.changeFilter('active')
    }
    const onActiveCompletedHandler = () => {
        props.changeFilter('completed')
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title} onKeyPress={onKeyPressHandler} onChange={onChangeHandler}/>
                <button onClick={() => {
                    addTask()
                }}>+
                </button>
            </div>
            <ul>
                {tasks}

            </ul>
            <div>
                <button onClick={onAllClickHandler}>All
                </button>
                <button onClick={onActiveClickHandler}>Active
                </button>
                <button onClick={onActiveCompletedHandler}>Completed
                </button>
            </div>
        </div>
    )
}