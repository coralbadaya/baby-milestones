import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import './styles/editorial-system.css';
import './styles/baby-book.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { DiyActivitiesProvider } from './context/DiyActivitiesContext';
import { DiyImagesProvider } from './context/DiyImagesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CookieConsentProvider>
          <DiyImagesProvider>
            <DiyActivitiesProvider>
              <App />
            </DiyActivitiesProvider>
          </DiyImagesProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
