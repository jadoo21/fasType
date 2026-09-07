import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the fasType typing experience', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/Improve Your Typing/i)).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /typing input/i })).toBeInTheDocument();
});
