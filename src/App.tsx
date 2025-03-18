import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import RouteHandler from './components/RouteHandler';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <div className="App-content">
          <RouteHandler />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
