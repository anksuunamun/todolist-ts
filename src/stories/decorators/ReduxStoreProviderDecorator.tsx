import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {todoListReducer} from '../../features/Todolists/todolist-reducer';
import {tasksReducer} from '../../features/Todolists/tasks-reducer';
import {AppRootStateType} from '../../app/store';
import {TaskPriorities, TaskStatuses} from '../../data-access-layer/api';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer
})

const initialGlobalState = {
    todolists: [
        {
            id:'todoListID1', title: 'What to learn', filter: 'all', addedDate: '',
            order: 0,
        },
        {
            id: 'todoListID2', title: 'What to buy', filter: 'all', addedDate: '',
            order: 0,
        },
    ],
    tasks: {
        ['todolistId1']: [{
            title: 'HTML and CSS', id: v1(), description: '',
            todoListId: 'todolistId1', order: 0, status: TaskStatuses.New,
            priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
        },
            {
                title: 'JS', id: v1(), description: '',
                todoListId: 'todolistId1', order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'ReactJS', id: v1(), description: '',
                todoListId: 'todolistId1', order: 0, status: TaskStatuses.Completed,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'ReactJS', id: v1(), description: '',
                todoListId: 'todolistId1', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },],
        ['todolistId2']: [{
            title: 'Milk', id: v1(), description: '',
            todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
            priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
        },
            {
                title: 'Eggs', id: v1(), description: '',
                todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'Bread', id: v1(), description: '',
                todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            },
            {
                title: 'Meat', id: v1(), description: '',
                todoListId: 'todolistId2', order: 0, status: TaskStatuses.New,
                priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
            }]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)

