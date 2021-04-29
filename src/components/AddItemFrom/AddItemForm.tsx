import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import IconButton from '@material-ui/core/IconButton';
import {AddBox} from '@material-ui/icons';
import {TextField} from '@material-ui/core';


export type AddItemFormPropsType = {
    addItem: (title: string) => void
    error: string | null
    setError: (error: string | null) => void
    disabled ?: boolean
}

const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>(' ')

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }

    function onKeyPressHandler(e: KeyboardEvent<HTMLInputElement>) {
        props.setError(null)
        if (e.key === 'Enter') {
            addTask()
        }
    }

    function addTask() {
        props.addItem(title);
        setTitle('')
    }

    return (
        <div>
            <TextField
                variant={'outlined'}
                value={title}
                onKeyPress={onKeyPressHandler}
                onChange={onChangeHandler}
                helperText={!!props.error ? 'Title is required' : ''}
                label={'Title'}
                error={!!props.error}
                disabled={props.disabled}
            />
            {/*<input value={title}*/}
            {/*       onKeyPress={onKeyPressHandler}*/}
            {/*       onChange={onChangeHandler}*/}
            {/*       className={props.error ? 'error' : undefined}/>*/}
            <IconButton disabled={props.disabled} onClick={() => {
                addTask()
            }}>
                <AddBox/>
            </IconButton>
            {/*{props.error*/}
            {/*    ? <div className={'error-message'}>{props.error}</div>*/}
            {/*    : null}*/}
        </div>
    );
})

export default AddItemForm;