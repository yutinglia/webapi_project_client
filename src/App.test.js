import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page', () => {
  render(<App />);
  const element = screen.getAllByText(/The Canine Shelter/)[0];
  expect(element).toBeInTheDocument();
});
