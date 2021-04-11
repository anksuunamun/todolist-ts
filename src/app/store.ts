import {TasksActionsType, tasksReducer} from '../features/Todolists/tasks-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {TodolistActionsType, todoListReducer} from '../features/Todolists/todolist-reducer';
import thunk, {ThunkAction} from 'redux-thunk';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodolistActionsType | TasksActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;