import {FilterValuesType, TaskStateType, TaskType} from '../App';
import {v1} from 'uuid';
import {AddTodoListActionType, RemoveTodoListActionType} from './todolist-reducer';

type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    todolistId: string
    taskId: string
}
type AddTaskActionType = {
    type: 'ADD_TASK'
    title: string
    todolistId: string
}
type ChangeTaskStatusActionType = {
    type: 'CHANGE_TASK_STATUS'
    id: string
    isDone: boolean
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

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskActionType => {
    return {
        type: 'REMOVE_TASK',
        todolistId: todoListId,
        taskId: taskId,
    }
}

export const addTaskAC = (todolistTitle: string, todolistId: string): AddTaskActionType => {
    return {
        type: 'ADD_TASK',
        title: todolistTitle,
        todolistId: todolistId
    }
}

export const changeTaskStatusAC = (id: string, isDone: boolean, todoListID: string): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE_TASK_STATUS',
        id, isDone, todoListID
    }
}

export const changeTaskTitleAC = (id: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {
        type: 'CHANGE_TASK_TITLE',
        id, title, todolistId
    }
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
            let task = {id: v1(), title: action.title, isDone: false}
            let todolistTasks = copyState[action.todolistId]
            copyState[action.todolistId] = [task, ...todolistTasks]
            return copyState
        }
        case 'CHANGE_TASK_STATUS': {
            let copyState = {...state}
            const todoTasks = copyState[action.todoListID]
            let task: TaskType | undefined = todoTasks.find(t => t.id === action.id)
            if (task) {
                task.isDone = action.isDone
            }
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(task => {
                        if (task.id === action.id) {
                            return {...task, isDone: action.isDone}
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
            return {...state, [action.todolistId]: []}
        }
        case 'REMOVE_TODOLIST' : {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState;
        }
        default: {
            return state;
        }
    }
}