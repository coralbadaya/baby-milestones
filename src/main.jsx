import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import './styles/editorial-system.css';
import './styles/baby-book.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { DiyActivitiesProvider } from './context/DiyActivitiesContext';
import { DiyImagesProvider } from './context/DiyImagesContext';
import { BabyIdentityProvider } from './hooks/useBabyIdentity.jsx';

const rootEl = document.getElementById('root');
rootEl.replaceChildren();
const root = createRoot(rootEl);
flushSync(() => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <BabyIdentityProvider>
          <CookieConsentProvider>
            <DiyImagesProvider>
              <DiyActivitiesProvider>
                <App />
              </DiyActivitiesProvider>
            </DiyImagesProvider>
          </CookieConsentProvider>
          </BabyIdentityProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  );
});
rootEl.setAttribute('data-ready', '');
