import { useState } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import type { FMItem } from './data/types';
import { FILE_SYSTEM } from './data/FileManagerData';
import CriticalError from '../CriticalError';
import Plus from '../../img/Luna/plus.png'
import Minus from '../../img/Luna/minus.png'
import XPScrollbar from '../XPScrollbar';
import './MoveCopyDialog.css';
import '../../App.css';

interface MoveCopyDialogProps {
    mode: 'move' | 'copy';
    item: FMItem;
    currentParentId: string;
    onConfirm: (targetId: string) => void;
    onClose: () => void;
    isActive?: boolean;
    onMouseDown?: () => void;
    getExtraChildren?: (parentId: string) => FMItem[];
    isDeleted?: (itemId: string) => boolean;
    onNewFolder?: (parentId: string) => void;
}

const MoveCopyDialog = ({
    mode,
    item,
    currentParentId,
    onConfirm,
    onClose,
    isActive,
    onMouseDown,
    getExtraChildren,
    isDeleted,
    onNewFolder,
}: MoveCopyDialogProps) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showInvalidLocation, setShowInvalidLocation] = useState(false);

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 190),
        Math.round(window.innerHeight / 2 - 130)
    );

    const toggle = (id: string) => setExpanded(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        return next;
    });

    const childrenOf = (node: FMItem) => [
        ...(node.children ?? []),
        ...(getExtraChildren?.(node.id) ?? []),
    ].filter(c => !isDeleted?.(c.id) && c.id !== 'recyclebin');

    const renderNode = (node: FMItem, depth: number) => {
        if (node.id === item.id) return null;
        if (node.type !== 'folder') return null;
        const kids = childrenOf(node).filter(c => c.type === 'folder');
        return (
            <div key={node.id}>
                <div
                    className={`mc-row${selectedId === node.id ? ' selected' : ''}`}
                    style={{ paddingLeft: depth * 16 }}
                    onClick={() => setSelectedId(node.id)}
                >
                    {kids.length > 0 ? (
                        <span className='mc-toggle' onClick={(e) => { e.stopPropagation(); toggle(node.id); }}>
                            <img
                                className='mc-toggle-icon'
                                src={expanded.has(node.id) ? Minus : Plus}
                                alt={expanded.has(node.id) ? 'Collapse' : 'Expand'}
                            />
                        </span>
                    ) : (
                        <span className='mc-toggle mc-toggle--empty' />
                    )}
                    <img className='mc-icon' src={node.icon} alt='' />
                    <span className='mc-label'>{node.name}</span>
                </div>
                {expanded.has(node.id) && kids.map(c => renderNode(c, depth + 1))}
            </div>
        );
    };

    const handleMakeNewFolder = () => {
        if (!selectedId) return;
        if (selectedId === 'root') {
            setShowInvalidLocation(true);
            return;
        }
        onNewFolder?.(selectedId);
        setExpanded(prev => new Set(prev).add(selectedId));
    };

    const isSameLocation = selectedId === currentParentId;
    const canConfirm = !!selectedId && selectedId !== 'root' && !isSameLocation;

    const title = mode === 'move' ? 'Move Items' : 'Copy Items';
    const actionLabel = mode === 'move' ? 'Move' : 'Copy';

    return (
        <>
            <div
                className={['app-window', 'move-copy-dialog', isActive && 'app-window--active'].filter(Boolean).join(' ')}
                style={{ left: position.x, top: position.y }}
                onMouseDown={onMouseDown}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && canConfirm) onConfirm(selectedId!);
                    if (e.key === 'Escape') onClose();
                }}
                tabIndex={-1}
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
                            aria-label='Help'
                        ></button>
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

                <div className='move-copy-body'>
                    <p className='move-copy-hint'>
                        Select the place where you want to {mode} '{item.name}'. Then click the {actionLabel} button.
                    </p>

                    <div className='mc-tree'>
                        <XPScrollbar className='mc-tree-scroll'>
                            {renderNode(FILE_SYSTEM, 0)}
                        </XPScrollbar>
                    </div>

                    <p className='move-copy-hint'>To view any subfolders, click a plus sign above.</p>

                    <div className='save-as-buttons'>
                        <button
                            type='button'
                            className='luna-btn secondary'
                            disabled={!selectedId}
                            onClick={handleMakeNewFolder}
                        >
                            Make New Folder
                        </button>
                        <button
                            type='button'
                            id='xp-default-btn'
                            className='luna-btn'
                            disabled={!canConfirm}
                            onClick={() => canConfirm && onConfirm(selectedId!)}
                        >
                            {actionLabel}
                        </button>
                        <button type='button' className='luna-btn secondary' onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {showInvalidLocation && createPortal(
                <CriticalError
                    type='invalidLocation'
                    onClose={() => setShowInvalidLocation(false)}
                />,
                document.body
            )}
        </>
    );
};

export default MoveCopyDialog;