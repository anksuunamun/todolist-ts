import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';

import {action} from '@storybook/addon-actions';
import {Task, TaskPropsType} from './Task';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses} from '../../../../data-access-layer/api';

export default {
    title: 'Components/Task',
    component: Task,
    argTypes: {},
} as Meta;

const changeTaskStatus = action('Status changed inside Task');
const removeTask = action('Removed button inside task was clicked');
const changeTaskTitle = action('Title changed inside Task');

const baseArg = {
    changeTaskStatus, removeTask, changeTaskTitle
}

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

export const TaskIsDoneExample = Template.bind({});

TaskIsDoneExample.args = {
    ...baseArg,
    task: {
        title: 'HTML and CSS', id: v1(), description: '',
        todoListId: 'todolistId1', order: 0, status: TaskStatuses.New,
        priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
    },
    todolistId: 'todolistId1'
};


export const TaskIsNotDoneExample = Template.bind({});

TaskIsNotDoneExample.args = {
    ...baseArg,
    task: {
        title: 'HTML and CSS', id: v1(), description: '',
        todoListId: 'todolistId1', order: 0, status: TaskStatuses.New,
        priority: TaskPriorities.Low, startDate: '', deadline: '', addedDate: '',
    },
    todolistId: 'todolistId1'
};
