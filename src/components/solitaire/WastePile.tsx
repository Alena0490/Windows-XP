import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Waste Pile
   Receives cards drawn from the stock. In draw-3 mode the top three
   waste cards are fanned to the right; only the topmost (rightmost)
   card is interactive (draggable / source for click-to-move).
───────────────────────────────────────── */
interface WastePileProps {
    cards: Card[];
    cardBack: string;
    onClick?: () => void;
    drawCount: 1 | 3;
    outlineDragging: boolean;
}

const WastePile = ({ 
    cards, 
    cardBack, 
    onClick, 
    drawCount, 
    outlineDragging, 
}: WastePileProps) => {
    if (cards.length === 0) {
        return (
            <div className='waste-pile' onClick={onClick}>
                <CardSlot slotImage={CARD_SLOTS[1]} />
            </div>
        );
    }

    const visible = drawCount === 3 ? cards.slice(-3) : cards.slice(-1);
    const topIdx = visible.length - 1;

    return (
        <div className='waste-pile' onClick={onClick}>
            {visible.map((c, i) => {
                const isTop = i === topIdx;
                const faceUp: Card = { ...c, faceUp: true };
                return (
                    <div
                        key={cards.length - visible.length + i}
                        style={{ position: 'absolute', left: `${i * 14}px`, top: 0, zIndex: i }}
                    >
                        <CardComponent
                            card={faceUp}
                            cardBack={cardBack}
                            dragItem={isTop ? { source: 'waste', cards: [faceUp] } : undefined}
                            canDrag={isTop}
                            outlineDragging={outlineDragging}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default WastePile;
