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
}

export const getFileIcon = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'txt':            return TxtIcon;
        case 'rtf':            return RTF;
        case 'log':
        case 'ini':
        case 'cfg':            return GenericTextDocument;
        case 'jpg':
        case 'jpeg':
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
                { id: 'c-windows', name: 'WINDOWS', type: 'folder', icon: FolderClosedIcon, modified: '28/04/2003', children: [] },
                { id: 'c-progfiles', name: 'Program Files', type: 'folder', icon: FolderClosedIcon, modified: '28/04/2003', children: [] },
                {
                    id: 'c-documents',
                    name: 'Documents and Settings',
                    type: 'folder',
                    icon: FolderClosedIcon,
                    modified: '28/04/2003',
                    children: [
                        {
                            id: 'c-admin',
                            name: 'Administrator',
                            type: 'folder',
                            icon: FolderClosedIcon,
                            modified: '28/04/2003',
                            children: [
                                {
                                    id: 'documents',
                                    name: 'My Documents',
                                    type: 'folder',
                                    icon: MyDocumentsIcon,
                                    modified: '28/04/2003',
                                    children: [
                                        { id: 'doc1', name: 'readme.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'doc2', name: 'notes.txt', type: 'file', icon: TxtIcon, size: '2 KB', modified: '28/04/2003' },
                                        { id: 'doc3', name: 'todo.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'doc4', name: 'diary.txt', type: 'file', icon: TxtIcon, size: '4 KB', modified: '28/04/2003' },
                                    ],
                                },
                                {
                                    id: 'pictures',
                                    name: 'My Pictures',
                                    type: 'folder',
                                    icon: MyPicturesIcon,
                                    modified: '28/04/2003',
                                    children: [
                                        { id: 'pic1', name: 'wallpaper.jpg', type: 'file', icon: JpgIcon, size: '512 KB', modified: '28/04/2003' },
                                        { id: 'pic2', name: 'screenshot.jpg', type: 'file', icon: JpgIcon, size: '256 KB', modified: '28/04/2003' },
                                        { id: 'pic3', name: 'photo.jpg', type: 'file', icon: JpgIcon, size: '1,024 KB', modified: '28/04/2003' },
                                    ],
                                },
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
                                {
                                    id: 'desktop',
                                    name: 'Desktop',
                                    type: 'folder',
                                    icon: DesktopIcon,
                                    modified: '28/04/2003',
                                    children: [
                                        { id: 'desk1', name: 'Minesweeper.lnk', type: 'file', icon: Minesweeper, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk2', name: 'Internet Explorer.lnk', type: 'file', icon: InternetExplorer, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk3', name: 'Paint.lnk', type: 'file', icon: Paint, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk4', name: 'Notepad.lnk', type: 'file', icon: Notepad, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk5', name: 'My Files.lnk', type: 'file', icon: FolderClosedIcon, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk6', name: 'Calculator.lnk', type: 'file', icon: Calculator, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk7', name: 'Terminal.lnk', type: 'file', icon: CommandPrompt, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk8', name: 'My Computer.lnk', type: 'file', icon: MyComputerIcon, size: '1 KB', modified: '28/04/2003' },
                                        { id: 'desk9', name: 'Recycle Bin.lnk', type: 'file', icon: RecycleBin, size: '1 KB', modified: '28/04/2003' },
                                    ],
                                },
                            ],
                        },
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
export const getDesktopItems = (apps: { name: string; size: string }[]) => [
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