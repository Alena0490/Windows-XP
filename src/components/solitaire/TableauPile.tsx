import { useDrop } from 'react-dnd';
import CardComponent from './CardComponent';
// import CardSlot from './CardSlot';
// import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';
import type { DragSource } from './Solitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Tableau Pile
   One of the seven columns. Cards are stacked with a vertical offset so
   every card remains partially visible; empty piles act as drop targets.
───────────────────────────────────────── */
interface TableauPileProps {
    cards: Card[];
    cardBack: string;
    pileIndex: number;
    onCardClick?: (index: number) => void;
    onDrop?: (item: DragSource) => void;
    outlineDragging: boolean;
    onDoubleClick?: (cardIndex: number) => void;
}

const TableauPile = ({
    cards,
    cardBack,
    pileIndex,
    onCardClick,
    onDrop,
    outlineDragging,
    onDoubleClick,
}: TableauPileProps) => {
    const [, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item: DragSource) => onDrop?.(item),
    }), [onDrop]);

    return (
        <div className='tableau-pile' ref={(node) => { drop(node); }}>
            {cards.length === 0 ? (
                <div className='card card--empty' />
            ) : (
                cards.map((card, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${cards.slice(0, i).reduce((acc, c) => acc + (c.faceUp ? 15 : 5), 0)}px`,
                            zIndex: i
                        }}
                    >
                        <CardComponent
                            card={card}
                            cardBack={cardBack}
                            onClick={() => onCardClick?.(i)}
                            dragItem={{
                                source: 'tableau',
                                pileIndex,
                                cardIndex: i,
                                cards: cards.slice(i),
                            }}
                            canDrag={card.faceUp}
                            outlineDragging={outlineDragging}
                            onDoubleClick={() => onDoubleClick?.(i)}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default TableauPile;
