import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodolistsActionType,
    AddTodoListAC,
    RemoveTodoListAC,
    setTodolistsAC
} from './todolist-reducer';
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
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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

//thunks

export const getTasksTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    try {
        let response = await tasksAPI.getTasks(todolistId);
        dispatch(setTasksAC({todolistId, tasks: response}));
        dispatch(setStatusAC({status: 'succeeded'}));
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    dispatch(setEntityTaskStatusAC({todolistId, status: 'loading', taskId}));
    try {
        let response = await tasksAPI.deleteTask(todolistId, taskId)
        if (response.resultCode === 0) {
            dispatch(removeTaskAC({taskId, todoListId: todolistId}));
            dispatch(setStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(response, dispatch);
            dispatch(setEntityTaskStatusAC({todolistId, status: 'failed', taskId}));
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
        dispatch(setEntityTaskStatusAC({todolistId, status: 'failed', taskId}));
    }
}

export const createTaskTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusAC({status: 'loading'}));
    try {
        let response = await tasksAPI.createTask(title, todolistId)
        if (response.resultCode === 0) {
            dispatch(addTaskAC({task: {...response.data.item, entityStatus: 'idle'}}));
            dispatch(setStatusAC({status: 'succeeded'}));
        } else if (response.resultCode === 1) {
            handleServerAppError(response, dispatch);
        }
    } catch (error) {
        handleNetworkError(error, dispatch);
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskBodyType): AppThunk =>
    async (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
        dispatch(setStatusAC({status: 'loading'}));
        dispatch(setEntityTaskStatusAC({todolistId, status: 'loading', taskId}));
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
                    dispatch(updateTaskAC({id: taskId, domainModel: task, todolistId}));
                    dispatch(setStatusAC({status: 'succeeded'}));
                    dispatch(setEntityTaskStatusAC({todolistId, status: 'succeeded', taskId}));
                } else {
                    handleServerAppError(response, dispatch);
                    dispatch(setEntityTaskStatusAC({todolistId, status: 'failed', taskId}));
                }
            } catch (error) {
                handleNetworkError(error, dispatch);
                dispatch(setEntityTaskStatusAC({todolistId, status: 'failed', taskId}));
            }
        }
    }


export type TaskStateType = {
    [todoListID: string]: Array<TaskDomainType>
}

const initialState: TaskStateType = {}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskId: string, todoListId: string }>) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            index !== -1 && tasks.splice(index, 1)
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskDomainType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC: (state, action: PayloadAction<{ id: string, domainModel: UpdateDomainTaskBodyType, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.id)
            index !== -1 && (tasks[index] = {...tasks[index], ...action.payload.domainModel})
        },
        setTasksAC: (state, action: PayloadAction<{ todolistId: string, tasks: Array<TaskType> }>) => {
            state[action.payload.todolistId] = action.payload.tasks.map(task => ({...task, entityStatus: 'idle'}))
        },
        setEntityTaskStatusAC: (state, action: PayloadAction<{ todolistId: string, status: RequestStatusType, taskId: string }>) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            index !== -1 && (tasks[index].entityStatus = action.payload.status)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(AddTodoListAC, (state, action) => {
                state[action.payload.todolist.id] = []
            }
        )
        builder.addCase(RemoveTodoListAC, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            return action.payload.todolists.forEach(tl => !state[tl.id] && (state[tl.id] = []))
        })
    }
})

export const tasksReducer = tasksSlice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC, setEntityTaskStatusAC} = tasksSlice.actions