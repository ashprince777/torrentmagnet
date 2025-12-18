import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { StaticPage } from './pages/StaticPage';

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
              <Route path="about" element={<StaticPage />} />
              <Route path="dmca" element={<StaticPage />} />
              <Route path="privacy-policy" element={<StaticPage />} />
              <Route path="contact" element={<StaticPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
