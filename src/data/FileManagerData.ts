import FolderClosedIcon from '../img/FolderClosed.webp';
import MyComputerIcon from '../img/MyComputer.webp';
import MyDocumentsIcon from '../img/MyDocuments.webp';
import MyPicturesIcon from '../img/MyPictures.webp';
import MyMusicIcon from '../img/MyMusic.webp';
import MyVideosIcon from '../img/MyVideos.webp';
import DesktopIcon from '../img/Desktop.webp';
import DownloadsIcon from '../img/Open.webp';
import TxtIcon from '../img/TXT.webp';
import JpgIcon from '../img/JPG.webp';
import WmvIcon from '../img/WMV.webp';
import ZipIcon from '../img/ZipFolder.webp';
import ExeIcon from '../img/Programs.webp';
import LnkIcon from '../img/URL.webp';
import GenericIcon from '../img/GenericDocument.webp';
import Gif from '../img/GIF.webp'
import HTML from '../img/HTML.webp'
import XML from '../img/XML.webp'
import XSL from '../img/XSL.webp'
import HLP from '../img/HLP.webp'
import Theme from '../img/Theme.webp'
import GenericAudio from '../img/GenericAudio.webp';
import GenericVideo from '../img/GenericVideo.webp';
import LocalDisc from '../img/LocalDisk.webp'
import RemovableMedia from '../img/RemovableMedia.webp';

export interface FMItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    icon: string;
    children?: FMItem[];
    size?: string;
    modified?: string;
}

export const getFileIcon = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'txt':            return TxtIcon;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':            return JpgIcon;
        case 'gif':            return Gif;
        case 'html':
        case 'htm':            return HTML;
        case 'xml':            return XML;
        case 'xsl':            return XSL;
        case 'hlp':            return HLP;
        case 'theme':          return Theme;
        case 'wav':
        case 'mp3':            return GenericAudio;
        case 'wmv':            return WmvIcon;
        case 'avi':
        case 'mp4':            return GenericVideo;
        case 'zip':            return ZipIcon;
        case 'exe':            return ExeIcon;
        case 'lnk':            return LnkIcon;
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
            children: [],
        },
        {
            id: 'documents',
            name: 'My Documents',
            type: 'folder',
            icon: MyDocumentsIcon,
            children: [
                { id: 'doc1', name: 'readme.txt',  type: 'file', icon: TxtIcon, size: '1 KB',   modified: '28/04/2003' },
                { id: 'doc2', name: 'notes.txt',   type: 'file', icon: TxtIcon, size: '2 KB',   modified: '28/04/2003' },
                { id: 'doc3', name: 'todo.txt',    type: 'file', icon: TxtIcon, size: '1 KB',   modified: '28/04/2003' },
                { id: 'doc4', name: 'diary.txt',   type: 'file', icon: TxtIcon, size: '4 KB',   modified: '28/04/2003' },
            ],
        },
        {
            id: 'pictures',
            name: 'My Pictures',
            type: 'folder',
            icon: MyPicturesIcon,
            children: [
                { id: 'pic1', name: 'wallpaper.jpg',  type: 'file', icon: JpgIcon, size: '512 KB',   modified: '28/04/2003' },
                { id: 'pic2', name: 'screenshot.jpg', type: 'file', icon: JpgIcon, size: '256 KB',   modified: '28/04/2003' },
                { id: 'pic3', name: 'photo.jpg',      type: 'file', icon: JpgIcon, size: '1,024 KB', modified: '28/04/2003' },
            ],
        },
        {
            id: 'music',
            name: 'My Music',
            type: 'folder',
            icon: MyMusicIcon,
            children: [
                { id: 'mus1', name: 'Windows XP Startup.wav',  type: 'file', icon: GenericAudio, size: '424 KB', modified: '28/04/2003' },
                { id: 'mus2', name: 'Windows XP Shutdown.wav', type: 'file', icon: GenericAudio, size: '282 KB', modified: '28/04/2003' },
                { id: 'mus3', name: 'Windows XP Error.wav',    type: 'file', icon: GenericAudio, size: '44 KB',  modified: '28/04/2003' },
            ],
        },
        {
            id: 'videos',
            name: 'My Videos',
            type: 'folder',
            icon: MyVideosIcon,
            children: [
                { id: 'vid1', name: 'clip.wmv',  type: 'file', icon: WmvIcon, size: '14,400 KB', modified: '28/04/2003' },
                { id: 'vid2', name: 'intro.wmv', type: 'file', icon: WmvIcon, size: '8,192 KB',  modified: '28/04/2003' },
            ],
        },
        {
            id: 'downloads',
            name: 'Downloads',
            type: 'folder',
            icon: DownloadsIcon,
            children: [
                { id: 'dl1', name: 'setup.exe',      type: 'file', icon: ExeIcon, size: '14,400 KB', modified: '28/04/2003' },
                { id: 'dl2', name: 'patch_v1.2.exe', type: 'file', icon: ExeIcon, size: '2,048 KB',  modified: '28/04/2003' },
                { id: 'dl3', name: 'wallpapers.zip', type: 'file', icon: ZipIcon, size: '8,192 KB',  modified: '28/04/2003' },
            ],
        },
        {
            id: 'desktop',
            name: 'Desktop',
            type: 'folder',
            icon: DesktopIcon,
            children: [
                { id: 'desk1', name: 'Minesweeper.lnk',       type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk2', name: 'Internet Explorer.lnk', type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk3', name: 'Paint.lnk',             type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk4', name: 'Notepad.lnk',           type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk6', name: 'Calculator.lnk',    type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk7', name: 'Terminal.lnk',      type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk8', name: 'My Computer.lnk',   type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk9', name: 'Recycle Bin.lnk',   type: 'file', icon: LnkIcon, size: '1 KB', modified: '28/04/2003' },
                { id: 'desk5', name: 'New Folder', type: 'folder', icon: FolderClosedIcon, modified: '28/04/2003' },
            ],
        },
        {
            id: 'cdrom',
            name: 'CD Drive (D:)',
            type: 'folder',
            icon: RemovableMedia,
            children: [],
        },
    ],
};