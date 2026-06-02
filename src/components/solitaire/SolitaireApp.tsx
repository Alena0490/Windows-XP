import type { GameState } from './Solitaire';

import StockPile from './StockPile';
import WastePile from './WastePile';
import FoundationPile from './FoundantionPile';
import TableauPile from './TableauPile';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface SolitaireAppProps {
    gameState: GameState;
    cardBack: string;
    onStockClick: () => void;
    onWasteClick: () => void;
    onTableauClick?: (pileIndex: number, cardIndex: number) => void;
    onDragStart: (source: 'waste' | 'tableau', pileIndex?: number, cardIndex?: number) => void;
    onDrop: (targetPileIndex: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onFoundationDrop: (foundationIndex: number) => void;
}

/* ─────────────────────────────────────────
   Game Board
   Top row: stock + waste + four foundations.
   Bottom: seven tableau columns.
───────────────────────────────────────── */
const SolitaireApp = ({
    gameState,
    cardBack,
    onStockClick,
    onWasteClick,
    onTableauClick,
    onDragStart,
    onDrop,
    onDragOver,
    onFoundationDrop,
}: SolitaireAppProps) => {
    return (
        <div className='solitaire-app solitaire-game'>
            {/* Top row */}
            <div className='solitaire-top'>
                <StockPile
                    cards={gameState.stock}
                    cardBack={cardBack}
                    onClick={onStockClick}
                />
                <WastePile
                    cards={gameState.waste}
                    cardBack={cardBack}
                    onClick={onWasteClick}
                    onDragStart={() => onDragStart('waste')}
                />
                {/* Spacer between waste and foundations */}
                <div />
                <div className='solitaire-foundations'>
                    <FoundationPile 
                        cards={gameState.foundations[0]} 
                        cardBack={cardBack} 
                        onDrop={() => onFoundationDrop(0)} 
                        onDragOver={onDragOver} 
                    />
                    <FoundationPile 
                        cards={gameState.foundations[1]} 
                        cardBack={cardBack}
                        onDrop={() => onFoundationDrop(1)} 
                        onDragOver={onDragOver}
                    />
                    <FoundationPile 
                        cards={gameState.foundations[2]} 
                        cardBack={cardBack} 
                        onDrop={() => onFoundationDrop(2)} 
                        onDragOver={onDragOver}
                    />
                    <FoundationPile 
                        cards={gameState.foundations[3]} 
                        cardBack={cardBack}
                        onDrop={() => onFoundationDrop(3)}
                        onDragOver={onDragOver} 
                    />
                </div>
            </div>

            {/* Tableau columns */}
            <div className='solitaire-tableau'>
                {gameState.tableau.map((pile, i) => (
                    <TableauPile
                        key={i}
                        cards={pile}
                        cardBack={cardBack}
                        onCardClick={(cardIndex) => onTableauClick?.(i, cardIndex)}
                        onDragStart={(cardIndex) => onDragStart('tableau', i, cardIndex)}
                        onDrop={() => onDrop(i)}
                        onDragOver={onDragOver}
                    />
                ))}
            </div>
        </div>
    );
};

export default SolitaireApp;
