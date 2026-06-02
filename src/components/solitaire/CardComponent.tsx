import type { Card } from './data/dataSolitaire';

/* ─────────────────────────────────────────
   Card
   Renders a single card, face-up or face-down. Draggable only when face-up.
───────────────────────────────────────── */
interface CardComponentProps {
    card: Card;
    cardBack: string;
    onClick?: () => void;
    onDragStart?: () => void;
    isSelected?: boolean;
}

const CardComponent = ({ card, cardBack, onClick, onDragStart, isSelected }: CardComponentProps) => {
    return (
        <div
            className={`card ${isSelected ? 'card--selected' : ''}`}
            onClick={onClick}
            draggable={card.faceUp}
            onDragStart={onDragStart}
        >
            <img
                src={card.faceUp ? card.image : cardBack}
                alt={card.faceUp ? `${card.suit} ${card.value}` : 'card back'}
                draggable={false}
            />
        </div>
    );
};

export default CardComponent;
