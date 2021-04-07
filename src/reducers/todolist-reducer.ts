import {v1} from 'uuid';
import {TodolistType} from '../data-access-layer/api';

export type RemoveTodoListActionType = {
    type: 'REMOVE_TODOLIST'
    id: string
}
export type AddTodoListActionType = {
    type: 'ADD_TODOLIST'
    title: string
    todolistId: string
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

export const RemoveTodoListAC = (todolistId: string): RemoveTodoListActionType => {
    return {
        type: 'REMOVE_TODOLIST',
        id: todolistId
    }
}

export const AddTodoListAC = (todolistTitle: string): AddTodoListActionType => {
    return {
        type: 'ADD_TODOLIST',
        title: todolistTitle,
        todolistId: v1()
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

const initialState: Array<TodolistDomainType> = []



export function todoListReducer(state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD_TODOLIST': {
            const newTodoListID = action.todolistId;
            const newTodoList: TodolistDomainType = {
                id: newTodoListID,
                title: action.title,
                addedDate: '',
                order: 0,
                filter: 'all'
            }
            return [newTodoList, ...state]
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
        default: {
            return state;
        }
    }
}