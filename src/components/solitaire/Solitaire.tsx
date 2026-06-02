import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import SolitaireMenu from './SolitaireMenu';
import SolitaireApp from './SolitaireApp';
import { createDeck, shuffleDeck, CARD_BACKS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import SolitaireIcon from '../../img/Solitaire.webp';
import '../../App.css';
import './Solitaire.css';

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
export interface GameState {
    tableau: Card[][];
    stock: Card[];
    waste: Card[];
    foundations: Card[][];
}

type SelectionSource = 'waste' | 'tableau' | 'foundation';
type DragSourceKind = 'waste' | 'tableau';

type Selection = {
    source: SelectionSource;
    pileIndex?: number;
    cardIndex?: number;
};

type DragSource = {
    source: DragSourceKind;
    pileIndex?: number;
    cardIndex?: number;
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

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const DEFAULT_CARD_BACK = CARD_BACKS[10];

/* ─────────────────────────────────────────
   Initial Game Setup
   Deals 1..7 cards into the tableau columns, top card face-up.
   Remaining deck becomes the stock; waste and foundations start empty.
───────────────────────────────────────── */
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

const Solitaire = ({
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onClose,
    onMouseDown,
    globalVolume,
    globalMuted,
}: SolitaireProps) => {

    /* ─────────────────────────────────────────
       State
    ───────────────────────────────────────── */
    // Window
    const { position, handleMouseDown } = useDraggable(400, 150);

    // Game data
    const [gameState, setGameState] = useState<GameState>(initGame);

    // Player preferences
    const [cardBack, setCardBack] = useState(DEFAULT_CARD_BACK);

    // UI state
    const [openModal, setOpenModal] = useState<'about' | 'deck' | null>(null);
    const [selected, setSelected] = useState<Selection | null>(null);
    const [dragSource, setDragSource] = useState<DragSource | null>(null);

    /* ─────────────────────────────────────────
       Card Movement
       Shared mover used by both click-to-move and drag-to-drop flows.
    ───────────────────────────────────────── */
    const moveCard = (targetPileIndex: number) => {
        if (!dragSource) return;
        
        setGameState(prev => {
            const newState = { ...prev, tableau: prev.tableau.map(p => [...p]) };
            
            let card;
            if (dragSource.source === 'waste') {
                card = prev.waste[prev.waste.length - 1];
                newState.waste = prev.waste.slice(0, -1);
            } else if (dragSource.source === 'tableau') {
                const pile = prev.tableau[dragSource.pileIndex!];
                card = pile[dragSource.cardIndex!];
                newState.tableau[dragSource.pileIndex!] = pile.slice(0, dragSource.cardIndex);
            } else return prev;

            newState.tableau[targetPileIndex] = [...newState.tableau[targetPileIndex], card];
            return newState;
        });
    };

    /* ─────────────────────────────────────────
       Window Handlers
    ───────────────────────────────────────── */
    const handleExit = () => onClose();

    /* ─────────────────────────────────────────
       Pile Click Handlers
    ───────────────────────────────────────── */
    // Stock: draw next card to waste, or recycle waste back into stock when empty.
    const handleStockClick = () => {
        setGameState(prev => {
            if (prev.stock.length === 0) {
                return {
                    ...prev,
                    stock: [...prev.waste].reverse().map(c => ({ ...c, faceUp: false })),
                    waste: [],
                };
            }
            const card = { ...prev.stock[prev.stock.length - 1], faceUp: true };
            return {
                ...prev,
                stock: prev.stock.slice(0, -1),
                waste: [...prev.waste, card],
            };
        });
    };

    // Waste: select the top card so a follow-up click moves it.
    const handleWasteClick = () => {
        if (gameState.waste.length === 0) return;
        setSelected({ source: 'waste' });
    };

    // Tableau: first click selects a face-up card; second click moves the selection here.
    const handleTableauClick = (pileIndex: number, cardIndex: number) => {
        if (selected === null) {
            const pile = gameState.tableau[pileIndex];
            const card = pile[cardIndex];
            if (!card.faceUp) return;
            setSelected({ source: 'tableau', pileIndex, cardIndex });
        } else {
            moveCard(pileIndex);
            setSelected(null);
        }
    };

    /* ─────────────────────────────────────────
       Drag & Drop Handlers
    ───────────────────────────────────────── */
    const handleDragStart = (
        source: DragSourceKind,
        pileIndex?: number,
        cardIndex?: number,
    ) => {
        setDragSource({ source, pileIndex, cardIndex });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetPileIndex: number) => {
        if (!dragSource) return;
        moveCard(targetPileIndex);
        setDragSource(null);
    };

    /* ─────────────────────────────────────────
       Render
    ───────────────────────────────────────── */
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
            {/* Title bar */}
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

            {/* Menu bar */}
            <SolitaireMenu
                onClose={handleExit}
                windowPosition={position}
                openModal={openModal}
                setOpenModal={setOpenModal}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                cardBack={cardBack}
                setCardBack={setCardBack}
                onDeal={() => {
                    setGameState(initGame());
                    setSelected(null);
                }}  
            />

            {/* Game board */}
            <SolitaireApp
                gameState={gameState}
                cardBack={cardBack}
                onStockClick={handleStockClick}
                onWasteClick={handleWasteClick}
                onTableauClick={handleTableauClick}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            />

            {/* Status bar */}
            <div className='solitaire-statusbar'>
                <div className='solitaire-helper'></div>
                <div className='solitaire-score'>Score:</div>
                <div className='solitaire-time'>Time:</div>
            </div>
        </div>
    );
};

export default Solitaire;
