import {todolistsAPI, TodolistType} from '../../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppThunk} from '../../app/store';
import {SetStatusActionType, setStatusAC, SetAppErrorActionType, RequestStatusType} from '../../app/app-reducer';
import {handleNetworkError, handleServerAppError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }

export type RemoveTodoListActionType = ReturnType<typeof RemoveTodoListAC>
export type AddTodoListActionType = ReturnType<typeof AddTodoListAC>
type ChangeTodoListTitleActionType = ReturnType<typeof ChangeTodoListTitleAC>
type ChangeFilterActionType = ReturnType<typeof ChangeFilterAC>
type SetEntityStatusACActionType = ReturnType<typeof setEntityStatusAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type TodolistActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeFilterActionType
    | SetTodolistsActionType
    | SetStatusActionType
    | SetAppErrorActionType
    | SetEntityStatusACActionType

//thunks
export const getTodolistsTC = (): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    try {
        let response = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC({todolists: response}))
        dispatch(setStatusAC({status: 'succeeded'}));
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const createTodolistTC = (title: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    try {
        let response = await todolistsAPI.createTodolist(title)
        if (response.resultCode === 0) {
            dispatch(AddTodoListAC({todolist: response.data.item}))
            dispatch(setStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(response, dispatch);
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const deleteTodolistTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    dispatch(setEntityStatusAC({todolistId, status: 'loading'}))
    try {
        let response = await todolistsAPI.deleteTodolist(todolistId)
        if (response.resultCode === 0) {
            dispatch(RemoveTodoListAC({todolistId}))
            dispatch(setStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(response, dispatch);
            dispatch(setEntityStatusAC({todolistId, status: 'failed'}))
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
        dispatch(setEntityStatusAC({todolistId, status: 'failed'}))
    }
}

export const changeTodolistTitleTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TodolistActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    dispatch(setEntityStatusAC({todolistId, status: 'loading'}))
    try {
        let response = await todolistsAPI.updateTodolist(todolistId, title)
        if (response.resultCode === 0) {
            dispatch(ChangeTodoListTitleAC({todolistTitle: title, todolistId}))
            dispatch(setStatusAC({status: 'succeeded'}));
            dispatch(setEntityStatusAC({todolistId, status: 'succeeded'}))
        } else {
            handleServerAppError(response, dispatch);
            dispatch(setEntityStatusAC({todolistId, status: 'failed'}))
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
        dispatch(setEntityStatusAC({todolistId, status: 'failed'}))
    }
}

const initialState: Array<TodolistDomainType> = []

const todosSlice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        RemoveTodoListAC: (state, action: PayloadAction<{ todolistId: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            index !== -1 && state.splice(index, 1)
        },
        AddTodoListAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        ChangeTodoListTitleAC: (state, action: PayloadAction<{ todolistTitle: string, todolistId: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            index !== -1 && (state[index].title = action.payload.todolistTitle)
        },
        ChangeFilterAC: (state, action: PayloadAction<{ todolistId: string, filterValue: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            index !== -1 && (state[index].filter = action.payload.filterValue)
        },
        setEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            index !== -1 && (state[index].entityStatus = action.payload.status)
        },
        setTodolistsAC: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            return action.payload.todolists.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'}))
        },
    }
})

export const todoListReducer = todosSlice.reducer
export const {
    RemoveTodoListAC,
    AddTodoListAC,
    ChangeTodoListTitleAC,
    ChangeFilterAC,
    setEntityStatusAC,
    setTodolistsAC
} = todosSlice.actions