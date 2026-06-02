import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';
import './Solitaire.css'

interface WastePileProps {
    cards: Card[];
    cardBack: string;
}

const WastePile = ({ cards, cardBack }: WastePileProps) => {
    return (
        <div className='waste-pile'>
            {cards.length > 0 ? (
                <CardComponent
                    card={{ ...cards[cards.length - 1], faceUp: true }}
                    cardBack={cardBack}
                />
            ) : (
                <CardSlot slotImage={CARD_SLOTS[1]} />
            )}
        </div>
    );
};

export default WastePile;
