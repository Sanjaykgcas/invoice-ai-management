import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Upload from './pages/Upload';
import CreateInvoice from './pages/CreateInvoice';
import History from './pages/History';
import useStore from './store/useStore';
import { useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground';

function PrivateRoute({ children }) {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  return (
    <Router>
      <AnimatedBackground />
      <div className="relative z-10 font-sans min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            } />
            <Route path="/create" element={
              <PrivateRoute>
                <CreateInvoice />
              </PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
