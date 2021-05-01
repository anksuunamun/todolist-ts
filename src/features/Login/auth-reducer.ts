import {
    SetAppErrorActionType,
    setAppInitializedAC,
    SetAppInitializedActionType,
    setStatusAC,
    SetStatusActionType
} from '../../app/app-reducer';
import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../../data-access-layer/api';
import {handleNetworkError, handleServerAppError} from '../../utils/error-utils';

const initialState = {
    isLoggedIn: false
}

export const setIsLoggedIn = (isLoggedIn: boolean) => ({
    type: 'login/SET_IS_LOGGED_IN', isLoggedIn
} as const)

export const logInTC = (data: LoginParamsType) => (dispatch: Dispatch<AuthReducerActionsType>) => {
    dispatch(setStatusAC('loading'))
    authAPI.logIn(data)
        .then(
            response => {
                if (response.resultCode === 0) {
                    dispatch(setIsLoggedIn(true))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    handleServerAppError(response, dispatch)
                }
            }
        )
        .catch(error => handleNetworkError(error, dispatch))
}

export const logOutTC = () => (dispatch: Dispatch<AuthReducerActionsType>) => {
    dispatch(setStatusAC('loading'))
    authAPI.logOut().then(
        response => {
            if (response.resultCode === 0) {
                dispatch(setIsLoggedIn(false))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(response, dispatch)
            }
        }
    ).catch(error => handleNetworkError(error, dispatch))
}

export const appInitTC = () => (dispatch: Dispatch<AuthReducerActionsType>) => {
    dispatch(setStatusAC('loading'))
    authAPI.authMe()
        .then(response => {
                if (response.resultCode === 0) {
                    dispatch(setStatusAC('succeeded'))
                    dispatch(setIsLoggedIn(true))
                } else {
                    handleServerAppError(response, dispatch)
                }
            }
        )
        .catch(error => handleNetworkError(error, dispatch))
        .finally(() => dispatch(setAppInitializedAC(true)))
}

type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedIn>

type AuthReducerActionsType = SetIsLoggedInActionType
    | SetAppErrorActionType
    | SetStatusActionType
    | SetAppInitializedActionType

export const authReducer = (state = initialState, action: AuthReducerActionsType): typeof initialState => {
    switch (action.type) {
        case 'login/SET_IS_LOGGED_IN': {
            return {...state, isLoggedIn: action.isLoggedIn}
        }
        default:
            return state
    }
}