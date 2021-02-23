import {FilterValuesType, TaskType, TodoListType} from '../App';
import {v1} from 'uuid';

type RemoveTodoListActionType = {
    type: 'REMOVE_TODOLIST'
    id: string
}
type AddTodoListActionType = {
    type: 'ADD_TODOLIST'
    title: string
}
type ChangeTodoListTitleActionType = {
    type: 'CHANGE_TODOLIST_TITLE'
    title: string
    id: string
}
type ChangeFilterActionType = {
    type: 'CHANGE_FILTER'
    value: FilterValuesType
    id: string
}

type ActionType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeFilterActionType

export function todoListReducer(state: Array<TodoListType>, action: ActionType) {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD_TODOLIST': {
            const newTodoListID = v1();
            const newTodoList: TodoListType = {
                id: newTodoListID,
                title: action.title,
                filter: 'all',
            }
            return [newTodoList, ...state]
        }
        case 'CHANGE_TODOLIST_TITLE' : {
            const todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.title = action.title
                return [...state]
            }
            return state
        }
        case 'CHANGE_FILTER': {
            const todoList = state.find(list => list.id === action.id);
            if (todoList) {
                todoList.filter = action.value;
                return [...state]
            } else return state
        }
        default: {
            return state;
        }
    }
}