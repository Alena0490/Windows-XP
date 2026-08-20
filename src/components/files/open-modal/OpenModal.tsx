import { useEffect, useMemo, useRef, useState } from 'react';
import useDraggable from '../../../hooks/useDraggable';
import { FILE_SYSTEM } from '../data/FileManagerData';
import type { FMItem } from '../data/types';

import Back from '../../../img/Back.webp';
import Up from '../../../img/Up.webp';
import NewFolder from '../../../img/NewFolder.webp';
import Details from '../../../img/DetailView.webp';
import Thumbnail from '../../../img/ThumbnailView.webp';
import Tiles from '../../../img/TileView.webp';
import Icons from '../../../img/IconView.webp';
import ListIcon from '../../../img/OEFolderList.webp';

import RecentDocuments from '../../../img/RecentDocuments.webp';
import Desktop from '../../../img/Desktop.webp';
import MyDocuments from '../../../img/MyDocuments.webp';
import MyComputer from '../../../img/MyComputer.webp';
import MyNetwork from '../../../img/MyNetworkPlaces.webp';
import FolderClosed from '../../../img/FolderClosed.webp';

import './OpenModal.css';
import '../../../App.css';

export interface FileTypeFilter {
    label: string;
    extensions: string[];
}

interface OpenModalProps {
    title?: string;
    initialPath?: string[];
    fileTypes?: FileTypeFilter[];
    onOpen: (item: FMItem) => void;
    onClose: () => void;
    style?: React.CSSProperties;
    isActive?: boolean;
    onMouseDown?: () => void;
}

type ViewMode = 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details';

