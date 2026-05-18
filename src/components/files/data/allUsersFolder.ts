import type { FMItem } from './types';
import {
    base,
    FolderClosedIcon, MyDocumentsIcon, MyPicturesIcon, MyMusicIcon,
    MyVideosIcon, DesktopIcon, Favorites, JpgIcon, WmvIcon, GenericAudio,
} from './icons';
import { sharedProgramsChildren } from './alenaFolder';

// ── C:\Documents and Settings\All Users ──────────────────────────────────────
export const allUsersFolder: FMItem = {
    id: 'c-allusers',
    name: 'All Users',
    type: 'folder',
    icon: FolderClosedIcon,
    modified: '10/05/2003',
    children: [
        { id: 'c-allusers-desktop',  name: 'Desktop',    type: 'folder', icon: DesktopIcon,      modified: '10/05/2003', children: [] },
        { id: 'c-allusers-favorites',name: 'Favorites',  type: 'folder', icon: Favorites,        modified: '10/05/2003', children: [] },
        { id: 'c-allusers-startmenu',name: 'Start Menu', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
            { id: 'c-allusers-programs', name: 'Programs', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003',
                children: sharedProgramsChildren.map(item => ({ ...item, id: `allusers-${item.id}` })) },
        ]},

        // ── Shared Documents ─────────────────────────────────────────────────
        {
            id: 'c-allusers-docs',
            name: 'Shared Documents',
            type: 'folder',
            icon: MyDocumentsIcon,
            folderType: 'documents',
            modified: '10/05/2003',
            children: [
                { id: 'c-allusers-music', name: 'Shared Music', type: 'folder', icon: MyMusicIcon, folderType: 'music', modified: '10/05/2003', children: [
                    { id: 'c-allusers-music-sample', name: 'Sample Music', type: 'folder', icon: FolderClosedIcon, folderType: 'music', modified: '10/05/2003', children: [
                        { id: 'c-allusers-mus-scherzo', name: 'BeethovenNo9Scherzo.mp3',         type: 'file', icon: GenericAudio, size: '591 KB',    modified: '10/05/2003' },
                        { id: 'c-allusers-mus-highway', name: 'Highway Blues - New Stories.mp3', type: 'file', icon: GenericAudio, size: '11,573 KB', modified: '10/05/2003' },
                    ]},
                ]},
                { id: 'c-allusers-pics', name: 'Shared Pictures', type: 'folder', icon: MyPicturesIcon, folderType: 'pictures', modified: '10/05/2003', children: [
                    { id: 'c-allusers-pic1', name: 'Blue Hills.jpg',   type: 'file', icon: JpgIcon, size: '9 KB',  modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/BlueHills.webp` },
                    { id: 'c-allusers-pic2', name: 'Sunset.jpg',       type: 'file', icon: JpgIcon, size: '23 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/Sunset.webp` },
                    { id: 'c-allusers-pic3', name: 'Water Lilies.jpg', type: 'file', icon: JpgIcon, size: '46 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/WaterLillies.webp` },
                    { id: 'c-allusers-pic4', name: 'Winter.jpg',       type: 'file', icon: JpgIcon, size: '85 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/Winter.webp` },
                ]},
                { id: 'c-allusers-videos', name: 'Shared Video', type: 'folder', icon: MyVideosIcon, folderType: 'video', modified: '10/05/2003', children: [
                    { id: 'c-allusers-vid1', name: 'clip.wmv',  type: 'file', icon: WmvIcon, size: '14,400 KB', modified: '10/05/2003' },
                    { id: 'c-allusers-vid2', name: 'intro.wmv', type: 'file', icon: WmvIcon, size: '8,192 KB',  modified: '10/05/2003' },
                ]},
            ],
        },
    ],
};