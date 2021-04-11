import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistsActionType} from './todolist-reducer';
import {tasksAPI, TaskStatuses, TaskType, UpdateTaskBodyType} from '../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppRootStateType, AppThunk} from './store';

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>

export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodolistsActionType
    | SetTasksActionType

export const removeTaskAC = (taskId: string, todoListId: string) => {
    return {
        type: 'REMOVE_TASK' as const,
        todolistId: todoListId,
        taskId: taskId,
    }
}

export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD_TASK' as const,
        task
    }
}

export const changeTaskStatusAC = (id: string, status: TaskStatuses, todoListID: string) => {
    return {
        type: 'CHANGE_TASK_STATUS' as const,
        id, status, todoListID
    }
}

export const changeTaskTitleAC = (id: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE_TASK_TITLE' as const,
        id, title, todolistId
    }
}

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => {
    return {
        type: 'SET_TASKS' as const,
        todolistId,
        tasks
    }
}

export const getTasksTC = (todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    let response = await tasksAPI.getTasks(todolistId)
    dispatch(setTasksAC(todolistId, response))
}


export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    let response = await tasksAPI.deleteTask(todolistId, taskId)
    if (response.resultCode === 0) {
        dispatch(removeTaskAC(taskId, todolistId))
    }
}

export const createTaskTC = (title: string, todolistId: string): AppThunk => async (dispatch: Dispatch<TasksActionsType>) => {
    let response = await tasksAPI.createTask(title, todolistId)
    dispatch(addTaskAC(response));
}


export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses): AppThunk => async (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
    let taskForUpdate = getState().tasks[todolistId].find(task => task.id === taskId)
    if (taskForUpdate) {
        let task: UpdateTaskBodyType = {
            title: taskForUpdate.title,
            description: taskForUpdate.description,
            status: status,
            priority: taskForUpdate.priority,
            startDate: taskForUpdate.startDate,
            deadline: taskForUpdate.deadline
        }
        let response = await tasksAPI.updateTask(todolistId, taskId, task)
        dispatch(changeTaskStatusAC(taskId, status, todolistId))
    }
}


export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string): AppThunk => {
    return (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
        let taskForUpdate = getState().tasks[todolistId].find(task => task.id === taskId)
        if (taskForUpdate) {
            let task: UpdateTaskBodyType = {
                status: taskForUpdate.status,
                description: taskForUpdate.description,
                title: title,
                priority: taskForUpdate.priority,
                startDate: taskForUpdate.startDate,
                deadline: taskForUpdate.deadline
            }
            tasksAPI.updateTask(todolistId, taskId, task)
                .then(response => {
                    dispatch(changeTaskTitleAC(taskId, title, todolistId))
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
            let copyState = {...state}
            let todoListTasks = copyState[action.todolistId]
            copyState[action.todolistId] = todoListTasks.filter(task => task.id !== action.taskId)
            return copyState
        }
        case 'ADD_TASK': {
            let copyState = {...state}
            let todolistTasks = copyState[action.task.todoListId]
            copyState[action.task.todoListId] = [action.task, ...todolistTasks]
            return copyState
        }
        case 'CHANGE_TASK_STATUS': {
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(task => {
                        if (task.id === action.id) {
                            return {...task, status: action.status}
                        } else {
                            return task
                        }
                    }
                )
            }
        }
        case 'CHANGE_TASK_TITLE': {
            let copyState = {...state}
            const todoTasks = copyState[action.todolistId]
            let task: TaskType | undefined = todoTasks.find(t => t.id === action.id)
            if (task) {
                task.title = action.title
            }
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => {
                        if (task.id === action.id) {
                            return {...task, title: action.title}
                        } else {
                            return task
                        }
                    }
                )
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