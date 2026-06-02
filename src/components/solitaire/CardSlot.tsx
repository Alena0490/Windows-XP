/* ─────────────────────────────────────────
   Card Slot
   Empty placeholder shown when a pile has no cards.
───────────────────────────────────────── */
interface CardSlotProps {
    slotImage: string;
    onClick?: () => void;
}

const CardSlot = ({ slotImage, onClick }: CardSlotProps) => {
    return (
        <div className='card card--slot' onClick={onClick}>
            <img src={slotImage} alt='empty slot' draggable={false} />
        </div>
    );
};

export default CardSlot;
