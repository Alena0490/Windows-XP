import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import { useFavorites } from './hooks/useFavorites';

import Accessibility from './Accessibility';
import CustomizeComputer from './CustomizeComputer';
import Favorites from './Favorites';
import Feedback from './Feedback';
import FixingProblem from './FixingProblem';
import Hardware from './Hardware';
import HelpHomepage from './HelpHomepage';
import History from './History';
import Index from './Index';
import MusicVideo from './MusicVideo'
import NetworkingWeb from './NetworkingWeb';
import Options from './Options';
import PerformanceMaintenance from './PerformanceMaintenance';
import PrintingFaxing from './PrintingFaxing';
import SecurityBasics from './SecurityBasics';
import Support from './Support';
import SystemAdministration from './SystemAdministration';
import Tools from './Tools';
import WhatsNew from './WhatsNew';
import WindowsBasics from './WindowsBasics';
import WorkingRemotely from './WorkingRemotely';

import Back from '../../img/Back.webp'
import Favourites from '../../img/Favourites.webp'
import Forward from '../../img/Forward.webp'
import GetSupport from '../../img/GetSupport.webp'
import Go from '../../img/Go.webp'
import HelpIcon from '../../img/HelpAndSupport.webp'
import HelpIndex from '../../img/HelpAndSupportIndex.webp'
import HistoryImg from '../../img/IEHistory.webp'
import Home from '../../img/IEHome.webp'
import Properties from '../../img/Properties.webp'

import './HelpAnsSupport.css'
import '../../App.css'

type HelpView = 'home' | 'whatsnew' | 'musicvideo' | 'networking' | 'remotework' | 'customize' | 'print' | 'support' | 'options' | 'fixingproblem' | 'tools' | 'performance' | 'windowsbasics' | 'securitybasics' | 'systemadministration' | 'accessibility' | 'hardware' | 'favorites' | 'history' | 'index' | 'feedback';

interface HelpAndSupportProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen?: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

interface HistoryEntry {
    view: HelpView;
    articleId?: string;
}

