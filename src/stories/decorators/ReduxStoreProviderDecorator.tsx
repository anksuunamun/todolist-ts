import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {todoListReducer} from '../../features/Todolists/todolist-reducer';
import {tasksReducer} from '../../features/Todolists/tasks-reducer';
import {AppRootStateType} from '../../app/store';
import {TaskPriorities, TaskStatuses} from '../../data-access-layer/api';
import {appReducer} from '../../app/app-reducer';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer,
    app: appReducer
})

const initialGlobalState = {
    app: {status: 'idle', error: null, isInitialized: false},
    auth: {isLoggedIn: false},
    todolists: [
        {
            id: 'todoListID1', title: 'What to learn', filter: 'all', addedDate: '',
            order: 0, entityStatus: 'idle',
        },
        {
            id: 'todoListID2', title: 'What to buy', filter: 'all', addedDate: '',
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

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)

