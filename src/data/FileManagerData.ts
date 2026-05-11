const base = import.meta.env.BASE_URL;

// Folders & system
import FolderClosedIcon from '../img/FolderClosed.webp';
import MyComputerIcon from '../img/MyComputer.webp';
import MyDocumentsIcon from '../img/MyDocuments.webp';
import MyPicturesIcon from '../img/MyPictures.webp';
import MyMusicIcon from '../img/MyMusic.webp';
import MyVideosIcon from '../img/MyVideos.webp';
import DesktopIcon from '../img/Desktop.webp';
import DownloadsIcon from '../img/Open.webp';
import LocalDisc from '../img/LocalDisk.webp';
import MyNetworkPlases from '../img/MyNetworkPlaces.webp';
// import Fonts from '../img/Fonts.webp'
import RemovableMedia from '../img/RemovableMedia.webp';
import RecycleBin from '../img/RecycleBinEmpty.webp';

// Tasks & actions
// import FolderOptions from '../img/FolderOptions.webp'
import ShareFolder from '../img/SharedFolder.webp';
import NewFolder from '../img/NewFolder.webp';
import MoveThisFolder from '../img/MoveThisFolder.webp';
// import MoveTo from '../img/MoveTo.webp'
// import ModeToFolder from '../img/MoveToFolder.webp'
import PublisToWeb from '../img/PublishToWeb.webp';
import RestoreAllItems from '../img/RestoreAllItems.webp';
import ExploreProperties from '../img/explorerProperties.webp';
import PlayAll from '../img/AllPrograms.webp';
import IEMedia from '../img/IE Media.webp';
import Copy from '../img/Copy.webp';
import CopyToDisc from '../img/CopyToDisc.webp';
import ExplorerDelete from '../img/ExplorerDelete.webp';
import ControlPanel from '../img/ControlPanel.webp';
import Programs from '../img/Programs.webp';
import Email from '../img/Email.webp';
import Rename from '../img/Rename.webp';
import PublishPhotosToWeb from '../img/PublishPhotosToWeb.webp';
import DisplayProperties from '../img/DisplayProperties.webp';

// Text & documents
import TxtIcon from '../img/TXT.webp';
import WRI from '../img/WRI.webp';
import INF from '../img/INF.webp';
import RTF from '../img/RTF.webp';
import HLP from '../img/HLP.webp';
import GenericTextDocument from '../img/GenericTextDocument.webp';
import GenericIcon from '../img/GenericDocument.webp';

// Images
import JpgIcon from '../img/JPG.webp';
import WmvIcon from '../img/WMV.webp';
import Gif from '../img/GIF.webp';
import TIFF from '../img/TIFF.webp';
import Bitmap from '../img/Bitmap.webp';
import ColorProfile from '../img/ColorProfile.webp';

// Web & code
import HTML from '../img/HTML.webp';
import XML from '../img/XML.webp';
import XSL from '../img/XSL.webp';
import CSS from '../img/CSS.webp';
import JavaScript from '../img/JavaScript.webp';
import VBS from '../img/VBS.webp';
import RegistryDocument from '../img/RegistryDocument.webp';

// Fonts
import TrueType from '../img/TrueType.webp';
import TrueType2 from '../img/TrueType2.webp';
import OpenType from '../img/OpenType.webp';
import Font2 from '../img/Font2.webp';
import Font from '../img/Font.webp';

// Audio & video
import GenericMedia from '../img/GenericMedia.webp';
import GenericAudio from '../img/GenericAudio.webp';
import GenericVideo from '../img/GenericVideo.webp';
import WMSPlaylist from '../img/WMSPlaylist.webp';
import MSWMM from '../img/MSWMM.webp';
import Camcorder from '../img/Camcorder.webp'

// System & misc
import Theme from '../img/Theme.webp';
import ZipIcon from '../img/ZipFolder.webp';
import ExeIcon from '../img/Programs.webp';
import LnkIcon from '../img/URL.webp';
import JournalTemplate from '../img/JournalTemplate.webp';
import JournalNote from '../img/JournalNote.webp';
import BLG from '../img/BLG.webp';
import DLL from '../img/DLL.webp';

// Applications
import Minesweeper from '../img/Minesweeper.webp';
import Paint from '../img/Paint.webp';
import Calculator from '../img/Calculator.webp';
import Notepad from '../img/Notepad.webp';
import InternetExplorer from '../img/InternetExplorer6.webp';
import CommandPrompt from '../img/CommandPrompt.webp';

