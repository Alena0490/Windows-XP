import type { FMItem } from './types';
import {
    base,
    FolderClosedIcon, MyDocumentsIcon, MyPicturesIcon, MyMusicIcon,
    MyVideosIcon, DesktopIcon, DownloadsIcon, Favorites, DAT,
    TxtIcon, JpgIcon, WmvIcon, GenericAudio, Gif,
    InternetExplorer, Paint, Notepad, Calculator, CommandPrompt, Minesweeper, Solitaire, MediaPlayer,
    beethovenCover, newStoriesCover, disc1Cover, disc2Cover, Bitmap, LnkIcon 
} from './icons';

import README_CONTENT from '../../../../README.md?raw';
import NOTES_CONTENT from '../../../../public/documents/notes.txt?raw';
import DIARY_CONTENT from '../../../../public/documents/diary.txt?raw';
import TODO_CONTENT from '../../../../public/documents/todo.txt?raw';

// ── SHARED PROGRAMS — used by both Alena and All Users ───────────────────────
export const sharedProgramsChildren: FMItem[] = [
    { id: 'prog-ie', name: 'Internet Explorer.lnk', type: 'file', icon: InternetExplorer, size: '1 KB', modified: '10/05/2003' },
    { id: 'prog-accessories', name: 'Accessories', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
        { id: 'prog-paint',   name: 'Paint.lnk',          type: 'file', icon: Paint,        size: '1 KB', modified: '10/05/2003' },
        { id: 'prog-notepad', name: 'Notepad.lnk',        type: 'file', icon: Notepad,       size: '1 KB', modified: '10/05/2003' },
        { id: 'prog-calc',    name: 'Calculator.lnk',     type: 'file', icon: Calculator,    size: '1 KB', modified: '10/05/2003' },
        { id: 'prog-cmd',     name: 'Command Prompt.lnk', type: 'file', icon: CommandPrompt, size: '1 KB', modified: '10/05/2003' },
    ]},
    { id: 'prog-entertainment', name: 'Entertainment', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
        { id: 'prog-mediaplayer', name: 'Windows Media Player.lnk', type: 'file', icon: MediaPlayer, size: '1 KB', modified: '10/05/2003' },
    ]},
    { id: 'prog-games', name: 'Games', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
        { id: 'prog-minesweeper', name: 'Minesweeper.lnk', type: 'file', icon: Minesweeper, size: '1 KB', modified: '10/05/2003' },
        { id: 'prog-solitaire',   name: 'Solitaire.lnk',   type: 'file', icon: Solitaire,   size: '1 KB', modified: '10/05/2003' },
    ]},
    { id: 'prog-startup', name: 'Startup', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
];

