import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';

import './Solitaire.css'

interface StockPileProps {
    cards: Card[];
    cardBack: string;
    onClick: () => void;
}

const StockPile = ({ cards, cardBack, onClick }: StockPileProps) => {
    return (
        <div className='stock-pile' onClick={onClick}>
            {cards.length > 0 ? (
                <CardComponent
                    card={cards[cards.length - 1]}
                    cardBack={cardBack}
                />
            ) : (
                <CardSlot slotImage={CARD_SLOTS[0]} onClick={onClick} />
            )}
        </div>
    );
};

export default StockPile;