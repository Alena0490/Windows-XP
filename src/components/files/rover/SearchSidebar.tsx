import { useState } from 'react';
import { mainItems, alsoItems } from './data/searchData';
import type { SearchView } from './data/searchData';

import Close from '../../../img/tileClose.png';
import Go from '../../../img/Go.webp'
import Help from '../../../img/HelpAndSupport.webp'
import SearchInternet from '../../../img/413.ico'
import Properties from '../../../img/explorerProperties.webp'

import styles from './SearchSidebar.module.css'

interface SearchSidebarProps {
    onClose: () => void;
}

const SearchSidebar = ({ onClose }: SearchSidebarProps) => {
    const [view, setView] = useState<SearchView>('home');

    const iconMap: Record<string, string> = { Go, Help, SearchInternet, Properties };

    return (
        <div className={styles['search-wrap']}>
            <div className={styles['search-panel']}>
                {/* ── Header ── */}
                <div className={styles['search-header']}>
                    <span className={styles['search-title']}>Search Companion</span>
                    <button type='button' className={styles['search-close']} aria-label='Close' onClick={onClose}>
                        <img src={Close} alt='' />
                    </button>
                </div>

                {/* ── View / Search ── */}
                <div className={styles['search-window']}>
                    <div className={styles['search-bubble']}>
                        {view === 'home' && (
                            <>
                                <p className={styles['search-question']}>What do you want to search for?</p>
                                {mainItems.map(item => (
                                    <button key={item.id} onClick={() => setView(item.id as SearchView)}>
                                        <img src={iconMap[item.icon]} alt='' />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                                <p>You may also want to...</p>
                                {alsoItems.map(item => (
                                    <button key={item.id} onClick={() => setView(item.id as SearchView)}>
                                        <img src={iconMap[item.icon]} alt='' />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                    <div className={styles['rover']}>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchSidebar