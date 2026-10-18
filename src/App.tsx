import { AuthProvider } from './contexts/AuthContext';
import { TypingTestProvider } from './contexts/TypingTestContext';
import { Layout } from './components/layout';
import RouteHandler from './components/RouteHandler';

function App() {
  return (
    <AuthProvider>
      <TypingTestProvider>
        <Layout>
          <RouteHandler />
        </Layout>
      </TypingTestProvider>
    </AuthProvider>
  );
}

export default App;
