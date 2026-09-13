import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { DiagnosticsProvider } from './context/DiagnosticsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavouritesProvider>
          <DiagnosticsProvider>
            <App />
          </DiagnosticsProvider>
        </FavouritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
