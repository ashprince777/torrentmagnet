import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import ComingSoonPage from './pages/ComingSoonPage';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchResultsPage />} />

              {/* Specific routes for static pages with explicit titles if needed, or generic: */}
              <Route path="about" element={<ComingSoonPage title="About Us" />} />
              <Route path="dmca" element={<ComingSoonPage title="DMCA" />} />
              <Route path="privacy-policy" element={<ComingSoonPage title="Privacy Policy" />} />
              <Route path="contact" element={<ComingSoonPage title="Contact Us" />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
