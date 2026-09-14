import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the fasType typing experience', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByRole('heading', { name: /Improve Your Typing/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /typing input/i })).toBeInTheDocument();
});

test('renders statistics page empty state with header and track your progress card', async () => {
  localStorage.clear();
  window.history.pushState({}, 'Statistics', '/statistics');
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(await screen.findByRole('heading', { name: /Your Typing Progress/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Track Your Progress/i })).toBeInTheDocument();
  expect(screen.getByText(/PERFORMANCE ANALYTICS/i)).toBeInTheDocument();
});

test('renders populated statistics page with speed chart and performance overview', async () => {
  localStorage.setItem('fastype_user', JSON.stringify({
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    bestWpm: 78,
    averageWpm: 70,
    averageAccuracy: 96,
    testsCompleted: 6,
  }));
  window.history.pushState({}, 'Statistics', '/statistics');
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(await screen.findByRole('heading', { name: /Typing Speed Progression/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Keystroke Stress Matrix/i })).toBeInTheDocument();
  expect(screen.getByText('Export Telemetry')).toBeInTheDocument();
  localStorage.clear();
});
