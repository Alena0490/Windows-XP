import { useRef } from 'react';
import useDesktopIconPositions, { type GetDefaultPosition } from '../hooks/useDesktopIconPositions';

import MyComputer from '../img/MyComputer.webp';
import IntertExplorer from '../img/InternetExplorer6.webp';
import MinesweeperIcon from '../img/Minesweeper.webp';
import SolitaireIcon from '../img/Solitaire.webp';
import PaintIcon from '../img/Paint.webp';
import CalculatorIcon from '../img/Calculator.webp';
import TerminalIcon from '../img/CommandPrompt.webp';
import NotepadIcon from '../img/Notepad.webp';
import WordpadIcon from '../img/Wordpad.webp';
import FolderIcon from '../img/FolderClosed.webp';
import MediaPlayerIcon from '../img/WindowsMediaPlayer 9.webp';
import DisplayPropertiesIcon from '../img/DisplayProperties.webp';
import KeyboardIcon from '../img/On-Screen Keyboard.webp';
import Pacman from '../img/Pacman.webp';
import NuPogodi from '../img/nu-pogodi.webp';
import PlusIcon from '../img/Plus.webp';
import VoiceRecorderIcon from '../img/VolumeAlt.webp';

import '../App.css';

interface DesktopProps {
    binIcon: string;
    openFileManager: (path?: string[], openSearch?: boolean) => void;
    openIE: (url?: string) => void;
    openMinesweeper: () => void;
    openSolitaire: () => void;
    openPaint: () => void;
    openCalculator: () => void;
    openTerminal: () => void;
    openPlus: () => void;
    openNotepad: (content?: string, fileName?: string) => void;
    openWordpad: (content?: string, fileName?: string) => void;
    openMediaPlayer: () => void;
    openDisplayProperties: () => void;
    openKeyboard: () => void;
    openVoiceRecorder: () => void;
    readmeContent: string;
}

interface DesktopIconData {
    id: string;
    icon: string;
    iconClassName?: string;
    alt: string;
    label: string;
    tooltip: string;
    onDoubleClick: () => void;
    asLink?: boolean;
}

