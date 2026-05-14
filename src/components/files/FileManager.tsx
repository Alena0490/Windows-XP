import { useState, useRef } from 'react';
import type { WMPTrack } from '../../types/WMPTrack';

import useDraggable from '../../hooks/useDraggable';
import MyComputer from '../../img/MyComputer.webp';

import FileManagerMenu from './FileManagerMenu';
import FileManagerApp from './FileManagerApp';

import '../../App.css';
import './FileManager.css';

interface FileMabagerProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    initialPath?: string[];
    onOpenApp: (id: string) => void;
    onTitleChange: (name: string, icon: string) => void;
    pathKey: number;
    onOpenIE: () => void;
    apps: { name: string; size: string }[];
    onOpenNotepad?: (content: string, fileName: string) => void;
    onOpenWMP?: (tracks: WMPTrack[], startIndex: number) => void;
}

const FileManager = ({
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onClose,
    onMouseDown,
    initialPath,
    onOpenApp,
    onTitleChange,
    pathKey,
    onOpenIE,
    apps,
    onOpenNotepad,
    onOpenWMP,
}: FileMabagerProps) => {

    const [currentFolder, setCurrentFolder] = useState('My Computer');
    const [currentFolderIcon, setCurrentFolderIcon] = useState(MyComputer);
    const [viewMode, setViewMode] = useState<'thumbnails' | 'tiles' | 'icons' | 'list' | 'details'>('thumbnails');
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [canGoUp, setCanGoUp] = useState(false);
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'type' | 'modified'>('name');
    const [showStandardButtons, setShowStandardButtons] = useState(true);
    const [showAddressBar, setShowAddressBar] = useState(true);
    const [showOtherPlaces, setShowOtherPlaces] = useState(true);
    const [showTipOfTheDay, setShowTipOfTheDay] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const goBackRef = useRef<() => void>(() => {});
    const goForwardRef = useRef<() => void>(() => {});
    const goUpRef = useRef<() => void>(() => {});

    const { position, handleMouseDown } = useDraggable(400, 150);

  return (
    <div
        className={[
            'app-window',
            'file-window',
                isMinimized && 'file--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'file--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='file-icon' src={currentFolderIcon} alt='Folder Icon' />
                    {currentFolder}            
                </span>
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
                        onClick={() => {
                            setIsMinimized(false);
                            setIsFullscreen(prev => !prev);
                        }}
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

            
            <FileManagerMenu
                onClose={onClose}
                viewMode={viewMode}
                onViewChange={setViewMode}
                onGoBack={() => goBackRef.current()}
                onGoForward={() => goForwardRef.current()}
                onGoUp={() => goUpRef.current()}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                canGoUp={canGoUp}
                onOpenIE={onOpenIE}
                showStatusBar={showStatusBar}
                onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                sortBy={sortBy}
                onSortChange={setSortBy}
                showStandardButtons={showStandardButtons}
                onToggleStandardButtons={() => setShowStandardButtons(prev => !prev)}
                showAddressBar={showAddressBar}
                onToggleAddressBar={() => setShowAddressBar(prev => !prev)}
                showOtherPlaces={showOtherPlaces}
                onToggleOtherPlaces={() => setShowOtherPlaces(prev => !prev)}
                showTipOfTheDay={showTipOfTheDay}
                onToggleDetails={() => setShowTipOfTheDay(prev => !prev)}
                showHistory={showHistory}
                onToggleHistory={() => setShowHistory(prev => !prev)}
            />

           
            <FileManagerApp
                initialPath={initialPath}
                onFolderChange={(name, icon) => {
                    setCurrentFolder(name);
                    setCurrentFolderIcon(icon);
                    onTitleChange(name, icon);
                }}
                onOpenApp={onOpenApp}
                pathKey={pathKey}
                viewMode={viewMode}
                onViewChange={setViewMode}
                onNavigationChange={(back, forward, up, goBackFn, goForwardFn, goUpFn) => {
                    setCanGoBack(back);
                    setCanGoForward(forward);
                    setCanGoUp(up);
                    goBackRef.current = goBackFn;
                    goForwardRef.current = goForwardFn;
                    goUpRef.current = goUpFn;
                }}
                showStatusBar={showStatusBar}
                sortBy={sortBy}
                showStandardButtons={showStandardButtons}
                showAddressBar={showAddressBar}
                showOtherPlaces={showOtherPlaces}
                showTipOfTheDay={showTipOfTheDay}
                onCloseTipOfTheDay={() => setShowTipOfTheDay(false)}
                showHistory={showHistory}
                onCloseHistory={() => setShowHistory(false)}
                apps={apps}
                onOpenNotepad={onOpenNotepad}
                onOpenWMP={onOpenWMP}
            />
    </div>
  )
}

export default FileManager