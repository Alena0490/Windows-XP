import { useState } from 'react';
import { mainItems, alsoItems, preferenceItems, advancedSections, lookInOptions, mediaTypes, modifiedOptions } from './data/searchData';
import type { SearchView, LookIn, MediaType, ModifiedOption } from './data/searchData';

import Close from '../../../img/tileClose.png';
import Go from '../../../img/Go.webp'
import Help from '../../../img/HelpAndSupport.webp'
import SearchInternet from '../../../img/413.ico'
import Properties from '../../../img/explorerProperties.webp'
import MyComputer from '../../../img/MyComputer.webp';
import LocalDisc from '../../../img/LocalDisk.webp';
import MyDocumentsIcon from '../../../img/MyDocuments.webp';
import DesktopIcon from '../../../img/Desktop.webp';

import styles from './SearchSidebar.module.css'

interface SearchSidebarProps {
    onClose: () => void;
}

const SearchSidebar = ({ onClose }: SearchSidebarProps) => {
    const [view, setView] = useState<SearchView>('home');
    const [fileName, setFileName] = useState('');
    const [phrase, setPhrase] = useState('');
    const [lookIn, setLookIn] = useState<LookIn>('my-computer');
    const [lookInOpen, setLookInOpen] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<Set<MediaType>>(new Set());
    const [modifiedOption, setModifiedOption] = useState<ModifiedOption>('any');
    const [internetQuery, setInternetQuery] = useState('');

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
        </button>
    ));

    const actionsBlock = (
        <div className={styles['search-actions']}>
            <button className={`${styles['search-btn']} ${styles['secondary']}`} onClick={() => setView('home')}><span className={styles['mnemonic']}>B</span>ack</button>
            <button className={styles['search-btn']}>Sea<span className={styles['mnemonic']}>r</span>ch</button>
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
                                    <input className={styles['search-input']} type='text' value={fileName} onChange={e => setFileName(e.target.value)} />
                                </label>

                                <label className={styles['search-label']}>A word or phrase in the file:
                                    <input className={styles['search-input']} type='text' value={phrase} onChange={e => setPhrase(e.target.value)} />
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
                                                type='checkbox'
                                                checked={selectedMedia.has(t.id)}
                                                onChange={() => toggleMedia(t.id)}
                                            />
                                            {t.label}
                                        </label>
                                    ))}
                                </div>

                                <label className={styles['search-label']}>All or part of the file name:
                                    <input className={styles['search-input']} type='text' value={fileName} onChange={e => setFileName(e.target.value)} />
                                </label>

                                {lookInBlock}
                                {advancedBlock}
                                {actionsBlock}
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
                                    <input className={styles['search-input']} type='text' value={fileName} onChange={e => setFileName(e.target.value)} />
                                </label>

                                {lookInBlock}
                                {advancedBlock}
                                {actionsBlock}
                            </>
                        )}

                        {/* Search the Internet */}
                        {view === 'internet' && (
                            <>
                                <p className={styles['search-question']}>What are you looking for?</p>

                                <label className={styles['search-label']}>Find a Web page for:
                                    <input className={styles['search-input']} type='text' value={internetQuery} onChange={e => setInternetQuery(e.target.value)} />
                                </label>

                                {actionsBlock}
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