import {todolistsAPI, TodolistType} from '../../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppThunk} from '../../app/store';

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

export type RemoveTodoListActionType = ReturnType<typeof RemoveTodoListAC>
export type AddTodoListActionType = ReturnType<typeof AddTodoListAC>
type ChangeTodoListTitleActionType = ReturnType<typeof ChangeTodoListTitleAC>
type ChangeFilterActionType = ReturnType<typeof ChangeFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type TodolistActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeFilterActionType
    | SetTodolistsActionType

//actions
export const RemoveTodoListAC = (todolistId: string) => ({type: 'REMOVE_TODOLIST' as const, id: todolistId})

export const AddTodoListAC = (todolist: TodolistType) => ({type: 'ADD_TODOLIST' as const, todolist})

export const ChangeTodoListTitleAC = (todolistTitle: string, todolistId: string) => ({
    type: 'CHANGE_TODOLIST_TITLE' as const,
    title: todolistTitle,
    id: todolistId,
})

export const ChangeFilterAC = (todolistId: string, filterValue: FilterValuesType) => ({
    type: 'CHANGE_FILTER' as const,
    value: filterValue,
    id: todolistId,
})

export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET_TODOLISTS' as const, todolists})

//thunks
export const getTodolistsTC = (): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    let response = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC(response))
}

export const createTodolistTC = (title: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    let response = await todolistsAPI.createTodolist(title)
    dispatch(AddTodoListAC(response))
}

export const deleteTodolistTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    let response = await todolistsAPI.deleteTodolist(todolistId)
    dispatch(RemoveTodoListAC(todolistId))
}

export const changeTodolistTitleTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    let response = await todolistsAPI.updateTodolist(todolistId, title)
    dispatch(ChangeTodoListTitleAC(title, todolistId))
}

const initialState: Array<TodolistDomainType> = []

export function todoListReducer(state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD_TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
        }
        case 'CHANGE_TODOLIST_TITLE' : {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE_FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.value} : tl)
        }
        case 'SET_TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }
        default: {
            return state;
        }
    }
}