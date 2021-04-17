import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistsActionType} from './todolist-reducer';
import {
    tasksAPI,
    TaskType,
    UpdateDomainTaskBodyType,
    UpdateTaskBodyType
} from '../../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppRootStateType, AppThunk} from '../../app/store';
import {SetStatusActionType, setStatusLoadingAC} from '../../app/app-reducer';

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodolistsActionType
    | SetTasksActionType | UpdateTaskActionType | SetStatusActionType

//actions
export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE_TASK' as const,
    todolistId: todoListId,
    taskId: taskId,
})

export const addTaskAC = (task: TaskType) => ({type: 'ADD_TASK' as const, task})

export const updateTaskAC = (id: string, domainModel: UpdateDomainTaskBodyType, todolistId: string) => ({
    type: 'UPDATE_TASK' as const,
    id, domainModel, todolistId
})

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({
    type: 'SET_TASKS' as const,
    todolistId,
    tasks
})

//thunks

export const getTasksTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusLoadingAC('loading'));
    let response = await tasksAPI.getTasks(todolistId);
    dispatch(setTasksAC(todolistId, response));
    dispatch(setStatusLoadingAC('succeeded'));
}

export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusLoadingAC('loading'));
    let response = await tasksAPI.deleteTask(todolistId, taskId)
    if (response.resultCode === 0) {
        dispatch(removeTaskAC(taskId, todolistId));
        dispatch(setStatusLoadingAC('succeeded'));
    }
}

export const createTaskTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setStatusLoadingAC('loading'));
    let response = await tasksAPI.createTask(title, todolistId)
    dispatch(addTaskAC(response));
    dispatch(setStatusLoadingAC('succeeded'));
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskBodyType): AppThunk => {
    return (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
        dispatch(setStatusLoadingAC('loading'));
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
            tasksAPI.updateTask(todolistId, taskId, task)
                .then(response => {
                    dispatch(updateTaskAC(taskId, task, todolistId));
                    dispatch(setStatusLoadingAC('succeeded'));
                })
        }
    }
}

export type TaskStateType = {
    [todoListID: string]: Array<TaskType>
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
            return {...state, [action.todolistId]: action.tasks}
        }
        case 'SET_TODOLISTS': {
            let newState = {...state}
            action.todolists.forEach(tl => {
                newState[tl.id] = []
            })
            return newState;
        }
        default: {
            return state;
        }
    }
}