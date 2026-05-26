import { useState } from 'react';
import { mainItems, alsoItems, preferenceItems, advancedSections, lookInOptions, mediaTypes, modifiedOptions } from './data/searchData';
import type { SearchView, LookIn, MediaType, ModifiedOption } from './data/searchData';

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
}

    const searchPaths = [
        'C:\\Documents and Settings',
        'C:\\Program Files',
        'C:\\WINDOWS',
        'C:\\WINDOWS\\system32',
        'C:\\WINDOWS\\Media',
    ];

const SearchSidebar = ({ onClose, onSearchResults }: SearchSidebarProps) => {
    const [view, setView] = useState<SearchView>('home');
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
            <button className={styles['search-section-chevron']} aria-label='more-options'>
                <img src={ChevronDown} alt='' />
            </button>
        </button>
    ));

    const actionsBlock = (
        <div className={styles['search-actions']}>
            <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('home')}><span className={styles['mnemonic']}>B</span>ack</button>
            <button className={styles['search-btn']} onClick={handleSearch}>Sea<span className={styles['mnemonic']}>r</span>ch</button>
        </div>
    );

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
                                    <button className={styles['search-btn']} onClick={() => setView('home')}>Stop</button>
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
                    </div>
                    <div className={styles['rover']}>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchSidebar