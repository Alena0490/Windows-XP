import { useEffect, useRef } from 'react';
import './ShutdownDisplay.css';

interface WelcomeDisplayProps {
    onDone: () => void;
    duration?: number;
}

const WelcomeDisplay = ({ onDone, duration = 2500 }: WelcomeDisplayProps) => {
    const onDoneRef = useRef(onDone);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onDoneRef.current();
        }, duration);

        return () => clearTimeout(timeout);
    }, [duration]);

    return (
        <div className='shutdown-display'>
            <div className='shutdown-top'></div>
            <div className='shutdown-middle welcome-middle'>
                <span className='welcome-text'>welcome</span>
            </div>
            <div className='shutdown-bottom'></div>
        </div>
    );
};

export default WelcomeDisplay;