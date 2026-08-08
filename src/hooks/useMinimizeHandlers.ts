import type useWindowState from './useWindowState';

type WindowState = ReturnType<typeof useWindowState>;
type MinimizeHandler = (value: boolean | ((prev: boolean) => boolean)) => void;

interface UseMinimizeHandlersParams {
    playStart: () => void;
    playMinimize: () => void;
    minesweeper: WindowState;
    solitaire: WindowState;
    paint: WindowState;
    calculator: WindowState;
    terminal: WindowState;
    notepad: WindowState;
    wordpad: WindowState;
    filemanager: WindowState;
    mediaplayer: WindowState;
    displayproperties: WindowState;
    keyboard: WindowState;
    volumecontrol: WindowState;
    plus: WindowState;
    charactermap: WindowState;
    outlook: WindowState;
    picturefax: WindowState;
    help: WindowState;
}

const useMinimizeHandlers = (params: UseMinimizeHandlersParams) => {
    const { playStart, playMinimize } = params;

    const makeMinimizeHandler = (windowState: WindowState): MinimizeHandler => (value) => {
        const next = typeof value === 'function' ? value(windowState.isMinimized) : value;
        if (next) playMinimize(); else playStart();
        windowState.setIsMinimized(next);
    };

    return {
        handleMinesweeperMinimize: makeMinimizeHandler(params.minesweeper),
        handleSolitaireMinimize: makeMinimizeHandler(params.solitaire),
        handlePaintMinimize: makeMinimizeHandler(params.paint),
        handleCalculatorMinimize: makeMinimizeHandler(params.calculator),
        handleTerminalMinimize: makeMinimizeHandler(params.terminal),
        handleNotepadMinimize: makeMinimizeHandler(params.notepad),
        handleWordpadMinimize: makeMinimizeHandler(params.wordpad),
        handleFileManagerMinimize: makeMinimizeHandler(params.filemanager),
        handleMediaPlayerMinimize: makeMinimizeHandler(params.mediaplayer),
        handleDisplayPropertiesMinimize: makeMinimizeHandler(params.displayproperties),
        handleKeyboardMinimize: makeMinimizeHandler(params.keyboard),
        handleVolumeControlMinimize: makeMinimizeHandler(params.volumecontrol),
        handlePlusMinimize: makeMinimizeHandler(params.plus),
        handleCharacterMapMinimize: makeMinimizeHandler(params.charactermap),
        handleOutlookMinimize: makeMinimizeHandler(params.outlook),
        handlePictureFaxMinimize: makeMinimizeHandler(params.picturefax),
        handleHelpMinimize: makeMinimizeHandler(params.help),
    };
};

export default useMinimizeHandlers;