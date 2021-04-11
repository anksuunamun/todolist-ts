import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TaskType} from '../data-access-layer/api';
import {TodolistsList} from '../features/Todolists/TodolistsList';


export type TaskStateType = {
    [todoListID: string]: Array<TaskType>
}

function App() {

    console.log('App render')
    // const todoListID1 = v1()
    // const todoListID2 = v1()
    // const [todoLists, dispatchToTodolists] = useReducer(todoListReducer, [
    //     {id: todoListID1, title: 'What to learn', filter: 'all'},
    //     {id: todoListID2, title: 'What to buy', filter: 'all'},
    // ])

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
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;



