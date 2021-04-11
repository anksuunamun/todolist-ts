import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../data-access-layer/api';
import {Dispatch} from 'redux';
import {getTasksTC} from './tasks-reducer';

export type RemoveTodoListActionType = {
    type: 'REMOVE_TODOLIST'
    id: string
}
export type AddTodoListActionType = {
    type: 'ADD_TODOLIST'
    todolist: TodolistType
}
type ChangeTodoListTitleActionType = {
    type: 'CHANGE_TODOLIST_TITLE'
    title: string
    id: string
}
type ChangeFilterActionType = {
    type: 'CHANGE_FILTER'
    value: FilterValuesType
    id: string
}

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

export type ActionType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeFilterActionType
    | SetTodolistsActionType

export const RemoveTodoListAC = (todolistId: string): RemoveTodoListActionType => {
    return {
        type: 'REMOVE_TODOLIST',
        id: todolistId
    }
}

export const AddTodoListAC = (todolist: TodolistType): AddTodoListActionType => {
    return {
        type: 'ADD_TODOLIST',
        todolist
    }
}

export const ChangeTodoListTitleAC = (todolistTitle: string, todolistId: string): ChangeTodoListTitleActionType => {
    return {
        type: 'CHANGE_TODOLIST_TITLE',
        title: todolistTitle,
        id: todolistId,
    }
}

export const ChangeFilterAC = (todolistId: string, filterValue: FilterValuesType): ChangeFilterActionType => {
    return {
        type: 'CHANGE_FILTER',
        value: filterValue,
        id: todolistId,
    }
}

export type SetTodolistsActionType = {
    type: 'SET_TODOLISTS',
    todolists: Array<TodolistType>
}

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {
        type: 'SET_TODOLISTS',
        todolists
    }
}

export const getTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolists()
            .then(response => {
                dispatch(setTodolistsAC(response));
            })
    }
}

export const createTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolist(title)
            .then(
                response => {
                    dispatch(AddTodoListAC(response))
                }
            )
    }
}

export const deleteTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTodolist(todolistId)
            .then(response =>
                dispatch(RemoveTodoListAC(todolistId))
            )
    }
}

export const changeTodolistTitleTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title)
            .then(response => {
                dispatch(ChangeTodoListTitleAC(title, todolistId))
            })
    }
}

const initialState: Array<TodolistDomainType> = []


export function todoListReducer(state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD_TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
        }
        case 'CHANGE_TODOLIST_TITLE' : {
            const todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.title = action.title
                return [...state]
            }
            // return state.map(tl => {
            //     if (tl.id === action.id) {
            //         return {...tl, title: action.title}
            //     } else {
            //         return tl;
            //     }
            // })
            return state;
        }
        case 'CHANGE_FILTER': {
            // const todoList = state.find(list => list.id === action.id);
            // if (todoList) {
            //     todoList.filter = action.value;
            //     return [...state]
            // } else return state
            return state.map(tl => {
                if (tl.id === action.id) {
                    return {...tl, filter: action.value}
                } else {
                    return tl
                }
            })
        }
        case 'SET_TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }
        default: {
            return state;
        }
    }
}