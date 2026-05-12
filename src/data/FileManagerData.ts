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
import PacmanIcon from '../img/Pacman.webp'
import NuPogodiIcon from '../img/nu-pogodi.webp'

// Tasks & actions
// import FolderOptions from '../img/FolderOptions.webp'
import ShareFolder from '../img/SharedFolder.webp';
import NewFolder from '../img/NewFolder.webp';
import MoveThisFolder from '../img/MoveThisFolder.webp';
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

// TEXT FILES
import README_CONTENT from '../../README.md?raw';
import NOTES_CONTENT from '../../public/documents/notes.txt?raw';
import DIARY_CONTENT from '../../public/documents/diary.txt?raw';
import TODO_CONTENT from '../../public/documents/todo.txt?raw';

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
    url?: string;
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
                        // C:\WINDOWS\Media
                        {
                            id: 'c-windows-media',
                            name: 'Media',
                            type: 'folder',
                            icon: FolderClosedIcon,
                            modified: '10/05/2003',
                            children: [
                                { id: 'med-feed', name: 'Windows Feed Discovered.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-infobar', name: 'Windows Information Bar.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-navstart', name: 'Windows Navigation Start.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-popup', name: 'Windows Pop-up Blocked.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-balloon', name: 'Windows XP Balloon.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-battery-critical', name: 'Windows XP Battery Critical.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-battery-low', name: 'Windows XP Battery Low.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-critical-stop', name: 'Windows XP Critical Stop.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-default', name: 'Windows XP Default.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-ding', name: 'Windows XP Ding.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-notify', name: 'Windows XP Notify.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-popup-blocked', name: 'Windows XP Pop-up Blocked.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-print', name: 'Windows XP Print Complete.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-recycle', name: 'Windows XP Recycle.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-restore', name: 'Windows XP Restore.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-ringin', name: 'Windows XP Ringin.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-ringout', name: 'Windows XP Ringout.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-shutdown', name: 'Windows XP Shutdown.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-start', name: 'Windows XP Start.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-startup', name: 'Windows XP Startup.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-error', name: 'Windows XP Error.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-exclamation', name: 'Windows XP Exclamation.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-hw-fail', name: 'Windows XP Hardware Fail.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-hw-insert', name: 'Windows XP Hardware Insert.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-hw-remove', name: 'Windows XP Hardware Remove.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-infobar2', name: 'Windows XP Information Bar.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-logoff', name: 'Windows XP Logoff Sound.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-logon', name: 'Windows XP Logon Sound.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-menu', name: 'Windows XP Menu Command.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                                { id: 'med-minimize', name: 'Windows XP Minimize.wav', type: 'file', icon: GenericAudio, size: '44 KB', modified: '10/05/2003' },
                            ]},
                        // C:\WINDOWS\Cursors
                        {
                            id: 'c-windows-cursors',
                            name: 'Cursors',
                            type: 'folder',
                            icon: FolderClosedIcon,
                            modified: '10/05/2003',
                            children: [
                                { id: 'cur-raindrop', name: 'raindrop.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/raindrop.webp` },
                                { id: 'cur-stopwatch', name: 'stopwatch.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/stopwatch.webp` },
                                { id: 'cur-wagtail', name: 'wagtail.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/wagtail.webp` },
                                { id: 'cur-handwait', name: 'handwait.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/handwait.webp` },
                                { id: 'cur-steering-wheel', name: 'steering-wheel.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/steering-wheel.webp` },
                                { id: 'cur-tennis-arrow', name: 'tennis-arrow.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/tennis-arrow.webp` },
                                { id: 'cur-oyster', name: 'oyster.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/oyster.webp` },
                                { id: 'cur-baseball', name: 'baseball.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/baseball.webp` },
                                { id: 'cur-cd-arrow', name: 'cd-arrow.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/cd-arrow.webp` },
                                { id: 'cur-plasmaball', name: 'plasmaBall.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/plasmaBall.webp` },
                                { id: 'cur-coffee', name: 'coffee.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/coffee.webp` },
                                { id: 'cur-science', name: 'science.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/science.webp` },
                                { id: 'cur-davinci', name: 'daVinci.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/daVinci.webp` },
                                { id: 'cur-tv', name: 'tv.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/tv.webp` },
                                { id: 'cur-pingpong', name: 'pingPong.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/pingPong.webp` },
                                { id: 'cur-sketchbook', name: 'sketchbook.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/sketchbook.webp` },
                                { id: 'cur-time-travel', name: 'time-travel.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/time-travel.webp` },
                                { id: 'cur-coin', name: 'coin.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/coin.webp` },
                                { id: 'cur-rainboww', name: 'rainboww.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/rainboww.webp` },
                                { id: 'cur-apple', name: 'apple.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/apple.webp` },
                                { id: 'cur-basketball', name: 'basketball.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/basketball.webp` },
                                { id: 'cur-hourglass', name: 'hourglass-c.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/hourglass-c.webp` },
                                { id: 'cur-drum', name: 'drum.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/drum.webp` },
                                { id: 'cur-metronom', name: 'metronom.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/metronom.webp` },
                                { id: 'cur-cursor-basic', name: 'cursor-basic.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/cursor-basic.webp` },
                                { id: 'cur-hand', name: 'hand.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/hand.webp` },
                                { id: 'cur-dinosaur', name: 'dinosaur-c.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/dinosaur-c.webp` },
                                { id: 'cur-barberpole', name: 'barberpole.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/barberpole.webp` },
                                { id: 'cur-banana', name: 'banana.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/banana.webp` },
                                { id: 'cur-dinosaour-g', name: 'dinosaour-g.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/dinosaour-g.webp` },
                                { id: 'cur-starfish', name: 'starfish.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/starfish.webp` },
                                { id: 'cur-computer', name: 'computer.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/computer.webp` },
                                { id: 'cur-coin-arrow', name: 'coin-arrow.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/coin-arrow.webp` },
                                { id: 'cur-windows-run', name: 'windows-run.webp', type: 'file', icon: JpgIcon, size: '1 KB', modified: '10/05/2003', thumbnailUrl: `${base}WINDOWS/Cursors/windows-run.webp` },
                            ],
                        },

                        // C:\WINDOWS\Cursors
                        { id: 'c-windows-fonts', name: 'Fonts', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'c-windows-help', name: 'Help', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'c-windows-resources', name: 'Resources', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'c-windows-temp', name: 'Temp', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    ],
                },
                // ── C:\Program Files ────────────────────────
                { id: 'c-progfiles', name: 'Program Files', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                    { id: 'pf-ie', name: 'Internet Explorer', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-wmp', name: 'Windows Media Player', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-messenger', name: 'Windows Messenger', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-common', name: 'Common Files', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-accessories', name: 'Accessories', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-games', name: 'Games', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-minesweeper', name: 'Minesweeper', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                ] },
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
                                        { id: 'doc-readme', name: 'About this project.md', type: 'file', icon: TxtIcon, size: '4 KB', modified: '12/05/2026', content: README_CONTENT },
                                        { id: 'doc-notes', name: 'notes.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003', content: NOTES_CONTENT },
                                        { id: 'doc-diary', name: 'diary.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003', content: DIARY_CONTENT },
                                        { id: 'doc-todo', name: 'todo.txt', type: 'file', icon: TxtIcon, size: '1 KB', modified: '10/05/2003', content: TODO_CONTENT },
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
                                    modified: '12/05/2026',
                                    children: [
                                        { id: 'mus-ode', name: 'BeethovenOdeToJoy.mp3', type: 'file', icon: GenericAudio, size: '2,872 KB', modified: '12/05/2026' },
                                        {
                                            id: 'music-sample',
                                            name: 'Sample Music',
                                            type: 'folder',
                                            icon: FolderClosedIcon,
                                            modified: '12/05/2026',
                                            children: [
                                                { id: 'mus-scherzo', name: 'BeethovenNo9Scherzo.mp3', type: 'file', icon: GenericAudio, size: '591 KB', modified: '12/05/2026' },
                                                { id: 'mus-highway', name: 'Highway Blues - New Stories.mp3', type: 'file', icon: GenericAudio, size: '11,573 KB', modified: '12/05/2026' },
                                            ],
                                        },
                                        { id: 'mus-computer-error', name: 'Computer Error (Abrade Remix).mp3', type: 'file', icon: GenericAudio, size: '7,912 KB', modified: '12/05/2026' },
                                        { id: 'mus-play-ball', name: 'Play Ball - Matt Ridgway.mp3', type: 'file', icon: GenericAudio, size: '27 KB', modified: '12/05/2026' },
                                        { id: 'mus-startup', name: 'Start Up (End of Support Remix).mp3', type: 'file', icon: GenericAudio, size: '2,308 KB', modified: '12/05/2026' },
                                        { id: 'mus-win-error', name: 'Windows Error (Electric Goat Remix).mp3', type: 'file', icon: GenericAudio, size: '5,793 KB', modified: '12/05/2026' },
                                        { id: 'mus-exclamation', name: 'Exclamation (Phant Remix).mp3', type: 'file', icon: GenericAudio, size: '2,731 KB', modified: '12/05/2026' },
                                        { id: 'mus-velkommen', name: 'Velkommen (Stray Objects Remix).mp3', type: 'file', icon: GenericAudio, size: '8,111 KB', modified: '12/05/2026' },
                                        { id: 'mus-xp-sounds', name: 'XP Sounds (SomethingUnreal Remix).mp3', type: 'file', icon: GenericAudio, size: '2,685 KB', modified: '12/05/2026' },
                                        { id: 'mus-xp-skelly', name: 'Windows XP (skelly Remix).mp3', type: 'file', icon: GenericAudio, size: '5,121 KB', modified: '12/05/2026' },
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
                                        { id: 'dl-epocha', name: 'epocha.jpg', type: 'file', icon: JpgIcon, size: '22 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/epocha.jpg` },
                                        { id: 'dl-witch', name: 'witch.jpg', type: 'file', icon: JpgIcon, size: '22 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/witch.jpg` },
                                        { id: 'dl-donald', name: 'donald-the-duck.jpg', type: 'file', icon: JpgIcon, size: '19 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/donald-the-duck.jpg` },
                                        { id: 'dl-prirucka', name: 'prirucka.png', type: 'file', icon: JpgIcon, size: '106 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/prirucka.png` },
                                        { id: 'dl-w3c', name: 'w3c.gif', type: 'file', icon: Gif, size: '1 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/w3c.gif` },
                                        { id: 'dl-icqdownload', name: 'icqdownload.gif', type: 'file', icon: Gif, size: '7 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/icqdownload.gif` },
                                        { id: 'dl-phone', name: 'phone.jpg', type: 'file', icon: JpgIcon, size: '11 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/phone.jpg` },
                                        { id: 'dl-nokia2', name: 'nokia2.jpg', type: 'file', icon: JpgIcon, size: '9 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/nokia2.jpg` },
                                        { id: 'dl-garfield', name: 'Garfield.png', type: 'file', icon: JpgIcon, size: '5 KB', modified: '12/05/2026', thumbnailUrl: `${base}downloads/Garfield.png` },
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
    { id: 'desk10', name: 'About this project.lnk', type: 'file' as const, icon: TxtIcon, size: '1 KB', modified: '12/05/2026' },
    { id: 'desk11', name: 'Pacman.lnk', type: 'file' as const, icon: PacmanIcon, size: '1 KB', modified: '12/05/2026', url: 'https://alena0490.github.io/Pacman/' },
    { id: 'desk12', name: 'Nu Pogodi.lnk', type: 'file' as const, icon: NuPogodiIcon, size: '1 KB', modified: '12/05/2026', url: 'https://alena0490.github.io/Nu-pogodi/' },
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