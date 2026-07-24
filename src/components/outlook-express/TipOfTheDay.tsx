import { useState, useRef } from 'react'
import { TIPS } from './data/tips'
import './OutlookExpress.css'

interface TipOfTheDayProps {
    onClose: () => void;
}

type Phase = 'idle' | 'hiding' | 'revealing';

const TipOfTheDay = ({ onClose }: TipOfTheDayProps) => {
    const [tipIndex, setTipIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('idle');

    const pendingIndex = useRef<number | null>(null);

    const goTo = (newIndex: number) => {
        if (phase !== 'idle') return; 
        pendingIndex.current = newIndex;
        setPhase('hiding');
    };

    const nextTip = () => goTo((tipIndex + 1) % TIPS.length);
    const prevTip = () => goTo((tipIndex - 1 + TIPS.length) % TIPS.length);

    const handleAnimationEnd = () => {
        if (phase === 'hiding') {
            if (pendingIndex.current !== null) {
                setTipIndex(pendingIndex.current);
                pendingIndex.current = null;
            }
            // wait one frame so the new text renders before revealing starts
            requestAnimationFrame(() => setPhase('revealing'));
        } else if (phase === 'revealing') {
            setPhase('idle');
        }
    };

    return (
        <div className="tip-of-the-day">
            <div className='tip-title'>
                Tip of the day
                <button
                    className='tip-close'
                    aria-label='Close tip of the day'
                    onClick={onClose}
                >&#x2716;</button>
            </div>

            <div
                className={`oe-tip-body${phase !== 'idle' ? ` ${phase}` : ''}`}
                onAnimationEnd={handleAnimationEnd}
            >
                {TIPS[tipIndex].text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                        {paragraph.split(/\*\*(.*?)\*\*/).map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                    </p>
                ))}
            </div>

            <div className="tip-switch">
                <button className="prev" onClick={prevTip}>Previous</button>
                <button className="next" onClick={nextTip}>Next</button>
            </div>
        </div>
    )
}

export default TipOfTheDay;
