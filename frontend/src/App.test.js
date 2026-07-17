import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home content', () => {
  render(<App />);
  const heading = screen.getByText(/smarter, faster hiring/i);
  expect(heading).toBeInTheDocument();
});
