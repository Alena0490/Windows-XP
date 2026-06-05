import { useState, useEffect, useRef } from 'react';
// import useSound from '../../hooks/useSound';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useDraggable from '../../hooks/useDraggable';
import SolitaireMenu from './SolitaireMenu';
import SolitaireApp from './SolitaireApp';
import WinAnimation from './WinAnimation';
import CardDragLayer from './CardDragLayer';
import { createDeck, shuffleDeck, CARD_BACKS, canPlaceOnTableau } from './data/dataSolitaire';
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
export type DragSourceKind = 'waste' | 'tableau' | 'foundation';

type Selection = {
    source: SelectionSource;
    pileIndex?: number;
    cardIndex?: number;
};

export type DragSource = {
    source: DragSourceKind;
    pileIndex?: number;
    cardIndex?: number;
    cards?: Card[];
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
    const [time, setTime] = useState(0);
    const [score, setScore] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [history, setHistory] = useState<GameState[]>([]);
    const [timedGame, setTimedGame] = useState(true);
    const timeRef = useRef(0);

    // Player preferences
    const [cardBack, setCardBack] = useState(DEFAULT_CARD_BACK);

    // UI state
    const [openModal, setOpenModal] = useState<'about' | 'deck' |'options' |  null>(null);
    const [selected, setSelected] = useState<Selection | null>(null);
    const [draw, setDraw] = useState<'one' | 'three'>('one')

    // Sounds
    // const { playShuffle, playFlip } = useSound(globalVolume, globalMuted);

      
    /* ─────────────────────────────────────────
       Timer
       Movers only while game is active, and stops at 999 seconds. Time is reset to 0 on every move for demo purposes; remove this in production.
    ───────────────────────────────────────── */
    useEffect(() => {
        if (!initGame || time >= 999  || gameWon|| !timedGame) return;
        const timer = setInterval(() => {
            setTime(prev => {
                const next = Math.min(999, prev + 1);
                timeRef.current = next;
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [time, gameWon, timedGame]);

    const formatTime = (t: number) => {
        const m = Math.floor(t / 60).toString().padStart(2, '0');
        const s = (t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    
    /* ─────────────────────────────────────────
       Card Movement
       Shared mover used by both click-to-move and drag-to-drop flows.
    ───────────────────────────────────────── */
    const moveCard = (targetPileIndex: number, item: DragSource) => {
        setHistory(prev => [...prev, gameState]);
        setGameState(prev => {
            const newState = { ...prev, tableau: prev.tableau.map(p => [...p]) };

            let card;
            if (item.source === 'waste') {
                card = prev.waste[prev.waste.length - 1];
            } else if (item.source === 'tableau') {
                const pile = prev.tableau[item.pileIndex!];
                card = pile[item.cardIndex!];
            } else if (item.source === 'foundation') {
                card = prev.foundations[item.pileIndex!][item.cardIndex!];
            } else return prev;

            if (!card) return prev;
            if (!canPlaceOnTableau(card, prev.tableau[targetPileIndex])) return prev;

            if (item.source === 'waste') {
                newState.waste = prev.waste.slice(0, -1);
                newState.tableau[targetPileIndex] = [...newState.tableau[targetPileIndex], card];
            } else if (item.source === 'tableau') {
                newState.tableau[item.pileIndex!] = prev.tableau[item.pileIndex!].slice(0, item.cardIndex);
                const cards = prev.tableau[item.pileIndex!].slice(item.cardIndex);
                newState.tableau[targetPileIndex] = [...newState.tableau[targetPileIndex], ...cards];
            } else if (item.source === 'foundation') {
                newState.foundations = prev.foundations.map(f => [...f]);
                newState.foundations[item.pileIndex!] = prev.foundations[item.pileIndex!].slice(0, -1);
                newState.tableau[targetPileIndex] = [...newState.tableau[targetPileIndex], card];
            }
            return newState;
        });
        if (item.source === 'waste') setScore(s => s + 5);
        if (item.source === 'foundation') setScore(prev => prev - 15);
    };

    // Go Back
    const handleUndo = () => {
        if (history.length === 0) return;
        setGameState(history[history.length - 1]);
        setHistory(prev => prev.slice(0, -1));
    };
   
    /* ─────────────────────────────────────────
       Window Handlers
    ───────────────────────────────────────── */
    const handleExit = () => onClose();

    const handleWinClick = () => {
        setGameWon(false);
        setGameState(initGame());
        setScore(0);
        setTime(0);
    };

    useEffect(() => {
        if (!gameWon) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleWinClick();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameWon]);

    /* ─────────────────────────────────────────
       Pile Click Handlers
    ───────────────────────────────────────── */
    // Stock: draw next card to waste, or recycle waste back into stock when empty.
    const handleStockClick = () => {
        const count = draw === 'three' ? 3 : 1;
        setGameState(prev => {
            if (prev.stock.length === 0) {
                return {
                    ...prev,
                    stock: [...prev.waste].reverse().map(c => ({ ...c, faceUp: false })),
                    waste: [],
                };
            }
            const take = Math.min(count, prev.stock.length);
            const drawn = prev.stock
                .slice(-take)
                .reverse()
                .map(c => ({ ...c, faceUp: true }));
            return {
                ...prev,
                stock: prev.stock.slice(0, -take),
                waste: [...prev.waste, ...drawn],
            };
        });
        // playFlip();
    };

    // Waste: select the top card so a follow-up click moves it.
    const handleWasteClick = () => {
        if (gameState.waste.length === 0) return;
        setSelected({ source: 'waste' });
    };

    // Tableau: first click selects a face-up card; second click moves the selection here.
    const handleTableauClick = (pileIndex: number, cardIndex: number) => {
        const pile = gameState.tableau[pileIndex];
        const card = pile[cardIndex];
        
        // Turn face-up if it's the top card and currently face-down
        if (!card.faceUp && cardIndex === pile.length - 1) {
            setGameState(prev => {
                const newTableau = prev.tableau.map(p => [...p]);
                newTableau[pileIndex][cardIndex] = { ...card, faceUp: true };
                return { ...prev, tableau: newTableau };
            });
            setScore(prev => prev + 5);
            // playFlip();
            return;
        }
         
        if (selected === null) {
            if (!card.faceUp) return;
            setSelected({ source: 'tableau', pileIndex, cardIndex });
        } else {
            if (selected.source !== 'foundation') {
                moveCard(pileIndex, selected as DragSource);
            }
            setSelected(null);
        }
    };

    /* ─────────────────────────────────────────
       Drag & Drop Handlers
       react-dnd passes the dragged item directly to the drop callback,
       so no shared drag-source state is required here.
    ───────────────────────────────────────── */
    const handleDrop = (targetPileIndex: number, item: DragSource) => {
        moveCard(targetPileIndex, item);
    };

    const handleFoundationDrop = (foundationIndex: number, item: DragSource) => {
        setGameState(prev => {
            const newState = {
                ...prev,
                tableau: prev.tableau.map(p => [...p]),
                foundations: prev.foundations.map(f => [...f])
            };

            let card: Card | undefined;
            if (item.source === 'waste') {
                card = prev.waste[prev.waste.length - 1];
            } else if (item.source === 'tableau') {
                const pile = prev.tableau[item.pileIndex!];
                card = pile[item.cardIndex!];
            }

            if (!card) return prev;

            const foundation = prev.foundations[foundationIndex];

            // Ace must be placed on empty foundation
            if (foundation.length === 0 && card.value !== 0) return prev;
            // Next cards must be the same suit and one rank higher
            if (foundation.length > 0) {
                const top = foundation[foundation.length - 1];
                if (card.suit !== top.suit || card.value !== top.value + 1) return prev;
            }

            if (item.source === 'waste') {
                newState.waste = prev.waste.slice(0, -1);
            } else if (item.source === 'tableau') {
                const pile = prev.tableau[item.pileIndex!];
                newState.tableau[item.pileIndex!] = pile.slice(0, item.cardIndex);
            }
            newState.foundations[foundationIndex] = [...foundation, card];
            const allFull = newState.foundations.every(f => f.length === 13);
            if (allFull) setGameWon(true);
            return newState;
        });
        setScore(prev => prev + 10);
    };

    /* ─────────────────────────────────────────
       Render
    ───────────────────────────────────────── */
    return (
        <DndProvider backend={HTML5Backend}>
            <CardDragLayer />
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
                    // onShuffle={playShuffle}
                    onDeal={() => {
                        // playShuffle();
                        setGameState(initGame());
                        setSelected(null);
                        setScore(0);
                        setTime(0);
                        setGameWon(false)
                    }}
                    onUndo={handleUndo}
                    draw={draw}
                    setDraw={setDraw}
                    timedGame={timedGame}
                    setTimedGame={setTimedGame}
                    showStatusBar={showStatusBar}
                    setShowStatusBar={setShowStatusBar}
                />

                {/* Game board */}
                <SolitaireApp
                    gameState={gameState}
                    cardBack={cardBack}
                    drawCount={draw === 'three' ? 3 : 1}
                    onStockClick={handleStockClick}
                    onWasteClick={handleWasteClick}
                    onTableauClick={handleTableauClick}
                    onDrop={handleDrop}
                    onFoundationDrop={handleFoundationDrop}
                />

                {/* Status bar */}
                {showStatusBar && (
                    <div className='solitaire-statusbar'>
                        <div className='solitaire-helper'>
                            {gameWon && <div>Press Esc or click to stop...</div>}
                        </div>
                        <div className='solitaire-score'>Score: {score} </div>
                        {timedGame && (
                            <div className='solitaire-time'>Time:
                                <output className='game-time'> {formatTime(time)}</output>
                            </div>
                        )}
                    </div>
                )}
                {gameWon && (
                    <WinAnimation 
                        foundations={gameState.foundations} 
                        onNewGame={handleWinClick} 
                    />
                )}
            </div>
        </DndProvider>
    );

};

export default Solitaire;
