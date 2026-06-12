import { useEffect } from 'react';
import Logo from '../../img/logo.webp';
import '../ShutDownScreen.css';
import './PleaseWait.css';

interface PleaseWaitProps {
    onDone: () => void;
}

const PleaseWait = ({ onDone }: PleaseWaitProps) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onDone();
        }, 1500);
        return () => clearTimeout(timeout);
    }, [onDone]);

    return (
        <div className='please-wait-overlay'>
            <div className='shutdown-modal please-wait-modal'>
                <div className='shutdown-top'>
                    <div className='logo-wrap'>
                        <img src={Logo} alt='MS Windows logo' />
                        <span className='turnoff-tm'>TM</span>
                    </div>
                </div>
                <div className='shutdown-middle please-wait-middle'>
                    <p className='please-wait-message'>Please wait...</p>
                </div>
                <div className='shutdown-bottom' />
            </div>
        </div>
    );
};

export default PleaseWait;