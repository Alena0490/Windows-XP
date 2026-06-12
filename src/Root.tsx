// Root.tsx
import App from './App';
import MobileBlock from './components/MobileBlock';

const Root = () => {
    const isMobile = window.innerWidth < 900;

    return isMobile ? <MobileBlock /> : <App />;
};

export default Root;