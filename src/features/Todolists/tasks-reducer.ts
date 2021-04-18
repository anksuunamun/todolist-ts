import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistsActionType} from './todolist-reducer';
import {
    tasksAPI,
    TaskType,
    UpdateDomainTaskBodyType,
    UpdateTaskBodyType
} from '../../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppRootStateType, AppThunk} from '../../app/store';
import {SetStatusActionType, setStatusAC, SetAppErrorActionType, RequestStatusType} from '../../app/app-reducer';
import {handleNetworkError, handleServerAppError} from '../../utils/error-utils';

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type SetEntityTaskStatusACActionType = ReturnType<typeof setEntityTaskStatusAC>

export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }

export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodolistsActionType
    | SetTasksActionType
    | UpdateTaskActionType
    | SetStatusActionType
    | SetAppErrorActionType
    | SetEntityTaskStatusACActionType

//actions
export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE_TASK',
    todolistId: todoListId,
    taskId: taskId,
} as const)

export const addTaskAC = (task: TaskDomainType) => ({type: 'ADD_TASK', task} as const)

export const updateTaskAC = (id: string, domainModel: UpdateDomainTaskBodyType, todolistId: string) => ({
    type: 'UPDATE_TASK',
    id, domainModel, todolistId
} as const)

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({
    type: 'SET_TASKS',
    todolistId,
    tasks
} as const)

export const setEntityTaskStatusAC = (todolistId: string, status: RequestStatusType, taskId: string) => ({
    type: 'SET_TASK_ENTITY_STATUS',
    status, todolistId, taskId
} as const)

//thunks

export const getTasksTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusAC('loading'));
    try {
        let response = await tasksAPI.getTasks(todolistId);
        dispatch(setTasksAC(todolistId, response));
        dispatch(setStatusAC('succeeded'));
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusAC('loading'));
    dispatch(setEntityTaskStatusAC(todolistId, 'loading', taskId));
    try {
        let response = await tasksAPI.deleteTask(todolistId, taskId)
        if (response.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId));
            dispatch(setStatusAC('succeeded'));
        } else {
            handleServerAppError(response, dispatch);
            dispatch(setEntityTaskStatusAC(todolistId, 'failed', taskId));
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
        dispatch(setEntityTaskStatusAC(todolistId, 'failed', taskId));
    }
}

export const createTaskTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusAC('loading'));
    try {
        let response = await tasksAPI.createTask(title, todolistId)
        if (response.resultCode === 0) {
            dispatch(addTaskAC({...response.data.item, entityStatus: 'idle'}));
            dispatch(setStatusAC('succeeded'));
        } else if (response.resultCode === 1) {
            handleServerAppError(response, dispatch);
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskBodyType): AppThunk =>
    async (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
        dispatch(setStatusAC('loading'));
        dispatch(setEntityTaskStatusAC(todolistId, 'loading', taskId));
        let taskForUpdate = getState().tasks[todolistId].find(task => task.id === taskId)
        if (taskForUpdate) {
            let task: UpdateTaskBodyType = {
                status: taskForUpdate.status,
                description: taskForUpdate.description,
                title: taskForUpdate.title,
                priority: taskForUpdate.priority,
                startDate: taskForUpdate.startDate,
                deadline: taskForUpdate.deadline,
                ...domainModel
            }
            try {
                let response = await tasksAPI.updateTask(todolistId, taskId, task);
                if (response.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, task, todolistId));
                    dispatch(setStatusAC('succeeded'));
                    dispatch(setEntityTaskStatusAC(todolistId, 'succeeded', taskId));
                } else {
                    handleServerAppError(response, dispatch);
                    dispatch(setEntityTaskStatusAC(todolistId, 'failed', taskId));
                }
            } catch (error) {
                handleNetworkError(error, dispatch);
                dispatch(setEntityTaskStatusAC(todolistId, 'failed', taskId));
            }
        }
    }


export type TaskStateType = {
    [todoListID: string]: Array<TaskDomainType>
}

const initialState: TaskStateType = {}

export function tasksReducer(state: TaskStateType = initialState, action: TasksActionsType): TaskStateType {
    switch (action.type) {
        case 'REMOVE_TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)}
        }
        case 'ADD_TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'UPDATE_TASK' : {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.id
                    ? {...task, ...action.domainModel} : task)
            }
        }
        case 'ADD_TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE_TODOLIST' : {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState;
        }
        case 'SET_TASKS': {
            return {...state, [action.todolistId]: action.tasks.map(task => ({...task, entityStatus: 'idle'}))}
        }
        case 'SET_TODOLISTS': {
            let newState = {...state}
            action.todolists.forEach(tl => {
                newState[tl.id] = []
            })
            return newState;
        }
        case 'SET_TASK_ENTITY_STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId ? {
                    ...task,
                    entityStatus: action.status
                } : task)
            }
        }
        default: {
            return state;
        }
    }
}