import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="App">
      <Header />
      <main className="App-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
