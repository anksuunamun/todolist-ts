import React, {useCallback, useReducer, useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Toolbar, Typography, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    AddTodoListAC,
    ChangeFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodoListAC,
    todoListReducer
} from './reducers/todolist-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './reducers/tasks-reducer';

export type TaskType = {
    title: string,
    id: string,
    isDone: boolean,
}

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [todoListID: string]: Array<TaskType>
}


function AppWithReducer() {
    console.log('App render')
    //BLL:
    const todoListID1 = v1()
    const todoListID2 = v1()
    const [todoLists, dispatchToTodolists] = useReducer(todoListReducer, [
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'},
    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListID1]: [{title: 'HTML and CSS', isDone: true, id: v1()},
            {title: 'JS', isDone: true, id: v1()},
            {title: 'ReactJS', isDone: false, id: v1()},
            {title: 'ReactJS', isDone: true, id: v1()},],
        [todoListID2]: [{title: 'Milk', isDone: true, id: v1()},
            {title: 'Eggs', isDone: true, id: v1()},
            {title: 'Bread', isDone: false, id: v1()},
            {title: 'Meat', isDone: true, id: v1()},],
    })

    let [error, setError] = useState<string | null>(null)

    //functions for Tasks
    const removeTask = useCallback(function (taskId: string, todoListID: string) {
        dispatchToTasks(removeTaskAC(taskId, todoListID));
    }, [])

    const addTask = useCallback(function (text: string, todoListID: string) {
        if (text.trim() !== '') {
            dispatchToTasks(addTaskAC(text, todoListID))
        } else {
            setError('Title is required')
        }
    }, [])

    const changeTaskStatus = useCallback(function (id: string, isDone: boolean, todoListID: string) {
        dispatchToTasks(changeTaskStatusAC(id, isDone, todoListID))
    }, [])

    const removeTodoList = useCallback(function (todoListID: string) {
        const action = RemoveTodoListAC(todoListID)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }, [])

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
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, title: string, todoListID: string) {
        dispatchToTasks(changeTaskTitleAC(id, title, todoListID))
    }, [])

    const changeTodoListTitle = useCallback(function (title: string, todoListID: string) {
        dispatchToTodolists(ChangeTodoListTitleAC(title, todoListID))
    }, [])

    const changeFilter = useCallback(function (newFilterValue: FilterValuesType, todoListID: string) {
        dispatchToTodolists(ChangeFilterAC(todoListID, newFilterValue))
    }, [])

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
                            if (todoList.filter === 'active') {
                                tasksForTodoList = tasks[todoList.id].filter(i => !i.isDone)
                            }
                            if (todoList.filter === 'completed') {
                                tasksForTodoList = tasks[todoList.id].filter(i => i.isDone)
                            }
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

export default AppWithReducer;