export interface FMItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    icon: string;
    children?: FMItem[];
    size?: string;
    modified?: string;
    thumbnailUrl?: string; 
    previewFolder?: boolean;
    content?: string;
}

export const getFileIcon = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'md':
        case 'txt':            return TxtIcon;
        case 'rtf':            return RTF;
        case 'log':
        case 'ini':
        case 'cfg':            return GenericTextDocument;
        case 'jpg':
        case 'jpeg':
        case 'webp': 
        case 'png':            return JpgIcon;         
        case 'bmp':            return Bitmap;
        case 'tiff':           return TIFF;
        case 'gif':            return Gif;
        case 'html':
        case 'htm':            return HTML;
        case 'xml':            return XML;
        case 'css':            return CSS;
        case 'js':            return JavaScript;
        case 'xsl':            return XSL;
        case 'hlp':            return HLP;
        case 'theme':          return Theme;
        case 'wav':
        case 'mp3':            return GenericAudio;
        case 'wmv':            return WmvIcon;
        case 'mov':   
        case 'avi':
        case 'mp4':            return GenericVideo;
        case 'wma':
        case 'mid':
        case 'midi':
        case 'flv':
        case 'mkv':            return GenericMedia;
        case 'mswmm':          return MSWMM;
        case 'ttf':            return TrueType;
        case 'ttc':            return TrueType2;
        case 'otf':            return OpenType;
        case 'fon':            return Font2;
        case 'woff':
        case 'woff2':
        case 'eot':            return Font;
        case 'vbs':            return VBS;
        case 'reg':            return RegistryDocument;
        case 'zip':            return ZipIcon;
        case 'exe':            return ExeIcon;
        case 'dll':            return DLL;
        case 'lnk':            return LnkIcon;
        case 'wri':            return WRI;
        case 'inf':            return INF;
        case 'icc':
        case 'icm':            return ColorProfile;
        case 'jtp':            return JournalTemplate;
        case 'jnt':            return JournalNote;
        case 'blg':            return BLG;
        case 'wpl':
        case 'asx':            return WMSPlaylist;
        default:               return GenericIcon;
    }
};

