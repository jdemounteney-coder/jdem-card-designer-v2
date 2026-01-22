import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const title = screen.getByText(/JdeM's Playing Card Design Tool/i);
  expect(title).toBeInTheDocument();
});
