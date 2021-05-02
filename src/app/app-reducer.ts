import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type AppActionTypes = SetStatusActionType | SetAppErrorActionType | SetAppInitializedActionType

export type SetStatusActionType = ReturnType<typeof setStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>

// export const setStatusAC = (status: RequestStatusType) => ({type: 'APP/SET_STATUS', status} as const)
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET_ERROR', error} as const)
// export const setAppInitializedAC = (isInitialized: boolean) => ({
//     type: 'APP/SET_IS_INITIALIZED',
//     isInitialized
// } as const)

// export const appReducer = (state = initialState, action: AppActionTypes): typeof initialState => {
//     switch (action.type) {
//         case 'APP/SET_STATUS': {
//             return {...state, status: action.status}
//         }
//         case 'APP/SET_ERROR': {
//             return {...state, error: action.error}
//         }
//         case 'APP/SET_IS_INITIALIZED': {
//             return {...state, isInitialized: action.isInitialized}
//         }
//
//         default:
//             return state;
//     }
// }

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppInitializedAC: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    }
})

export const {setStatusAC, setAppErrorAC, setAppInitializedAC} = appSlice.actions
export const appReducer = appSlice.reducer