import { useDragLayer } from 'react-dnd';
import type { DragSource } from './Solitaire';

import './Solitaire.css';

/* ─────────────────────────────────────────
   Card Drag Layer
   Custom react-dnd preview that renders every card in the dragged
   sequence (not just the source node) so the user sees the whole stack
   follow the cursor.
───────────────────────────────────────── */
const layerStyles: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};

interface CardDragLayerProps {
    outlineDragging: boolean;
}

const CardDragLayer = ({ outlineDragging }: CardDragLayerProps) => {
    const { isDragging, item, offset } = useDragLayer((monitor) => ({
        item: monitor.getItem() as DragSource | null,
        offset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !offset || !item?.cards?.length) return null;

    return (
        <div style={layerStyles}>
            <div style={{
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                position: 'relative',
            }}>
                {item.cards.map((c, i) => (
                    <div
                        key={i}
                        className='card'
                        style={{ position: 'absolute', top: `${i * 15}px` }}
                    >
                        {outlineDragging ? (
                            <div className='card-outline' />
                        ) : (
                            <img src={c.image} alt='' draggable={false} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardDragLayer;
