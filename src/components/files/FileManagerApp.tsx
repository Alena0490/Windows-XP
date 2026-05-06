import { useState, useEffect, useMemo } from 'react'
import { FILE_SYSTEM } from '../../data/FileManagerData';
import type { FMItem } from '../../data/FileManagerData';

import FileManagerSidebar from './FileManagerSidebar';

import Forward from '../../img/Forward.webp'
import Back from '../../img/Back.webp'
import Up from '../../img/Up.webp'
import Search from '../../img/Search.webp'
import Folders from '../../img/FolderView.webp'
import Terminal from '../../img/CommandPrompt.webp'
import Favourites from '../../img/Favourites.webp'
import Go from '../../img/Go.webp'

//View
import Default from '../../img/Default.webp'
import ThumbnailView from '../../img/ThumbnailView.webp'
import DetailView from '../../img/DetailView.webp'
import TileView from '../../img/TileView.webp'
import IconView from '../../img/IconView.webp'


import './FileManagerApp.css'

interface FileManagerAppProps {
    onFolderChange: (name: string, icon: string) => void;
    initialPath?: string[];
}

const FileManagerApp = ({ onFolderChange, initialPath }: FileManagerAppProps) => {
    const [path, setPath] = useState<string[]>(initialPath ?? []);
    const [navHistory, setNavHistory] = useState<string[][]>([initialPath ?? []]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'default' | 'thumbnails' | 'tiles' | 'icons' | 'list'>('default');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // FOLDER NAVIGATION
    const navigateTo = (newPath: string[]) => {
        setPath(newPath);
        const trimmed = navHistory.slice(0, historyIndex + 1);
        setNavHistory([...trimmed, newPath]);
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

    useEffect(() => {
        const node = getNodeAtPath(path);
        onFolderChange(node.name, node.icon);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            className={`toolbar-dropdown-arrow toolbar-btn ${!canGoBack ? 'disabled' : ''}`}
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
                        <button type='button' className='toolbar-btn' aria-label='Terminal'>
                            <img className='toolbar-img' src={Terminal} alt='Terminal' />
                        </button>
                        <button type='button' className='toolbar-btn' aria-label='Favourites'>
                            <img className='toolbar-img' src={Favourites} alt='Favourites' />
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
                                    <button type='button' onClick={() => { setViewMode('default'); setViewDropdownOpen(false); }}>
                                        <img src={Default} alt='Default' /> Default
                                    </button>
                                    <button type='button' onClick={() => { setViewMode('thumbnails'); setViewDropdownOpen(false); }}>
                                        <img src={ThumbnailView} alt='Thumbnails' /> Thumbnails
                                    </button>
                                    <button type='button' onClick={() => { setViewMode('tiles'); setViewDropdownOpen(false); }}>
                                        <img src={TileView} alt='Tiles' /> Tiles
                                    </button>
                                    <button type='button' onClick={() => { setViewMode('icons'); setViewDropdownOpen(false); }}>
                                        <img src={IconView} alt='Icons' /> Icons
                                    </button>
                                    <button type='button' onClick={() => { setViewMode('list'); setViewDropdownOpen(false); }}>
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
                />
                <div className={`file-content ${viewMode}`}>
                    {currentNode.children && currentNode.children.length > 0 ? (
                        viewMode === 'list' ? (
                            <table className='file-list'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Size</th>
                                        <th>Date Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentNode.children.map(item => (
                                        <tr
                                            key={item.id}
                                            className={selectedId === item.id ? 'selected' : ''}
                                            onClick={() => setSelectedId(item.id)}
                                            onDoubleClick={() => item.type === 'folder' && navigateTo([...path, item.id])}
                                        >
                                            <td className='file-list-name'>
                                                <img src={item.icon} alt='' className='file-list-icon' />
                                                {item.name}
                                            </td>
                                            <td>{item.size ?? ''}</td>
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
                                    onDoubleClick={() => item.type === 'folder' && navigateTo([...path, item.id])}
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
        </div>
    );
}

export default FileManagerApp