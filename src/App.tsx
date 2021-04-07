import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TaskPriorities, TaskStatuses, TaskType} from './data-access-layer/api';
import {TaskStateType} from './reducers/tasks-reducer';

// export type TaskType = {
//     title: string,
//     id: string,
//     isDone: boolean,
// }

 type FilterValuesType = 'all' | 'active' | 'completed'

 type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

// export type TaskStateType = {
//     [todoListID: string]: Array<TaskType>
// }


function App() {

    //BLL:
    const todoListID1 = v1()
    const todoListID2 = v1()
    const [todoLists, setTodolists] = useState<Array<TodoListType>>([
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListID1]: [{
            title: 'HTML and CSS', id: v1(), description: '',
            todoListId: todoListID1, order: 0, status: TaskStatuses.New,
            priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
        },
            {
                title: 'JS', id: v1(), description: '',
                todoListId: todoListID1, order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'ReactJS', id: v1(), description: '',
                todoListId: todoListID1, order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'ReactJS', id: v1(), description: '',
                todoListId: todoListID1, order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },],
        [todoListID2]: [{
            title: 'Milk', id: v1(), description: '',
            todoListId: todoListID2, order: 0, status: TaskStatuses.New,
            priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
        },
            {
                title: 'Eggs', id: v1(), description: '',
                todoListId: todoListID2, order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'Bread', id: v1(), description: '',
                todoListId: todoListID2, order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'Meat', id: v1(), description: '',
                todoListId: todoListID2, order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            }],
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
            const newTask: TaskType = {
                title: text, id: v1(), description: '',
                todoListId: todoListID,
                order: 0,
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
            const todoListTasks = tasks[todoListID];
            tasks[todoListID] = ([newTask, ...todoListTasks])
            setTasks({...tasks})
        } else {
            setError('Title is required')
        }
    }

    function changeTaskStatus(id: string, status: TaskStatuses, todoListID: string) {
        const todoTasks = tasks[todoListID]
        let task: TaskType | undefined = todoTasks.find(t => t.id === id)
        if (task) {
            task.status = status
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
                                tasksForTodoList = tasks[todoList.id].filter(i => i.status === TaskStatuses.New)
                            }
                            if (todoList.filter === 'completed') {
                                tasksForTodoList = tasks[todoList.id].filter(i => i.status === TaskStatuses.Completed)
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

