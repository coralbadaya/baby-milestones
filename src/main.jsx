import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import './styles/editorial-system.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { DiyImagesProvider } from './context/DiyImagesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DiyImagesProvider>
          <App />
        </DiyImagesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
