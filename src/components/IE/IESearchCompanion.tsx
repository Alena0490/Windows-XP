import { useState, useRef, useEffect } from 'react';
import useRoverStateMachine from '../files/rover/hooks/useRoverStateMachine';
import type { RoverView } from '../files/rover/hooks/useRoverStateMachine';

import styles from './IESearchCompanion.module.css';

import Close from '../../img/tileClose.png';
import Go from '../../img/Go.webp';
import SearchInternet from '../../img/413.ico'
import Properties from '../../img/explorerProperties.webp'

interface IESearchCompanionProps {
    onClose: () => void;
    onOpenFM: () => void;
    onNavigate: (url: string) => void;
    globalMuted: boolean;
    globalVolume: number;
}

const IESearchCompanion = ({ onClose, onOpenFM, onNavigate, globalVolume, globalMuted }: IESearchCompanionProps) => {
    const [view, setView] = useState<'search' | 'you-rang'>('search');
    const [query, setQuery] = useState('');
    // Drives the Rover into its 'results' state (searching ↔ reading loop)
    // while a query is being sent. Flips back to 'idle' a few seconds later
    // so the dog settles before the next interaction.
    const [searchPhase, setSearchPhase] = useState<'idle' | 'searching' | 'done'>('idle');
    const searchTimerRef = useRef<number | null>(null);

    const roverView: RoverView =
        view === 'you-rang' ? 'you-rang' :
        searchPhase === 'searching' ? 'results' :
        searchPhase === 'done' ? 'results-found' :
        'idle';

    useEffect(() => {
        return () => {
            if (searchTimerRef.current !== null) window.clearTimeout(searchTimerRef.current);
        };
    }, []);

    const {
      roverFrame,
      handleRoverClick,
      handleCloseClick,
      handleDoTrick,
    } = useRoverStateMachine({ view: roverView, onClose, globalVolume, globalMuted });

    const handleSearch = () => {
      if (!query.trim()) return;
      onNavigate(`https://web.archive.org/web/20031024040025if_/http://www.google.com/search?q=${encodeURIComponent(query)}`);
      // Wake the Rover: searching ↔ reading loop, then a brief 'congratulate'
      // before settling back to idle.
      if (searchTimerRef.current !== null) window.clearTimeout(searchTimerRef.current);
      setSearchPhase('searching');
      searchTimerRef.current = window.setTimeout(() => {
          setSearchPhase('done');
          searchTimerRef.current = window.setTimeout(() => {
              setSearchPhase('idle');
              searchTimerRef.current = null;
          }, 4000);
      }, 6000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSearch();
      }
    };

    const handleRoverClickWrapped = () => {
      handleRoverClick();
      setView('you-rang');
    };

    return (
        <div className={styles['ie-search-wrap']}>
            <div className={styles['ie-search-header']}>
                <span>Search Companion</span>
                <button onClick={handleCloseClick} aria-label='Close'>
                    <img src={Close} alt='' />
                </button>
            </div>

            <div className={styles['ie-search-window']}>
                <div className={styles['ie-search-bubble']}>
                    {view === 'search' && (
                        <>
                            <p className={styles['ie-search-question']}>What are you looking for?</p>
                            <p className={styles['ie-question-detail']}>Type your question below. For best results, use complete sentences.</p>
                            <textarea
                                className={styles['ie-search-input']}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder='Please type your query here, then press <Enter>.'
                                rows={3}
                            />
                            <p className={styles['ie-search-sample']}>Sample question:</p>
                            <button onClick={() => setQuery('Buy a book online')}>
                                <img src={Go} alt='' />
                                <span>Buy a book online</span>
                            </button>
                            <p className={styles['ie-search-sample']}>You may also want to...</p>
                            <button onClick={onOpenFM}>
                                <img src={SearchInternet} alt='' />
                                <span>Search this computer for files</span>
                            </button>
                            <button onClick={() => {}}>
                                <img src={Properties} alt='' />
                                <span>Change preferences</span>
                            </button>
                            <div className={styles['ie-search-actions']}>
                                <button 
                                  className={`${styles['ie-search-btn']} luna-btn`}
                                  onClick={handleSearch}
                                >Search</button>
                            </div>
                        </>
                    )}

                    {view === 'you-rang' && (
                        <>
                            <p className={styles['ie-search-question']}>You rang?</p>
                            <p>What would you like to do?</p>
                            <button disabled>
                                <img src={Go} alt='' />
                                <span>Choose a different animated character</span>
                            </button>
                            <button disabled>
                                <img src={Go} alt='' />
                                <span>Turn off the animated character</span>
                            </button>
                            <button onClick={handleDoTrick}>
                                <img src={Go} alt='' />
                                <span>Do a trick</span>
                            </button>
                            <div className={styles['ie-search-actions']}>
                                <button
                                    className={styles['ie-search-btn']}
                                    onClick={() => setView('search')}
                                >Back</button>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles['ie-search-rover']}>
                    {roverFrame.type === 'png' && roverFrame.src ? (
                        <img src={roverFrame.src} alt='' />
                    ) : roverFrame.type === 'sprite' ? (
                        <div
                            className={styles['ie-search-rover-sprite']}
                            style={{
                                backgroundPosition: `-${Math.round(roverFrame.x * 1.481)}px -${Math.round(roverFrame.y * 1.481)}px`
                            }}
                        />
                    ) : null}
                    <div className={styles['ie-search-rover-inside']} onClick={handleRoverClickWrapped} />
                </div>
            </div>
        </div>
    );
};

export default IESearchCompanion;