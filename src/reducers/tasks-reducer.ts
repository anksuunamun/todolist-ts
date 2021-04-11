import {v1} from 'uuid';
import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistsActionType} from './todolist-reducer';
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskBodyType} from '../data-access-layer/api';
import {Dispatch} from 'redux';
import {AppRootStateType} from './store';

type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    todolistId: string
    taskId: string
}
type AddTaskActionType = {
    type: 'ADD_TASK'
    task: TaskType
}
type ChangeTaskStatusActionType = {
    type: 'CHANGE_TASK_STATUS'
    id: string
    status: TaskStatuses
    todoListID: string
}
type ChangeTaskTitleActionType = {
    type: 'CHANGE_TASK_TITLE'
    id: string
    title: string
    todolistId: string
}

export type ActionType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodolistsActionType
    | SetTasksActionType

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskActionType => {
    return {
        type: 'REMOVE_TASK',
        todolistId: todoListId,
        taskId: taskId,
    }
}

export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {
        type: 'ADD_TASK',
        task
    }
}

export const changeTaskStatusAC = (id: string, status: TaskStatuses, todoListID: string): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE_TASK_STATUS',
        id, status, todoListID
    }
}

export const changeTaskTitleAC = (id: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {
        type: 'CHANGE_TASK_TITLE',
        id, title, todolistId
    }
}

export type SetTasksActionType = {
    type: 'SET_TASKS'
    todolistId: string
    tasks: Array<TaskType>
}

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>): SetTasksActionType => {
    return {
        type: 'SET_TASKS',
        todolistId,
        tasks
    }
}

export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.getTasks(todolistId)
            .then(response => dispatch(setTasksAC(todolistId, response)))
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.deleteTask(todolistId, taskId)
            .then(response => {
                    if (response.resultCode === 0) {
                        dispatch(removeTaskAC(taskId, todolistId))
                    }
                }
            )
    }
}
export const createTaskTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.createTask(title, todolistId)
            .then(response => {
                dispatch(addTaskAC(response));
            })
    }
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
            tasksAPI.updateTask(todolistId, taskId, task)
                .then(response => {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId))
                })
        }
    }
}

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
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

export function tasksReducer(state: TaskStateType = initialState, action: ActionType): TaskStateType {
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