import CardComponent from './CardComponent';
import CardSlot from './CardSlot';
import { CARD_SLOTS } from './data/dataSolitaire';
import type { Card } from './data/dataSolitaire';
import './Solitaire.css'

interface TableauPileProps {
    cards: Card[];
    cardBack: string;
    onCardClick?: (index: number) => void;
    onDragStart?: (index: number) => void;
    onDrop?: () => void;
}

const TableauPile = ({ cards, cardBack, onCardClick, onDragStart, onDrop }: TableauPileProps) => {
    return (
        <div className='tableau-pile' onDrop={onDrop}>
            {cards.length === 0 ? (
                <CardSlot slotImage={CARD_SLOTS[0]} />
            ) : (
                cards.map((card, i) => (
                    <div key={i} style={{ position: 'absolute', top: `${i * 10}px`, zIndex: i }}>
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