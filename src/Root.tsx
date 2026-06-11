// Root.tsx
import { useState, useEffect } from 'react';
import App from './App';
import MobileBlock from './components/MobileBlock';

const Root = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return isMobile ? <MobileBlock /> : <App />;
};

export default Root;