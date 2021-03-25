import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';

import {action} from '@storybook/addon-actions';
import AppWithRedux from '../AppWithRedux';
import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';

export default {
    title: 'Components/AppWithRedux',
    component: AppWithRedux,
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator]
} as Meta;

const Template: Story = (args) => <AppWithRedux {...args} />;

export const AppWithReduxExample = Template.bind({});

AppWithReduxExample.args = {
    addItem: action('Add item clicked.')
};


