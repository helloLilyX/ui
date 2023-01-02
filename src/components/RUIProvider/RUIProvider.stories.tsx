import React from 'react';

import { RUIComponentMeta, RUIComponentStory } from '~/.storybook/utils';

import { RUIProvider as Component, RUIProviderProps } from './RUIProvider';

export default RUIComponentMeta<RUIProviderProps>('Getting Started', Component);

export const RUIProvider = RUIComponentStory<RUIProviderProps>((args) => (
  <Component {...args}>Demo here.</Component>
));
