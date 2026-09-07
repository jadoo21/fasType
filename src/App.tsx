import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { TypingTestProvider } from './contexts/TypingTestContext';
import Header from './components/Header';
import RouteHandler from './components/RouteHandler';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <TypingTestProvider>
        <div className="App">
          <Header />
          <div className="App-content">
            <RouteHandler />
          </div>
        </div>
        <Footer />
      </TypingTestProvider>
    </AuthProvider>
  );
}

export default App;