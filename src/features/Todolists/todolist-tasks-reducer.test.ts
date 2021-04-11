import {AddTodoListAC, TodolistDomainType, todoListReducer} from './todolist-reducer';
import {tasksReducer, TaskStateType} from './tasks-reducer';


test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = AddTodoListAC({
        title: 'new todo',
        id: 'anyid',
        addedDate: '',
        order: 0
    });

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
