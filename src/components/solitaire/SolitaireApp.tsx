import type { GameState } from './Solitaire';

import StockPile from './StockPile';
import WastePile from './WastePile';
import FoundationPile from './FoundantionPile';
import TableauPile from './TableauPile';

import './Solitaire.css';

interface SolitaireAppProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    cardBack: string;
    setCardBack: (back: string) => void;
}

const SolitaireApp = ({
    gameState,
    setGameState,
    cardBack,
    setCardBack
}: SolitaireAppProps) => {
    void setGameState;
    void setCardBack;

        return (
            <div className='solitaire-app solitaire-game'>
                <div className='solitaire-top'>
                    <StockPile cards={gameState.stock} cardBack={cardBack} onClick={() => {}} />
                    <WastePile cards={gameState.waste} cardBack={cardBack} />
                    <div />
                    <div className='solitaire-foundations'>
                        <FoundationPile cards={gameState.foundations[0]} cardBack={cardBack} />
                        <FoundationPile cards={gameState.foundations[1]} cardBack={cardBack} />
                        <FoundationPile cards={gameState.foundations[2]} cardBack={cardBack} />
                        <FoundationPile cards={gameState.foundations[3]} cardBack={cardBack} />
                    </div>
                </div>
                <div className='solitaire-tableau'>
                    {gameState.tableau.map((pile, i) => (
                        <TableauPile key={i} cards={pile} cardBack={cardBack} />
                    ))}
                </div>
            </div>
        );

};

export default SolitaireApp;