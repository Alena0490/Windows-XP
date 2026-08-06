import type { FMItem } from './types';
import {
    base,
    FolderClosedIcon, MyComputerIcon, LocalDisc, RemovableMedia, RecycleBin,
    TxtIcon, RTF, GenericTextDocument,
    JpgIcon, Bitmap, TIFF, Gif,
    HTML, XML, CSS, JavaScript, XSL, HLP, Theme,
    GenericAudio, WmvIcon, GenericVideo, GenericMedia, MSWMM,
    TrueType, TrueType2, OpenType, Font2, Font,
    VBS, RegistryDocument, ZipIcon, ExeIcon, DLL, LnkIcon,
    WRI, INF, ColorProfile, JournalTemplate, JournalNote, BLG, WMSPlaylist, DAT,
    GenericIcon,
    MyPicturesIcon, MyMusicIcon, MyDocumentsIcon, MyVideosIcon,
    DesktopIcon, DownloadsIcon, MyNetworkPlases,
    ShareFolder, NewFolder, Camcorder, MoveThisFolder, PublisToWeb,
    RestoreAllItems, ExploreProperties, PlayAll, IEMedia,
    Copy, CopyToDisc, ExplorerDelete, Programs, Email,
    Rename, PublishPhotosToWeb, DisplayProperties, ControlPanel, WindowsUpdate, HelpAndSupport,
    Minesweeper, Solitaire, Paint, Calculator, Notepad, InternetExplorer, CommandPrompt,
    MediaPlayer9, OnScreenKeyboard,
    PacmanIcon, NuPogodiIcon, MSDOS, HTT,
    CPAccessibility, CPAppearance, CPAudio, CPDate, CPNetwork, CPPerformance, CPPrinters, CPUsers,
    Fonts, Application, CDROM, Slideshow
} from './icons';
import { windowsFolder } from './windowsFolder';
import { alenaFolder } from './alenaFolder';
import { allUsersFolder } from './allUsersFolder';

export type { FMItem };

// ── FILE ICON RESOLVER ───────────────────────────────────────────────────────
export const getFileIcon = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'md':
        case undefined:
        case '0':
        case '':
        case 'txt':   return TxtIcon;
        case 'rtf':   return RTF;
        case 'pif':   return MSDOS;
        case 'log':
        case 'ini':
        case 'cfg':   return GenericTextDocument;
        case 'jpg':
        case 'jpeg':
        case 'webp':
        case 'png':   return JpgIcon;
        case 'bmp':   return Bitmap;
        case 'tiff':  return TIFF;
        case 'gif':   return Gif;
        case 'html':
        case 'mhtml':
        case 'htm':   return HTML;
        case 'xml':   return XML;
        case 'css':   return CSS;
        case 'js':    return JavaScript;
        case 'xsl':   return XSL;
        case 'hlp':   return HLP;
        case 'htt':   return HTT;
        case 'theme': return Theme;
        case 'wav':
        case 'mp3':   return GenericAudio;
        case 'wmv':   return WmvIcon;
        case 'mov':
        case 'avi':
        case 'mp4':   return GenericVideo;
        case 'wma':
        case 'mid':
        case 'midi':
        case 'flv':
        case 'mkv':   return GenericMedia;
        case 'mswmm': return MSWMM;
        case 'ttf':   return TrueType;
        case 'ttc':   return TrueType2;
        case 'otf':   return OpenType;
        case 'fon':   return Font2;
        case 'woff':
        case 'woff2':
        case 'eot':   return Font;
        case 'vbs':   return VBS;
        case 'reg':   return RegistryDocument;
        case 'zip':   return ZipIcon;
        case 'exe':   return ExeIcon;
        case 'dll':   return DLL;
        case 'lnk':   return LnkIcon;
        case 'wri':   return WRI;
        case 'inf':   return INF;
        case 'icc':
        case 'icm':   return ColorProfile;
        case 'jtp':   return JournalTemplate;
        case 'jnt':   return JournalNote;
        case 'blg':   return BLG;
        case 'wpl':
        case 'asx':   return WMSPlaylist;
        case 'dat':   return DAT;
        default:      return GenericIcon;
    }
};

