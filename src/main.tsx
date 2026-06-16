import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root';
import './index.css';

const isMobile = window.innerWidth < 900;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Root isMobile={isMobile} />
    </StrictMode>
);