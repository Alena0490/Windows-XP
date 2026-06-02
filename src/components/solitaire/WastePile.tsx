import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Waste Pile
   Receives cards drawn from the stock. Only the top card is interactive
   (clickable for selection and draggable to a tableau/foundation).
───────────────────────────────────────── */
interface WastePileProps {
    cards: Card[];
    cardBack: string;
    onClick?: () => void;
    onDragStart: (source: 'waste' | 'tableau', pileIndex?: number, cardIndex?: number) => void;
}

const WastePile = ({ cards, cardBack, onClick, onDragStart }: WastePileProps) => {
    return (
        <div className='waste-pile' onClick={onClick}>
            {cards.length > 0 ? (
                <CardComponent
                    card={{ ...cards[cards.length - 1], faceUp: true }}
                    cardBack={cardBack}
                    onDragStart={() => onDragStart('waste')}
                />
            ) : (
                <CardSlot slotImage={CARD_SLOTS[1]} />
            )}
        </div>
    );
};

export default WastePile;
