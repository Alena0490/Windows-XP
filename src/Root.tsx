import App from './App';
import MobileBlock from './components/MobileBlock';

const Root = ({ isMobile }: { isMobile: boolean }) => {
    return isMobile ? <MobileBlock /> : <App />;
};

export default Root;