// ── C:\Documents and Settings\Alena\My Documents ─────────────────────────────
// In this app's tree pictures/music/videos/downloads are SIBLINGS of My Documents
// (not children of it), because Start Menu shortcuts navigate to them directly via
// ['localdisc','c-documents','c-admin', <id>] paths.
const myDocumentsFolder: FMItem = {
    id: 'documents',
    name: 'My Documents',
    type: 'folder',
    icon: MyDocumentsIcon,
    folderType: 'documents',
    modified: '10/05/2003',
    children: [
        { id: 'doc-readme', name: 'About this project.md', type: 'file', icon: TxtIcon, size: '4 KB', modified: '12/05/2026', content: README_CONTENT },
        { id: 'doc-notes',  name: 'notes.txt',             type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003', content: NOTES_CONTENT },
        { id: 'doc-diary',  name: 'diary.txt',             type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003', content: DIARY_CONTENT },
        { id: 'doc-todo',   name: 'todo.txt',              type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003', content: TODO_CONTENT },
    ],
};

const picturesFolder: FMItem = {
    id: 'pictures',
    name: 'My Pictures',
    type: 'folder',
    icon: MyPicturesIcon,
    folderType: 'pictures',
    modified: '10/05/2003',
    children: [
        {
            id: 'pic-sample',
            name: 'Sample Pictures',
            type: 'folder',
            icon: FolderClosedIcon,
            previewFolder: true,
            folderType: 'pictures',
            modified: '10/05/2003',
            children: [
                { id: 'pic1', name: 'Blue Hills.jpg',   type: 'file', icon: JpgIcon, size: '9 KB',  modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/BlueHills.webp` },
                { id: 'pic2', name: 'Sunset.jpg',       type: 'file', icon: JpgIcon, size: '23 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/Sunset.webp` },
                { id: 'pic3', name: 'Water Lilies.jpg', type: 'file', icon: JpgIcon, size: '46 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/WaterLillies.webp` },
                { id: 'pic4', name: 'Winter.jpg',       type: 'file', icon: JpgIcon, size: '85 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/Winter.webp` },
            ],
        },
        { id: 'pic-own1', name: 'Prisoners Dilema.webp', type: 'file', icon: JpgIcon, size: '43 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/prisoners-dilema.webp` },
        { id: 'pic-own2', name: 'Slot Game.webp',         type: 'file', icon: JpgIcon, size: '14 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/slot-game.webp` },
        { id: 'pic-own3', name: 'Pacman Start.webp',      type: 'file', icon: JpgIcon, size: '16 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/pacman-start.webp` },
        { id: 'pic-own4', name: 'Escape Room.webp',       type: 'file', icon: JpgIcon, size: '7 KB',  modified: '10/05/2003', thumbnailUrl: `${base}pictures/escape-room.webp` },
        { id: 'pic-own5', name: 'Nu Pogodi Screen.webp',  type: 'file', icon: JpgIcon, size: '30 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/Nu-Pogodi-screen.webp` },
    ],
};

const musicFolder: FMItem = {
    id: 'music',
    name: 'My Music',
    type: 'folder',
    icon: MyMusicIcon,
    folderType: 'music',
    modified: '12/05/2026',
    children: [
        { id: 'mus-music',   name: 'music.bmp',     type: 'file', icon: Bitmap,  size: '103 KB',  modified: '10/05/2003', imageUrl: `${base}music/music.bmp`},
        { id: 'mus-ode', name: 'BeethovenOdeToJoy.mp3', type: 'file', icon: GenericAudio, size: '2,872 KB', modified: '12/05/2003',
            trackData: { name: 'Ode to Joy', url: `${base}music/BeethovenOdeToJoy.mp3`, artist: 'Ludwig van Beethoven', album: 'Symphony No. 9', cover: beethovenCover } },
        {
            id: 'music-sample',
            name: 'Sample Music',
            type: 'folder',
            icon: FolderClosedIcon,
            folderType: 'music',
            modified: '12/05/2026',
            children: [
                { id: 'mus-scherzo', name: 'BeethovenNo9Scherzo.mp3',         type: 'file', icon: GenericAudio, size: '591 KB',    modified: '12/05/2026',
                    trackData: { name: 'Symphony No. 9',          url: `${base}music/Sample Music/BeethovenNo9Scherzo.mp3`,         artist: 'Ludwig van Beethoven', album: 'Symphony No. 9', cover: beethovenCover } },
                { id: 'mus-highway', name: 'Highway Blues - New Stories.mp3', type: 'file', icon: GenericAudio, size: '11,573 KB', modified: '12/05/2026',
                    trackData: { name: 'New Stories (Highway Blues)', url: `${base}music/Sample Music/Highway Blues - New Stories.mp3`, artist: 'Marc Seales', album: 'Speakin Out', cover: newStoriesCover } },
            ],
        },
        { id: 'mus-computer-error', name: 'Computer Error (Abrade Remix).mp3',      type: 'file', icon: GenericAudio, size: '7,912 KB', modified: '12/05/2026', trackData: { name: 'Computer Error', url: `${base}music/Computer Error (Abrade Remix).mp3`,      artist: 'Abrade',       cover: disc2Cover } },
        { id: 'mus-play-ball',      name: 'Play Ball - Matt Ridgway.mp3',            type: 'file', icon: GenericAudio, size: '27 KB',     modified: '12/05/2026', trackData: { name: 'Play Ball',      url: `${base}music/Play Ball - Matt Ridgway.mp3`,            artist: 'Matt Ridgway', cover: disc1Cover } },
        { id: 'mus-startup',        name: 'Start Up (End of Support Remix).mp3',     type: 'file', icon: GenericAudio, size: '2,308 KB', modified: '12/05/2026', trackData: { name: 'Start Up',       url: `${base}music/Start Up (End of Support Remix).mp3`,     cover: disc2Cover } },
        { id: 'mus-win-error',      name: 'Windows Error (Electric Goat Remix).mp3', type: 'file', icon: GenericAudio, size: '5,793 KB', modified: '12/05/2026', trackData: { name: 'Windows Error',  url: `${base}music/Windows Error (Electric Goat Remix).mp3`, cover: disc2Cover } },
        { id: 'mus-exclamation',    name: 'Exclamation (Phant Remix).mp3',           type: 'file', icon: GenericAudio, size: '2,731 KB', modified: '12/05/2026', trackData: { name: 'Exclamation',    url: `${base}music/Exclamation (Phant Remix).mp3`,           cover: disc2Cover } },
        { id: 'mus-velkommen',      name: 'Velkommen (Stray Objects Remix).mp3',     type: 'file', icon: GenericAudio, size: '8,111 KB', modified: '12/05/2026', trackData: { name: 'Velkommen',      url: `${base}music/Velkommen (Stray Objects Remix).mp3`,     cover: disc2Cover } },
        { id: 'mus-xp-sounds',      name: 'XP Sounds (SomethingUnreal Remix).mp3',   type: 'file', icon: GenericAudio, size: '2,685 KB', modified: '12/05/2026', trackData: { name: 'XP Sounds',      url: `${base}music/XP Sounds (SomethingUnreal Remix).mp3`,   cover: disc2Cover } },
        { id: 'mus-xp-skelly',      name: 'Windows XP (skelly Remix).mp3',           type: 'file', icon: GenericAudio, size: '5,121 KB', modified: '12/05/2026', trackData: { name: 'Windows XP',     url: `${base}music/Windows XP (skelly Remix).mp3`,           cover: disc2Cover } },
    ],
};

const videosFolder: FMItem = {
    id: 'videos',
    name: 'My Videos',
    type: 'folder',
    icon: MyVideosIcon,
    folderType: 'video',
    modified: '28/04/2003',
    children: [
        { id: 'vid1', name: 'clip.wmv',  type: 'file', icon: WmvIcon, size: '14,400 KB', modified: '28/04/2003' },
        { id: 'vid2', name: 'intro.wmv', type: 'file', icon: WmvIcon, size: '8,192 KB',  modified: '28/04/2003' },
    ],
};

const downloadsFolder: FMItem = {
    id: 'downloads',
    name: 'Downloads',
    type: 'folder',
    icon: DownloadsIcon,
    modified: '12/05/2026',
    children: [
        { id: 'dl-epocha',      name: 'epocha.jpg',          type: 'file', icon: JpgIcon, size: '22 KB',  modified: '12/05/2026', thumbnailUrl: `${base}downloads/epocha.jpg` },
        { id: 'dl-witch',       name: 'witch.jpg',           type: 'file', icon: JpgIcon, size: '22 KB',  modified: '12/05/2026', thumbnailUrl: `${base}downloads/witch.jpg` },
        { id: 'dl-donald',      name: 'donald-the-duck.jpg', type: 'file', icon: JpgIcon, size: '19 KB',  modified: '12/05/2026', thumbnailUrl: `${base}downloads/donald-the-duck.jpg` },
        { id: 'dl-prirucka',    name: 'prirucka.png',        type: 'file', icon: JpgIcon, size: '106 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/prirucka.png` },
        { id: 'dl-w3c',         name: 'w3c.gif',             type: 'file', icon: Gif,     size: '1 KB',   modified: '12/05/2026', thumbnailUrl: `${base}downloads/w3c.gif` },
        { id: 'dl-icqdownload', name: 'icqdownload.gif',     type: 'file', icon: Gif,     size: '7 KB',   modified: '12/05/2026', thumbnailUrl: `${base}downloads/icqdownload.gif` },
        { id: 'dl-phone',       name: 'phone.jpg',           type: 'file', icon: JpgIcon, size: '11 KB',  modified: '12/05/2026', thumbnailUrl: `${base}downloads/phone.jpg` },
        { id: 'dl-nokia2',      name: 'nokia2.jpg',          type: 'file', icon: JpgIcon, size: '9 KB',   modified: '12/05/2026', thumbnailUrl: `${base}downloads/nokia2.jpg` },
        { id: 'dl-garfield',    name: 'Garfield.png',        type: 'file', icon: JpgIcon, size: '5 KB',   modified: '12/05/2026', thumbnailUrl: `${base}downloads/Garfield.png` },
    ],
};

// ── C:\Documents and Settings\Alena ──────────────────────────────────────────
export const alenaFolder: FMItem = {
    id: 'c-admin',
    name: 'Alena',
    type: 'folder',
    icon: FolderClosedIcon,
    modified: '10/05/2003',
    children: [
        { id: 'c-alena-cookies', name: 'Cookies', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
            { id: 'c-alena-cookie-index', name: 'index.dat', type: 'file', icon: DAT, size: '16 KB', modified: '10/05/2003' },
        ]},
        { id: 'c-alena-favorites',  name: 'Favorites',   type: 'folder', icon: Favorites,       modified: '10/05/2003', children: [
            { id: 'fav-msn',           name: 'MSN.com.url',              type: 'file', icon: LnkIcon , size: '1 KB', modified: '10/05/2003' },
            { id: 'fav-radio',         name: 'Radio Station Guide.url',  type: 'file', icon: LnkIcon , size: '1 KB', modified: '10/05/2003' },
            { id: 'fav-windowsmedia',  name: 'Windows Media.url',        type: 'file', icon: LnkIcon , size: '1 KB', modified: '10/05/2003' },
        ] },
        { id: 'c-alena-startmenu',  name: 'Start Menu',  type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
            { id: 'c-alena-programs', name: 'Programs', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003',
                children: sharedProgramsChildren.map(item => ({ ...item, id: `alena-${item.id}` })) },
        ]},
        myDocumentsFolder,
        picturesFolder,
        musicFolder,
        videosFolder,
        downloadsFolder,
        { id: 'desktop', name: 'Desktop', type: 'folder', icon: DesktopIcon, modified: '28/04/2003', children: [] },
    ],
};