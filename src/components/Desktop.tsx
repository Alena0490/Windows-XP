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
    readmeContent: string;
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
    readmeContent,
}: DesktopProps) => {
    return (
        <div className='app-wrapper'>
            <a
                href='#'
                className='desktop-item'
                onDoubleClick={() => openFileManager()}
                data-tooltip='Displays the drives and hardware connected to this computer.'
            >
                <img className='app-icon my-computer' src={MyComputer} alt='My Computer' />
                <span className='desktop-item-label'>My Computer</span>
            </a>

            <div
                className='desktop-item'
                data-tooltip='Finds and displays information and Web sites on the Internet.'
                onDoubleClick={() => openIE()}
            >
                <img className='app-icon ie' src={IntertExplorer} alt='Internet Explorer' />
                <span className='desktop-item-label'>Internet Explorer</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Minesweeper: A game of logic and strategy. Clear the grid without detonating a mine.'
                onDoubleClick={openMinesweeper}
            >
                <img className='app-icon paint' src={MinesweeperIcon} alt='Minesweeper' />
                <span className='desktop-item-label'>Minesweeper</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Solitaire: The classic card-shuffling game.'
                onDoubleClick={openSolitaire}
            >
                <img className='app-icon' src={SolitaireIcon} alt='Solitaire' />
                <span className='desktop-item-label'>Solitaire</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='PAC-MAN: Classic 1980 arcade game. Guide PAC-MAN through the maze and eat all the dots.'
                onDoubleClick={() => openIE('https://alena0490.github.io/Pacman/')}
            >
                <img className='app-icon' src={Pacman} alt='Pacman' />
                <span className='desktop-item-label'>PAC-MAN</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Nu Pogodi! (Egg catching): Classic Soviet handheld electronic game simulator.'
                onDoubleClick={() => openIE('https://alena0490.github.io/Nu-pogodi/')}
            >
                <img className='app-icon' src={NuPogodi} alt='Nu Pogodi' />
                <span className='desktop-item-label'>Nu Pogodi</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Creates and edits drawings, and displays and edits scanned photos.'
                onDoubleClick={openPaint}
            >
                <img className='app-icon paint' src={PaintIcon} alt='Paint' />
                <span className='desktop-item-label'>Paint</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Performs basic arithmetic, financial, and scientific calculations.'
                onDoubleClick={openCalculator}
            >
                <img className='app-icon paint' src={CalculatorIcon} alt='Calculator' />
                <span className='desktop-item-label'>Calculator</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Provides a scriptable command-line interface'
                onDoubleClick={openTerminal}
            >
                <img className='app-icon paint' src={TerminalIcon} alt='Windows CMD' />
                <span className='desktop-item-label'>Terminal</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Customize your Windows XP experience with Plus! themes, screensavers, and more.'
                onDoubleClick={openPlus}
            >
                <img className='app-icon' src={PlusIcon} alt='Windows Plus!' />
                <span className='desktop-item-label'>Windows Plus!</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Creates and edits text files using minimal formatting.'
                onDoubleClick={() => openNotepad()}
            >
                <img className='app-icon' src={NotepadIcon} alt='Notepad' />
                <span className='desktop-item-label'>Notepad</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Creates and edits documents and other text files with complex formatting.'
                onDoubleClick={() => openWordpad()}
            >
                <img className='app-icon' src={WordpadIcon} alt='WordPad' />
                <span className='desktop-item-label'>WordPad</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Provides a convenient location to store documents, graphics, and other files.'
                onDoubleClick={() => openFileManager(['localdisc'])}
            >
                <img className='app-icon' src={FolderIcon} alt='File Manager' />
                <span className='desktop-item-label'>My Files</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Contains the files and folders that you have deleted. These items are not permanently removed until you empty the Recycle Bin.'
                onDoubleClick={() => openFileManager(['recyclebin'])}
            >
                <img className='app-icon bin' src={binIcon} alt='Recycle Bin' />
                <span className='desktop-item-label'>Recycle Bin</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Opens README.md to show information, features, and documentation about this project.'
                onDoubleClick={() => openNotepad(readmeContent, 'About this project.md')}
            >
                <img className='app-icon' src={NotepadIcon} alt='About this project' />
                <span className='desktop-item-label'>About this project</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Plays digital media including music, videos, CDs, and DVDs.'
                onDoubleClick={() => openMediaPlayer()}
            >
                <img className='app-icon' src={MediaPlayerIcon} alt='Windows Media Player' />
                <span className='desktop-item-label'>Media Player</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Customizes your desktop display, wallpaper, screensaver, and appearance.'
                onDoubleClick={() => openDisplayProperties()}
            >
                <img className='app-icon' src={DisplayPropertiesIcon} alt='Display Properties' />
                <span className='desktop-item-label'>Display Properties</span>
            </div>

            <div
                className='desktop-item'
                data-tooltip='Displays an on-screen keyboard that you can type on using a mouse.'
                onDoubleClick={openKeyboard}
            >
                <img className='app-icon' src={KeyboardIcon} alt='On-Screen Keyboard' />
                <span className='desktop-item-label'>On-Screen Keyboard</span>
            </div>
        </div>
    );
};

export default Desktop;