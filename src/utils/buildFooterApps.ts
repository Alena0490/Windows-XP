import type { AppState } from '../components/taskbarAndStart/Footer';
import type { IEInstance } from '../hooks/useIEInstance';

import MinesweeperIcon from '../img/Minesweeper.webp';
import SolitaireIcon from '../img/Solitaire.webp';
import PaintIcon from '../img/Paint.webp';
import CalculatorIcon from '../img/Calculator.webp';
import TerminalIcon from '../img/CommandPrompt.webp';
import NotepadIcon from '../img/Notepad.webp';
import WordpadHeadingIcon from '../components/wordpad/img/WordpadHeading.webp';
import FolderIcon from '../img/FolderClosed.webp';
import MediaPlayerIcon from '../img/WindowsMediaPlayer 9.webp';
import DisplayPropertiesIcon from '../img/DisplayProperties.webp';
import KeyboardIcon from '../img/On-Screen Keyboard.webp';
import VolumeIcon from '../img/VolumeLevel.webp';
import PlusIcon from '../img/Plus.webp';
import CharmapIcon from '../img/Charmap.webp';
import OutlookIcon from '../img/OutlookExpress.webp';

type MinimizeHandler = (value: boolean | ((prev: boolean) => boolean)) => void;

interface BuildFooterAppsParams {
    isMinesweeperOpen: boolean;
    minesweeperIsMinimized: boolean;
    handleMinesweeperMinimize: MinimizeHandler;
    openMinesweeper: () => void;

    isSolitaireOpen: boolean;
    solitaireIsMinimized: boolean;
    handleSolitaireMinimize: MinimizeHandler;
    openSolitaire: () => void;

    ieInstances: IEInstance[];
    minimizeIE: (id: string, v: boolean | ((prev: boolean) => boolean)) => void;

    isPaintOpen: boolean;
    paintIsMinimized: boolean;
    handlePaintMinimize: MinimizeHandler;
    openPaint: () => void;

    isCalculatorOpen: boolean;
    calculatorIsMinimized: boolean;
    handleCalculatorMinimize: MinimizeHandler;
    openCalculator: () => void;

    isTerminalOpen: boolean;
    terminalIsMinimized: boolean;
    handleTerminalMinimize: MinimizeHandler;
    openTerminal: () => void;

    isNotepadOpen: boolean;
    notepadIsMinimized: boolean;
    handleNotepadMinimize: MinimizeHandler;
    openNotepad: (content?: string, fileName?: string) => void;

    isWordpadOpen: boolean;
    wordpadIsMinimized: boolean;
    handleWordpadMinimize: MinimizeHandler;
    openWordpad: (content?: string, fileName?: string) => void;

    isFileManagerOpen: boolean;
    filemanagerIsMinimized: boolean;
    handleFileManagerMinimize: MinimizeHandler;
    bringToFront: (id: string) => void;

    isMediaPlayerOpen: boolean;
    mediaplayerIsMinimized: boolean;
    handleMediaPlayerMinimize: MinimizeHandler;
    openMediaPlayer: () => void;

    isDisplayPropertiesOpen: boolean;
    displaypropertiesIsMinimized: boolean;
    handleDisplayPropertiesMinimize: MinimizeHandler;
    openDisplayProperties: () => void;

    isKeyboardOpen: boolean;
    keyboardIsMinimized: boolean;
    handleKeyboardMinimize: MinimizeHandler;
    openKeyboard: () => void;

    isVolumeControlOpen: boolean;
    volumecontrolIsMinimized: boolean;
    handleVolumeControlMinimize: MinimizeHandler;
    openVolumeControl: () => void;

    isPlusOpen: boolean;
    plusIsMinimized: boolean;
    handlePlusMinimize: MinimizeHandler;
    openPlus: () => void;

    isCharacterMapOpen: boolean;
    charactermapIsMinimized: boolean;
    handleCharacterMapMinimize: MinimizeHandler;
    openCharacterMap: () => void;

    isOutlookOpen: boolean;
    outlookIsMinimized: boolean;
    handleOutlookMinimize: MinimizeHandler;
    openOutlook: () => void;
}

