import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';
import './Solitaire'

interface FoundationPileProps {
    cards: Card[];
    cardBack: string;
    onDrop?: () => void;
}

const FoundationPile = ({ cards, cardBack, onDrop }: FoundationPileProps) => {
    return (
        <div className='foundation-pile' onDrop={onDrop}>
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
