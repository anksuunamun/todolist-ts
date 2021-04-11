import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';
import AddItemForm, {AddItemFormPropsType} from './AddItemForm';
import {action} from '@storybook/addon-actions';

export default {
    title: 'Components/AddItemForm',
    component: AddItemForm,
    argTypes: {},
} as Meta;

const Template: Story<AddItemFormPropsType> = (args) => <AddItemForm {...args} />;

export const AddItemFormClassic = Template.bind({});

AddItemFormClassic.args = {
    addItem: action('Add item clicked.')
};