const buildFooterApps = (params: BuildFooterAppsParams): AppState[] => [
    {
        id: 'minesweeper',
        isOpen: params.isMinesweeperOpen,
        isMinimized: params.minesweeperIsMinimized,
        setMinimized: params.handleMinesweeperMinimize,
        onOpen: params.openMinesweeper,
        icon: MinesweeperIcon,
        label: 'Minesweeper',
    },
    {
        id: 'solitaire',
        isOpen: params.isSolitaireOpen,
        isMinimized: params.solitaireIsMinimized,
        setMinimized: params.handleSolitaireMinimize,
        onOpen: params.openSolitaire,
        icon: SolitaireIcon,
        label: 'Solitaire',
    },
    ...params.ieInstances.map(w => ({
        id: w.id,
        isOpen: true,
        isMinimized: w.isMinimized,
        setMinimized: (value: boolean | ((prev: boolean) => boolean)) => params.minimizeIE(w.id, value),
        onOpen: () => params.minimizeIE(w.id, false),
        icon: w.favicon,
        label: w.title,
    })),
    {
        id: 'paint',
        isOpen: params.isPaintOpen,
        isMinimized: params.paintIsMinimized,
        setMinimized: params.handlePaintMinimize,
        onOpen: params.openPaint,
        icon: PaintIcon,
        label: 'Paint',
    },
    {
        id: 'calculator',
        isOpen: params.isCalculatorOpen,
        isMinimized: params.calculatorIsMinimized,
        setMinimized: params.handleCalculatorMinimize,
        onOpen: params.openCalculator,
        icon: CalculatorIcon,
        label: 'Calculator',
    },
    {
        id: 'terminal',
        isOpen: params.isTerminalOpen,
        isMinimized: params.terminalIsMinimized,
        setMinimized: params.handleTerminalMinimize,
        onOpen: params.openTerminal,
        icon: TerminalIcon,
        label: 'Command Prompt',
    },
    {
        id: 'notepad',
        isOpen: params.isNotepadOpen,
        isMinimized: params.notepadIsMinimized,
        setMinimized: params.handleNotepadMinimize,
        onOpen: () => params.openNotepad(),
        icon: NotepadIcon,
        label: 'Notepad',
    },
    {
        id: 'wordpad',
        isOpen: params.isWordpadOpen,
        isMinimized: params.wordpadIsMinimized,
        setMinimized: params.handleWordpadMinimize,
        onOpen: () => params.openWordpad(),
        icon: WordpadHeadingIcon,
        label: 'WordPad',
    },
    {
        id: 'filemanager',
        isOpen: params.isFileManagerOpen,
        isMinimized: params.filemanagerIsMinimized,
        setMinimized: params.handleFileManagerMinimize,
        onOpen: () => {
            if (params.filemanagerIsMinimized) params.handleFileManagerMinimize(false);
            params.bringToFront('filemanager');
        },
        icon: FolderIcon,
        label: 'My Computer',
    },
    {
        id: 'mediaplayer',
        isOpen: params.isMediaPlayerOpen,
        isMinimized: params.mediaplayerIsMinimized,
        setMinimized: params.handleMediaPlayerMinimize,
        onOpen: params.openMediaPlayer,
        icon: MediaPlayerIcon,
        label: 'Windows Media Player',
    },
    {
        id: 'displayproperties',
        isOpen: params.isDisplayPropertiesOpen,
        isMinimized: params.displaypropertiesIsMinimized,
        setMinimized: params.handleDisplayPropertiesMinimize,
        onOpen: params.openDisplayProperties,
        icon: DisplayPropertiesIcon,
        label: 'Display Properties',
    },
    {
        id: 'keyboard',
        isOpen: params.isKeyboardOpen,
        isMinimized: params.keyboardIsMinimized,
        setMinimized: params.handleKeyboardMinimize,
        onOpen: params.openKeyboard,
        icon: KeyboardIcon,
        label: 'On-Screen Keyboard',
    },
    {
        id: 'volumecontrol',
        isOpen: params.isVolumeControlOpen,
        isMinimized: params.volumecontrolIsMinimized,
        setMinimized: params.handleVolumeControlMinimize,
        onOpen: params.openVolumeControl,
        icon: VolumeIcon,
        label: 'Volume Control',
    },
    {
        id: 'plus',
        isOpen: params.isPlusOpen,
        isMinimized: params.plusIsMinimized,
        setMinimized: params.handlePlusMinimize,
        onOpen: params.openPlus,
        icon: PlusIcon,
        label: 'Windows Plus!',
    },
    {
        id: 'charactermap',
        isOpen: params.isCharacterMapOpen,
        isMinimized: params.charactermapIsMinimized,
        setMinimized: params.handleCharacterMapMinimize,
        onOpen: params.openCharacterMap,
        icon: CharmapIcon,
        label: 'Character Map',
    },
    {
        id: 'outlook',
        isOpen: params.isOutlookOpen,
        isMinimized: params.outlookIsMinimized,
        setMinimized: params.handleOutlookMinimize,
        onOpen: params.openOutlook,
        icon: OutlookIcon,
        label: 'Outlook Express',
    },
];

export default buildFooterApps;