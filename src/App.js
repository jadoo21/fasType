import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import RouteHandler from './components/RouteHandler';

function App() {
  return (
    <div className="App">
      <Header />
      <RouteHandler />
    </div>
  );
}

export default App;