const HelpAndSupport = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    isActive,
    globalVolume,
    globalMuted,
    plusTheme,
}: HelpAndSupportProps) => {
    const { position, handleMouseDown } = useDraggable(200, 100);
    const { favorites, isFavorite, addFavorite, removeFavorite, renameFavorite } = useFavorites();

    const [history, setHistory] = useState<HistoryEntry[]>([{ view: 'home' }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const currentView = history[historyIndex].view;
    const currentArticleId = history[historyIndex].articleId;
    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < history.length - 1;

    const pageTitles: Record<HelpView, string> = {
        home: 'Help and Support Center',
        whatsnew: "What's new in Windows XP",
        musicvideo: 'Music, videos, games, and photos',
        networking: 'Networking and the Web',
        remotework: 'Working remotely',
        customize: 'Customizing your computer',
        print: 'Printing and faxing',
        support: 'Welcome to Support',
        options: 'Options',
        fixingproblem: 'Fixing a problem',
        performance: 'Performance and maintenance',
        tools: 'Tools',
        windowsbasics: 'Windows basics',
        securitybasics: 'Protecting your PC: security basics',
        systemadministration: 'Security and administration',
        accessibility: 'Accessibility',
        hardware: 'Hardware',
        favorites: 'Favorites',
        history: 'History',
        index: 'Index',
        feedback: 'Send Feedback',
    };

    const handleAddFavorite = (id: string, title: string) => {
        if (isFavorite(id)) {
            return;
        }
        addFavorite({ id, title });
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        navigateTo('index');
    };

    const navigateTo = (view: HelpView, articleId?: string) => {
        if (view === currentView && articleId === currentArticleId) return;
        const next = history.slice(0, historyIndex + 1);
        next.push({ view, articleId });
        setHistory(next);
        setHistoryIndex(next.length - 1);
    };

    const goBack = () => { if (canGoBack) setHistoryIndex(i => i - 1); };
    const goForward = () => { if (canGoForward) setHistoryIndex(i => i + 1); };
    const goHome = () => navigateTo('home');

    return (
        <div className={[
            'app-window',
            'help-window',
            isActive  && 'app-window--active',
            isMinimized && 'help-window--minimized',
            isMinimized && 'app-window--minimized',
            isFullscreen && 'help-window--fullscreen',
            isFullscreen && 'app-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isFullscreen ? {} : { left: position.x, top: position.y }}
        onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
            <div className='title'>
                <img
                    className='help-icon'
                    alt='Help Icon'
                    src={HelpIcon}
                />

                <span className='title-bar-text'>Help and Support Center</span>
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
                    aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    onClick={toggleFullscreen}
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

        <div className='help-body'>
            <div className="help-toolbar">
                <button onClick={goBack} disabled={!canGoBack}>
                    <img src={Back} alt="Back" />
                    Back
                    <span className="history-arrow" aria-hidden="true"></span>
                </button>

                <button onClick={goForward} disabled={!canGoForward}>
                    <img src={Forward} alt="Forward" />
                    <span className="history-arrow" aria-hidden="true"></span>
                </button>

                <button onClick={goHome}>
                    <img src={Home} alt="Home" />
                </button>

                <div className="button-separator"></div>

                <button onClick={() => navigateTo('index')}>
                    <img src={HelpIndex} alt="Help Index" />
                    <span>I<span className='mnemonic'>n</span>dex</span> 
                </button>

                 <button onClick={() => navigateTo('favorites')}>
                    <img src={Favourites} alt="Favourites" />
                    <span>F<span className='mnemonic'>a</span>vorites</span>
                </button>

                <button onClick={() => navigateTo('history')}>
                    <img src={HistoryImg} alt="History" />
                    <span>Histor<span className='mnemonic'>y</span></span>
                </button>
              
               <div className="button-separator"></div>

                <button onClick={() => navigateTo('support')}>
                    <img src={GetSupport} alt="Get Support" />
                    <span>S<span className='mnemonic'>u</span>pport</span>
                </button>

                <button onClick={() => navigateTo('options')}>
                    <img src={Properties} alt="Properties" />
                    <span><span className='mnemonic'>O</span>ptions</span>
                </button>
            </div>

            <div className="help-search">
                <div>
                    <form className="search" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <span>Search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit"><img src={Go} alt="Go" /></button>
                    </form>
                    <p>Set search options</p>
                </div>
                <div className='second'>
                    <div className="search-title">
                        <h2><img src={HelpIcon} alt="" /> Help and Support Center</h2>
                        <p>Windows XP Professional</p>
                    </div>
                </div>
            </div>

            {currentView === 'home' && (
                <HelpHomepage onNavigate={navigateTo} />
            )}

            {currentView === 'whatsnew' && (
                <WhatsNew
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'musicvideo' && (
                <MusicVideo
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'networking' && (
                <NetworkingWeb
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'remotework' && (
                <WorkingRemotely
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'customize' && (
                <CustomizeComputer
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'print' && (
                <PrintingFaxing
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'support' && (
                <Support
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}

            {currentView === 'options' && (
                <Options
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}

            {currentView === 'fixingproblem' && (
                <FixingProblem
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'tools' && (
                <Tools
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}

            {currentView === 'performance' && (
                <PerformanceMaintenance
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'windowsbasics' && (
                <WindowsBasics
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'securitybasics' && (
                <SecurityBasics
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'systemadministration' && (
                <SystemAdministration
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'accessibility' && (
                <Accessibility
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}

            {currentView === 'hardware' && (
                <Hardware
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    isFavorite={isFavorite}
                    onAddFavorite={handleAddFavorite}
                    initialArticle={currentArticleId}
                />
            )}


            {currentView === 'favorites' && (
                <Favorites
                    favorites={favorites}
                    onRemove={removeFavorite}
                    onRename={renameFavorite}
                    onDisplay={(id) => {
                        const [view, articleId] = id.split(':');
                        navigateTo(view as HelpView, articleId);
                    }}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}

            {currentView === 'history' && (
                <History
                    items={history
                        .filter(h => h.view !== 'home' && h.view !== 'favorites' && h.view !== 'history')
                        .map(h => ({ id: h.view, title: pageTitles[h.view] }))}
                    onDisplay={(id) => navigateTo(id as HelpView)}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}

            {currentView === 'index' && (
                <Index
                    onDisplay={(id) => {
                        const [view, articleId] = id.split(':');
                        navigateTo(view as HelpView, articleId);
                    }}
                    initialQuery={searchQuery}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}

            {currentView === 'feedback' && (
                <Feedback
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}
        </div>
    </div>
  )
}

export default HelpAndSupport
