import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Toolbar, Typography, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';

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


function App() {

    //BLL:
    const todoListID1 = v1()
    const todoListID2 = v1()
    const [todoLists, setTodolists] = useState<Array<TodoListType>>([
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
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
    function removeTask(taskId: string, todoListID: string) {
        const todoListTasks = tasks[todoListID]
        tasks[todoListID] = todoListTasks.filter(task => task.id !== taskId)
        setTasks({...tasks})

    }

    function addTask(text: string, todoListID: string) {
        if (text.trim() !== '') {
            const newTask: TaskType = {title: text, isDone: false, id: v1()}
            const todoListTasks = tasks[todoListID];
            tasks[todoListID] = ([newTask, ...todoListTasks])
            setTasks({...tasks})
        } else {
            setError('Title is required')
        }
    }

    function changeTaskStatus(id: string, isDone: boolean, todoListID: string) {
        const todoTasks = tasks[todoListID]
        let task: TaskType | undefined = todoTasks.find(t => t.id === id)
        if (task) {
            task.isDone = isDone
            setTasks({...tasks})
        }
    }

    function removeTodoList(todoListID: string) {
        setTodolists(todoLists.filter(list => list.id !== todoListID))
        delete tasks[todoListID];
        setTasks({...tasks})
    }

    // let tasksForTodoList = tasks1
    // if (filter === 'active') {
    //     tasksForTodoList = tasks1.filter(t => !t.isDone)
    // }
    // if (filter === 'completed') {
    //     tasksForTodoList = tasks1.filter(t => t.isDone)
    // }
//functions for TodoLists
    function addTodoList(title: string) {
        const newTodoListID = v1();
        const newTodoList: TodoListType = {
            id: newTodoListID,
            title: title,
            filter: 'all',
        }
        setTodolists([newTodoList, ...todoLists])
        setTasks({...tasks, [newTodoListID]: []})
    }

    function changeTaskTitle(id: string, title: string, todoListID: string) {
        const todoTasks = tasks[todoListID]
        let task: TaskType | undefined = todoTasks.find(t => t.id === id)
        if (task) {
            task.title = title
            setTasks({...tasks})
        }
    }

    function changeTodoListTitle(title: string, todoListID: string) {
        const todoList = todoLists.find(tl => tl.id === todoListID)
        if (todoList) {
            todoList.title = title
            setTodolists([...todoLists])
        }
    }

    function changeFilter(newFilterValue: FilterValuesType, todoListID: string) {
        const todoList = todoLists.find(list => list.id === todoListID);
        if (todoList) {
            todoList.filter = newFilterValue;
            setTodolists([...todoLists])
        }
    }

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

export default App;
