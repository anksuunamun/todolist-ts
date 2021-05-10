import {
    AddTodoListAC,
    ChangeFilterAC,
    ChangeTodoListTitleAC, FilterValuesType,
    RemoveTodoListAC, TodolistDomainType,
    todoListReducer
} from './todolist-reducer';
import {v1} from 'uuid';


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
        todolistId1 = v1();
        todolistId2 = v1();

        startState = [
            {id: todolistId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'},
            {id: todolistId2, title: 'What to buy', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'}
        ]
    }
)

test('correct todolist should be removed', () => {
    const endState = todoListReducer(startState, RemoveTodoListAC({todolistId: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});


test('correct todolist should be added', () => {
    let newTodolist = {todolist: {id: v1(), title: 'What to drink', filter: 'all', order: 0, addedDate: ''}}

    const endState = todoListReducer(startState, AddTodoListAC(newTodolist))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('What to drink');
    expect(endState === startState).toBeFalsy()
});


test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist';

    const endState = todoListReducer(startState, ChangeTodoListTitleAC({
        todolistTitle: newTodolistTitle,
        todolistId: todolistId2
    }));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = 'completed';

    const endState = todoListReducer(startState, ChangeFilterAC({todolistId: todolistId2, filterValue: newFilter}));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});
