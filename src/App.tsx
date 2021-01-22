import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';

export type TaskType = {
    title: string,
    id: string,
    isDone: boolean,
}

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {


    let [tasks1, setTasks] = useState<Array<TaskType>>([
        {title: 'HTML and CSS', isDone: true, id: v1()},
        {title: 'JS', isDone: true, id: v1()},
        {title: 'ReactJS', isDone: false, id: v1()},
        {title: 'ReactJS', isDone: true, id: v1()},
    ])

    const [filter, setFilter] = useState<FilterValuesType>('all')


    function removeTask(taskId: string) {
        setTasks(tasks1.filter(task => task.id !== taskId))
    }

    function changeFilter(newFilterValue: FilterValuesType) {
        setFilter(newFilterValue)
    }

    function addTask(text: string) {
        const newTask:TaskType = {title: text, isDone: false, id: v1()}
        setTasks([newTask, ...tasks1])
    }

    let tasksForTodoList = tasks1
    if (filter === 'active') {
        tasksForTodoList = tasks1.filter(t => !t.isDone)
    }
    if (filter === 'completed') {
        tasksForTodoList = tasks1.filter(t => t.isDone)
    }


    return (
        <div className="App">
            <Todolist title="What to learn" tasks={tasksForTodoList} removeTask={removeTask} changeFilter={changeFilter} addTask={addTask}/>


        </div>
    );
}

export default App;
