import React, {useCallback, useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Toolbar, Typography, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    AddTodoListAC,
    ChangeFilterAC,
    ChangeTodoListTitleAC, FilterValuesType,
    RemoveTodoListAC, TodolistDomainType,
} from './reducers/todolist-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './reducers/tasks-reducer';
import {AppRootStateType} from './reducers/store';
import {useDispatch, useSelector} from 'react-redux';
import {TaskStatuses, TaskType, TodolistType} from './data-access-layer/api';





export type TaskStateType = {
    [todoListID: string]: Array<TaskType>
}

function AppWithRedux() {
    console.log('App render')
    //BLL:
    const todoListID1 = v1()
    const todoListID2 = v1()
    // const [todoLists, dispatchToTodolists] = useReducer(todoListReducer, [
    //     {id: todoListID1, title: 'What to learn', filter: 'all'},
    //     {id: todoListID2, title: 'What to buy', filter: 'all'},
    // ])

    let todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    let dispatch = useDispatch();

    // const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    //     [todoListID1]: [{title: 'HTML and CSS', isDone: true, id: v1()},
    //         {title: 'JS', isDone: true, id: v1()},
    //         {title: 'ReactJS', isDone: false, id: v1()},
    //         {title: 'ReactJS', isDone: true, id: v1()},],
    //     [todoListID2]: [{title: 'Milk', isDone: true, id: v1()},
    //         {title: 'Eggs', isDone: true, id: v1()},
    //         {title: 'Bread', isDone: false, id: v1()},
    //         {title: 'Meat', isDone: true, id: v1()},],
    // })

    let [error, setError] = useState<string | null>(null)

    //functions for Tasks
    const removeTask = useCallback(function (taskId: string, todoListID: string) {
        dispatch(removeTaskAC(taskId, todoListID));
    }, [dispatch])

    const addTask = useCallback(function (text: string, todoListID: string) {
        if (text.trim() !== '') {
            dispatch(addTaskAC(text, todoListID))
        } else {
            setError('Title is required')
        }
    }, [dispatch])

    const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todoListID: string) {
        dispatch(changeTaskStatusAC(id, status, todoListID))
    }, [dispatch])

    const removeTodoList = useCallback(function (todoListID: string) {
        const action = RemoveTodoListAC(todoListID)
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
        const action = AddTodoListAC(title)
        dispatch(action)
    }, [dispatch])

    const changeTaskTitle = useCallback(function (id: string, title: string, todoListID: string) {
        dispatch(changeTaskTitleAC(id, title, todoListID))
    }, [dispatch])

    const changeTodoListTitle = useCallback(function (title: string, todoListID: string) {
        dispatch(ChangeTodoListTitleAC(title, todoListID))
    }, [dispatch])

    const changeFilter = useCallback(function (newFilterValue: FilterValuesType, todoListID: string) {
        dispatch(ChangeFilterAC(todoListID, newFilterValue))
    }, [dispatch])

    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
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
                                            removeTodoList={removeTodoList}
                                            changeTaskTitle={changeTaskTitle}
                                            changeTodoListTitle={changeTodoListTitle}/>
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
