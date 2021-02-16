import React, {ChangeEvent, useState} from 'react';
import {Simulate} from 'react-dom/test-utils';


type EditableSpanPropsType = {
    title: string
    changeItem: (title: string) => void
}

function EditableSpan(props: EditableSpanPropsType) {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)
    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        props.changeItem(title)
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.currentTarget.value
        setTitle(newValue)
    }
    return (
        editMode
            ? <input value={title}
                     autoFocus={true}
                     onBlur={offEditMode}
                     onChange={changeTitle}/>
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
}

export default EditableSpan;