import { useState, useEffect, useRef, useMemo } from 'react';
import { FILE_SYSTEM, getDesktopItems } from './data/FileManagerData';
import ControlPanelIcon from '../../img/ControlPanel.webp';
import type { FMItem } from './data/FileManagerData';
import type { WMPTrack } from '../mediaPlayer/types/WMPTrack';
import { addRecentDoc } from '../../utils/recentDocs';

import FileManagerSidebar from './FileManagerSidebar';
import HistorySidebar from './HistorySidebar';
import SearchSidebar from './rover/SearchSidebar';
import TipOfTheDay from './TipOfTheDay';
import PictureViewer from './PictureViewer';
import HiddenFolderWarning from './HiddenFolderWarning';
import ControlPanelHome from './controlPanel/ControlPanelHome';
import ControlPanelAppearance from './controlPanel/ControlPanelAppearance';
import ControlPanelNetwork from './controlPanel/ControlPanelNetwork';
import ControlPanelPrinters from './controlPanel/ControlPanelPrinters';
import ControlPanelDate from './controlPanel/ControlPanelDate';
import ControlPanelAccessibility from './controlPanel/ControlPanelAccessibility';
import ControlPanelAccounts from './controlPanel/ControlPanelAccounts';
import ControlPanelSound from './controlPanel/ControlPanelSound';
import ControlPanelPerformance from './controlPanel/ControlPanelPerformance';

import Forward from '../../img/Forward.webp';
import Back from '../../img/Back.webp';
import Up from '../../img/Up.webp';
import Search from '../../img/Search.webp';
import Folders from '../../img/FolderView.webp';
import Go from '../../img/Go.webp';

//View
// import Default from '../../img/FolderViewClassic.webp';
import ThumbnailView from '../../img/ThumbnailView.webp';
import DetailView from '../../img/DetailView.webp';
import TileView from '../../img/TileView.webp';
import IconView from '../../img/IconView.webp';
import ListView from '../../img/OEFolderList.webp';
import FontSimilarityView from '../../img/FontSimilarityView.webp'

import './FileManagerApp.css';

