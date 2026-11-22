import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/index.css';

import App from './App';
import { ToastProvider } from './components/ui/Toast';
import { CategoriesProvider } from './features/categories/CategoriesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