export const FILE_SYSTEM: FMItem = {
    id: 'root',
    name: 'My Computer',
    type: 'folder',
    icon: MyComputerIcon,
    children: [
        {
            id: 'localdisc',
            name: 'Local Disk (C:)',
            type: 'folder',
            icon: LocalDisc,
            children: [
                // ── C:\WINDOWS ──────────────────────────────
                { 
                    id: 'c-windows', 
                    name: 'WINDOWS', 
                    type: 'folder', 
                    icon: FolderClosedIcon, 
                    modified: '10/05/2003', 
                    children: [
                        // C:\WINDOWS\system32
                        {
                            id: 'c-windows-system32',
                            name: 'system32',
                            type: 'folder',
                            icon: FolderClosedIcon,
                            modified: '10/05/2003',
                            children: [
                                { id: 'sys-spacecraft', name: 'user-spacecraft.webp', type: 'file', icon: JpgIcon, size: '92 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-spacecraft.webp` },
                                { id: 'sys-horses', name: 'user-horses.webp', type: 'file', icon: JpgIcon, size: '27 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-horses.webp` },
                                { id: 'sys-beach', name: 'user-beach.webp', type: 'file', icon: JpgIcon, size: '103 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-beach.webp` },
                                { id: 'sys-skate', name: 'user-skate.webp', type: 'file', icon: JpgIcon, size: '20 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-skate.webp` },
                                { id: 'sys-cherry', name: 'user-cherry.webp', type: 'file', icon: JpgIcon, size: '11 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-cherry.webp` },
                                { id: 'sys-astronaut', name: 'user-astronaut.webp', type: 'file', icon: JpgIcon, size: '64 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-astronaut.webp` },
                                { id: 'sys-flower', name: 'user-flower.jpg', type: 'file', icon: JpgIcon, size: '127 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-flower.jpg` },
                                { id: 'sys-ball', name: 'user-ball.jpg', type: 'file', icon: JpgIcon, size: '37 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-ball.jpg` },
                                { id: 'sys-guitar', name: 'user-guitar.webp', type: 'file', icon: JpgIcon, size: '16 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-guitar.webp` },
                                { id: 'sys-duck', name: 'user-duck.jpg', type: 'file', icon: JpgIcon, size: '26 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-duck.jpg` },
                                { id: 'sys-tropic', name: 'user-tropic.jpg', type: 'file', icon: JpgIcon, size: '52 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-tropic.jpg` },
                                { id: 'sys-water', name: 'user-water.webp', type: 'file', icon: JpgIcon, size: '24 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-water.webp` },
                                { id: 'sys-car', name: 'user-car.jpg', type: 'file', icon: JpgIcon, size: '63 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-car.jpg` },
                                { id: 'sys-snow', name: 'user-snow.jpg', type: 'file', icon: JpgIcon, size: '86 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-snow.jpg` },
                                { id: 'sys-butterfly', name: 'user-butterfly.webp', type: 'file', icon: JpgIcon, size: '39 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-butterfly.webp` },
                                { id: 'sys-fish', name: 'user-fish.jpg', type: 'file', icon: JpgIcon, size: '60 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-fish.jpg` },
                                { id: 'sys-bike', name: 'user-bike.webp', type: 'file', icon: JpgIcon, size: '22 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-bike.webp` },
                                { id: 'sys-dog', name: 'user-dog.jpg', type: 'file', icon: JpgIcon, size: '53 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-dog.jpg` },
                                { id: 'sys-chess', name: 'user-chess.jpg', type: 'file', icon: JpgIcon, size: '48 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-chess.jpg` },
                                { id: 'sys-cat', name: 'user-cat.jpg', type: 'file', icon: JpgIcon, size: '160 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-cat.jpg` },
                                { id: 'sys-frog', name: 'user-frog.jpg', type: 'file', icon: JpgIcon, size: '42 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-frog.jpg` },
                                { id: 'sys-suitcase', name: 'user-suitcase.jpg', type: 'file', icon: JpgIcon, size: '72 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/system32/user-suitcase.jpg` },
                            ],
                        },
                         // C:\WINDOWS\Web
                        {
                            id: 'c-windows-web',
                            name: 'Web',
                            type: 'folder',
                            icon: FolderClosedIcon,
                            modified: '10/05/2003',
                            children: [
                                // C:\WINDOWS\Web\Wallpaper
                                {
                                    id: 'c-windows-wallpaper',
                                    name: 'Wallpaper',
                                    type: 'folder',
                                    icon: FolderClosedIcon,
                                    previewFolder: true,
                                    modified: '10/05/2003',
                                    children: [
                                        { id: 'wall-power', name: 'Power.webp', type: 'file', icon: JpgIcon, size: '10 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Power.webp` },
                                        { id: 'wall-purpleflower', name: 'PurpleFlower.webp', type: 'file', icon: JpgIcon, size: '12 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/PurpleFlower.webp` },
                                        { id: 'wall-radiance', name: 'Radiance.webp', type: 'file', icon: JpgIcon, size: '21 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Radiance.webp` },
                                        { id: 'wall-redmoondessert', name: 'RedMoonDessert.webp', type: 'file', icon: JpgIcon, size: '31 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/RedMoonDessert.webp` },
                                        { id: 'wall-ripples', name: 'Ripples.webp', type: 'file', icon: JpgIcon, size: '12 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Ripples.webp` },
                                        { id: 'wall-stonehenge', name: 'Stonehenge.webp', type: 'file', icon: JpgIcon, size: '20 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Stonehenge.webp` },
                                        { id: 'wall-tulips', name: 'Tulips.webp', type: 'file', icon: JpgIcon, size: '38 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Tulips.webp` },
                                        { id: 'wall-vortecspace', name: 'VortecSpace.webp', type: 'file', icon: JpgIcon, size: '37 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/VortecSpace.webp` },
                                        { id: 'wall-windowsxp', name: 'WindowsXP.webp', type: 'file', icon: JpgIcon, size: '8 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/WindowsXP.webp` },
                                        { id: 'wall-wind', name: 'Wind.webp', type: 'file', icon: JpgIcon, size: '7 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Wind.webp` },
                                        { id: 'wall-azul', name: 'Azul.webp', type: 'file', icon: JpgIcon, size: '34 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Azul.webp` },
                                        { id: 'wall-autumn', name: 'Autumn.webp', type: 'file', icon: JpgIcon, size: '79 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Autumn.webp` },
                                        { id: 'wall-ascent', name: 'Ascent.webp', type: 'file', icon: JpgIcon, size: '9 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Ascent.webp` },
                                        { id: 'wall-bliss', name: 'Bliss.webp', type: 'file', icon: JpgIcon, size: '28 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Bliss.webp` },
                                        { id: 'wall-crystal', name: 'Crystal.webp', type: 'file', icon: JpgIcon, size: '7 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Crystal.webp` },
                                        { id: 'wall-follow', name: 'Follow.webp', type: 'file', icon: JpgIcon, size: '17 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Follow.webp` },
                                        { id: 'wall-friend', name: 'Friend.webp', type: 'file', icon: JpgIcon, size: '42 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Friend.webp` },
                                        { id: 'wall-home', name: 'Home.webp', type: 'file', icon: JpgIcon, size: '35 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Home.webp` },
                                        { id: 'wall-peace', name: 'Peace.webp', type: 'file', icon: JpgIcon, size: '4 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/Peace.webp` },
                                        { id: 'wall-moonflower', name: 'MoonFlower.webp', type: 'file', icon: JpgIcon, size: '15 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Web/Wallpaper/MoonFlower.webp` },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                // ── C:\Program Files ────────────────────────
                { id: 'c-progfiles', name: 'Program Files', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                // ── C:\Documents and Settings ───────────────
                {
                    id: 'c-documents',
                    name: 'Documents and Settings',
                    type: 'folder',
                    icon: FolderClosedIcon,
                    modified: '10/05/2003',
                    children: [
                        // C:\Documents and Settings\Administrator
                        {
                            id: 'c-admin',
                            name: 'Administrator',
                            type: 'folder',
                            icon: FolderClosedIcon,
                            modified: '10/05/2003',
                            children: [
                                // My Documents
                                {
                                    id: 'documents',
                                    name: 'My Documents',
                                    type: 'folder',
                                    icon: MyDocumentsIcon,
                                    modified: '10/05/2003',
                                    children: [
                                        { id: 'doc1', name: 'readme.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003' },
                                        { id: 'doc2', name: 'notes.txt', type: 'file', icon: TxtIcon, size: '2 KB', modified: '10/05/2003' },
                                        { id: 'doc3', name: 'todo.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003' },
                                        { id: 'doc4', name: 'diary.txt', type: 'file', icon: TxtIcon, size: '4 KB', modified: '10/05/2003' },
                                    ],
                                },
                                // My Pictures
                                {
                                    id: 'pictures',
                                    name: 'My Pictures',
                                    type: 'folder',
                                    icon: MyPicturesIcon,
                                    modified: '10/05/2003',
                                    children: [
                                        {
                                            id: 'pic-sample',
                                            name: 'Sample Pictures',
                                            type: 'folder',
                                            icon: FolderClosedIcon,
                                            previewFolder: true,
                                            modified: '10/05/2003',
                                            children: [
                                                { id: 'pic1', name: 'Blue Hills.jpg', type: 'file', icon: JpgIcon, size: '9 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/BlueHills.webp` },
                                                { id: 'pic2', name: 'Sunset.jpg', type: 'file', icon: JpgIcon, size: '23 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/Sunset.webp` },
                                                { id: 'pic3', name: 'Water Lilies.jpg', type: 'file', icon: JpgIcon, size: '46 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/WaterLillies.webp` },
                                                { id: 'pic4', name: 'Winter.jpg', type: 'file', icon: JpgIcon, size: '85 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/sample/Winter.webp` },
                                            ],
                                        },
                                        { id: 'pic-own1', name: 'Prisoners Dilema.webp', type: 'file', icon: JpgIcon, size: '43 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/prisoners-dilema.webp` },
                                        { id: 'pic-own2', name: 'Slot Game.webp', type: 'file', icon: JpgIcon, size: '14 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/slot-game.webp` },
                                        { id: 'pic-own3', name: 'Pacman Start.webp', type: 'file', icon: JpgIcon, size: '16 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/pacman-start.webp` },
                                        { id: 'pic-own4', name: 'Escape Room.webp', type: 'file', icon: JpgIcon, size: '7 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/escape-room.webp` },
                                        { id: 'pic-own5', name: 'Nu Pogodi Screen.webp', type: 'file', icon: JpgIcon, size: '30 KB', modified: '10/05/2003', thumbnailUrl: `${base}pictures/Nu-Pogodi-screen.webp` },
                                    ],
                                },
                                // My Music
                                {
                                    id: 'music',
                                    name: 'My Music',
                                    type: 'folder',
                                    icon: MyMusicIcon,
                                    modified: '28/04/2003',
                                    children: [
                                        { id: 'mus1', name: 'Windows XP Startup.wav', type: 'file', icon: GenericAudio, size: '424 KB', modified: '28/04/2003' },
                                        { id: 'mus2', name: 'Windows XP Shutdown.wav', type: 'file', icon: GenericAudio, size: '282 KB', modified: '28/04/2003' },
                                        { id: 'mus3', name: 'Windows XP Error.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '28/04/2003' },
                                    ],
                                },
                                // My Videos
                                {
                                    id: 'videos',
                                    name: 'My Videos',
                                    type: 'folder',
                                    icon: MyVideosIcon,
                                    modified: '28/04/2003',
                                    children: [
                                        { id: 'vid1', name: 'clip.wmv', type: 'file', icon: WmvIcon, size: '14,400 KB', modified: '28/04/2003' },
                                        { id: 'vid2', name: 'intro.wmv', type: 'file', icon: WmvIcon, size: '8,192 KB', modified: '28/04/2003' },
                                    ],
                                },
                                // Downloads
                                {
                                    id: 'downloads',
                                    name: 'Downloads',
                                    type: 'folder',
                                    icon: DownloadsIcon,
                                    modified: '28/04/2003',
                                    children: [
                                        { id: 'dl1', name: 'setup.exe', type: 'file', icon: ExeIcon, size: '14,400 KB', modified: '28/04/2003' },
                                        { id: 'dl2', name: 'patch_v1.2.exe', type: 'file', icon: ExeIcon, size: '2,048 KB', modified: '28/04/2003' },
                                        { id: 'dl3', name: 'wallpapers.zip', type: 'file', icon: ZipIcon, size: '8,192 KB', modified: '28/04/2003' },
                                    ],
                                },
                                // Desktop
                                {
                                    id: 'desktop',
                                    name: 'Desktop',
                                    type: 'folder',
                                    icon: DesktopIcon,
                                    modified: '28/04/2003',
                                    // Children come from getDesktopItems(apps) so sizes stay in sync with TERMINAL_APPS in App.tsx.
                                    children: [],
                                },
                            ],
                        },
                        // Shared Videos
                        {
                            id: 'shared-videos',
                            name: 'Shared Videos',
                            type: 'folder',
                            icon: MyVideosIcon,
                            modified: '28/04/2003',
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 'cdrom',
            name: 'CD Drive (D:)',
            type: 'folder',
            icon: RemovableMedia,
            children: [],
        },
        {
            id: 'recyclebin',
            name: 'Recycle Bin',
            type: 'folder',
            icon: RecycleBin,
            children: [],
        },
    ],
};

// Desktop items with dynamic sizes
export const getDesktopItems = (apps: { name: string; size: string }[]): FMItem[] => [
    { id: 'desk1', name: 'Minesweeper.lnk', type: 'file' as const, icon: Minesweeper, size: (apps.find(a => a.name === 'Minesweeper')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk2', name: 'Internet Explorer.lnk', type: 'file' as const, icon: InternetExplorer, size: (apps.find(a => a.name === 'Internet Explorer')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk3', name: 'Paint.lnk', type: 'file' as const, icon: Paint, size: (apps.find(a => a.name === 'Paint')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk4', name: 'Notepad.lnk', type: 'file' as const, icon: Notepad, size: (apps.find(a => a.name === 'Notepad')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk5', name: 'My Files.lnk', type: 'file' as const, icon: FolderClosedIcon, size: (apps.find(a => a.name === 'File Manager')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk6', name: 'Calculator.lnk', type: 'file' as const, icon: Calculator, size: (apps.find(a => a.name === 'Calculator')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk7', name: 'Terminal.lnk', type: 'file' as const, icon: CommandPrompt, size: (apps.find(a => a.name === 'Command Prompt')?.size ?? '1') + ' KB', modified: '28/04/2003' },
    { id: 'desk8', name: 'My Computer.lnk', type: 'file' as const, icon: MyComputerIcon, size: '1 KB', modified: '28/04/2003' },
    { id: 'desk9', name: 'Recycle Bin.lnk', type: 'file' as const, icon: RecycleBin, size: '1 KB', modified: '28/04/2003' },
];

export {
    // Folders & system
    MyPicturesIcon,
    MyMusicIcon,
    MyDocumentsIcon,
    MyVideosIcon,
    DesktopIcon,
    DownloadsIcon,
    RecycleBin,
    LocalDisc,
    RemovableMedia,
    MyNetworkPlases,
    // Tasks & actions
    GenericMedia,
    ShareFolder,
    NewFolder,
    Camcorder,
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
    PublishPhotosToWeb,
    DisplayProperties,
    ControlPanel,
};