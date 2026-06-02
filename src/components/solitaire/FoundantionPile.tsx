import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Foundation Pile
   One of four piles built Ace → King in a single suit. Renders only the
   top card; empty piles show the foundation slot graphic.
───────────────────────────────────────── */
interface FoundationPileProps {
    cards: Card[];
    cardBack: string;
    onDrop?: React.DragEventHandler<HTMLDivElement>;
    onDragOver: (e: React.DragEvent) => void;
}

const FoundationPile = ({ 
    cards, 
    cardBack, 
    onDrop, 
    onDragOver 
}: FoundationPileProps) => {
    return (
        <div className='foundation-pile' onDrop={onDrop} onDragOver={onDragOver}>
            {cards.length > 0 ? (
                <CardComponent
                    card={{ ...cards[cards.length - 1], faceUp: true }}
                    cardBack={cardBack}
                    onDragOver={onDragOver}
                />
            ) : (
                <CardSlot slotImage={CARD_SLOTS[2]} />
            )}
        </div>
    );
};

export default FoundationPile;
