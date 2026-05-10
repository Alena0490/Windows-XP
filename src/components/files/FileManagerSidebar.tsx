import { useState, useEffect, useRef } from 'react';
import type { FMItem } from '../../data/FileManagerData';
import {
    // System
    FILE_SYSTEM,
    LocalDisc,
    MyNetworkPlases,
    RecycleBin,
    RemovableMedia,
    // Personal folders
    MyDocumentsIcon,
    MyPicturesIcon,
    MyMusicIcon,
    MyVideosIcon,
    DesktopIcon,
    DownloadsIcon,
    // Tasks & actions
    ShareFolder,
    NewFolder,
    MoveThisFolder,
    PublisToWeb,
    RestoreAllItems,
    ExploreProperties,
    PlayAll,
    IEMedia,
    Copy,
    CopyToDisc,
    ExplorerDelete,
    Programs,
    Email,
    Rename,
    Camcorder,
    PublishPhotosToWeb,
    DisplayProperties,
    ControlPanel,
} from '../../data/FileManagerData';
import './FileManagerSidebar.css';

interface FileManagerSidebarProps {
    path: string[];
    navigateTo: (newPath: string[]) => void;
    currentNode: FMItem;
    selectedItem: FMItem | null;
    showOtherPlaces: boolean;
    apps: { name: string; size: string }[];
}

