import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from './App';
import AddItemForm from './AddItemForm';
import EditableSpan from './EditableSpan';
import {Button, Checkbox} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './reducers/store';
import {TaskStateType, TodoListType} from './AppWithReducer';

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
    changeTaskTitle: (id: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
}

export function Todolist(props: PropsType) {

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
    const tasks = props.tasks.map(
        task => {
            const onClickHandler = () => {
                props.removeTask(task.id, props.id)
            }
            const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                let newIsDoneValue = e.currentTarget.checked
                props.changeTaskStatus(task.id, newIsDoneValue, props.id)
            }
            const changeTitle = (title: string) => {
                props.changeTaskTitle(task.id, title, props.id)
            }
            return <li key={task.id}
                       className={task.isDone ? 'is-done' : ''}
            >
                <Checkbox checked={task.isDone}
                          onChange={onChangeHandler}
                          color={'secondary'}/>
                {/*<input type="checkbox"*/}
                {/*       checked={task.isDone}*/}
                {/*       onChange={onChangeHandler}*/}
                {/*/>*/}
                {/*<span>{task.title}</span>*/}
                <EditableSpan title={task.title}
                              changeItem={changeTitle}/>
                <IconButton onClick={onClickHandler}
                            color="default">
                    <DeleteIcon/>
                </IconButton>
            </li>

        }
    )
    // const [title, setTitle] = useState<string>(' ')

    // function addTask() {
    //     props.addTask(title, props.id);
    //     setTitle('')
    // }

    // function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    //     setTitle(e.currentTarget.value)
    // }
    //
    // function onKeyPressHandler(e: KeyboardEvent<HTMLInputElement>) {
    //     props.setError(null)
    //     if (e.key === 'Enter') {
    //         addTask()
    //     }
    // }

    const onAllClickHandler = () => {
        props.changeFilter('all', props.id)
    }
    const onActiveClickHandler = () => {
        props.changeFilter('active', props.id)
    }
    const onActiveCompletedHandler = () => {
        props.changeFilter('completed', props.id)
    }

    function changeTodoListTitle(title: string) {
        props.changeTodoListTitle(title, props.id)
    }

    return (
        <div>
            <h3>
                {/*{props.title}*/}
                <EditableSpan title={props.title}
                              changeItem={changeTodoListTitle}/>
                <IconButton onClick={() => props.removeTodoList(props.id)}>
                    <DeleteIcon/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask}
                         error={props.error}
                         setError={props.setError}/>
            {/*<div>*/}
            {/*    <input value={title} onKeyPress={onKeyPressHandler} onChange={onChangeHandler}*/}
            {/*           className={props.error ? 'error' : undefined}/>*/}
            {/*    <button onClick={() => {*/}
            {/*        addTask()*/}
            {/*    }}>+*/}
            {/*    </button>*/}
            {/*    {props.error ? <div className={'error-message'}>{props.error}</div> : null}*/}
            {/*</div>*/}
            <ul>
                {tasks}

            </ul>
            <div>
                <Button onClick={onAllClickHandler}
                        color={props.filter === 'all' ? 'secondary' : 'default'}
                        variant={'contained'}
                        size={'small'}
                    // className={props.filter === 'all' ? 'active-filter' : ''}
                >All
                </Button>
                <Button onClick={onActiveClickHandler}
                        color={props.filter === 'active' ? 'secondary' : 'default'}
                        variant={'contained'}
                        size={'small'}
                    // className={props.filter === 'active' ? 'active-filter' : ''}
                >Active
                </Button>
                <Button onClick={onActiveCompletedHandler}
                        color={props.filter === 'completed' ? 'secondary' : 'default'}
                        variant={'contained'}
                        size={'small'}
                    // className={props.filter === 'completed' ? 'active-filter' : ''}
                >Completed
                </Button>
            </div>
        </div>
    )
}