const Desktop = ({
    binIcon,
    openFileManager,
    openIE,
    openMinesweeper,
    openSolitaire,
    openPaint,
    openCalculator,
    openTerminal,
    openPlus,
    openNotepad,
    openWordpad,
    openMediaPlayer,
    openDisplayProperties,
    openKeyboard,
    openVoiceRecorder,
    readmeContent,
}: DesktopProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const items: DesktopIconData[] = [
        {
            id: 'mycomputer',
            icon: MyComputer,
            iconClassName: 'my-computer',
            alt: 'My Computer',
            label: 'My Computer',
            tooltip: 'Displays the drives and hardware connected to this computer.',
            onDoubleClick: () => openFileManager(),
            asLink: true,
        },
        {
            id: 'ie',
            icon: IntertExplorer,
            iconClassName: 'ie',
            alt: 'Internet Explorer',
            label: 'Internet Explorer',
            tooltip: 'Finds and displays information and Web sites on the Internet.',
            onDoubleClick: () => openIE(),
        },
        {
            id: 'minesweeper',
            icon: MinesweeperIcon,
            iconClassName: 'paint',
            alt: 'Minesweeper',
            label: 'Minesweeper',
            tooltip: 'Minesweeper: A game of logic and strategy. Clear the grid without detonating a mine.',
            onDoubleClick: openMinesweeper,
        },
        {
            id: 'solitaire',
            icon: SolitaireIcon,
            alt: 'Solitaire',
            label: 'Solitaire',
            tooltip: 'Solitaire: The classic card-shuffling game.',
            onDoubleClick: openSolitaire,
        },
        {
            id: 'pacman',
            icon: Pacman,
            alt: 'Pacman',
            label: 'PAC-MAN',
            tooltip: 'PAC-MAN: Classic 1980 arcade game. Guide PAC-MAN through the maze and eat all the dots.',
            onDoubleClick: () => openIE('https://alena0490.github.io/Pacman/'),
        },
        {
            id: 'nupogodi',
            icon: NuPogodi,
            alt: 'Nu Pogodi',
            label: 'Nu Pogodi',
            tooltip: 'Nu Pogodi! (Egg catching): Classic Soviet handheld electronic game simulator.',
            onDoubleClick: () => openIE('https://alena0490.github.io/Nu-pogodi/'),
        },
        {
            id: 'paint',
            icon: PaintIcon,
            iconClassName: 'paint',
            alt: 'Paint',
            label: 'Paint',
            tooltip: 'Creates and edits drawings, and displays and edits scanned photos.',
            onDoubleClick: openPaint,
        },
        {
            id: 'calculator',
            icon: CalculatorIcon,
            iconClassName: 'paint',
            alt: 'Calculator',
            label: 'Calculator',
            tooltip: 'Performs basic arithmetic, financial, and scientific calculations.',
            onDoubleClick: openCalculator,
        },
        {
            id: 'terminal',
            icon: TerminalIcon,
            iconClassName: 'paint',
            alt: 'Windows CMD',
            label: 'Terminal',
            tooltip: 'Provides a scriptable command-line interface',
            onDoubleClick: openTerminal,
        },
        {
            id: 'plus',
            icon: PlusIcon,
            alt: 'Windows Plus!',
            label: 'Windows Plus!',
            tooltip: 'Customize your Windows XP experience with Plus! themes, screensavers, and more.',
            onDoubleClick: openPlus,
        },
        {
            id: 'notepad',
            icon: NotepadIcon,
            alt: 'Notepad',
            label: 'Notepad',
            tooltip: 'Creates and edits text files using minimal formatting.',
            onDoubleClick: () => openNotepad(),
        },
        {
            id: 'wordpad',
            icon: WordpadIcon,
            alt: 'WordPad',
            label: 'WordPad',
            tooltip: 'Creates and edits documents and other text files with complex formatting.',
            onDoubleClick: () => openWordpad(),
        },
        {
            id: 'myfiles',
            icon: FolderIcon,
            alt: 'File Manager',
            label: 'My Files',
            tooltip: 'Provides a convenient location to store documents, graphics, and other files.',
            onDoubleClick: () => openFileManager(['localdisc']),
        },
        {
            id: 'aboutproject',
            icon: NotepadIcon,
            alt: 'About this project',
            label: 'About this project',
            tooltip: 'Opens README.md to show information, features, and documentation about this project.',
            onDoubleClick: () => openNotepad(readmeContent, 'About this project.md'),
        },
        {
            id: 'mediaplayer',
            icon: MediaPlayerIcon,
            alt: 'Windows Media Player',
            label: 'Media Player',
            tooltip: 'Plays digital media including music, videos, CDs, and DVDs.',
            onDoubleClick: () => openMediaPlayer(),
        },
        {
            id: 'displayproperties',
            icon: DisplayPropertiesIcon,
            alt: 'Display Properties',
            label: 'Display Properties',
            tooltip: 'Customizes your desktop display, wallpaper, screensaver, and appearance.',
            onDoubleClick: () => openDisplayProperties(),
        },
        {
            id: 'keyboard',
            icon: KeyboardIcon,
            alt: 'On-Screen Keyboard',
            label: 'On-Screen Keyboard',
            tooltip: 'Displays an on-screen keyboard that you can type on using a mouse.',
            onDoubleClick: openKeyboard,
        },
        {
            id: 'voicerecorder',
            icon: VoiceRecorderIcon,
            alt: 'Sound Recorder',
            label: 'Sound Recorder',
            tooltip: 'Records, mixes, plays, and edits sounds.',
            onDoubleClick: openVoiceRecorder,
        },
        {
            id: 'recyclebin',
            icon: binIcon,
            iconClassName: 'bin',
            alt: 'Recycle Bin',
            label: 'Recycle Bin',
            tooltip: 'Contains the files and folders that you have deleted. These items are not permanently removed until you empty the Recycle Bin.',
            onDoubleClick: () => openFileManager(['recyclebin']),
        },
    ];

    const GRID_X = 82;
    const GRID_Y = 82;
    const RIGHT_PADDING = 12;
    const nonBinIds = items.filter(item => item.id !== 'recyclebin').map(item => item.id);

    const getDefaultPosition: GetDefaultPosition = (id, container) => {
        // Bin sits at the true bottom-right of the visible container.
        const binY = Math.max(0, Math.floor(container.height / GRID_Y) * GRID_Y - GRID_Y);
        if (id === 'recyclebin') {
            return {
                x: Math.max(0, container.width - GRID_X - RIGHT_PADDING),
                y: binY,
            };
        }
        // Fill each column down to (but not overlapping) the bin's row.
        const rowsPerCol = Math.max(4, Math.floor(container.height / GRID_Y));
        const index = nonBinIds.indexOf(id);
        const col = Math.floor(index / rowsPerCol);
        const row = index % rowsPerCol;
        return { x: col * GRID_X, y: row * GRID_Y };
    };

    const { positions, handleMouseDown } = useDesktopIconPositions({
        itemIds: items.map(item => item.id),
        getDefaultPosition,
        containerRef,
    });

    return (
        <div className='app-wrapper' ref={containerRef}>
            {items.map(item => {
                const position = positions[item.id];
                if (!position) return null;
                const Tag = item.asLink ? 'a' : 'div';
                return (
                    <Tag
                        key={item.id}
                        {...(item.asLink ? { href: '#' } : {})}
                        className='desktop-item'
                        style={{ left: position.x, top: position.y }}
                        data-tooltip={item.tooltip}
                        data-icon-id={item.id}
                        onMouseDown={(e) => handleMouseDown(item.id, e)}
                        onDoubleClick={item.onDoubleClick}
                    >
                        <img
                            className={`app-icon${item.iconClassName ? ` ${item.iconClassName}` : ''}`}
                            src={item.icon}
                            alt={item.alt}
                            draggable={false}
                        />
                        <span className='desktop-item-label'>{item.label}</span>
                    </Tag>
                );
            })}
        </div>
    );
};

export default Desktop;