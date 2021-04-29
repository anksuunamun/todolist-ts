import React, {ChangeEvent, useState} from 'react';
import {TextField} from '@material-ui/core';


export type EditableSpanPropsType = {
    title: string
    changeItem: (title: string) => void
    disabled?: boolean
}

const EditableSpan = React.memo(function (props: EditableSpanPropsType) {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)
    const onEditMode = () => {
        !props.disabled && setEditMode(true)
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
        // editMode
        //     ? <input value={title}
        //              autoFocus={true}
        //              onBlur={offEditMode}
        //              onChange={changeTitle}/>
        //     : <span onDoubleClick={onEditMode}>{props.title}</span>
        editMode
            ? <TextField value={title}
                         autoFocus={true}
                         onBlur={offEditMode}
                         onChange={changeTitle}
                         variant={'standard'}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
})

export default EditableSpan;