import React, {useCallback, useEffect, useState} from 'react';
import {
    ChangeFilterAC,
    changeTodolistTitleTC,
    createTodolistTC,
    deleteTodolistTC,
    FilterValuesType,
    getTodolistsTC,
    TodolistDomainType
} from './todolist-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {createTaskTC, deleteTaskTC, TaskStateType, updateTaskTC} from './tasks-reducer';
import {TaskStatuses} from '../../data-access-layer/api';
import {Grid, Paper} from '@material-ui/core';
import AddItemForm from '../../components/AddItemFrom/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Redirect} from 'react-router-dom';


type TodolistsListPropsType = {}
export const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {
    let dispatch = useDispatch();

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
    useEffect(() => {
        dispatch(getTodolistsTC());
    }, [dispatch])
    let todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)


    let [error, setError] = useState<string | null>(null)

    const removeTask = useCallback(function (taskId: string, todoListID: string) {
        dispatch(deleteTaskTC(todoListID, taskId));
    }, [dispatch])

    const addTask = useCallback(function (text: string, todoListID: string) {
        if (text.trim() !== '') {
            dispatch(createTaskTC(text, todoListID))
        } else {
            setError('Title is required')
        }
    }, [dispatch])

    const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todoListID: string) {
        dispatch(updateTaskTC(todoListID, id, {status}))
    }, [dispatch])

    const removeTodoList = useCallback(function (todoListID: string) {
        const action = deleteTodolistTC(todoListID)
        dispatch(action)
    }, [dispatch])

    // let tasksForTodoList = tasks1
    // if (filter === 'active') {
    //     tasksForTodoList = tasks1.filter(t => !t.isDone)
    // }
    // if (filter === 'completed') {
    //     tasksForTodoList = tasks1.filter(t => t.isDone)
    // }
//functions for TodoLists
    const addTodoList = useCallback(function (title: string) {
        const action = createTodolistTC(title)
        dispatch(action)
    }, [dispatch])

    const changeTaskTitle = useCallback(function (id: string, title: string, todoListID: string) {
        dispatch(updateTaskTC(todoListID, id, {title}))
    }, [dispatch])

    const changeTodoListTitle = useCallback(function (title: string, todoListID: string) {
        dispatch(changeTodolistTitleTC(title, todoListID))
    }, [dispatch])

    const changeFilter = useCallback(function (newFilterValue: FilterValuesType, todoListID: string) {
        dispatch(ChangeFilterAC(todoListID, newFilterValue))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    return (<>
        <Grid container style={{padding: '25px 0'}}>
            <AddItemForm addItem={addTodoList} error={error} setError={setError}/>
        </Grid>
        <Grid container spacing={10}>
            {
                todoLists.map(todoList => {
                    let tasksForTodoList = tasks[todoList.id]
                    return (
                        <Grid item
                              key={todoList.id}>
                            <Paper elevation={10} style={{padding: '15px'}}>
                                <Todolist
                                    title={todoList.title}
                                    tasks={tasksForTodoList}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    error={error}
                                    setError={setError}
                                    filter={todoList.filter}
                                    id={todoList.id}
                                    entityStatus={todoList.entityStatus}
                                    removeTodoList={removeTodoList}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodoListTitle={changeTodoListTitle}/>
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>)
}