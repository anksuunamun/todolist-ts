import React, {ChangeEvent, useState, KeyboardEvent, useCallback} from 'react';
import IconButton from '@material-ui/core/IconButton';
import {AddBox} from '@material-ui/icons';
import {TextField} from '@material-ui/core';


export type AddItemFormPropsType = {
    addItem: (title: string) => void
    error: string | null
    setError: (error: string | null) => void
}

const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
    console.log('AddItemForm render')
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
            />
            {/*<input value={title}*/}
            {/*       onKeyPress={onKeyPressHandler}*/}
            {/*       onChange={onChangeHandler}*/}
            {/*       className={props.error ? 'error' : undefined}/>*/}
            <IconButton onClick={() => {
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