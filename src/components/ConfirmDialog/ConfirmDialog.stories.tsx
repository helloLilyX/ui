import { RUIComponentMeta, RUIComponentStory } from '@sb/utils';
import React from 'react';

import { Stack } from '../Stack';
import { ConfirmDialog as Component, ConfirmDialogProps } from './ConfirmDialog';

export default RUIComponentMeta<ConfirmDialogProps>('Internal', Component);

export const ConfirmDialog = RUIComponentStory<ConfirmDialogProps>((args) => (
  <Stack>
    <Component {...args} title="Delete folder" primaryActionSlot="Delete">
      Are you sure you want to delete &quot;My Documents&quot;? All contents will be permanently
      destroyed.
    </Component>
    <Component
      {...args}
      title="Submit document"
      primaryActionSlot="Submit"
      primaryActionAccent="success"
    >
      Are you sure you want to submit this document?
    </Component>
    <Component
      {...args}
      title="Share file"
      primaryActionSlot="Yes, share publicly"
      primaryActionAccent="teal"
      secondaryActionSlot="No, share privately"
    >
      Do you want to create a shared link that is publicly accessible?
    </Component>
  </Stack>
));
