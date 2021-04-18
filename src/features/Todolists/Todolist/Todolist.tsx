import React, {useCallback, useEffect} from 'react';
import AddItemForm from '../../../components/AddItemFrom/AddItemForm';
import EditableSpan from '../../../components/EditableSpan/EditableSpan';
import {Button} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../data-access-layer/api';
import {FilterValuesType} from '../todolist-reducer';
import {getTasksTC, TaskDomainType} from '../tasks-reducer';
import {useDispatch} from 'react-redux';
import {RequestStatusType} from '../../../app/app-reducer';

type PropsType = {
    title: string,
    tasks: Array<TaskDomainType>
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    addTask: (text: string, todoListID: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    error: string | null
    setError: (error: string | null) => void
    filter: FilterValuesType
    id: string
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (id: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
    entityStatus: RequestStatusType
}

export const Todolist = React.memo(function (props: PropsType) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTasksTC(props.id))
    }, [])

    console.log('Todolist render')

    let tasksForTodoList = props.tasks;

    if (props.filter === 'active') {
        tasksForTodoList = props.tasks.filter(i => i.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodoList = props.tasks.filter(i => i.status === TaskStatuses.Completed)
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
                      entityStatus={task.entityStatus}
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
                              changeItem={changeTodoListTitle}
                              disabled={props.entityStatus === 'loading'}
                />
                <IconButton onClick={() => props.removeTodoList(props.id)}
                            disabled={props.entityStatus === 'loading'}>
                    <DeleteIcon/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask}
                         error={props.error}
                         setError={props.setError}
                         disabled={props.entityStatus === 'loading'}/>
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

