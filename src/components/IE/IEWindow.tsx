// STATES
import { useState, useEffect } from 'react';
import useDraggable from '../../hooks/useDraggable';
import { favourites } from './data/IEData';
import { blockedDomains } from './data/blockedDomains';

// COMPONENTS
import IEMenu from './IEMenu';
import IEFavourites from './IEFavourites';
import TipOfTheDay from './IETipOfTheDay';
import OpenDialog from '../OpenDialog'
import IEHistory from './IEHistory'
import IESearchCompanion from './IESearchCompanion';
import AddFavourite from './AddFavourite';
import type { UserFavourite } from './AddFavourite';

// IMAGES
import Logo from '../../img/logo2.webp';
import InternetIcon from '../../img/InternetShortcut.webp';
import URL from '../../img/URL.webp';
import Back from '../../img/Back.webp';
import Forward from '../../img/Forward.webp';
import Refresh from '../../img/IERefresh.webp';
import Stop from '../../img/IEStop.webp';
import Home from '../../img/IEHome.webp';
import Search from '../../img/Search.webp';
import Favourites from '../../img/Favourites.webp';
import History from '../../img/IEHistory.webp';
import Mail from '../../img/Email.webp';
import Printer from '../../img/Printer.webp';
import Edit from '../../img/IEEdit.webp';
import Discuss from '../../img/IEDiscuss.webp';
import Go from '../../img/Go.webp';
import NetworkError from '../../img/netError.webp';

// STYLES
import '../../App.css';
import './IEWindow.css';
import './IEHistory.css'

interface IEWindowProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    initialUrl?: string;
    globalVolume: number;
    globalMuted: boolean;
    onOpenFM: () => void;
    onOpenNotepad?: (content: string, filename?: string) => void;
    onNewWindow?: (url?: string) => void;
    onTitleChange?: (title: string) => void;
    onFaviconChange?: (favicon: string) => void;
}

const HOME_URL = 'https://web.archive.org/web/20031024040025if_/http://www.google.com/';
const PORTFOLIO_URL = 'https://alena-pumprova.cz/';

