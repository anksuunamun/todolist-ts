const initialState = {
    status: 'idle' as RequestStatusType,
    error: 'Some error occurred'
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type AppActionTypes = SetStatusActionType | SetAppErrorActionType

export type SetStatusActionType = ReturnType<typeof setStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

export const setStatusAC = (status: RequestStatusType) => ({type: 'APP/SET_STATUS', status} as const)
export const setAppErrorAC = (error: string) => ({type: 'APP/SET_ERROR', error} as const)

export const appReducer = (state = initialState, action: AppActionTypes): typeof initialState => {
    switch (action.type) {
        case 'APP/SET_STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET_ERROR': {
            return {...state, error: action.error}
        }
        default:
            return state;
    }
}