import {CommonResponseType} from '../data-access-layer/api';
import {setAppErrorAC, SetAppErrorActionType, setStatusAC, SetStatusActionType} from '../app/app-reducer';
import {Dispatch} from 'redux';

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages[0]) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setStatusAC('failed'));
}

export const handleNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC(error.message));
    dispatch(setStatusAC('failed'));
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetStatusActionType>