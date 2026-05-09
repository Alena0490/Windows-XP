import { useState, useEffect, useRef } from 'react';
import { FILE_SYSTEM } from '../../data/FileManagerData';
import type { FMItem } from '../../data/FileManagerData';
import './FileManagerSidebar.css';

import MyDocumentsIcon from '../../img/MyDocuments.webp';
import MyPicturesIcon from '../../img/MyPictures.webp';
import MyMusicIcon from '../../img/MyMusic.webp';
import MyVideosIcon from '../../img/MyVideos.webp';
import DownloadsIcon from '../../img/Open.webp';
import DesktopIcon from '../../img/Desktop.webp';

interface FileManagerSidebarProps {
    path: string[];
    navigateTo: (newPath: string[]) => void;
    currentNode: FMItem;
    selectedItem: FMItem | null;
    showOtherPlaces: boolean;
}

const PERSONAL_SHORTCUTS = [
    { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
    { id: 'pictures',  name: 'My Pictures',  icon: MyPicturesIcon,  path: ['localdisc', 'c-documents', 'c-admin', 'pictures'] },
    { id: 'music',     name: 'My Music',     icon: MyMusicIcon,     path: ['localdisc', 'c-documents', 'c-admin', 'music'] },
    { id: 'videos',    name: 'My Videos',    icon: MyVideosIcon,    path: ['localdisc', 'c-documents', 'c-admin', 'videos'] },
    { id: 'downloads', name: 'Downloads',    icon: DownloadsIcon,   path: ['localdisc', 'c-documents', 'c-admin', 'downloads'] },
    { id: 'desktop',   name: 'Desktop',      icon: DesktopIcon,     path: ['localdisc', 'c-documents', 'c-admin', 'desktop'] },
];

const FileManagerSidebar = ({ 
    path, 
    navigateTo, 
    currentNode, 
    selectedItem,
    showOtherPlaces
}: FileManagerSidebarProps) => {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const sidebarRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const toggleGroup = (id: string) => {
        setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const updateSidebarArrows = () => {
        const sidebar = sidebarRef.current;
        const wrap = wrapRef.current;
        if (!sidebar || !wrap) return;
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight;
        wrap.classList.toggle('show-top-arrow', isScrollable);
        wrap.classList.toggle('show-bottom-arrow', isScrollable);
    };

    useEffect(() => {
        setTimeout(updateSidebarArrows, 0);
        const sidebar = sidebarRef.current;
        if (!sidebar) return;
        sidebar.addEventListener('scroll', updateSidebarArrows);
        window.addEventListener('resize', updateSidebarArrows);
        return () => {
            sidebar.removeEventListener('scroll', updateSidebarArrows);
            window.removeEventListener('resize', updateSidebarArrows);
        };
    }, [collapsed]);

    // Determine which shortcuts to show in Other Places
    const isInsideLocalDisc = path[0] === 'localdisc';
    const otherPlaces = isInsideLocalDisc
        ? PERSONAL_SHORTCUTS
        : FILE_SYSTEM.children?.map(child => ({
            id: child.id,
            name: child.name,
            icon: child.icon,
            path: [child.id],
        })) ?? [];

    // Details panel — selected item or current folder
    const detailsItem = selectedItem ?? currentNode;
    const detailsType = detailsItem.type === 'folder' ? 'File Folder' : (detailsItem.name.split('.').pop()?.toUpperCase() ?? 'File') + ' File';

    return (
        <div ref={wrapRef} className='fm-sidebar-wrap'>
            <div ref={sidebarRef} className='fm-sidebar'>

                {/* System Tasks */}
                    <div className='fm-task-group'>
                        <div className='fm-task-header' onClick={() => toggleGroup('system')}>
                            <span>System Tasks</span>
                            <span className='fm-task-chevron'>{collapsed['system'] ? '»' : '«'}</span>
                        </div>
                        {!collapsed['system'] && (
                            <div className='fm-task-body'>
                                <button type='button' className='fm-task-link' onClick={() => navigateTo([])}>
                                    <img src={FILE_SYSTEM.icon} alt='' className='fm-task-icon' />
                                    My Computer
                                </button>
                            </div>
                        )}
                    </div>

                {/* Other Places */}
                {showOtherPlaces && (
                    <div className='fm-task-group'>
                        <div className='fm-task-header' onClick={() => toggleGroup('places')}>
                            <span>Other Places</span>
                            <span className='fm-task-chevron'>{collapsed['places'] ? '»' : '«'}</span>
                        </div>
                        {!collapsed['places'] && (
                            <div className='fm-task-body'>
                                {otherPlaces.map(place => (
                                    <button
                                        key={place.id}
                                        type='button'
                                        className={`fm-task-link${path.join('/') === place.path.join('/') ? ' active' : ''}`}
                                        onClick={() => navigateTo(place.path)}
                                    >
                                        <img src={place.icon} alt='' className='fm-task-icon' />
                                        {place.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Details  */}
                    <div className='fm-task-group'>
                        <div className='fm-task-header' onClick={() => toggleGroup('details')}>
                            <span>Details</span>
                            <span className='fm-task-chevron'>{collapsed['details'] ? '»' : '«'}</span>
                        </div>
                        {!collapsed['details'] && (
                            <div className='fm-task-body fm-task-details'>
                                <img src={detailsItem.icon} alt='' className='fm-details-icon' />
                                <div className='fm-details-name'>{detailsItem.name}</div>
                                <div className='fm-details-type'>{detailsType}</div>
                                {detailsItem.size && (
                                    <div className='fm-details-date'>Size: {detailsItem.size}</div>
                                )}
                                {detailsItem.modified && (
                                    <div className='fm-details-date'>Date: {detailsItem.modified}</div>
                                )}
                            </div>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default FileManagerSidebar;