// ── FILE SYSTEM TREE ─────────────────────────────────────────────────────────
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
                windowsFolder,
                { id: 'c-boot', name: 'BOOT', type: 'file', icon: INF, size: '211 KB', modified: '04/07/2003' },

                // ── C:\Program Files ────────────────────────────────────────
                { id: 'c-progfiles', name: 'Program Files', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                    { id: 'pf-ie',          name: 'Internet Explorer',    type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                        { id: 'pfie-enus',     name: 'en-US',    type: 'folder', icon: FolderClosedIcon, modified: '04/07/2003', children: [] },
                        { id: 'pfie-hmmapi',   name: 'hmmapi',   type: 'file', icon: DLL, size: '76 KB', modified: '04/07/2003' },
                        { id: 'pfie-iediagcmd',name: 'iediagcmd',type: 'file', icon: Application, size: '38 KB', modified: '04/07/2003' },
                        { id: 'pfie-ielowutil',name: 'ielowutil',type: 'file', icon: Application, size: '38 KB', modified: '04/07/2003' },
                        { id: 'pfie-ieshims',  name: 'IEShims',  type: 'file', icon: DLL, size: '87 KB', modified: '04/07/2003' },
                        { id: 'pfie-iexplore', name: 'iexplore', type: 'file', icon: InternetExplorer, size: '499 KB', modified: '04/07/2003' },
                        { id: 'pfie-sqmapi',   name: 'sqmapi',   type: 'file', icon: DLL, size: '38 KB', modified: '04/07/2003' },
                    ] },
                    { id: 'pf-wmp',         name: 'Windows Media Player', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                        { id: 'pfwmp-enus',       name: 'en-US',            type: 'folder', icon: FolderClosedIcon, modified: '04/07/2003', children: [] },
                        { id: 'pfwmp-mediarend',  name: 'Media Renderer',   type: 'folder', icon: FolderClosedIcon, modified: '04/07/2003', children: [] },
                        { id: 'pfwmp-netshare',   name: 'Network Sharing',  type: 'folder', icon: FolderClosedIcon, modified: '04/07/2003', children: [] },
                        { id: 'pfwmp-skins',      name: 'Skins',            type: 'folder', icon: FolderClosedIcon, modified: '04/07/2003', children: [] },
                        { id: 'pfwmp-visual',     name: 'Visualizations',   type: 'folder', icon: FolderClosedIcon, modified: '04/07/2003', children: [] },
                        { id: 'pfwmp-migrate',    name: 'migrate',          type: 'file', icon: Application, size: '38 KB',  modified: '04/07/2003' },
                        { id: 'pfwmp-mpvis',      name: 'mpvis',            type: 'file', icon: DLL,         size: '145 KB', modified: '04/07/2003' },
                        { id: 'pfwmp-setupwm',    name: 'setup_wm',         type: 'file', icon: MediaPlayer9,size: '203 KB', modified: '04/07/2003' },
                        { id: 'pfwmp-wmpband',    name: 'wmpband',          type: 'file', icon: DLL,         size: '38 KB',  modified: '04/07/2003' },
                        { id: 'pfwmp-wmplayer',   name: 'wmplayer',         type: 'file', icon: MediaPlayer9,size: '499 KB', modified: '04/07/2003' },
                        { id: 'pfwmp-wmpmediashr',name: 'WMPMediaSharing',  type: 'file', icon: DLL,         size: '87 KB',  modified: '04/07/2003' },
                        { id: 'pfwmp-wmpnssci',   name: 'wmpnssci',         type: 'file', icon: DLL,         size: '145 KB', modified: '04/07/2003' },
                        { id: 'pfwmp-wmpnssui',   name: 'WMPNSSUI',         type: 'file', icon: DLL,         size: '289 KB', modified: '04/07/2003' },
                    ] },
                    { id: 'pf-messenger',   name: 'Windows Messenger',    type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-common',      name: 'Common Files',         type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-accessories', name: 'Accessories',          type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                        { id: 'pf-paint',        name: 'Paint',              type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-calculator',   name: 'Calculator',         type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-terminal',     name: 'Command Prompt',     type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-notepad',      name: 'Notepad',            type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-wordpad',      name: 'WordPad',            type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-keyboard',     name: 'On-Screen Keyboard', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-volume',       name: 'Volume Control',     type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-displayprops', name: 'Display Properties', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-filemanager',  name: 'File Manager',       type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    ] },
                    { id: 'pf-games',       name: 'Games',                type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                        { id: 'pf-minesweeper',  name: 'Minesweeper',        type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                        { id: 'pf-solitaire',    name: 'Solitaire',          type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    ] },
                    { id: 'pf-plus',        name: 'Windows Plus!',        type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                ]},

                // ── C:\Documents and Settings ───────────────────────────────
                {
                    id: 'c-documents',
                    name: 'Documents and Settings',
                    type: 'folder',
                    icon: FolderClosedIcon,
                    modified: '10/05/2003',
                    children: [ alenaFolder, allUsersFolder ],
                },
            ],
        },
        { id: 'controlpanel', name: 'Control Panel', type: 'folder', icon: ControlPanel, folderType: 'controlpanel', children: [
            { id: 'cp-appearance', name: 'Appearance and Themes', type: 'folder', icon: CPAppearance, modified: '10/05/2003', children: [] },
            { id: 'cp-network', name: 'Network and Internet Connections', type: 'folder', icon: CPNetwork, modified: '10/05/2003', children: [] },
            { id: 'cp-programs', name: 'Add or Remove Programs', type: 'file', icon: Programs, modified: '10/05/2003' },
            { id: 'cp-audio', name: 'Sounds, Speech, and Audio Devices', type: 'folder', icon: CPAudio, modified: '10/05/2003', children: [] },
            { id: 'cp-performance', name: 'Performance and Maintenance', type: 'folder', icon: CPPerformance, modified: '10/05/2003', children: [] },
            { id: 'cp-printers', name: 'Printers and Other Hardware', type: 'folder', icon: CPPrinters, modified: '10/05/2003', children: [] },
            { id: 'cp-users', name: 'User Accounts', type: 'folder', icon: CPUsers, modified: '10/05/2003', children: [] },
            { id: 'cp-date', name: 'Date, Time, Language, and Regional Options', type: 'folder', icon: CPDate, modified: '10/05/2003', children: [] },
            { id: 'cp-accessibility', name: 'Accessibility Options', type: 'folder', icon: CPAccessibility, modified: '10/05/2003', children: [] },
            { id: 'cp-fonts', name: 'Fonts', type: 'folder', icon: Fonts, modified: '10/05/2003', children: [] },
            { id: 'cp-display', name: 'Display', type: 'folder', icon: DisplayProperties, modified: '10/05/2003', children: [] },
        ] },
        { id: 'cdrom',      name: 'Local Disk (D:)', type: 'folder', icon: RemovableMedia, children: [] },
        { id: 'cdrw',       name: 'CD Drive (E:)', type: 'folder', icon: CDROM,          children: [
           {
                id: 'pic-random',
                name: 'random',
                type: 'folder',
                icon: FolderClosedIcon,
                modified: '04/07/2003',
                children: [
                    { id: 'pic-rand-dog',  name: 'DOG.GIF',  type: 'file', icon: Gif, size: '7 KB',  modified: '04/07/2003', imageUrl: `${base}pictures/random/DOG.GIF` },
                    { id: 'pic-rand-anim', name: 'ANIM.GIF', type: 'file', icon: Gif, size: '12 KB', modified: '04/07/2003', imageUrl: `${base}pictures/random/ANIM.GIF` },
                    { id: 'pic-rand-bike', name: 'BIKE.GIF', type: 'file', icon: Gif, size: '16 KB', modified: '04/07/2003', imageUrl: `${base}pictures/random/BIKE.GIF` },
                    { id: 'pic-rand-car',  name: 'CAR.GIF',  type: 'file', icon: Gif, size: '27 KB', modified: '04/07/2003', imageUrl: `${base}pictures/random/CAR.GIF` },
                    { id: 'pic-rand-lake', name: 'LAKE.GIF', type: 'file', icon: Gif, size: '31 KB', modified: '04/07/2003', imageUrl: `${base}pictures/random/LAKE.GIF` },
                    { id: 'pic-rand-cup',  name: 'CUP.GIF',  type: 'file', icon: Gif, size: '4 KB',  modified: '04/07/2003', imageUrl: `${base}pictures/random/CUP.GIF` },
                ],
            },
        ] },
        { id: 'recyclebin', name: 'Recycle Bin',   type: 'folder', icon: RecycleBin,     children: [] },
    ],
};

// ── DESKTOP ITEMS ────────────────────────────────────────────────────────────
export const getDesktopItems = (apps: { name: string; size: string }[]): FMItem[] => {
    const kb = (name: string) => (apps.find(a => a.name === name)?.size ?? '1') + ' KB';
    return [
        { id: 'desk1',  name: 'Minesweeper.lnk',        type: 'file', icon: Minesweeper,      size: kb('Minesweeper'),       modified: '28/04/2003' },
        { id: 'desk2',  name: 'Internet Explorer.lnk',  type: 'file', icon: InternetExplorer, size: kb('Internet Explorer'), modified: '28/04/2003' },
        { id: 'desk3',  name: 'Paint.lnk',              type: 'file', icon: Paint,            size: kb('Paint'),             modified: '28/04/2003' },
        { id: 'desk4',  name: 'Notepad.lnk',            type: 'file', icon: Notepad,          size: kb('Notepad'),           modified: '28/04/2003' },
        { id: 'desk5',  name: 'My Files.lnk',           type: 'file', icon: FolderClosedIcon, size: kb('File Manager'),      modified: '28/04/2003' },
        { id: 'desk6',  name: 'Calculator.lnk',         type: 'file', icon: Calculator,       size: kb('Calculator'),        modified: '28/04/2003' },
        { id: 'desk7',  name: 'Terminal.lnk',           type: 'file', icon: CommandPrompt,    size: kb('Command Prompt'),    modified: '28/04/2003' },
        { id: 'desk8',  name: 'My Computer.lnk',        type: 'file', icon: MyComputerIcon,   size: '1 KB',                  modified: '28/04/2003' },
        { id: 'desk9',  name: 'Recycle Bin.lnk',        type: 'file', icon: RecycleBin,       size: '1 KB',                  modified: '28/04/2003' },
        { id: 'desk10', name: 'About this project.lnk', type: 'file', icon: TxtIcon,          size: '1 KB',                  modified: '12/05/2026' },
        { id: 'desk11', name: 'Pacman.lnk',             type: 'file', icon: PacmanIcon,       size: '1 KB',                  modified: '12/05/2026', url: 'https://alena0490.github.io/Pacman/' },
        { id: 'desk12', name: 'Nu Pogodi.lnk',          type: 'file', icon: NuPogodiIcon,     size: '1 KB',                  modified: '12/05/2026', url: 'https://alena0490.github.io/Nu-pogodi/' },
        { id: 'desk13', name: 'Solitaire.lnk',          type: 'file', icon: Solitaire,        size: kb('Solitaire'),         modified: '28/04/2003' },
        { id: 'desk14', name: 'Media Player.lnk',       type: 'file', icon: MediaPlayer9,     size: kb('Windows Media Player'), modified: '28/04/2003' },
        { id: 'desk15', name: 'Display Properties.lnk', type: 'file', icon: DisplayProperties, size: '1 KB',                 modified: '28/04/2003' },
        { id: 'desk-keyboard', name: 'On-Screen Keyboard.lnk', type: 'file', icon: OnScreenKeyboard, size: '1 KB',           modified: '28/04/2003' },
    ];
};

// ── RE-EXPORTS — backwards compatibility ─────────────────────────────────────
export {
    MyPicturesIcon, MyMusicIcon, MyDocumentsIcon, MyVideosIcon,
    DesktopIcon, DownloadsIcon, RecycleBin, LocalDisc, RemovableMedia,
    MyNetworkPlases, GenericMedia, ShareFolder, NewFolder, Camcorder,
    MoveThisFolder, PublisToWeb, RestoreAllItems, ExploreProperties,
    PlayAll, IEMedia, Copy, CopyToDisc, ExplorerDelete,
    Programs, Email, Rename, PublishPhotosToWeb, DisplayProperties, ControlPanel,
    WindowsUpdate, HelpAndSupport, Slideshow
};