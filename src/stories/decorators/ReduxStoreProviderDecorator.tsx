import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {todoListReducer} from '../../features/Todolists/todolist-reducer';
import {tasksReducer} from '../../features/Todolists/tasks-reducer';
import {AppRootStateType, RootReducerType} from '../../app/store';
import {TaskPriorities, TaskStatuses} from '../../data-access-layer/api';
import {appReducer} from '../../app/app-reducer';
import {authReducer} from '../../features/Login/auth-reducer';
import thunk from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
import {HashRouter} from 'react-router-dom';

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    app: {status: 'succeeded', error: null, isInitialized: true},
    auth: {isLoggedIn: false},
    todolists: [
        {
            id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '',
            order: 0, entityStatus: 'idle',
        },
        {
            id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '',
            order: 0, entityStatus: 'idle',
        },
    ],
    tasks: {
        ['todolistId1']: [{
            title: 'HTML and CSS', id: v1(), description: '',
            todoListId: 'todolistId1', order: 0, status: TaskStatuses.New,
            priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
        },
            {
                title: 'JS', id: v1(), description: '',
                todoListId: 'todolistId1', order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
            },
            {
                title: 'ReactJS', id: v1(), description: '',
                todoListId: 'todolistId1', order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
            },
            {
                title: 'ReactJS', id: v1(), description: '',
                todoListId: 'todolistId1', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
            },],
        ['todolistId2']: [{
            title: 'Milk', id: v1(), description: '',
            todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
            priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
        },
            {
                title: 'Eggs', id: v1(), description: '',
                todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
            },
            {
                title: 'Bread', id: v1(), description: '',
                todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
            },
            {
                title: 'Meat', id: v1(), description: '',
                todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '', entityStatus: 'idle'
            }]
    }
};

// export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})


export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>
)

export const HashRouterDecorator = (storyFn: any) => (
    <HashRouter>
        {storyFn()}
    </HashRouter>
)
