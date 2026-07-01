import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/Windows-XP/',
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    minesweeper: ['./src/components/minesweeper/Game.tsx'],
                    ie: ['./src/components/IE/IEWindow.tsx'],
                    paint: ['./src/components/Paint/Paint.tsx'],
                    calculator: ['./src/components/Calculator/Calculator.tsx'],
                    terminal: ['./src/components/terminal/Terminal.tsx'],
                    login: ['./src/components/LoginScreen.tsx'],
                    loading: ['./src/components/XPLoading.tsx'],
                    footer: ['./src/components/taskbarAndStart/Footer.tsx'],
                    startmenu: ['./src/components/taskbarAndStart/StartMenu.tsx'],
                    errorbubble: ['./src/components/taskbarAndStart/ErrorBubble.tsx'],
                    criticalerror: ['./src/components/CriticalError.tsx'],
                    notepad: ['./src/components/notepad/Notepad.tsx'],
                    wordpad: ['./src/components/wordpad/Wordpad.tsx'],
                    shutdownscreen: ['./src/components/ShutdownScreen.tsx'],
                    shutdowndisplay: ['./src/components/ShutdownDisplay.tsx'],
                    filemanager: ['./src/components/files/FileManager.tsx'],
                    mediaplayer: ['./src/components/mediaPlayer/MediaPlayer.tsx'],
                    solitaire: ['./src/components/solitaire/Solitaire.tsx'],
                    keyboard: ['./src/components/keyboard/Keyboard.tsx'],
                    displayproperties: ['./src/components/display-properties/DisplayProperties.tsx'],
                    screensaver: ['./src/components/ScreensaverOverlay.tsx'],
                    run: ['./src/components/runDialog/Run.tsx'],
                    volumecontrol: ['./src/components/volume-control/VolumeControl.tsx'],
                    plus: ['./src/components/plus/PlusMain.tsx'],
                }
            }
        }
    }
})
