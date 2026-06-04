import { useState, useEffect, useRef } from 'react';
import { mainItems, alsoItems, preferenceItems, advancedSections, lookInOptions, mediaTypes, modifiedOptions } from './data/searchData';
import type { SearchView, LookIn, MediaType, ModifiedOption } from './data/searchData';
import useRoverAnimation, { getSoundUrl } from '../rover/hooks/useRoverAnimation';
import { trickAnimations } from '../rover/data/roverAnimation';

import { FILE_SYSTEM } from '../data/FileManagerData';
import type { FMItem } from '../data/types';

import Close from '../../../img/tileClose.png';
import Go from '../../../img/Go.webp'
import Help from '../../../img/HelpAndSupport.webp'
import SearchInternet from '../../../img/413.ico'
import Properties from '../../../img/explorerProperties.webp'
import MyComputer from '../../../img/MyComputer.webp';
import LocalDisc from '../../../img/LocalDisk.webp';
import MyDocumentsIcon from '../../../img/MyDocuments.webp';
import DesktopIcon from '../../../img/Desktop.webp';
import ChevronDown from '../../../img/chevron-double-down.svg'

import styles from './SearchSidebar.module.css'

interface SearchSidebarProps {
    onClose: () => void;
    onSearchResults: (results: FMItem[]) => void;
    globalMuted: boolean;
    globalVolume: number;
}

const searchPaths = [
    'C:\\Documents and Settings',
    'C:\\Program Files',
    'C:\\WINDOWS',
    'C:\\WINDOWS\\system32',
    'C:\\WINDOWS\\Media',
];

// ── Rover state-machine constants (module scope so effect deps stay stable) ──
const IDLE_VARIANTS = ['1idle', '2idle', '3idle', '4idle', '5idle', '6idle', '7idle', '8idle', '9idle', '10idle'];
const RETURN_TO_IDLE = new Set([
    'come', 'pleased', 'ashamed', 'attention', 'congratulate',
    'shopping', 'writing', 'money', 'sports', 'travel', 'thinking',
    'haf', 'lick',
]);
const IDLE_TIMEOUT_MS = 30_000;
const pickIdle = () => IDLE_VARIANTS[Math.floor(Math.random() * IDLE_VARIANTS.length)];
const pickIdleExcluding = (current: string) => {
    const choices = IDLE_VARIANTS.filter(n => n !== current);
    return choices[Math.floor(Math.random() * choices.length)];
};
const pickTrick = () => trickAnimations[Math.floor(Math.random() * trickAnimations.length)];

