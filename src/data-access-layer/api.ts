import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'ab4073b3-e602-4190-9ab5-ec0d40796ddb'
    }
})

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    id: string
    title: string
    description: null | string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: null | string
    deadline: null | string
    addedDate: null | string
}

export type UpdateTaskBodyType = {
    title: string
    description: null | string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: null | string
    deadline: null | string
}
type GetTasksResponseType = {
    items: Array<TaskType>
    totalCount: number,
    error: null | string
}

type CommonResponseType<T> = {
    data: T
    messages: Array<string>
    fieldsErrors: Array<string>,
    resultCode: number
}

export const todolistsAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('/todo-lists')
            .then(response => response.data)
    },
    createTodolist(title: string) {
        return instance.post<CommonResponseType<{ item: TodolistType }>>('/todo-lists', {title})
            .then(response => response.data.data.item)
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonResponseType<{}>>(`/todo-lists/${todolistId}`)
            .then(response => response)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<CommonResponseType<{}>>(`/todo-lists/${todolistId}`, {title})
            .then(response => response)
    }
}

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
            .then(response => response.data.items)
    },
    createTask(title: string, todolistId: string) {
        return instance.post<CommonResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {title})
            .then(response => response.data.data.item)
    },
    updateTask(todolistId: string, taskId: string, data: UpdateTaskBodyType) {
        return instance.put<CommonResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, {...data})
            .then(response => response.data.data.item)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<CommonResponseType<{}>>(`/todo-lists/${todolistId}/tasks/${taskId}`)
            .then(response => response.data)
    }
}