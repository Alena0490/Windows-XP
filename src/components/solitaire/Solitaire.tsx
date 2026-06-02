import { useState } from 'react'
import SolitaireMenu from './SolitaireMenu'
import SolitaireApp from './SolitaireApp'
import useDraggable from '../../hooks/useDraggable';
import { createDeck, shuffleDeck, CARD_BACKS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import SolitaireIcon from '../../img/Solitaire.webp'
import '../../App.css'
import './Solitaire.css'

export interface GameState {
    tableau: Card[][];
    stock: Card[];
    waste: Card[];
    foundations: Card[][];
}

const DEFAULT_CARD_BACK = CARD_BACKS[10];

const initGame = (): GameState => {
    const deck = shuffleDeck(createDeck());
    const tableau: Card[][] = Array.from({ length: 7 }, (_, col) =>
        deck.splice(0, col + 1).map((card, i, arr) => ({
            ...card,
            faceUp: i === arr.length - 1,
        }))
    );
    return {
        tableau,
        stock: deck,
        waste: [],
        foundations: [[], [], [], []],
    };
};

interface SolitaireProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    globalVolume: number;
    globalMuted: boolean;
}

const Solitaire = ({
    isFullscreen, 
    setIsFullscreen, 
    isMinimized, 
    setIsMinimized, 
    onClose, 
    onMouseDown, 
    globalVolume, 
    globalMuted
}: SolitaireProps) => {

    const { position, handleMouseDown } = useDraggable(400, 150);
    const [gameState, setGameState] = useState<GameState>(initGame);
    const [cardBack, setCardBack] = useState(DEFAULT_CARD_BACK);
    const [openModal, setOpenModal] = useState<'about' | 'deck' | null>(null);

    const handleExit = () => onClose();

    return (
        <div
            className={[
                'app-window',
                'solitaire-window',
                isMinimized && 'solitaire--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'solitaire--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='game-icon' src={SolitaireIcon} alt='Solitaire Icon' />
                    Solitaire
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            setIsFullscreen(prev => !prev);
                        }}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={handleExit}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>
            <SolitaireMenu
                onClose={handleExit}
                windowPosition={position}
                openModal={openModal}
                setOpenModal={setOpenModal}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                cardBack={cardBack}
                setCardBack={setCardBack}
            />
            <SolitaireApp
                gameState={gameState}
                setGameState={setGameState}
                cardBack={cardBack}
                setCardBack={setCardBack}
            />
            <div className='solitaire-statusbar'>
                <div className="solitaire-helper"></div>
                <div className="solitaire-score">Score:</div>
                <div className="solitaire-time">Time:</div>
            </div>           
        </div>
    );
};

export default Solitaire;