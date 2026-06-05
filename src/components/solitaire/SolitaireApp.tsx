import type { GameState, DragSource } from './Solitaire';

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
    drawCount: 1 | 3;
    onStockClick: () => void;
    onWasteClick: () => void;
    onTableauClick?: (pileIndex: number, cardIndex: number) => void;
    onDrop: (targetPileIndex: number, item: DragSource) => void;
    onFoundationDrop: (foundationIndex: number, item: DragSource) => void;
    outlineDragging: boolean;
}

/* ─────────────────────────────────────────
   Game Board
   Top row: stock + waste + four foundations.
   Bottom: seven tableau columns.
───────────────────────────────────────── */
const SolitaireApp = ({
    gameState,
    cardBack,
    drawCount,
    onStockClick,
    onWasteClick,
    onTableauClick,
    onDrop,
    onFoundationDrop,
    outlineDragging,
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
                    drawCount={drawCount}
                     outlineDragging={outlineDragging}
                />
                {/* Spacer between waste and foundations */}
                <div />
                <div className='solitaire-foundations'>
                    <FoundationPile
                        cards={gameState.foundations[0]}
                        cardBack={cardBack}
                        onDrop={(item) => onFoundationDrop(0, item)}
                        foundationIndex={0}
                        outlineDragging={outlineDragging}
                    />
                    <FoundationPile
                        cards={gameState.foundations[1]}
                        cardBack={cardBack}
                        onDrop={(item) => onFoundationDrop(1, item)}
                        foundationIndex={1}
                        outlineDragging={outlineDragging}
                    />
                    <FoundationPile
                        cards={gameState.foundations[2]}
                        cardBack={cardBack}
                        onDrop={(item) => onFoundationDrop(2, item)}
                        foundationIndex={2}
                        outlineDragging={outlineDragging}
                    />
                    <FoundationPile
                        cards={gameState.foundations[3]}
                        cardBack={cardBack}
                        onDrop={(item) => onFoundationDrop(3, item)}
                        foundationIndex={3}
                        outlineDragging={outlineDragging}
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
                        pileIndex={i}
                        onCardClick={(cardIndex) => onTableauClick?.(i, cardIndex)}
                        onDrop={(item) => onDrop(i, item)}
                        outlineDragging={outlineDragging}
                    />
                ))}
            </div>
        </div>
    );
};

export default SolitaireApp;
