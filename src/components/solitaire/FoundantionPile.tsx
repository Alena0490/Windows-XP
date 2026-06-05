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
    foundationIndex: number;
    onDrop?: (item: DragSource) => void;
    outlineDragging: boolean;
}

const FoundationPile = ({
    cards,
    cardBack,
    foundationIndex,
    onDrop,
    outlineDragging,
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
                    dragItem={{
                        source: 'foundation',
                        pileIndex: foundationIndex,
                        cardIndex: cards.length - 1,
                        cards: [cards[cards.length - 1]],
                    }}
                    canDrag
                    outlineDragging={outlineDragging}
                />
            ) : (
                <CardSlot slotImage={CARD_SLOTS[2]} />
            )}
        </div>
    );
};

export default FoundationPile;