const SIDEBAR_SHORTCUTS: { label: string; icon: string; path: string[] }[] = [
    { label: 'My Recent\nDocuments', icon: RecentDocuments, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
    { label: 'Desktop', icon: Desktop, path: ['localdisc', 'c-documents', 'c-admin', 'desktop'] },
    { label: 'My Documents', icon: MyDocuments, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
    { label: 'My Computer', icon: MyComputer, path: [] },
    { label: 'My Network', icon: MyNetwork, path: [] },
];

const getNodeAtPath = (path: string[]): FMItem => {
    let node = FILE_SYSTEM;
    for (const id of path) {
        const child = node.children?.find(c => c.id === id);
        if (!child) break;
        node = child;
    }
    return node;
};

const OpenModal = ({
    title = 'Open',
    initialPath = [],
    fileTypes,
    onOpen,
    onClose,
    style,
    isActive,
    onMouseDown,
}: OpenModalProps) => {
    const initialX = typeof style?.left === 'number'
        ? style.left
        : Math.round(window.innerWidth / 2 - 250);
    const initialY = typeof style?.top === 'number'
        ? style.top
        : Math.round(window.innerHeight / 2 - 210);
    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    const [path, setPath] = useState<string[]>(initialPath);
    const [history, setHistory] = useState<string[][]>([initialPath]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [viewMenuOpen, setViewMenuOpen] = useState(false);
    const [lookInOpen, setLookInOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(0);

    const viewMenuRef = useRef<HTMLDivElement>(null);
    const lookInRef = useRef<HTMLDivElement>(null);

    // Close popovers on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
                setViewMenuOpen(false);
            }
            if (lookInRef.current && !lookInRef.current.contains(e.target as Node)) {
                setLookInOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const currentNode = getNodeAtPath(path);
    const canGoBack = historyIndex > 0;
    const canGoUp = path.length > 0;

    const currentType = fileTypes?.[selectedType];
    const activeExtensions = currentType?.extensions ?? [];

    // Filter children by extension when a file type filter is active
    const matchesFilter = (item: FMItem): boolean => {
        if (item.type === 'folder') return true;
        if (!activeExtensions.length) return true;
        const lower = item.name.toLowerCase();
        return activeExtensions.some(ext => lower.endsWith(ext.toLowerCase()));
    };

    const sortedChildren = useMemo(() => {
        const kids = currentNode.children ?? [];
        return [...kids]
            .filter(matchesFilter)
            .sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNode, selectedType, fileTypes]);

    // Breadcrumbs for the "Look in" trail
    const breadcrumbs = useMemo(() => {
        const crumbs: { name: string; icon?: string; path: string[] }[] = [
            { name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
        ];
        let node = FILE_SYSTEM;
        const acc: string[] = [];
        for (const id of path) {
            const child = node.children?.find(c => c.id === id);
            if (!child) break;
            acc.push(id);
            crumbs.push({ name: child.name, icon: child.icon, path: [...acc] });
            node = child;
        }
        return crumbs;
    }, [path]);

    const currentCrumb = breadcrumbs[breadcrumbs.length - 1];

    const navigateTo = (newPath: string[]) => {
        setPath(newPath);
        const trimmed = history.slice(0, historyIndex + 1);
        setHistory([...trimmed, newPath]);
        setHistoryIndex(trimmed.length);
        setSelectedId(null);
        setLookInOpen(false);
    };

    const goBack = () => {
        if (!canGoBack) return;
        const idx = historyIndex - 1;
        setHistoryIndex(idx);
        setPath(history[idx]);
        setSelectedId(null);
    };

    const goUp = () => {
        if (!canGoUp) return;
        navigateTo(path.slice(0, -1));
    };

    const handleItemClick = (item: FMItem) => {
        setSelectedId(item.id);
        if (item.type !== 'folder') setFileName(item.name);
    };

    const handleItemDoubleClick = (item: FMItem) => {
        if (item.type === 'folder') {
            navigateTo([...path, item.id]);
            return;
        }
        onOpen(item);
    };

    const handleOpenClick = () => {
        if (selectedId) {
            const item = sortedChildren.find(c => c.id === selectedId);
            if (item) {
                if (item.type === 'folder') { navigateTo([...path, item.id]); return; }
                onOpen(item);
                return;
            }
        }
        // Fallback: try to match by typed file name
        if (fileName.trim()) {
            const match = sortedChildren.find(c => c.type !== 'folder' && c.name.toLowerCase() === fileName.trim().toLowerCase());
            if (match) onOpen(match);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleOpenClick(); }
        else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };

    // View mode options
    const viewOptions: { mode: ViewMode; icon: string; label: string }[] = [
        { mode: 'thumbnails', icon: Thumbnail, label: 'Thumbnails' },
        { mode: 'tiles',      icon: Tiles,     label: 'Tiles' },
        { mode: 'icons',      icon: Icons,     label: 'Icons' },
        { mode: 'list',       icon: ListIcon,  label: 'List' },
        { mode: 'details',    icon: Details,   label: 'Details' },
    ];

    return (
        <div
            className={['app-window', 'open-modal', isActive && 'app-window--active'].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            onMouseDown={onMouseDown}
            onKeyDown={handleKeyDown}
        >
            <div
                className='title-bar'
                onMouseDown={(e) => {
                    if ((e.target as HTMLElement).closest('.xp-title-control')) return;
                    handleMouseDown(e);
                }}
            >
                <span className='title-bar-text'>{title}</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label='Help'
                    >
                        ?
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className='open-modal-body'>
                {/* ── Top row: Look in + toolbar (spans full width) ──────── */}
                <div className='open-modal-topbar'>
                    <label className='open-modal-lookin-label'>Look in:</label>

                    <div className='open-modal-lookin' ref={lookInRef}>
                        <button
                            type='button'
                            className='open-modal-lookin-btn'
                            onClick={() => setLookInOpen(v => !v)}
                        >
                            <img src={currentCrumb.icon ?? FolderClosed} alt='' />
                            <span>{currentCrumb.name}</span>
                            <span className='open-modal-lookin-caret' aria-hidden='true' />
                        </button>
                        {lookInOpen && (
                            <ul className='open-modal-lookin-menu'>
                                {breadcrumbs.map((crumb, i) => (
                                    <li
                                        key={i}
                                        className={i === breadcrumbs.length - 1 ? 'is-current' : ''}
                                        style={{ paddingLeft: `${i * 12 + 6}px` }}
                                        onClick={() => navigateTo(crumb.path)}
                                    >
                                        <img src={crumb.icon ?? FolderClosed} alt='' />
                                        <span>{crumb.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='open-modal-toolbar'>
                        <button
                            type='button'
                            className={`open-modal-tool-btn${!canGoBack ? ' disabled' : ''}`}
                            onClick={goBack}
                            aria-label='Back'
                        >
                            <img src={Back} alt='Back' />
                        </button>
                        <button
                            type='button'
                            className={`open-modal-tool-btn${!canGoUp ? ' disabled' : ''}`}
                            onClick={goUp}
                            aria-label='Up One Level'
                        >
                            <img src={Up} alt='Up' />
                        </button>
                        <button
                            type='button'
                            className='open-modal-tool-btn disabled'
                            aria-label='Create New Folder'
                        >
                            <img src={NewFolder} alt='New Folder' />
                        </button>
                        <div className='open-modal-view-wrap' ref={viewMenuRef}>
                            <button
                                type='button'
                                className='open-modal-tool-btn open-modal-view-btn'
                                onClick={() => setViewMenuOpen(v => !v)}
                                aria-label='Views'
                            >
                                <img src={viewOptions.find(v => v.mode === viewMode)?.icon ?? Details} alt='Views' />
                                <span className='open-modal-view-caret'>▾</span>
                            </button>
                            {viewMenuOpen && (
                                <ul className='open-modal-view-menu'>
                                    {viewOptions.map(opt => (
                                        <li
                                            key={opt.mode}
                                            className={opt.mode === viewMode ? 'is-current' : ''}
                                            onClick={() => { setViewMode(opt.mode); setViewMenuOpen(false); }}
                                        >
                                            <img src={opt.icon} alt='' />
                                            <span>{opt.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Content row: sidebar + (files + footer) ───────────── */}
                <div className='open-modal-content-row'>
                    <div className='open-modal-sidebar'>
                        {SIDEBAR_SHORTCUTS.map((s, i) => {
                            const isActiveShortcut = JSON.stringify(path) === JSON.stringify(s.path);
                            return (
                                <button
                                    key={i}
                                    type='button'
                                    className={`open-modal-shortcut${isActiveShortcut ? ' is-active' : ''}`}
                                    onClick={() => navigateTo(s.path)}
                                >
                                    <img src={s.icon} alt='' />
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className='open-modal-column'>
                {/* ── File list ─────────────────────────────────────────── */}
                <div className={`open-modal-files open-modal-files--${viewMode}`}>
                        {sortedChildren.length === 0 ? (
                            <div className='open-modal-empty'>This folder is empty.</div>
                        ) : viewMode === 'details' ? (
                            <table className='open-modal-details'>
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
                                            onClick={() => handleItemClick(item)}
                                            onDoubleClick={() => handleItemDoubleClick(item)}
                                        >
                                            <td>
                                                <img src={item.icon ?? FolderClosed} alt='' />
                                                {item.name}
                                            </td>
                                            <td>{item.size ?? ''}</td>
                                            <td>{item.type === 'folder' ? 'File Folder' : (item.name.endsWith('.lnk') ? 'Shortcut' : 'File')}</td>
                                            <td>{item.modified ?? ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            sortedChildren.map(item => (
                                <div
                                    key={item.id}
                                    className={`open-modal-item${selectedId === item.id ? ' selected' : ''}`}
                                    onClick={() => handleItemClick(item)}
                                    onDoubleClick={() => handleItemDoubleClick(item)}
                                >
                                    {viewMode === 'thumbnails' ? (
                                        <>
                                            <div className='open-modal-item-thumb'>
                                                <img
                                                    className={item.thumbnailUrl ? 'is-thumbnail' : 'is-icon'}
                                                    src={item.thumbnailUrl ?? item.icon ?? FolderClosed}
                                                    alt=''
                                                />
                                            </div>
                                            <span className='open-modal-item-label'>{item.name}</span>
                                        </>
                                    ) : viewMode === 'tiles' ? (
                                        <>
                                            <img className='open-modal-item-icon' src={item.icon ?? FolderClosed} alt='' />
                                            <div className='open-modal-item-info'>
                                                <span className='open-modal-item-label'>{item.name}</span>
                                                <span className='open-modal-item-meta'>
                                                    {item.type === 'folder' ? 'File Folder' : item.size ?? ''}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <img className='open-modal-item-icon' src={item.icon ?? FolderClosed} alt='' />
                                            <span className='open-modal-item-label'>{item.name}</span>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                {/* ── Bottom row: filename + type + buttons ───────────────── */}
                <div className='open-modal-footer'>
                    <div className='open-modal-footer-fields'>
                        <div className='open-modal-field-row'>
                            <label htmlFor='open-modal-filename'>File name:</label>
                            <div className='open-modal-select-wrapper'>
                                <input
                                    id='open-modal-filename'
                                    type='text'
                                    className='open-modal-input'
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                />
                                <span className='open-modal-select-arrow' aria-hidden='true' />
                            </div>
                        </div>
                        <div className='open-modal-field-row'>
                            <label htmlFor='open-modal-filetype'>Files of type:</label>
                            <div className='open-modal-select-wrapper'>
                                <select
                                    id='open-modal-filetype'
                                    className='open-modal-input'
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(Number(e.target.value))}
                                    disabled={!fileTypes || fileTypes.length === 0}
                                >
                                    {(fileTypes && fileTypes.length > 0
                                        ? fileTypes
                                        : [{ label: 'All Files', extensions: [] }]
                                    ).map((t, i) => (
                                        <option key={i} value={i}>{t.label}</option>
                                    ))}
                                </select>
                                <span className='open-modal-select-arrow' aria-hidden='true' />
                            </div>
                        </div>
                    </div>
                    <div className='open-modal-footer-buttons'>
                        <button type='button' className='luna-btn' onClick={handleOpenClick}>Open</button>
                        <button type='button' className='luna-btn secondary' onClick={onClose}>Cancel</button>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenModal;
