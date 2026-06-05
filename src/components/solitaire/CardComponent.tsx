import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import type { Card } from './data/dataSolitaire';
import type { DragSource } from './Solitaire';

/* ─────────────────────────────────────────
   Card
   Renders a single card, face-up or face-down. Draggable only when face-up.
───────────────────────────────────────── */
interface CardComponentProps {
    card: Card;
    cardBack: string;
    onClick?: () => void;
    dragItem?: DragSource;
    canDrag?: boolean;
    isSelected?: boolean;
    outlineDragging?: boolean;
}

const CardComponent = ({
    card,
    cardBack,
    onClick,
    dragItem,
    canDrag = false,
    isSelected,
    outlineDragging,
}: CardComponentProps) => {

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'CARD',
        item: dragItem ?? { source: 'waste' as const },
        canDrag: () => canDrag && !!dragItem,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [dragItem, canDrag]);

    // Hide the browser's default drag preview so CardDragLayer can render
    // a custom one showing every card in the dragged sequence.
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    return (
        <div
            ref={(node) => { drag(node); }}
            className={`card ${isSelected ? 'card--selected' : ''}`}
            onClick={onClick}
            style={{ opacity: isDragging ? 0 : 1 }}
        >
            {isDragging && outlineDragging ? (
            <div className='card-outline' />
            ) : (
                <img
                    src={card.faceUp ? card.image : cardBack}
                    alt={card.faceUp ? `${card.suit} ${card.value}` : 'card back'}
                    draggable={false}
                />
            )}
        </div>
    );
};

export default CardComponent;
