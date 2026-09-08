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
          <main className="App-content">
            <RouteHandler />
          </main>
          <Footer />
        </div>
      </TypingTestProvider>
    </AuthProvider>
  );
}

export default App;
