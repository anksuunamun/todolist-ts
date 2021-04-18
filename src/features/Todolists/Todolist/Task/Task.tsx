import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox} from '@material-ui/core';
import EditableSpan from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {TaskStatuses, TaskType} from '../../../../data-access-layer/api';
import {RequestStatusType} from '../../../../app/app-reducer';
import {TaskDomainType} from '../../tasks-reducer';

export type TaskPropsType = {
    changeTaskStatus: (id: string, status: TaskStatuses, todoListID: string) => void
    removeTask: (taskId: string, todoListID: string) => void
    changeTaskTitle: (id: string, title: string, todoListID: string) => void
    todolistId: string
    task: TaskDomainType
    entityStatus: RequestStatusType
}
export const Task = React.memo((props: TaskPropsType) => {
    console.log('Task render')

    const onClickHandler = () => {
        props.removeTask(props.task.id, props.todolistId)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.task.id, newIsDoneValue, props.todolistId)
    }
    const changeTitle = useCallback((title: string) => {
        props.changeTaskTitle(props.task.id, title, props.todolistId)
    }, [props.todolistId, props.changeTaskTitle])


    return (<li className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
    >
        <Checkbox checked={props.task.status === TaskStatuses.Completed}
                  onChange={onChangeHandler}
                  color={'secondary'}
                  disabled={props.entityStatus === 'loading'}/>
        {/*<input type="checkbox"*/}
        {/*       checked={task.isDone}*/}
        {/*       onChange={onChangeHandler}*/}
        {/*/>*/}
        {/*<span>{task.title}</span>*/}
        <EditableSpan title={props.task.title}
                      changeItem={changeTitle}
                      disabled={props.entityStatus === 'loading'}/>
        <IconButton onClick={onClickHandler}
                    color="default"
                    disabled={props.entityStatus === 'loading'}>
            <DeleteIcon/>
        </IconButton>
    </li>)
})