const IEWindow = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    initialUrl,
    globalVolume,
    globalMuted,
    onOpenFM,
    onOpenNotepad,
    onNewWindow,
    onTitleChange,
    onFaviconChange,
}: IEWindowProps) => {
    const [history, setHistory] = useState([HOME_URL, initialUrl ?? PORTFOLIO_URL]);
    const [historyIndex, setHistoryIndex] = useState(1);
    const [inputUrl, setInputUrl] = useState(initialUrl ?? PORTFOLIO_URL);
    const [hasError, setHasError] = useState(false);
    const [showFavourites, setShowFavourites] = useState(false);
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [showStandardToolbar, setShowStandardToolbar] = useState(true);
    const [showAddressBar, setShowAddressBar] = useState(true);
    const [iframeKey, setIframeKey] = useState(() => Date.now());
    const [isStopped, setIsStopped] = useState(false);
    const [showTipOfTheDay, setShowTipOfTheDay] = useState(false);
    const [showLinksDropdown, setShowLinksDropdown] = useState(false);
    const [showOpenDialog, setShowOpenDialog] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showAddFavourite, setShowAddFavourite] = useState(false);
    const [userFavourites, setUserFavourites] = useState<UserFavourite[]>(() => {
        try { return JSON.parse(localStorage.getItem('ie-favourites') ?? '[]'); }
        catch { return []; }
    });

    const handleNewWindow = () => {
        onNewWindow?.(currentUrl);
    };

    // Show initial window title
    useEffect(() => {
        onTitleChange?.(getPageTitle(currentUrl));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

     // Show initial window favicon
    useEffect(() => {
        onFaviconChange?.(getFavicon(currentUrl));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSaveAs = () => {
        fetch(currentUrl)
            .then(r => r.text())
            .then(text => {
                const blob = new Blob([text], { type: 'text/html' });
                const url = globalThis.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'page.html';
                a.click();
                globalThis.URL.revokeObjectURL(url);
            })
            .catch(() => {});
    };

    const handleSaveFavourite = (fav: UserFavourite) => {
        setUserFavourites(prev => {
            const next = [...prev.filter(f => f.url !== fav.url), fav];
            localStorage.setItem('ie-favourites', JSON.stringify(next));
            return next;
        });
    };

    const handleViewSource = async () => {
        try {
            const res = await fetch(currentUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const filename = currentUrl.replace(/[^a-z0-9]/gi, '_').slice(0, 40);
            onOpenNotepad?.(text, `source_${filename}.html`);
        } catch {
            onOpenNotepad?.(
                `The source for this page cannot be displayed.\r\n\r\n${currentUrl}`,
                'source.htm'
            );
        }
    };


    const currentUrl = history[historyIndex];
    const { position, handleMouseDown } = useDraggable(200, 100);

    const handleOpen = () => setShowOpenDialog(true);

    const handleRefresh = () => {
        setIsStopped(false);
        setIframeKey(Date.now());
    };

    const handleStop = () => setIsStopped(true);

    // Height to page content 
    const getIframeHeight = (url: string): string => {
        if (url.includes('the-morning-after')) return 'iframe-height-morning-after';
        if (url.includes('alena-pumprova.cz')) return 'iframe-height-portfolio';
        if (url.includes('alena0490.github.io/Pacman')) return 'iframe-height-game';
        if (url.includes('msn.com')) return 'iframe-height-msn';
        if (url.includes('mobilmania')) return 'iframe-height-mobilmania';
        if (url.includes('kinobox')) return 'iframe-height-kinobox';
        if (url.includes('idnes')) return 'iframe-height-idnes';
        if (url.includes('ocko')) return 'iframe-height-ocko';
        if (url.includes('zpovednice')) return 'iframe-height-zpovednice';
        if (url.includes('icq')) return 'iframe-height-icq';
        if (url.includes('Slot')) return 'iframe-height-slot-game';
        if (url.includes('Nu-pogodi')) return 'iframe-height-nu-pogodi';
        if (url.includes('Detective')) return 'iframe-height-detective';
        return 'iframe-height-default';
    };

    // Return favicon for the given URL, falling back to the default URL icon
    const getFavicon = (url: string): string => {
        for (const group of favourites) {
            const item = group.items.find(i => i.url === url);
            if (item) return item.icon;
        }
        return URL;
    };

    // Return page title for the given URL, truncated to 45 characters
    const getPageTitle = (url: string): string => {
        for (const group of favourites) {
            const item = group.items.find(i => i.url === url);
            if (item && item.title) {
                const title = item.title.length > 45
                    ? item.title.slice(0, 45) + '...'
                    : item.title;
                return `${title} – Microsoft Internet Explorer`;
            }
        }
        return 'Alena Pumprová – Microsoft Internet Explorer';
    };

    // Navigate to a new URL, updating history and resetting error state
    const navigateTo = (url: string) => {
        setHasError(false);
        setIsStopped(false);
        const isBlocked = blockedDomains.some(domain => url.includes(domain));
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, url]);
        setHistoryIndex(newHistory.length);
        setInputUrl(url);
        onTitleChange?.(getPageTitle(url));
        onFaviconChange?.(getFavicon(url));
        if (isBlocked) setHasError(true);
    };

    const [trackedInitialUrl, setTrackedInitialUrl] = useState(initialUrl);
    if (initialUrl !== trackedInitialUrl) {
        setTrackedInitialUrl(initialUrl);
        if (initialUrl) navigateTo(initialUrl);
    }

    // Back button
    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInputUrl(history[newIndex]);
            onTitleChange?.(getPageTitle(history[newIndex]));
            onFaviconChange?.(getFavicon(history[newIndex]));
        }
    };

    // Forward button
    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInputUrl(history[newIndex]);
            onTitleChange?.(getPageTitle(history[newIndex]));
            onFaviconChange?.(getFavicon(history[newIndex]));
        }
    };

    // Cut, Copy & Paste
    const handleCut = async () => {
        await navigator.clipboard.writeText(inputUrl);
        setInputUrl('');
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(inputUrl);
    };

    const handlePaste = async () => {
        const text = await navigator.clipboard.readText();
        setInputUrl(prev => prev + text);
    };

    // Tip of the Day
    const onCloseTipOfTheDay=() => setShowTipOfTheDay(false)

    return (
        <div
            className={[
                'ie-window',
                'app-window',
                isMinimized && 'ie-window--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'ie-window--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <div className='title'>
                    <img
                        className='browser-icon'
                        src={getFavicon(currentUrl)}
                        alt='Internet Link Icon'
                    />
                    <span className='title-bar-text'>{getPageTitle(currentUrl)}</span>
                </div>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className='ie-toolbars'>
                <div className='ie-menu'>
                    <IEMenu
                        onNavigate={navigateTo}
                        onForward={goForward}
                        onBack={goBack}
                        onHome={() => navigateTo(PORTFOLIO_URL)}
                        onOpen={handleOpen}
                        onClose={onClose}
                        favouritesVisible={showFavourites}
                        statusBarVisible={showStatusBar}
                        onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                        onToggleFavourites={() => {
                            setShowFavourites(prev => !prev);
                            setShowHistory(false);
                        }}
                        onToggleStandardToolbar={() => setShowStandardToolbar(prev => !prev)}
                        onToggleAddressBar={() => setShowAddressBar(prev => !prev)}
                        standardToolbarVisible={showStandardToolbar}
                        addressBarVisible={showAddressBar}
                        onToggleFullscreen={toggleFullscreen}
                        onRefresh={handleRefresh}
                        onStop={handleStop}
                        onPrint={() => window.print()}
                        onCut={handleCut}
                        onCopy={handleCopy}
                        onPaste={handlePaste}
                        globalVolume={globalVolume}
                        globalMuted={globalMuted}
                        showTipOfTheDay={showTipOfTheDay}
                        onToggleTipOfTheDay={() => setShowTipOfTheDay(prev => !prev)}
                        onToggleHistory={() => {
                            setShowHistory(prev => !prev);
                            setShowFavourites(false);
                        }}
                        historyVisible={showHistory}
                        onToggleSearch={() => {
                            setShowSearch(prev => !prev);
                            setShowFavourites(false);
                            setShowHistory(false);
                        }}
                        searchVisible={showSearch}
                        onAddFavourite={() => setShowAddFavourite(true)}
                        onViewSource={handleViewSource}
                        onNewWindow={handleNewWindow}
                        onSaveAs={handleSaveAs}
                    />
                    <div className='windows-corner-panel'>
                        <img
                            className='windows-corner-icon'
                            src={Logo}
                            alt='Internet Explorer Logo'
                        />
                    </div>
                </div>

                <div className='ie-toolbar'>
                    {showStandardToolbar && (
                        <div className='ie-toolbar-top'>
                            <button
                                type='button'
                                className={`toolbar-btn ${historyIndex === 0 ? 'disabled' : ''}`}
                                onClick={goBack}
                                aria-label='go back'
                            >
                                <img className='toolbar-img' src={Back} alt='Back' />
                                Back
                            </button>
                            <button
                                type='button'
                                className={`toolbar-dropdown-arrow toolbar-btn ${historyIndex === 0 ? 'disabled' : ''}`}
                                onClick={() => {}}
                            >
                                ▾
                            </button>
                            <button
                                type='button'
                                className={`toolbar-btn ${historyIndex === history.length - 1 ? 'disabled' : ''}`}
                                onClick={goForward}
                                aria-label='go forward'
                            >
                                <img className='toolbar-img' src={Forward} alt='Forward' />
                                Forward
                            </button>
                            <button
                                type='button'
                                className={`toolbar-dropdown-arrow toolbar-btn ${historyIndex === history.length - 1 ? 'disabled' : ''}`}
                                onClick={() => {}}
                            >
                                ▾
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                onClick={handleRefresh}
                                aria-label='refresh'
                            >
                                <img className='toolbar-img' src={Refresh} alt='Refresh' />
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                onClick={handleStop}
                                aria-label='stop'
                            >
                                <img className='toolbar-img' src={Stop} alt='Stop' />
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn border-right'
                                onClick={() => navigateTo(PORTFOLIO_URL)}
                                aria-label='go home'
                            >
                                <img className='toolbar-img' src={Home} alt='Home' />
                                Home
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                onClick={() => {
                                    setShowSearch(prev => !prev);
                                    setShowFavourites(false);
                                    setShowHistory(false);
                                }}
                                aria-label='search'
                            >
                                <img className='toolbar-img' src={Search} alt='Search' />
                                Search
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                onClick={() => {
                                    setShowFavourites(prev => !prev);
                                    setShowHistory(false);
                                    setShowSearch(false);
                                }}
                            >
                                <img className='toolbar-img' src={Favourites} alt='Favourites' />
                                Favourites
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn border-right'
                                aria-label='view history'
                                onClick={() => {
                                    setShowHistory(prev => !prev);
                                    setShowFavourites(false);
                                    setShowSearch(false);
                                }}
                            >
                                <img className='toolbar-img' src={History} alt='History' />
                                History
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                aria-label='mail'
                            >
                                <img className='toolbar-img' src={Mail} alt='Mail' />
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                onClick={() => window.print()}
                                aria-label='print'
                            >
                                <img className='toolbar-img' src={Printer} alt='Print' />
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                aria-label='edit page'
                            >
                                <img className='toolbar-img' src={Edit} alt='Edit' />
                            </button>
                            <button
                                type='button'
                                className='toolbar-btn'
                                aria-label='discuss'
                            >
                                <img className='toolbar-img' src={Discuss} alt='Discuss' />
                            </button>
                        </div>
                    )}

                    {showAddressBar && (
                        <div className='ie-toolbar-bottom'>
                            <div className='left'>
                                <span>A<span className='mnemonic'>d</span>dress</span>
                                <div className='input-wrapper'>
                                    <img
                                        className='toolbar-img-xs absolute'
                                        src={getFavicon(currentUrl)}
                                        alt='URL Icon'
                                    />
                                    <input
                                        type='text'
                                        className='address-bar'
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && navigateTo(inputUrl)}
                                    />
                                    <button 
                                        type='button'
                                        className='more-links'
                                        aria-label='Show history'
                                        onClick={() => {}}
                                    ></button>
                                </div>
                            </div>
                            <div className='right'>
                                <button
                                    type='button'
                                    className='toolbar-btn'
                                    onClick={() => navigateTo(inputUrl)}
                                    aria-label='go to address'
                                >
                                    <img className='toolbar-img-small' src={Go} alt='Go' />
                                    Go
                                </button>
                                <div className='ie-links-toggle'>
                                    <button
                                        type='button'
                                        className='toolbar-btn'
                                        onClick={() => setShowLinksDropdown(!showLinksDropdown)}
                                        aria-label='view links'
                                    >
                                        Links »
                                    </button>
                                    {showLinksDropdown && (
                                        <div className='ie-links-dropdown'>
                                            <button
                                                type='button'
                                                onClick={() => { navigateTo('https://web.archive.org/web/20030604011837/http://www.msn.com/'); setShowLinksDropdown(false); }}
                                            >
                                                <img src={URL} alt='' />
                                                MSN.com
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => { navigateTo('https://web.archive.org/web/20031110170823/http://entertainment.msn.com/Stations/Default.aspx'); setShowLinksDropdown(false); }}
                                            >
                                                <img src={URL} alt='' />
                                                Radio Station Guide
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => { navigateTo('https://web.archive.org/web/20030726031115/http://windowsmedia.com/Mediaguide/Home'); setShowLinksDropdown(false); }}
                                            >
                                                <img src={URL} alt='' />
                                                Windows Media
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FAVOURITES */}
            <div className='page-window-outer'>
                {showFavourites && (
                    <IEFavourites
                        onNavigate={(url) => { navigateTo(url); setShowFavourites(false); }}
                        onClose={() => setShowFavourites(false)}
                        userFavourites={userFavourites}
                        onAddFavourite={() => setShowAddFavourite(true)}
                        onRemoveUserFavourite={(url) => {
                            setUserFavourites(prev => {
                                const next = prev.filter(f => f.url !== url);
                                localStorage.setItem('ie-favourites', JSON.stringify(next));
                                return next;
                            });
                        }}
                    />
                )}

                {/* HISTORY */}
                {showHistory && (
                    <IEHistory
                        history={history}
                        historyIndex={historyIndex}
                        navigateTo={(url) => { navigateTo(url); setShowHistory(false); }}
                        onClose={() => setShowHistory(false)}
                    />
                )}

                {/* SEARCH */}
                {showSearch && (
                    <IESearchCompanion
                        onClose={() => setShowSearch(false)}
                        onOpenFM={() => {
                            setShowSearch(false);
                            onOpenFM();
                        }}
                        onNavigate={navigateTo}
                    />
                )}

                <div className='page-window-wrap'>
                    {hasError && (
                        <div className='ie-error'>
                            <div className='ie-error-header'>
                                <img className='error-icon' src={NetworkError} alt='error' />
                                <h2>Internet Explorer cannot display the webpage</h2>
                            </div>
                            <hr />
                            <p>What you can try:</p>
                            <button
                                type='button'
                                onClick={() => navigateTo(PORTFOLIO_URL)}
                            >
                                Diagnose Connection Problems
                            </button>
                            <details>
                                <summary>
                                    <span className='ie-error-arrow'></span>
                                    More information
                                </summary>
                                <p>This problem can be caused by a variety of issues, including:</p>
                                <ul>
                                    <li>Internet connectivity has been lost.</li>
                                    <li>The website is temporarily unavailable.</li>
                                    <li>The Domain Name Server (DNS) is not reachable.</li>
                                    <li>The Domain Name Server (DNS) does not have a listing for the website's domain.</li>
                                    <li>There might be a typing error in the address.</li>
                                </ul>
                                <p><strong>For offline users</strong></p>
                                <p>You can still view subscribed feeds and some recently viewed webpages.</p>
                                <p>To view subscribed feeds:</p>
                                <ol>
                                    <li>Click the Favorites button ⭐, click <strong>Feeds</strong>, and then click the feed you want to view.</li>
                                </ol>
                                <p>To view recently visited webpages (might not work on all pages):</p>
                                <ol>
                                    <li>Press Alt, click <strong>File</strong>, and then click <strong>Work Offline</strong>.</li>
                                    <li>Click the Favorites button ⭐, click <strong>History</strong>, and then click the page you want to view.</li>
                                </ol>
                            </details>
                        </div>
                    )}
                    <iframe
                        key={`${currentUrl}-${iframeKey}`}
                        className={`page-window ${getIframeHeight(currentUrl)}`}
                        src={hasError || isStopped ? 'about:blank' : currentUrl}
                        title='Internet Explorer'
                        scrolling='no'
                        style={{ display: hasError ? 'none' : 'block' }}
                    />
                </div>
            </div>

            {/* tip of the day */}
            {showTipOfTheDay && (
                <TipOfTheDay onClose={onCloseTipOfTheDay} />
            )}

            {/* open dialog */}
            {showOpenDialog && (
                <OpenDialog
                    history={history}
                    onOpen={(url) => navigateTo(url)}
                    onClose={() => setShowOpenDialog(false)}
                    onBrowse={() => {
                        setShowOpenDialog(false);
                        onOpenFM();
                    }}
                />
            )}

            {showStatusBar && (
                <div className='ie-statusbar'>
                    <img src={getFavicon(currentUrl)} alt='URL Icon' />
                    <span className='status-text'>
                        <img src={InternetIcon} alt='Internet Icon' />
                        Internet
                    </span>
                </div>
            )}

            {showAddFavourite && (
                <AddFavourite
                    onClose={() => setShowAddFavourite(false)}
                    currentUrl={currentUrl}
                    currentTitle={getPageTitle(currentUrl)}
                    onSave={handleSaveFavourite}
                />
            )}
        </div>
    );
};

export default IEWindow;