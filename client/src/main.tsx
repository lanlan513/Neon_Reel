import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.tsx';

import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

const container = document.getElementById('root');
if (!container) throw new Error('找不到 #root 容器，無法掛載應用。');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
