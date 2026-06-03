import { useDrop } from 'react-dnd';
import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';
import type { DragSource } from './Solitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Foundation Pile
   One of four piles built Ace → King in a single suit. Renders only the
   top card; empty piles show the foundation slot graphic.
───────────────────────────────────────── */
interface FoundationPileProps {
    cards: Card[];
    cardBack: string;
    onDrop?: (item: DragSource) => void;
}

const FoundationPile = ({
    cards,
    cardBack,
    onDrop,
}: FoundationPileProps) => {
    const [, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item: DragSource) => onDrop?.(item),
    }), [onDrop]);

    return (
        <div className='foundation-pile' ref={(node) => { drop(node); }}>
            {cards.length > 0 ? (
                <CardComponent
                    card={{ ...cards[cards.length - 1], faceUp: true }}
                    cardBack={cardBack}
                />
            ) : (
                <CardSlot slotImage={CARD_SLOTS[2]} />
            )}
        </div>
    );
};

export default FoundationPile;
