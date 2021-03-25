import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';

import {action} from '@storybook/addon-actions';
import EditableSpan, {EditableSpanPropsType} from '../EditableSpan';

export default {
    title: 'Components/EditableSpan',
    component: EditableSpan,
    argTypes: {
        title: {defaultValue: 'React'}
    },
} as Meta;

const Template: Story<EditableSpanPropsType> = (args) => <EditableSpan {...args} />;

export const EditableSpanExample = Template.bind({});

const baseArgs = {
    changeItem: action('Item is changing!')
}

EditableSpanExample.args = {
    ...baseArgs,
    // title: 'Some title',
};


