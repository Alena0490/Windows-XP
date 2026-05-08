import { useState, useEffect, useRef, useMemo } from 'react'
import { FILE_SYSTEM } from '../../data/FileManagerData';
import type { FMItem } from '../../data/FileManagerData';

import FileManagerSidebar from './FileManagerSidebar';

import Forward from '../../img/Forward.webp'
import Back from '../../img/Back.webp'
import Up from '../../img/Up.webp'
import Search from '../../img/Search.webp'
import Folders from '../../img/FolderView.webp'
import Go from '../../img/Go.webp'

//View
import Default from '../../img/FolderViewClassic.webp'
import ThumbnailView from '../../img/ThumbnailView.webp'
import DetailView from '../../img/DetailView.webp'
import TileView from '../../img/TileView.webp'
import IconView from '../../img/IconView.webp'

import './FileManagerApp.css'

interface FileManagerAppProps {
    onFolderChange: (name: string, icon: string) => void;
    initialPath?: string[];
    onOpenApp: (id: string) => void;
    pathKey: number;
    viewMode: 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details';
    onViewChange: (mode: 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details') => void;
    onNavigationChange?: (
        canGoBack: boolean, 
        canGoForward: boolean, 
        canGoUp: boolean, 
        goBack: () => void, 
        goForward: () => void, 
        goUp: () => void
    ) => void;
    showStatusBar: boolean;
}

const FileManagerApp = ({ 
    onFolderChange, 
    initialPath, 
    onOpenApp, 
    pathKey,
    viewMode,
    onViewChange, 
    onNavigationChange,
    showStatusBar
}: FileManagerAppProps) => {
    const [path, setPath] = useState<string[]>(initialPath ?? []);
    const [navHistory, setNavHistory] = useState<string[][]>([initialPath ?? []]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // FOLDER NAVIGATION

    const navigateTo = (newPath: string[]) => {
        setPath(newPath);
        const trimmed = navHistory.slice(0, historyIndex + 1);
        const newHistory = [...trimmed, newPath];
        setNavHistory(newHistory);
        setHistoryIndex(trimmed.length);
        const node = getNodeAtPath(newPath);
        onFolderChange(node.name, node.icon);
    };

    const goBack = () => {
        if (historyIndex === 0) return;
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setPath(navHistory[newIndex]);
        const node = getNodeAtPath(navHistory[newIndex]);
        onFolderChange(node.name, node.icon);
    };

    const goForward = () => {
        if (historyIndex === navHistory.length - 1) return;
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setPath(navHistory[newIndex]);
        const node = getNodeAtPath(navHistory[newIndex]);
        onFolderChange(node.name, node.icon);
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
        onFolderChange(node.name, node.icon);
        updateNav(historyIndex, navHistory.length, path.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        updateNav(historyIndex, navHistory.length, path.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historyIndex, navHistory, path]);

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
        onFolderChange(node.name, node.icon);
        updateNav(0, 1, newPath.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathKey]);

    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < navHistory.length - 1;
    const canGoUp = path.length > 0;
    const currentNode = getNodeAtPath(path);
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

    return (
        <div className='file-app'>

            {/* ── Toolbar ── */}
            <div className='file-toolbars'>
                <div className='file-toolbar'>
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
                        <button type='button' className='toolbar-btn' aria-label='Search'>
                            <img className='toolbar-img' src={Search} alt='Search' />
                            Search
                        </button>
                        <button type='button' className='toolbar-btn border-right' aria-label='Folders'>
                            <img className='toolbar-img' src={Folders} alt='Folders' />
                            Folders
                        </button>
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
                                        <img src={Default} alt='List' /> List
                                    </button>
                                    <button type='button' className={viewMode === 'details' ? 'is-active' : ''} onClick={() => { onViewChange('details'); setViewDropdownOpen(false); }}>
                                        <img src={DetailView} alt='Details' /> Details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Address Bar ── */}
                    <div className='file-toolbar-bottom'>
                        <div className='left'>
                            <span>Address</span>
                            <div className='input-wrapper'>
                                <img
                                    className='toolbar-img-xs absolute'
                                    src={currentNode.icon}
                                    alt=''
                                />
                                <input
                                    type='text'
                                    className='address-bar'
                                    value={breadcrumbs.map(c => c.name).join(' \\ ')}
                                    readOnly
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
                </div>
            </div>

            <div className='file-main'>
                <FileManagerSidebar
                    path={path}
                    navigateTo={navigateTo}
                    currentNode={currentNode}
                    selectedItem={currentNode.children?.find(c => c.id === selectedId) ?? null}
                />
                <div className={`file-content ${viewMode}`}>
                    {currentNode.children && currentNode.children.length > 0 ? (
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
                                    {currentNode.children.map(item => (
                                        <tr
                                            key={item.id}
                                            className={selectedId === item.id ? 'selected' : ''}
                                            onClick={() => setSelectedId(item.id)}
                                            onDoubleClick={() => {
                                                if (item.type === 'folder') {
                                                    navigateTo([...path, item.id]);
                                                } else if (item.name.endsWith('.lnk')) {
                                                    onOpenApp(item.id);
                                                    setSelectedId(null);
                                                }
                                            }}
                                        >
                                            <td className='file-list-name'>
                                                <img src={item.icon} alt='' className='file-list-icon' />
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
                            currentNode.children.map(item => (
                                <div
                                    key={item.id}
                                    className={`file-grid-item${selectedId === item.id ? ' selected' : ''}`}
                                    onClick={() => setSelectedId(item.id)}
                                    onDoubleClick={() => {
                                        if (item.type === 'folder') {
                                            navigateTo([...path, item.id]);
                                        } else if (item.name.endsWith('.lnk')) {
                                            onOpenApp(item.id);
                                            setSelectedId(null);
                                        }
                                    }}
                                >
                                    {viewMode === 'thumbnails' ? (
                                        <>
                                            <div className='file-grid-thumb'>
                                                <img
                                                    className={item.thumbnailUrl ? 'is-thumbnail' : 'is-icon'}
                                                    src={item.thumbnailUrl ?? item.icon}
                                                    alt=''
                                                />
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

            {/* status bar */}
            {showStatusBar && (
                <div className='file-status-bar'>
                    <span className='file-status-count'>
                        {currentNode.children?.length ?? 0} object{(currentNode.children?.length ?? 0) !== 1 ? 's' : ''}
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