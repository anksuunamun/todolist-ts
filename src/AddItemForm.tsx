import React, {ChangeEvent, useState, KeyboardEvent} from 'react';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    error: string | null
    setError: (error: string | null) => void
}

function AddItemForm(props: AddItemFormPropsType) {
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
            <input value={title} onKeyPress={onKeyPressHandler} onChange={onChangeHandler}
                   className={props.error ? 'error' : undefined}/>
            <button onClick={() => {
                addTask()
            }}>+
            </button>
            {props.error ? <div className={'error-message'}>{props.error}</div> : null}
        </div>
    );
}

export default AddItemForm;