interface FileManagerAppProps {
    onFolderChange: (name: string, icon: string | undefined) => void;
    initialPath?: string[];
    onOpenApp: (id: string) => void;
    pathKey: number;
    viewMode: 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details' | 'similarity';
    onViewChange: (mode: 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details' | 'similarity') => void;
    onNavigationChange?: (
        canGoBack: boolean, 
        canGoForward: boolean, 
        canGoUp: boolean, 
        goBack: () => void, 
        goForward: () => void, 
        goUp: () => void
    ) => void;
    showStatusBar: boolean;
    sortBy: 'name' | 'size' | 'type' | 'modified';
    showStandardButtons: boolean;
    showAddressBar: boolean;
    showOtherPlaces: boolean;
    showTipOfTheDay: boolean;
    onCloseTipOfTheDay: () => void;
    showHistory: boolean;
    onCloseHistory: () => void;
    showSearch: boolean;
    onCloseSearch: () => void;
    onToggleSearch: () => void;
    apps: { name: string; size: string }[];
    onOpenNotepad?: (content: string, fileName: string) => void;
    onOpenWMP?: (tracks: WMPTrack[], startIndex: number) => void;
    onOpenIE?: (url: string) => void;
    onOpenFontView?: (item: FMItem) => void;
    globalVolume: number;
    globalMuted: boolean;
    pickerMode?: 'wallpaper' | null;
    onFilePicked?: (url: string) => void;
    onOpenDisplayProperties?: (tab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings') => void;
    onOpenVolumeControl?: () => void;
}

// File extensions accepted by the wallpaper picker. .jpeg covered by suffix match.
const IMAGE_EXTS = ['.webp', '.jpg', '.jpeg', '.png', '.bmp', '.gif'] as const;
const isPickableImage = (item: FMItem): string | null => {
    const lower = item.name.toLowerCase();
    if (!IMAGE_EXTS.some(ext => lower.endsWith(ext))) return null;
    return item.imageUrl ?? item.thumbnailUrl ?? null;
};

const getFolderIcon = (node: { id: string; icon?: string }) =>
    node.id.startsWith('cp-') ? ControlPanelIcon : node.icon;

const FileManagerApp = ({ 
    onFolderChange, 
    initialPath, 
    onOpenApp, 
    pathKey,
    viewMode,
    onViewChange, 
    onNavigationChange,
    showStatusBar,
    sortBy,
    showStandardButtons,
    showAddressBar,
    showOtherPlaces,
    showTipOfTheDay,
    onCloseTipOfTheDay,
     showHistory,
     onCloseHistory,
     showSearch,
     onCloseSearch,
     onToggleSearch,
     apps,
     onOpenNotepad,
     onOpenIE,
     onOpenWMP,
     onOpenFontView,
     globalVolume,
     globalMuted,
     pickerMode,
     onFilePicked,
     onOpenDisplayProperties,
     onOpenVolumeControl,
}: FileManagerAppProps) => {
    const [path, setPath] = useState<string[]>(initialPath ?? []);
    const [navHistory, setNavHistory] = useState<string[][]>([initialPath ?? []]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewerImageId, setViewerImageId] = useState<string | null>(null);
    const [revealedHidden, setRevealedHidden] = useState<Set<string>>(new Set());
    const [searchResults, setSearchResults] = useState<FMItem[] | null>(null);
    const [controlPanelClassic, setControlPanelClassic] = useState(false);
    const [similarityBaseFont, setSimilarityBaseFont] = useState('Arial');

    const handleViewerChange = (id: string) => {
        setViewerImageId(id);
        setSelectedId(id);
        const item = sortedChildren.find(c => c.id === id);
        if (item) {
            addRecentDoc({ name: item.name, path: item.id, type: 'image' });
        }
    };

    // FOLDER NAVIGATION
    const navigateTo = (newPath: string[]) => {
        setViewerImageId(null);
        setSearchResults(null);
        setPath(newPath);
        const trimmed = navHistory.slice(0, historyIndex + 1);
        const newHistory = [...trimmed, newPath];
        setNavHistory(newHistory);
        setHistoryIndex(trimmed.length);
        const node = getNodeAtPath(newPath);
        onFolderChange(node.name, getFolderIcon(node));
    };

    const goBack = () => {
        if (historyIndex === 0) return;
        setViewerImageId(null);
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setPath(navHistory[newIndex]);
        const node = getNodeAtPath(navHistory[newIndex]);
        onFolderChange(node.name, getFolderIcon(node));
    };

    const goForward = () => {
        if (historyIndex === navHistory.length - 1) return;
        setViewerImageId(null);
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setPath(navHistory[newIndex]);
        const node = getNodeAtPath(navHistory[newIndex]);
        onFolderChange(node.name, getFolderIcon(node));
    };

    const goUp = () => {
        if (path.length === 0) return;
        navigateTo(path.slice(0, -1));
    };

    // Refs to always have latest version of nav functions
    const goBackRef = useRef(goBack);
    const goForwardRef = useRef(goForward);
    const goUpRef = useRef(goUp);

    useEffect(() => {
        goBackRef.current = goBack;
        goForwardRef.current = goForward;
        goUpRef.current = goUp;
    });

    const updateNav = (histIdx: number, histLen: number, pathLen: number) => {
        onNavigationChange?.(
            histIdx > 0,
            histIdx < histLen - 1,
            pathLen > 0,
            () => goBackRef.current(),
            () => goForwardRef.current(),
            () => goUpRef.current()
        );
    };

    const getNodeAtPath = (path: string[]): FMItem => {
    if (!path || !Array.isArray(path)) return FILE_SYSTEM;
    let node = FILE_SYSTEM;
    for (const id of path) {
        const child = node.children?.find(c => c.id === id);
        if (!child) break;
        node = child;
    }
    return node;
};

    const isFirstRender = useRef(true);

    useEffect(() => {
        const node = getNodeAtPath(path);
        onFolderChange(node.name, getFolderIcon(node));
        updateNav(historyIndex, navHistory.length, path.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        updateNav(historyIndex, navHistory.length, path.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historyIndex, navHistory, path]);

    // Clear stale search results when the Search panel is closed
    useEffect(() => {
        if (!showSearch) setSearchResults(null);
    }, [showSearch]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const newPath = initialPath ?? [];
        const node = getNodeAtPath(newPath);
        setPath(newPath);
        setNavHistory([newPath]);
        setHistoryIndex(0);
        onFolderChange(node.name, getFolderIcon(node));
        updateNav(0, 1, newPath.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathKey]);

    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < navHistory.length - 1;
    const canGoUp = path.length > 0;
    const currentNode = getNodeAtPath(path);

    // DATA DERIVED FROM PATH
    const isDesktop = path[path.length - 1] === 'desktop';
    const currentChildren = (showSearch && searchResults)
        ? searchResults
        : isDesktop ? getDesktopItems(apps) : currentNode.children;

    const sortedChildren = [...(currentChildren ?? [])].sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        }
         if (sortBy === 'type') {
            const extA = a.name.split('.').pop()?.toLowerCase() ?? '';
            const extB = b.name.split('.').pop()?.toLowerCase() ?? '';
            return extA.localeCompare(extB);
        }
        if (sortBy === 'modified') {
            const parseDate = (d?: string) => {
                if (!d) return 0;
                const [day, month, year] = d.split('/').map(Number);
                return new Date(year, month - 1, day).getTime();
            };
            return parseDate(a.modified) - parseDate(b.modified);
        }
        if (sortBy === 'size') {
            const parseSize = (s?: string) => {
                if (!s) return 0;
                return parseInt(s.replace(/,/g, '').replace(' KB', ''));
            };
            return parseSize(a.size) - parseSize(b.size);
        }
        return 0; // PLACEHOLDER - ORTING IS IN DEVELOPEMNT
    });

    const breadcrumbs = useMemo(() => {
        const crumbs = [{ name: 'My Computer', icon: FILE_SYSTEM.icon }];
        if (!path || !Array.isArray(path)) return crumbs;
        let node = FILE_SYSTEM;
        for (const id of path) {
            const child = node.children?.find(c => c.id === id);
            if (!child) break;
            crumbs.push({ name: child.name, icon: child.icon });
            node = child;
        }
        return crumbs;
    }, [path]);


    // KEYBOARD SHORTCUTS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't hijack keys while the user is typing into an editable field
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            if (e.key === 'Backspace') {
                e.preventDefault();
                goUpRef.current();
            }
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                goBackRef.current();
            }
            if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault();
                goForwardRef.current();
            }
            if (e.key === 'Enter' && selectedId !== null) {
                const item = sortedChildren.find(c => c.id === selectedId);
                if (item) {
                    if (item.id === 'cp-fonts') {
                            navigateTo(['localdisc', 'c-windows', 'c-windows-fonts']);
                            return;
                        }
                    if (item.id === 'cp-display') {
                        onOpenDisplayProperties?.();
                        return;
                    }
                    if (item.type === 'folder') {
                        navigateTo([...path, item.id]);
                    } else if (item.name.endsWith('.lnk')) {
                        onOpenApp(item.id);
                        setSelectedId(null);
                    } else if (item.name.endsWith('.txt') || item.name.endsWith('.md')) {  
                        openNotepad(item);
                    }  else if (item.url) {
                        onOpenIE?.(item.url);
                    }
                    else if (item.name.endsWith('.mp3') || item.name.endsWith('.wav')) {
                    if (item.trackData) {
                        openWMP(item);
                    }
                }
                else if (item.fontUrl) {
                    onOpenFontView?.(item);
                }

                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId, sortedChildren, path]);

    // FILE OPENING HISTORY
    const openNotepad = (item: FMItem) => {
        const content = item.content ?? '';
        onOpenNotepad?.(content, item.name);
        addRecentDoc({ name: item.name, path: item.id, type: 'txt' });
    };

    const openWMP = (item: FMItem) => {
        if (!item.trackData) return;
        const siblings = sortedChildren.filter(c => c.trackData);
        const tracks = siblings.map(c => c.trackData!);
        const startIndex = siblings.findIndex(c => c.id === item.id);
        onOpenWMP?.(tracks, startIndex);
        addRecentDoc({ name: item.name, path: item.id, type: 'mp3' });
    };

    return (
        <div className='file-app'>

            {/* ── Toolbar ── */}
            <div className='file-toolbars'>
                <div className='file-toolbar'>
                    {showStandardButtons && (
                        <div className='file-toolbar-top'>
                            <button
                                type='button'
                                className={`toolbar-btn ${!canGoBack ? 'disabled' : ''}`}
                                onClick={goBack}
                                aria-label='Back'
                            >
                                <img className='toolbar-img' src={Back} alt='Back' />
                                Back
                            </button>
                            <button
                                type='button'
                                className={`toolbar-dropdown-arrow toolbar-btn ${!canGoBack ? 'disabled' : ''}`}
                                onClick={() => {}}
                            >
                                ▾
                            </button>

                            <button
                                type='button'
                                className={`toolbar-btn ${!canGoForward ? 'disabled' : ''}`}
                                onClick={goForward}
                                aria-label='Forward'
                            >
                                <img className='toolbar-img' src={Forward} alt='Forward' />
                            </button>
                            <button
                                type='button'
                                className={`toolbar-dropdown-arrow toolbar-btn ${!canGoForward ? 'disabled' : ''}`}
                                onClick={() => {}}
                            >
                                ▾
                            </button>

                            <button
                                type='button'
                                className={`toolbar-btn border-right ${!canGoUp ? 'disabled' : ''}`}
                                onClick={goUp}
                                aria-label='Up'
                            >
                                <img className='toolbar-img' src={Up} alt='Up' />
                            </button>
                            <button
                                type='button'
                                className={`toolbar-btn${showSearch ? ' is-active' : ''}`}
                                aria-label='Search'
                                onClick={onToggleSearch}
                            >
                                <img className='toolbar-img' src={Search} alt='Search' />
                                Search
                            </button>
                            <button type='button' className='toolbar-btn border-right' aria-label='Folders'>
                                <img className='toolbar-img' src={Folders} alt='Folders' />
                                Folders
                            </button>

                            {currentNode.id === 'c-windows-fonts' ? (
                                <>
                                    <button type='button' className={`toolbar-btn${viewMode === 'thumbnails' ? ' is-active' : ''}`} onClick={() => onViewChange('thumbnails')}>
                                        <img className='toolbar-img' src={ThumbnailView} alt='Thumbnails' />
                                    </button>
                                    <button type='button' className={`toolbar-btn${viewMode === 'icons' ? ' is-active' : ''}`} onClick={() => onViewChange('icons')}>
                                        <img className='toolbar-img' src={IconView} alt='Large Icons' />
                                    </button>

                                    <button type='button' className={`toolbar-btn${viewMode === 'similarity' ? ' is-active' : ''}`} onClick={() => onViewChange('similarity')}>
                                        <img className='toolbar-img' src={FontSimilarityView} alt='Similarity' />
                                    </button>
                                    <button type='button' className={`toolbar-btn${viewMode === 'details' ? ' is-active' : ''}`} onClick={() => onViewChange('details')}>
                                        <img className='toolbar-img' src={DetailView} alt='Details' />
                                    </button>
                                </>
                            ) : (
                                <div className='file-view-toggle'>
                                    <button
                                        type='button'
                                        className='toolbar-btn'
                                        onClick={() => setViewDropdownOpen(prev => !prev)}
                                    >
                                        <img className='toolbar-img' src={IconView} alt='View' />
                                        ▾
                                    </button>
                                    {viewDropdownOpen && (
                                        <div className='file-view-dropdown'>
                                            <button type='button' className={viewMode === 'thumbnails' ? 'is-active' : ''} onClick={() => { onViewChange('thumbnails'); setViewDropdownOpen(false); }}>
                                                <img src={ThumbnailView} alt='Thumbnails' /> Thumbnails
                                            </button>
                                            <button type='button' className={viewMode === 'tiles' ? 'is-active' : ''} onClick={() => { onViewChange('tiles'); setViewDropdownOpen(false); }}>
                                                <img src={TileView} alt='Tiles' /> Tiles
                                            </button>
                                            <button type='button' className={viewMode === 'icons' ? 'is-active' : ''} onClick={() => { onViewChange('icons'); setViewDropdownOpen(false); }}>
                                                <img src={IconView} alt='Icons' /> Icons
                                            </button>
                                            <button type='button' className={viewMode === 'list' ? 'is-active' : ''} onClick={() => { onViewChange('list'); setViewDropdownOpen(false); }}>
                                                <img src={ListView} alt='List' /> List
                                            </button>
                                            <button type='button' className={viewMode === 'details' ? 'is-active' : ''} onClick={() => { onViewChange('details'); setViewDropdownOpen(false); }}>
                                                <img src={DetailView} alt='Details' /> Details
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                    )}

                    {/* ── Address Bar ── */}
                    {showAddressBar && (
                        <div className='file-toolbar-bottom'>
                            <div className='left'>
                                <span>Address</span>
                                <div className='input-wrapper'>
                                    <img
                                        className='toolbar-img-xs absolute'
                                        src={getFolderIcon(currentNode)}
                                        alt=''
                                    />
                                    <div className='address-bar address-breadcrumbs'>
                                        {breadcrumbs.map((crumb, index) => (
                                            <span key={index} className='address-breadcrumb'>
                                                {index > 0 && <span className='address-separator'>▸</span>}
                                                <button
                                                    type='button'
                                                    className={`address-crumb-btn${index === breadcrumbs.length - 1 ? ' is-current' : ''}`}
                                                    onClick={() => {
                                                        if (index < breadcrumbs.length - 1) navigateTo(path.slice(0, index));
                                                    }}
                                                >
                                                    {crumb.name}
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        type='button'
                                        className='more-links'
                                        aria-label='Show history'
                                        onClick={() => {}}
                                    />
                                </div>
                            </div>
                            <div className='right'>
                                <button type='button' className='toolbar-btn' aria-label='Go'>
                                    <img className='toolbar-img-small' src={Go} alt='Go' />
                                    Go
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='file-main'>
                {showHistory ? (
                    <HistorySidebar
                        navHistory={navHistory}
                        historyIndex={historyIndex}
                        navigateTo={navigateTo}
                        onClose={onCloseHistory}
                    />
                ) : showSearch ? (
                    <SearchSidebar
                        onClose={onCloseSearch}
                        onSearchResults={setSearchResults}
                        globalVolume={globalVolume}
                        globalMuted={globalMuted}
                    />
                ) : (
                    <FileManagerSidebar
                        path={path}
                        navigateTo={navigateTo}
                        currentNode={currentNode}
                        selectedItem={sortedChildren?.find(c => c.id === selectedId) ?? null}
                        showOtherPlaces={showOtherPlaces}
                        apps={apps}
                        controlPanelClassic={controlPanelClassic}
                        onControlPanelClassic={() => setControlPanelClassic(true)}
                        onSwitchToCategory={() => setControlPanelClassic(false)}
                    />
                )}
                <div className={`file-content ${viewMode}`} data-folder-type={showSearch ? 'search' : currentNode.folderType} data-cp-classic={controlPanelClassic ? 'true' : undefined}>
                    {viewerImageId ? (
                        <PictureViewer
                            images={sortedChildren.filter(c => (c.thumbnailUrl || c.imageUrl) && c.type === 'file')}
                            activeId={viewerImageId}
                            onChange={handleViewerChange}
                        />
                    ) : currentNode.id === 'cp-appearance' ? (
                        <ControlPanelAppearance onOpenDisplayProperties={onOpenDisplayProperties} />
                    ) : currentNode.id === 'cp-network' ? (
                        <ControlPanelNetwork />
                    ) : currentNode.id === 'cp-printers' ? (
                        <ControlPanelPrinters />
                    ) : currentNode.id === 'cp-date' ? (
                        <ControlPanelDate />
                    ) : currentNode.id === 'cp-accessibility' ? (
                        <ControlPanelAccessibility />
                    ) : currentNode.id === 'cp-users' ? (
                        <ControlPanelAccounts />
                    ) : currentNode.id === 'cp-audio' ? (
                        <ControlPanelSound onOpenVolumeControl={onOpenVolumeControl} />
                    ) : currentNode.id === 'cp-performance' ? (
                        <ControlPanelPerformance />
                    ) : currentNode.id === 'controlpanel' && !controlPanelClassic ? (
                        <ControlPanelHome navigateTo={navigateTo} path={path} />
                    ) : currentNode.id === 'c-windows-fonts' && viewMode === 'similarity' ? (
                        <>
                            <div className='font-similarity-bar'>
                                <span>List fonts by similarity to:</span>
                                <select
                                    value={similarityBaseFont}
                                    onChange={e => setSimilarityBaseFont(e.target.value)}
                                >
                                    {sortedChildren.filter(c => c.fontUrl).map(c => (
                                        <option key={c.id} value={c.displayName ?? c.name}>
                                            {c.displayName ?? c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <table className='file-list similarity-list'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Similarity to {similarityBaseFont}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedChildren.map(item => (
                                        <tr
                                            key={item.id}
                                            className={selectedId === item.id ? 'selected' : ''}
                                            onClick={() => setSelectedId(item.id)}
                                            onDoubleClick={() => { if (item.fontUrl) onOpenFontView?.(item); }}
                                        >
                                            <td className='file-list-name'>
                                                <img src={item.icon ?? ''} alt='' className='file-list-icon' />
                                                {item.displayName ?? item.name}
                                            </td>
                                            <td className={`similarity-cell similarity-${item.similarity ?? 'not-similar'}`}>
                                                {item.similarity === 'very-similar'
                                                    ? 'Very similar'
                                                    : item.similarity === 'fairly-similar'
                                                        ? 'Fairly similar'
                                                        : 'Not similar'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : currentNode.hidden && !revealedHidden.has(currentNode.id) ? (
                        <HiddenFolderWarning onReveal={() => setRevealedHidden(prev => new Set(prev).add(currentNode.id))} />
                    ) : sortedChildren && sortedChildren.length > 0 ? (
                        viewMode === 'details' ? (
                            <table className='file-list'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Size</th>
                                        <th>Type</th>
                                        <th>Date Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedChildren.map(item => (
                                        <tr
                                            key={item.id}
                                            className={selectedId === item.id ? 'selected' : ''}
                                            onClick={() => setSelectedId(item.id)}
                                            onDoubleClick={() => {
                                                if (pickerMode === 'wallpaper' && item.type !== 'folder') {
                                                    const url = isPickableImage(item);
                                                    if (url) { onFilePicked?.(url); return; }
                                                    // Non-image in picker mode: ignore the double-click
                                                    return;
                                                }
                                                if (item.id === 'cp-fonts') {
                                                    navigateTo(['localdisc', 'c-windows', 'c-windows-fonts']);
                                                    return;
                                                }
                                                if (item.id === 'cp-display') {
                                                    onOpenDisplayProperties?.();
                                                    return;
                                                }
                                                if (item.type === 'folder') {
                                                    navigateTo([...path, item.id]);
                                                } else if (item.thumbnailUrl || item.imageUrl) {
                                                    handleViewerChange(item.id);
                                                } else if (item.name.endsWith('.lnk')) {
                                                    onOpenApp(item.id);
                                                    setSelectedId(null);
                                                }
                                                else if (item.name.endsWith('.txt') || item.name.endsWith('.md')) { 
                                                    openNotepad(item);
                                                }  else if (item.url) {
                                                    onOpenIE?.(item.url);
                                                }
                                                else if (item.name.endsWith('.mp3') || item.name.endsWith('.wav')) {
                                                    if (item.trackData) {
                                                        openWMP(item);
                                                    } else if (item.fontUrl) {
                                                        onOpenFontView?.(item);
                                                    }
                                                } else if (item.fontUrl) {
                                                    onOpenFontView?.(item);
                                                }
                                                }}
                                        >
                                            <td className='file-list-name'>
                                                <img src={item.icon ?? ''} alt='' className='file-list-icon' />
                                                {item.name}
                                            </td>
                                            <td>{item.size ?? ''}</td>
                                            <td>
                                                {item.type === 'folder'
                                                    ? 'File Folder'
                                                    : item.name.endsWith('.lnk')
                                                        ? 'Shortcut'
                                                        : 'File'}
                                            </td>

                                            <td>{item.modified ?? ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            sortedChildren.map(item => (
                                <div
                                    key={item.id}
                                    className={`file-grid-item${selectedId === item.id ? ' selected' : ''}`}
                                    onClick={() => setSelectedId(item.id)}
                                    onDoubleClick={() => {
                                        if (pickerMode === 'wallpaper' && item.type !== 'folder') {
                                            const url = isPickableImage(item);
                                            if (url) { onFilePicked?.(url); return; }
                                            // Non-image in picker mode: ignore the double-click
                                            return;
                                        }
                                        if (item.id === 'cp-fonts') {
                                            navigateTo(['localdisc', 'c-windows', 'c-windows-fonts']);
                                            return;
                                        }
                                        if (item.id === 'cp-display') {
                                            onOpenDisplayProperties?.();
                                            return;
                                        }
                                        if (item.type === 'folder') {
                                            navigateTo([...path, item.id]);
                                        } else if (item.thumbnailUrl || item.imageUrl) {
                                            handleViewerChange(item.id);
                                        } else if (item.name.endsWith('.lnk')) {
                                            onOpenApp(item.id);
                                            setSelectedId(null);
                                        } else if (item.name.endsWith('.txt') || item.name.endsWith('.md')) {
                                            openNotepad(item);
                                        } else if (item.url) {
                                            onOpenIE?.(item.url);
                                        }
                                        else if (item.name.endsWith('.mp3') || item.name.endsWith('.wav')) {
                                            if (item.trackData) {
                                                openWMP(item);
                                            }
                                        }
                                        else if (item.fontUrl) {
                                            onOpenFontView?.(item);
                                        }
                                    }}
                                >
                                    {viewMode === 'thumbnails' ? (
                                        <>
                                            <div className='file-grid-thumb'>
                                                {item.type === 'folder' && item.previewFolder ? (
                                                    <div className='folder-preview'>
                                                        {item.children?.filter(c => c.thumbnailUrl).slice(0, 4).map(c => (
                                                            <img key={c.id} src={c.thumbnailUrl} alt='' />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <img
                                                        className={`${item.thumbnailUrl ? 'is-thumbnail' : 'is-icon'}${item.largeThumbnail ? ' large' : ''}`}
                                                        src={item.thumbnailUrl ?? item.icon}
                                                        alt=''
                                                    />
                                                )}
                                            </div>
                                            <span className='file-grid-label'>{item.name}</span>
                                        </>
                                    ) : viewMode === 'tiles' ? (
                                        <>
                                            <img className='file-grid-icon' src={item.icon} alt='' />
                                            <div className='file-grid-info'>
                                                <span className='file-grid-label'>{item.name}</span>
                                                <span className='file-grid-meta'>
                                                    {item.type === 'folder' ? 'File Folder' : item.size ?? ''}
                                                </span>
                                            </div>
                                        </>
                                    ) : viewMode === 'list' ? (
                                        <>
                                            <img className='file-grid-icon' src={item.icon} alt='' />
                                            <span className='file-grid-label'>{item.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <img className='file-grid-icon' src={item.icon} alt='' />
                                            <span className='file-grid-label'>{item.name}</span>
                                        </>
                                    )}
                                </div>
                            ))
                        )
                    ) : (
                        <div className='file-empty'>This folder is empty.</div>
                    )}
                </div>
            </div>

            {/* tip of the day */}
            {showTipOfTheDay && (
                <TipOfTheDay onClose={onCloseTipOfTheDay} />
            )}

            {/* status bar */}
            {showStatusBar && (
                <div className='file-status-bar'>
                    <span className='file-status-count'>
                        {sortedChildren?.length ?? 0} object{(sortedChildren?.length ?? 0) !== 1 ? 's' : ''}
                    </span>
                    <span className='file-status-path'>
                        {breadcrumbs.map(c => c.name).join(' \\ ')}
                    </span>
                </div>
            )}
        </div>
    );
}

export default FileManagerApp