import type { FMItem } from './types';
import {
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
    MediaPlayer9,
    PacmanIcon, NuPogodiIcon, MSDOS, HTT,
    CPAccessibility, CPAppearance, CPAudio, CPDate, CPNetwork, CPPerformance, CPPrinters, CPUsers,
    Fonts
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

                // ── C:\Program Files ────────────────────────────────────────
                { id: 'c-progfiles', name: 'Program Files', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [
                    { id: 'pf-ie',          name: 'Internet Explorer',    type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-wmp',         name: 'Windows Media Player', type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-messenger',   name: 'Windows Messenger',    type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-common',      name: 'Common Files',         type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-accessories', name: 'Accessories',          type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-games',       name: 'Games',                type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
                    { id: 'pf-minesweeper', name: 'Minesweeper',          type: 'folder', icon: FolderClosedIcon, modified: '10/05/2003', children: [] },
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
        { id: 'cdrom',      name: 'CD Drive (D:)', type: 'folder', icon: RemovableMedia, children: [] },
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
    WindowsUpdate, HelpAndSupport,
};