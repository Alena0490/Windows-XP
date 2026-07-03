interface BuildOpenAppHandlerParams {
    openMinesweeper: () => void;
    openIE: (url?: string) => void;
    openPaint: () => void;
    openNotepad: (content?: string, fileName?: string) => void;
    openFileManager: (path?: string[], openSearch?: boolean) => void;
    openCalculator: () => void;
    openTerminal: () => void;
    openMediaPlayer: () => void;
    openSolitaire: () => void;
    openDisplayProperties: () => void;
    openKeyboard: () => void;
    readmeContent: string;
}

const buildOpenAppHandler = (params: BuildOpenAppHandlerParams) => (id: string) => {
    switch (id) {
        case 'desk1': params.openMinesweeper(); break;
        case 'desk2': params.openIE(); break;
        case 'desk3': params.openPaint(); break;
        case 'desk4': params.openNotepad(); break;
        case 'desk5': params.openFileManager(['localdisc']); break;
        case 'desk6': params.openCalculator(); break;
        case 'desk7': params.openTerminal(); break;
        case 'desk8': params.openFileManager(); break;
        case 'desk9': params.openFileManager(['recyclebin']); break;
        case 'desk10': params.openNotepad(params.readmeContent, 'About this project.md'); break;
        case 'desk11': params.openIE('https://alena0490.github.io/Pacman/'); break;
        case 'desk12': params.openIE('https://alena0490.github.io/Nu-pogodi/'); break;
        case 'desk13': params.openMediaPlayer(); break;
        case 'desk14': params.openSolitaire(); break;
        case 'desk15': params.openDisplayProperties(); break;
        case 'desk-keyboard': params.openKeyboard(); break;
        case 'prog-keyboard': params.openKeyboard(); break;
    }
};

export default buildOpenAppHandler;