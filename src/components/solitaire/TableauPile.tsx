import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Tableau Pile
   One of the seven columns. Cards are stacked with a vertical offset so
   every card remains partially visible; empty piles act as drop targets.
───────────────────────────────────────── */
interface TableauPileProps {
    cards: Card[];
    cardBack: string;
    onCardClick?: (index: number) => void;
    onDragStart?: (index: number) => void;
    onDrop?: () => void;
    onDragOver: (e: React.DragEvent) => void;
}

const TableauPile = ({
    cards,
    cardBack,
    onCardClick,
    onDragStart,
    onDrop,
    onDragOver,
}: TableauPileProps) => {
    return (
        <div className='tableau-pile' onDrop={onDrop} onDragOver={onDragOver}>
            {cards.length === 0 ? (
                <div className='card card--empty' />
            ) : (
                cards.map((card, i) => (
                    <div
                        key={i}
                        style={{ 
                            position: 'absolute', 
                            top: `${cards.slice(0, i).reduce((acc, c) => acc + (c.faceUp ? 20 : 5), 0)}px`, 
                            zIndex: i 
                        }}
                    >
                        <CardComponent
                            card={card}
                            cardBack={cardBack}
                            onClick={() => onCardClick?.(i)}
                            onDragStart={() => onDragStart?.(i)}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default TableauPile;
