import {addTaskAC, removeTaskAC, tasksReducer, TaskStateType, updateTaskAC} from './tasks-reducer';
import {AddTodoListAC, RemoveTodoListAC} from './todolist-reducer';
import {TaskStatuses} from '../../data-access-layer/api';

let startState: TaskStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId1'
            },
            {
                id: '2', title: 'JS', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId1'
            },
            {
                id: '3', title: 'React', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId1'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId2'
            },
            {
                id: '2', title: 'milk', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId2'
            },
            {
                id: '3', title: 'tea', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId2'
            }
        ]
    };
})

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC('2', 'todolistId2');

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId1'
            },
            {
                id: '2', title: 'JS', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId1'
            },
            {
                id: '3', title: 'React', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId1'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId2'
            },
            {
                id: '3', title: 'tea', status: 0, deadline: '',
                startDate: '', priority: 0, description: '',
                addedDate: '', order: 0, todoListId: 'todolistId2'
            }
        ]
    });
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every(t => t.id !== '2')).toBeTruthy()
    //если для всех элементов массива возвращается true, то метод вернет true
    //или так
    expect(endState['todolistId2'][0].id).toBe('1')
    expect(endState['todolistId2'][1].id).toBe('3')

});

test('correct task should be added to correct array', () => {
    const action = addTaskAC({
        id: '4', title: 'lemon', status: 0, deadline: '',
        startDate: '', priority: 0, description: '',
        addedDate: '', order: 0, todoListId: 'todolistId2'
    });

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('lemon');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {
    const action = updateTaskAC('2', {status: TaskStatuses.Completed}, 'todolistId2');

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Completed);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.New);
});


test('title of specified task should be changed', () => {
    const action = updateTaskAC('2', {title: 'beer'}, 'todolistId2');

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('beer');
    expect(endState['todolistId1'][1].title).toBe('JS');
});

test('new array should be added when new todolist is added', () => {
    const action = AddTodoListAC({title: 'new todolist', addedDate: '', order: 0, id: 'newId'});

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = RemoveTodoListAC('todolistId2');

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});
