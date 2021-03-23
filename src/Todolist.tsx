import React, {ChangeEvent, useState, KeyboardEvent, useCallback} from 'react';
import {FilterValuesType, TaskType} from './App';
import AddItemForm from './AddItemForm';
import EditableSpan from './EditableSpan';
import {Button, Checkbox} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './reducers/store';
import {TaskStateType, TodoListType} from './AppWithReducer';
import {Task} from './Task';

type PropsType = {
    title: string,
    tasks: Array<TaskType>
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    addTask: (text: string, todoListID: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    error: string | null
    setError: (error: string | null) => void
    filter: FilterValuesType
    id: string
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (id: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
}

export const Todolist = React.memo(function (props: PropsType) {
    console.log('Todolist render')

    let tasksForTodoList = props.tasks;

    if (props.filter === 'active') {
        tasksForTodoList = props.tasks.filter(i => !i.isDone)
    }
    if (props.filter === 'completed') {
        tasksForTodoList = props.tasks.filter(i => i.isDone)
    }


    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const tasks = tasksForTodoList.map(
        task => <Task key={task.id}
                      changeTaskStatus={props.changeTaskStatus}
                      removeTask={props.removeTask}
                      todolistId={props.id}
                      task={task}
                      changeTaskTitle={props.changeTaskTitle}
        />
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

    const onAllClickHandler = useCallback(() => {
        props.changeFilter('all', props.id)
    }, [props.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => {
        props.changeFilter('active', props.id)
    }, [props.id, props.changeFilter])
    const onActiveCompletedHandler = useCallback(() => {
        props.changeFilter('completed', props.id)
    }, [props.id, props.changeFilter])

    const changeTodoListTitle = useCallback(function (title: string) {
        props.changeTodoListTitle(title, props.id)
    }, [props.changeTodoListTitle, props.id])

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
})