const SearchSidebar = ({ onClose, onSearchResults, globalMuted, globalVolume }: SearchSidebarProps) => {
    const [view, setView] = useState<SearchView>('home');
    const viewRef = useRef(view);
    viewRef.current = view;
    const [fileName, setFileName] = useState('');
    const [phrase, setPhrase] = useState('');
    const [lookIn, setLookIn] = useState<LookIn>('my-computer');
    const [lookInOpen, setLookInOpen] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<Set<MediaType>>(new Set());
    const [modifiedOption, setModifiedOption] = useState<ModifiedOption>('any');
    const [internetQuery, setInternetQuery] = useState('');
    const [results, setResults] = useState<FMItem[]>([]);
    const [searchPath, setSearchPath] = useState('');
    // ── Rover animation state machine ────────────────────────────────────
    // - mount → 'come', then chain to a random idle on completion
    // - 'results' → alternate 'searching' ↔ 'reading' every 4s
    // - 'results-found' → 'congratulate' → 'pleased' → idle
    // - 'results-empty' → 'ashamed' → idle
    // - Stop button (cancel mid-search) → 'attention' → idle
    // - Click on Rover → 'pleased' → idle
    // - Do a trick → random from trickAnimations (always plays bark)
    // - after a long idle stretch with no view change → 'sleep'
    const [currentAnimation, setCurrentAnimation] = useState('come');
    const [isExiting, setIsExiting] = useState(false);

    const handleAnimationComplete = () => {
        if (isExiting) {
            onClose();
            return;
        }
        setCurrentAnimation(prev => {
            // Success chain: 'congratulate' → 'pleased' → idle
            if (viewRef.current === 'results-found' && prev === 'congratulate') {
                return 'pleased';
            }
            // An idle finished its single cycle — rotate to a different idle
            // so a fresh animation (and a fresh sound) plays.
            if (/^\d+idle$/.test(prev)) {
                return pickIdleExcluding(prev);
            }
            // Other finite event animations (come / pleased / ashamed / etc.) → idle
            return RETURN_TO_IDLE.has(prev) ? pickIdle() : prev;
        });
    };

    const handleCloseClick = () => {
        setIsExiting(true);
        setCurrentAnimation('exit');
    };

    const roverFrame = useRoverAnimation(currentAnimation, handleAnimationComplete, globalVolume, globalMuted);

    // View transitions drive the result-related animations. Other views keep
    // whatever is playing (which becomes a rotating idle after `come` finishes).
    useEffect(() => {
        if (view === 'results-empty') setCurrentAnimation('ashamed');
        else if (view === 'results-found') setCurrentAnimation('congratulate');
        else if (view !== 'results' &&
                 (currentAnimation === 'searching' || currentAnimation === 'reading' || currentAnimation === 'sleep')) {
            // Returning from results or waking from sleep — settle on a fresh idle
            setCurrentAnimation(pickIdle());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view]);

    // Alternate 'searching' ↔ 'reading' every 4s while the search is running
    useEffect(() => {
        if (view !== 'results') return;
        const sequence = ['searching', 'reading'];
        let i = 0;
        setCurrentAnimation(sequence[i]);
        const timer = window.setInterval(() => {
            i = (i + 1) % sequence.length;
            setCurrentAnimation(sequence[i]);
        }, 4000);
        return () => window.clearInterval(timer);
    }, [view]);

    // Sleep after a stretch of inactivity while idling.
    // Tracks when idle first started so rotating between idle variants doesn't
    // reset the timer — the threshold applies to total idle time.
    const idleStartRef = useRef<number | null>(null);
    useEffect(() => {
        const isIdle = /^\d+idle$/.test(currentAnimation);
        if (!isIdle || view === 'results') {
            idleStartRef.current = null;
            return;
        }
        if (idleStartRef.current === null) idleStartRef.current = Date.now();
        const elapsed = Date.now() - idleStartRef.current;
        const remaining = Math.max(IDLE_TIMEOUT_MS - elapsed, 0);
        const timer = window.setTimeout(() => {
            setCurrentAnimation('sleep');
            idleStartRef.current = null;
        }, remaining);
        return () => window.clearTimeout(timer);
    }, [currentAnimation, view]);

    // Cancel mid-search: play `attention`, then return to home (which falls back to idle)
    const cancelSearch = () => {
        setCurrentAnimation('attention');
        setView('home');
    };

    // Clicking the Rover: play `pleased`
    const handleRoverClick = () => {
        setCurrentAnimation('pleased');
        setView('you-rang');
    };

    // Do a trick: pick a random animation AND play the bark explicitly.
    // Using the same getSoundUrl path the hook uses for the `come` chime —
    // that one already plays, so we know the URL pipeline works.
    const handleDoTrick = () => {
        setCurrentAnimation(pickTrick());
        if (globalMuted) return;
        const url = getSoundUrl('./sounds/rover_Resources_Haf.wav');
        if (url) {
            const audio = new Audio(url);
            audio.volume = globalVolume;
            audio.play().catch(() => undefined);
        }
    };

    const iconMap: Record<string, string> = {
        Go, Help, SearchInternet, Properties,
        MyComputer, LocalDisc, MyDocuments: MyDocumentsIcon, Desktop: DesktopIcon
    };

    const toggleMedia = (id: MediaType) => {
        setSelectedMedia(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // Item Search
    const searchFileSystem = (node: FMItem, nameQuery: string, phraseQuery: string): FMItem[] => {
        const found: FMItem[] = [];
        if (node.type === 'file') {
            const nameMatch = !nameQuery.trim() || node.name.toLowerCase().includes(nameQuery.toLowerCase());
            const phraseMatch = !phraseQuery.trim() || (node.content ?? '').toLowerCase().includes(phraseQuery.toLowerCase());
            if (nameMatch && phraseMatch) found.push(node);
        }
        if (node.children) {
            for (const child of node.children) {
                found.push(...searchFileSystem(child, nameQuery, phraseQuery));
            }
        }
        return found;
    };

    // Enter key search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    // Find the first node in the tree matching the given id
    const findNodeById = (root: FMItem, id: string): FMItem | undefined => {
        if (root.id === id) return root;
        for (const child of root.children ?? []) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
        return undefined;
    };

    // Map the Look-in dropdown value to a starting node in the file tree
    const getSearchRoot = (id: LookIn): FMItem => {
        if (id === 'my-computer') return FILE_SYSTEM;
        const targetId = id === 'local-disk' ? 'localdisc' : id; // 'documents' / 'desktop' match the FMItem ids
        return findNodeById(FILE_SYSTEM, targetId) ?? FILE_SYSTEM;
    };

    const handleSearch = () => {
        if (!fileName.trim() && !phrase.trim()) return;
        setView('results');
        onSearchResults([]);
        const searchRoot = getSearchRoot(lookIn);
        let i = 0;
        const interval = setInterval(() => {
            setSearchPath(searchPaths[i % searchPaths.length]);
            i++;
        }, 800);
        setTimeout(() => {
            clearInterval(interval);
            // Bail if the user navigated away mid-search (cancel / clicked rover / closed).
            // Otherwise we'd clobber pleased / exit / etc. with the results animation.
            if (viewRef.current !== 'results') return;
            const found = searchFileSystem(searchRoot, fileName, phrase);
            setResults(found);
            onSearchResults(found);
            setView(found.length > 0 ? 'results-found' : 'results-empty');
        }, 10000);
    };

    // ── Shared form blocks used by every file-search view ─────────────────
    const lookInBlock = (
        <label className={styles['search-label']}>Look in:
            <div className={styles['search-select-wrap']}>
                <button
                    className={styles['search-select']}
                    aria-expanded={lookInOpen}
                    onClick={() => setLookInOpen(prev => !prev)}
                >
                    <img src={iconMap[lookInOptions.find(o => o.id === lookIn)?.icon ?? '']} alt='' />
                    <span>{lookInOptions.find(o => o.id === lookIn)?.label}</span>
                </button>
                {lookInOpen && (
                    <div className={styles['search-select-dropdown']}>
                        {lookInOptions.map(opt => (
                            <button
                                key={opt.id}
                                className={styles['search-select-option']}
                                onClick={() => { setLookIn(opt.id as LookIn); setLookInOpen(false); }}
                            >
                                <img src={iconMap[opt.icon]} alt='' />
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </label>
    );

    const advancedBlock = advancedSections.map(section => (
        <button
            key={section.id}
            className={`${styles['search-section-btn']} ${openSection === section.id ? styles['open'] : ''}`}
            onClick={() => setOpenSection(prev => prev === section.id ? null : section.id)}
        >
            <span>{section.label}</span>
               <span className={styles['search-section-chevron']} aria-label='more-options'>
                    <img src={ChevronDown} alt='' />
                </span>
        </button>
    ));

    const actionsBlock = (
        <div className={styles['search-actions']}>
            <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('home')}><span className={styles['mnemonic']}>B</span>ack</button>
            <button className={styles['search-btn']} onClick={handleSearch}>Sea<span className={styles['mnemonic']}>r</span>ch</button>
        </div>
    );

    return (
        <div className={`${styles['search-wrap']} ${isExiting ? styles['is-exiting'] : ''}`}>
            <div className={styles['search-panel']}>
                {/* ── Header ── */}
                <div className={styles['search-header']}>
                    <span className={styles['search-title']}>Search Companion</span>
                    <button type='button' className={styles['search-close']} aria-label='Close' onClick={handleCloseClick}>
                        <img src={Close} alt='' />
                    </button>
                </div>

                {/* ── View / Search ── */}
                <div className={styles['search-window']}>
                    <div className={styles['search-bubble']}>
                        {/* Home */}
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

                        {/* Preferences */}
                        {view === 'preferences' && (
                            <>
                                <p className={styles['search-question']}>How do you want to use Search Companion?</p>
                                {preferenceItems.map(item => (
                                    <button key={item.id}>
                                        <img src={iconMap[item.icon]} alt='' />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                                <button className={styles['search-btn']} onClick={() => setView('home')}>Back</button>
                            </>
                        )}

                        {/* All files and folders */}
                        {view === 'files' && (
                            <>
                                <p className={styles['search-question']}>Search by any or all of the criteria below.</p>

                                <label className={styles['search-label']}>All or part of the file name:
                                    <input 
                                        className={styles['search-input']} 
                                        type='text' 
                                        value={fileName} 
                                        onChange={e => setFileName(e.target.value)} 
                                        onKeyDown={handleKeyDown} 
                                    />
                                </label>

                                <label className={styles['search-label']}>A word or phrase in the file:
                                    <input 
                                        className={styles['search-input']} 
                                        type='text' 
                                        value={phrase} 
                                        onChange={e => setPhrase(e.target.value)} 
                                        onKeyDown={handleKeyDown} 
                                    />
                                </label>

                                {lookInBlock}
                                {advancedBlock}
                                {actionsBlock}
                            </>
                        )}

                        {/* Pictures, music, or video */}
                        {view === 'pictures' && (
                            <>
                                <p className={styles['search-question']}>Search for all files of a certain type, or search by type and name.</p>

                                <div className={styles['search-checkbox-group']}>
                                    {mediaTypes.map(t => (
                                        <label key={t.id} className={styles['search-checkbox-label']}>
                                            <input
                                                className={styles['search-checkbox-input']}
                                                type='checkbox'
                                                checked={selectedMedia.has(t.id)}
                                                onChange={() => toggleMedia(t.id)}
                                            />
                                            {t.label}
                                        </label>
                                    ))}
                                </div>

                                <label className={styles['search-label']}>All or part of the file name:
                                    <input 
                                        className={styles['search-input']} 
                                        type='text' 
                                        value={fileName} 
                                        onChange={e => setFileName(e.target.value)} 
                                        onKeyDown={handleKeyDown}
                                    />
                                </label>

                                <p>You may also want to...</p>
                                <label className={styles['search-checkbox-label']}>
                                    <img src={iconMap['Properties']} alt='' />
                                    Use advanced search options
                                </label>
                                <div className={styles['search-actions']}>
                                    <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('home')}>Back</button>
                                    <button className={styles['search-btn']} onClick={handleSearch}>Sea<span className={styles['mnemonic']}>r</span>ch</button>
                                </div>
                            </>
                        )}

                        {/* Documents */}
                        {view === 'documents' && (
                            <>
                                <p className={styles['search-question']}>Last time it was modified:</p>

                                <div className={styles['search-radio-group']}>
                                    {modifiedOptions.map(opt => (
                                        <label key={opt.id} className={styles['search-radio-label']}>
                                            <input
                                                className={styles['search-checkbox-input']}
                                                type='radio'
                                                name='modified'
                                                checked={modifiedOption === opt.id}
                                                onChange={() => setModifiedOption(opt.id)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>

                                <label className={styles['search-label']}>All or part of the document name:
                                    <input 
                                        className={styles['search-input']} 
                                        type='text' 
                                        value={fileName} 
                                        onChange={e => setFileName(e.target.value)}
                                        onKeyDown={handleKeyDown} 
                                        />
                                </label>

                                <p>You may also want to...</p>
                                <label className={styles['search-checkbox-label']}>
                                    <img src={iconMap['Properties']} alt='' />
                                    Use advanced search options
                                </label>
                                
                                <div className={styles['search-actions']}>
                                    <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('home')}>Back</button>
                                    <button className={styles['search-btn']} onClick={handleSearch}>Sea<span className={styles['mnemonic']}>r</span>ch</button>
                                </div>
                            </>
                        )}

                        {/* Search the Internet */}
                        {view === 'internet' && (
                            <>
                                <p className={styles['search-question']}>What are you looking for?</p>

                                <label className={styles['search-label']}>Find a Web page for:
                                    <input 
                                        className={styles['search-input']} 
                                        type='text' value={internetQuery} 
                                        onChange={e => setInternetQuery(e.target.value)}
                                        onKeyDown={handleKeyDown} 
                                    />
                                </label>

                                {actionsBlock}
                            </>
                        )}

                        {/* Searching */}
                        {view === 'results' && (
                            <div className={styles['search-results']}>
                                <p className={styles['search-question']}>
                                    Searching for files with "{fileName}" in the file name.
                                </p>
                                <p>- Looking in My Computer and in subfolders.</p>
                                <p>- Looking in system folders.</p>
                                <p>- Not looking in hidden files and folders.</p>
                                <p className={styles['search-path']}>- Searching {searchPath}</p>
                                <div className={styles['search-progress-wrap']}>
                                    <div className={styles['search-progress-bar']}>
                                        <div className={styles['search-progress-dot']} />
                                    </div>
                                </div>
                                <div className={styles['search-actions']}>
                                    <button className={styles['search-btn']} onClick={cancelSearch}>Stop</button>
                                </div>
                            </div>
                        )}

                        {/* Search Results - Empty */}
                        {view === 'results-empty' && (
                            <div className={styles['search-results-empty']}>
                                <p className={styles['search-question']}>There were no files found. Do you want to quit searching?</p>
                                <button onClick={() => setView('home')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Yes, finished searching</span>
                                </button>
                                <button onClick={() => setView('files')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Yes, but make future searches faster</span>
                                </button>
                                <button onClick={() => setView('files')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>No, try a different search</span>
                                </button>
                                <div className={styles['search-actions']}>
                                    <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('files')}>Back</button>
                                </div>
                            </div>
                        )}

                        {/* Search Results - Found */}
                        {view === 'results-found' && (
                            <>
                                <p className={styles['search-question']}>{results.length} files found. Did you find what you want?</p>
                                <p>To refine this search and...</p>
                                <button onClick={() => setView('files')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Specify file name or keywords</span>
                                </button>
                                <button onClick={() => setView('files')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Look in a specific location</span>
                                </button>
                                <button onClick={() => setView('files')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Include hidden and system files</span>
                                </button>
                                <button onClick={() => setView('pictures')}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Find only pictures larger than 2 KB</span>
                                </button>
                                <button>
                                    <img src={iconMap['SearchInternet']} alt='' />
                                    <span>Search for pictures on the Internet</span>
                                </button>
                                <p>You may also want to...</p>
                                <button>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Sort results by</span>
                                </button>
                                <div className={styles['search-actions']}>
                                    <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('files')}>Back</button>
                                </div>
                            </>
                        )}

                        {/* You Rang */}
                        {view === 'you-rang' && (
                            <>
                                <p className={styles['search-question']}>You rang?</p>
                                <p>What would you like to do?</p>
                                <button disabled>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Choose a different animated character</span>
                                </button>
                                <button disabled>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Turn off the animated character</span>
                                </button>
                                <button onClick={handleDoTrick}>
                                    <img src={iconMap['Go']} alt='' />
                                    <span>Do a trick</span>
                                </button>
                                <div className={styles['search-actions']}>
                                    <button 
                                        className={`${styles['search-btn']} ${styles['secondary']}`} 
                                        onClick={() => setView('home')}
                                    >Back</button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles['rover']}>
                        {roverFrame.type === 'png' && roverFrame.src ? (
                            <img src={roverFrame.src} alt='' />
                        ) : roverFrame.type === 'sprite' ? (
                            <div
                                className={styles['rover-sprite']}
                                style={{
                                    backgroundPosition: `-${Math.round(roverFrame.x * 1.481)}px -${Math.round(roverFrame.y * 1.481)}px`
                                }}
                            />
                        ) : null}
                        <div className={styles['rover-inside']} onClick={handleRoverClick} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchSidebar