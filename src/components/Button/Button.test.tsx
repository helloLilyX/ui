import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Button } from './index';

describe('Tests for Button component', () => {
  it('renders content', () => {
    const { container } = render(<Button>Foo bar</Button>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('can be disabled', () => {
    render(<Button>Foo bar</Button>);
    expect(screen.getByRole('button', { name: 'Foo bar' })).toBeDisabled();
  });
});