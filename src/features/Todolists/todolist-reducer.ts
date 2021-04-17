import {todolistsAPI, TodolistType} from '../../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppThunk} from '../../app/store';
import {SetStatusActionType, setStatusAC, SetAppErrorActionType} from '../../app/app-reducer';
import {handleNetworkError, handleServerAppError} from '../../utils/error-utils';

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
    | SetTodolistsActionType | SetStatusActionType | SetAppErrorActionType

//actions
export const RemoveTodoListAC = (todolistId: string) => ({type: 'REMOVE_TODOLIST', id: todolistId} as const)

export const AddTodoListAC = (todolist: TodolistType) => ({type: 'ADD_TODOLIST', todolist} as const)

export const ChangeTodoListTitleAC = (todolistTitle: string, todolistId: string) => ({
    type: 'CHANGE_TODOLIST_TITLE',
    title: todolistTitle,
    id: todolistId,
} as const)

export const ChangeFilterAC = (todolistId: string, filterValue: FilterValuesType) => ({
    type: 'CHANGE_FILTER',
    value: filterValue,
    id: todolistId,
} as const)

export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET_TODOLISTS', todolists} as const)

//thunks
export const getTodolistsTC = (): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC('loading'));
    try {
        let response = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(response))
        dispatch(setStatusAC('succeeded'));
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const createTodolistTC = (title: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC('loading'));
    try {
        let response = await todolistsAPI.createTodolist(title)
        if (response.resultCode === 0) {
            dispatch(AddTodoListAC(response.data.item))
            dispatch(setStatusAC('succeeded'));
        } else {
            handleServerAppError(response, dispatch);
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const deleteTodolistTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC('loading'));
    try {
        let response = await todolistsAPI.deleteTodolist(todolistId)
        if (response.resultCode === 0) {
            dispatch(RemoveTodoListAC(todolistId))
            dispatch(setStatusAC('succeeded'));
        } else {
            handleServerAppError(response, dispatch);
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const changeTodolistTitleTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC('loading'));
    try {
        let response = await todolistsAPI.updateTodolist(todolistId, title)
        if (response.resultCode === 0) {
            dispatch(ChangeTodoListTitleAC(title, todolistId))
            dispatch(setStatusAC('succeeded'));
        } else {
            handleServerAppError(response, dispatch);
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
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