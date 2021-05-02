import {CommonResponseType} from '../data-access-layer/api';
import {setAppErrorAC, SetAppErrorActionType, setStatusAC, SetStatusActionType} from '../app/app-reducer';
import {Dispatch} from 'redux';

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages[0]) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setStatusAC({status: 'failed'}));
}

export const handleNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC({error: error.message}));
    dispatch(setStatusAC({status: 'failed'}));
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetStatusActionType>