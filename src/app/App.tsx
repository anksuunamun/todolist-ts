import React, {useEffect} from 'react';
import './App.css';
import {AppBar, Button, CircularProgress, Container, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TodolistsList} from '../features/Todolists/TodolistsList';
import LinearProgress from '@material-ui/core/LinearProgress';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './store';
import {RequestStatusType} from './app-reducer';
import ErrorSnackbar from '../components/ErrorSnackbar/ErrorSnackbar';
import Login from '../features/Login/Login';
import {Route, Switch, Redirect} from 'react-router-dom';
import {appInitTC, logOutTC} from '../features/Login/auth-reducer';

// export type TaskStateType = {
//     [todoListID: string]: Array<TaskType>
// }

function App() {
    const dispatch = useDispatch();
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const appInit = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

    useEffect(() => {
        dispatch(appInitTC())
    }, [])

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

    const onLogoutHandler = () => {
        dispatch(logOutTC());
    }

    if (!appInit) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
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
                    <Button color="inherit" onClick={onLogoutHandler}>{isLoggedIn ? 'Log out' : 'Log in'}</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Switch>
                    <Route exact path={'/'} render={() => <TodolistsList/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route path={'/404'} render={() => <div>Error</div>}/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;



