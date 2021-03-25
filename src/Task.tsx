import {TaskType} from './App';
import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox} from '@material-ui/core';
import EditableSpan from './EditableSpan';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export type TaskPropsType = {
    changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    changeTaskTitle: (id: string, title: string, todoListID: string) => void
    todolistId: string
    task: TaskType
}
export const Task = React.memo((props: TaskPropsType) => {
    console.log('Task render')

    const onClickHandler = () => {
        props.removeTask(props.task.id, props.todolistId)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(props.task.id, newIsDoneValue, props.todolistId)
    }
    const changeTitle = useCallback((title: string) => {
        props.changeTaskTitle(props.task.id, title, props.todolistId)
    }, [props.todolistId, props.changeTaskTitle])


    return (<li className={props.task.isDone ? 'is-done' : ''}
    >
        <Checkbox checked={props.task.isDone}
                  onChange={onChangeHandler}
                  color={'secondary'}/>
        {/*<input type="checkbox"*/}
        {/*       checked={task.isDone}*/}
        {/*       onChange={onChangeHandler}*/}
        {/*/>*/}
        {/*<span>{task.title}</span>*/}
        <EditableSpan title={props.task.title}
                      changeItem={changeTitle}/>
        <IconButton onClick={onClickHandler}
                    color="default">
            <DeleteIcon/>
        </IconButton>
    </li>)
})