import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { SectionTitle } from './SectionTitle';

describe('Tests for Section component', () => {
  it('renders content', () => {
    const { container } = render(<SectionTitle>Foo bar</SectionTitle>);
    expect(container.firstChild).toMatchSnapshot();
  });
});