const PERSONAL_SHORTCUTS = [
    { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
    { id: 'pictures',  name: 'My Pictures',  icon: MyPicturesIcon,  path: ['localdisc', 'c-documents', 'c-admin', 'pictures'] },
    { id: 'music',     name: 'My Music',     icon: MyMusicIcon,     path: ['localdisc', 'c-documents', 'c-admin', 'music'] },
    { id: 'videos',    name: 'My Videos',    icon: MyVideosIcon,    path: ['localdisc', 'c-documents', 'c-admin', 'videos'] },
    { id: 'downloads', name: 'Downloads',    icon: DownloadsIcon,   path: ['localdisc', 'c-documents', 'c-admin', 'downloads'] },
    { id: 'desktop',   name: 'Desktop',      icon: DesktopIcon,     path: ['localdisc', 'c-documents', 'c-admin', 'desktop'] },
    { id: 'recyclebin', name: 'Recycle Bin', icon: RecycleBin, path: ['recyclebin'] },
];

const FileManagerSidebar = ({ 
    path, 
    navigateTo, 
    currentNode, 
    selectedItem,
    showOtherPlaces,
    apps,
}: FileManagerSidebarProps) => {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const sidebarRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const toggleGroup = (id: string) => {
        setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Tasks from the Context
    // File tasks — shown when a file is selected
    const fileTasks = [
        { icon: Rename, label: 'Rename this file' },
        { icon: MoveThisFolder, label: 'Move this file' },
        { icon: Copy, label: 'Copy this file' },
        { icon: PublisToWeb, label: 'Publish this file to the Web' },
        { icon: Email, label: 'E-mail this file' },
        { icon: ExplorerDelete, label: 'Delete this file' },
    ];

    // Folder tasks — shown when no file is selected
    const folderTaskItems = [
        { icon: NewFolder, label: 'Make a new folder' },
        { icon: PublisToWeb, label: 'Publish this folder to the Web' },
        { icon: ShareFolder, label: 'Share this folder' },
    ];

    // Context-aware task groups
    const getTasks = () => {
        const secondaryTasks = selectedItem?.type === 'file' ? fileTasks : folderTaskItems;

        // System tasks
        if (currentNode.id === 'root') {
            return {
                title: 'System Tasks',
                items: [
                    { icon: ExploreProperties, label: 'View system information' },
                    { icon: Programs, label: 'Add or remove programs' },
                    { icon: ControlPanel, label: 'Change a setting' },
                ],
                folderTasks: null,
            };
        }
        // Music tasks
        if (currentNode.id === 'music') {
            return {
                title: 'Music Tasks',
                items: [
                    { icon: PlayAll, label: 'Play all' },
                    { icon: IEMedia, label: 'Shop for music online' },
                    { icon: CopyToDisc, label: 'Copy all items to audio CD' },
                ],
                folderTasks: secondaryTasks,
            };
        }
        // Video Tasks
        if (currentNode.id === 'videos') {
            return {
                title: 'Video Tasks',
                items: [
                    { icon: PlayAll, label: 'Play all' },
                    { icon: CopyToDisc, label: 'Copy to CD' },
                    { icon: Camcorder, label: 'Get videos from camera or scanner' },
                    { icon: IEMedia, label: 'Shop for videos online' },
                ],
                folderTasks: secondaryTasks,
            };
        }
        // Picture Tasks
        if (currentNode.id === 'pictures') {
            return {
                title: 'Picture Tasks',
                items: selectedItem?.type === 'file' ? [
                    { icon: DisplayProperties, label: 'View as a slide show' },
                    { icon: PublishPhotosToWeb, label: 'Order prints online' },
                    { icon: Copy, label: 'Print pictures' },
                    { icon: CopyToDisc, label: 'Copy all items to CD' },
                    { icon: IEMedia, label: 'Shop for pictures online' },
                ] : [
                    { icon: DisplayProperties, label: 'View as a slide show' },
                    { icon: PublishPhotosToWeb, label: 'Order prints online' },
                    { icon: Copy, label: 'Print pictures' },
                    { icon: CopyToDisc, label: 'Copy all items to CD' },
                ],
                folderTasks: secondaryTasks,
            };
        }
        // Reccycle Bin tasks
        if (currentNode.id === 'recyclebin') {
            return {
                title: 'Recycle Bin Tasks',
                items: [
                    { icon: RecycleBin, label: 'Empty the Recycle Bin' },
                    { icon: RestoreAllItems, label: 'Restore all items' },
                ],
                folderTasks: null,
            };
        }

        if (currentNode.id === 'desktop') {
            return {
                title: 'File and Folder Tasks',
                items: [
                    { icon: PublisToWeb, label: 'Publish the selected items to the Web' },
                    { icon: Email, label: 'E-mail the selected items' },
                    { icon: ExplorerDelete, label: 'Delete the selected items' },
                ],
                folderTasks: null,
            };
        }
        // Basic tasks
        return {
            title: 'File and Folder Tasks',
            items: secondaryTasks,
            folderTasks: null,
        };
    };

    const tasks = getTasks();

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

    // Other Places — context-aware shortcuts
    const getOtherPlaces = () => {
        if (currentNode.id === 'root') {
            return [
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
                { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
                { id: 'localdisc', name: 'Local Disk (C:)', icon: LocalDisc, path: ['localdisc'] },
            ];
        }
        if (currentNode.id === 'music') {
            return [
                { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
                { id: 'music', name: 'My Music', icon: MyMusicIcon, path: ['localdisc', 'c-documents', 'c-admin', 'music'] },
                { id: 'root', name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
            ];
        }
        if (currentNode.id === 'pictures') {
            return [
                { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
                { id: 'pictures', name: 'My Pictures', icon: MyPicturesIcon, path: ['localdisc', 'c-documents', 'c-admin', 'pictures'] },
                { id: 'root', name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
            ];
        }
        if (currentNode.id === 'videos') {
            return [
                { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
                { id: 'videos', name: 'My Videos', icon: MyVideosIcon, path: ['localdisc', 'c-documents', 'c-admin', 'videos'] },
                { id: 'shared-videos', name: 'Shared Videos', icon: MyVideosIcon, path: ['localdisc', 'c-documents', 'shared-videos'] },
                { id: 'root', name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
            ];
        }
        if (currentNode.id === 'downloads') {
            return [
                { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
                { id: 'root', name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
            ];
        }

        if (currentNode.id === 'documents') {
            return [
                { id: 'root', name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
            ];
        }

        if (currentNode.id === 'desktop') {
            return [
                { id: 'documents', name: 'My Documents', icon: MyDocumentsIcon, path: ['localdisc', 'c-documents', 'c-admin', 'documents'] },
                { id: 'root', name: 'My Computer', icon: FILE_SYSTEM.icon, path: [] },
                { id: 'network', name: 'My Network Places', icon: MyNetworkPlases, path: [] },
            ];
        }

        if (currentNode.id === 'recyclebin') {
            return [
                { id: 'localdisc', name: 'Local Disk (C:)', icon: LocalDisc, path: ['localdisc'] },
                { id: 'cdrom', name: 'CD Drive (D:)', icon: RemovableMedia, path: ['cdrom'] },
                { id: 'recyclebin', name: 'Recycle Bin', icon: RecycleBin, path: ['recyclebin'] },
            ];
        }
        return PERSONAL_SHORTCUTS;
    };

    const otherPlaces = getOtherPlaces();

    // Details panel — selected item or current folder
    // FilE Size
    const getSize = () => {
        if (detailsItem.name.endsWith('.lnk')) {
            const nameMap: Record<string, string> = {
                'Terminal': 'Command Prompt',
                'My Files': 'File Manager',
                'My Computer': 'File Manager',
            };
            const appName = detailsItem.name.replace('.lnk', '');
            const mappedName = nameMap[appName] ?? appName;
            const app = apps.find(a => a.name === mappedName);
            return app ? app.size + ' KB' : detailsItem.size;
        }
        return detailsItem.size;
    };

    const detailsItem = selectedItem ?? currentNode;
    const detailsType = currentNode.id === 'recyclebin' && !selectedItem
    ? 'System Folder'
    : detailsItem.type === 'folder'
        ? 'File Folder'
        : (detailsItem.name.split('.').pop()?.toUpperCase() ?? 'File') + ' File';

    return (
        <div ref={wrapRef} className='fm-sidebar-wrap'>
            <div ref={sidebarRef} className='fm-sidebar'>

               {/* Tasks */}
                <div className='fm-task-group'>
                    <div className='fm-task-header' onClick={() => toggleGroup('tasks')}>
                        <span>{tasks.title}</span>
                        <span className='fm-task-chevron'>{collapsed['tasks'] ? '»' : '«'}</span>
                    </div>
                    {!collapsed['tasks'] && (
                        <div className='fm-task-body'>
                            {tasks.items.map((item, index) => (
                                <button key={index} type='button' className='fm-task-link' onClick={() => {}}>
                                    <img src={item.icon} alt='' className='fm-task-icon' />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* File and Folder Tasks */}
                {tasks.folderTasks && (
                    <div className='fm-task-group'>
                        <div className='fm-task-header' onClick={() => toggleGroup('foldertasks')}>
                            <span>File and Folder Tasks</span>
                            <span className='fm-task-chevron'>{collapsed['foldertasks'] ? '»' : '«'}</span>
                        </div>
                        {!collapsed['foldertasks'] && (
                            <div className='fm-task-body'>
                                {tasks.folderTasks.map((item, index) => (
                                    <button key={index} type='button' className='fm-task-link' onClick={() => {}}>
                                        <img src={item.icon} alt='' className='fm-task-icon' />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

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
                                    <div className='fm-details-date'>Size: {getSize()}</div>
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