import { render, screen } from '@testing-library/react';
import MovieMasher from './MovieMasher';

test('renders learn react link', () => {
  render(<MovieMasher />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
