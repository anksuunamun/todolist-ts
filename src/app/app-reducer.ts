const initialState = {
    status: 'idle' as RequestStatusType
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type AppActionTypes = SetStatusActionType

export type SetStatusActionType = ReturnType<typeof setStatusLoadingAC>

export const setStatusLoadingAC = (status: RequestStatusType) => ({type: 'APP/SET_STATUS', status} as const)

export const appReducer = (state = initialState, action: AppActionTypes): typeof initialState => {
    switch (action.type) {
        case 'APP/SET_STATUS': {
            return {...state, status: action.status}
        }
        default:
            return state;
    }
}