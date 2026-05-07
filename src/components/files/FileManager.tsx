import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';

import MyComputer from '../../img/MyComputer.webp'

import FileManagerMenu from './FileManagerMenu';
import FileManagerApp from './FileManagerApp';

import '../../App.css';
import './FileManager.css'

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
    pathKey
}:FileMabagerProps) => {

    const [currentFolder, setCurrentFolder] = useState('My Computer');
    const [currentFolderIcon, setCurrentFolderIcon] = useState(MyComputer);
    const [viewMode, setViewMode] = useState<'default' | 'thumbnails' | 'tiles' | 'icons' | 'list'>('default');


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
            />

    </div>
  )
}

export default FileManager