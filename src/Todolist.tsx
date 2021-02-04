import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from './App';

type PropsType = {
    title: string,
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListID: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    addTask: (text: string, todoListID: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
    error: string | null
    setError: (error: string | null) => void
    filter: FilterValuesType
    id: string
    removeTodoList: (todoListID: string) => void
}

export function Todolist(props: PropsType) {
    const tasks = props.tasks.map(
        task => {
            const onClickHandler = () => {
                props.removeTask(task.id, props.id)
            }
            const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                let newIsDoneValue = e.currentTarget.checked
                props.changeTaskStatus(task.id, newIsDoneValue, props.id)
            }
            return <li key={task.id}><input type="checkbox" checked={task.isDone} onChange={onChangeHandler}
                                            className={task.isDone ? 'is-done' : ''}/>
                <span>{task.title}</span>
                <button onClick={onClickHandler}>remove
                </button>
            </li>

        }
    )
    const [title, setTitle] = useState<string>(' ')

    function addTask() {
        props.addTask(title, props.id);
        setTitle('')
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }

    function onKeyPressHandler(e: KeyboardEvent<HTMLInputElement>) {
        props.setError(null)
        if (e.key === 'Enter') {
            addTask()
        }
    }

    const onAllClickHandler = () => {
        props.changeFilter('all', props.id)
    }
    const onActiveClickHandler = () => {
        props.changeFilter('active', props.id)
    }
    const onActiveCompletedHandler = () => {
        props.changeFilter('completed', props.id)
    }


    return (
        <div>
            <h3>{props.title}
                <button onClick={() => props.removeTodoList(props.id)}>X</button>
            </h3>
            <div>
                <input value={title} onKeyPress={onKeyPressHandler} onChange={onChangeHandler}
                       className={props.error ? 'error' : undefined}/>
                <button onClick={() => {
                    addTask()
                }}>+
                </button>
                {props.error ? <div className={'error-message'}>{props.error}</div> : null}
            </div>
            <ul>
                {tasks}

            </ul>
            <div>
                <button onClick={onAllClickHandler} className={props.filter === 'all' ? 'active-filter' : ''}>All
                </button>
                <button onClick={onActiveClickHandler}
                        className={props.filter === 'active' ? 'active-filter' : ''}>Active
                </button>
                <button onClick={onActiveCompletedHandler}
                        className={props.filter === 'completed' ? 'active-filter' : ''}>Completed
                </button>
            </div>
        </div>
    )
}