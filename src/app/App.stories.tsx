import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';

import {action} from '@storybook/addon-actions';
import App from './App';
import {HashRouterDecorator, ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator';
import StoryRouter from 'storybook-react-router';

export default {
    title: 'Components/App',
    component: App,
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator, HashRouterDecorator]
} as Meta;

const Template: Story = (args) => <App {...args} demo={true} />;

export const AppExample = Template.bind({});

AppExample.args = {
    addItem: action('Add item clicked.')
};


