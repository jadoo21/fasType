import ReactDOM from 'react-dom/client';
// CSS is handled by the bundler; TypeScript has no declaration for stylesheet imports.
// @ts-expect-error -- stylesheet side-effect import
import './styles/bootstrap-parity.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Router>
    <App />
  </Router>
);
