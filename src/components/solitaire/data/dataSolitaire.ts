import Club_0 from '../img/clubs/Club_0.png'
import Club_1 from '../img/clubs/Club_1.png'
import Club_2 from '../img/clubs/Club_2.png'
import Club_3 from '../img/clubs/Club_3.png'
import Club_4 from '../img/clubs/Club_4.png'
import Club_5 from '../img/clubs/Club_5.png'
import Club_6 from '../img/clubs/Club_6.png'
import Club_7 from '../img/clubs/Club_7.png'
import Club_8 from '../img/clubs/Club_8.png'
import Club_9 from '../img/clubs/Club_9.png'
import Club_10 from '../img/clubs/Club_10.png'
import Club_11 from '../img/clubs/Club_11.png'
import Club_12 from '../img/clubs/Club_12.png'

import Diamond_0 from '../img/diamonds/Diamond_0.png'
import Diamond_1 from '../img/diamonds/Diamond_1.png'
import Diamond_2 from '../img/diamonds/Diamond_2.png'
import Diamond_3 from '../img/diamonds/Diamond_3.png'
import Diamond_4 from '../img/diamonds/Diamond_4.png'
import Diamond_5 from '../img/diamonds/Diamond_5.png'
import Diamond_6 from '../img/diamonds/Diamond_6.png'
import Diamond_7 from '../img/diamonds/Diamond_7.png'
import Diamond_8 from '../img/diamonds/Diamond_8.png'
import Diamond_9 from '../img/diamonds/Diamond_9.png'
import Diamond_10 from '../img/diamonds/Diamond_10.png'
import Diamond_11 from '../img/diamonds/Diamond_11.png'
import Diamond_12 from '../img/diamonds/Diamond_12.png'

import Heart_0 from '../img/hearts/Heart_0.png'
import Heart_1 from '../img/hearts/Heart_1.png'
import Heart_2 from '../img/hearts/Heart_2.png'
import Heart_3 from '../img/hearts/Heart_3.png'
import Heart_4 from '../img/hearts/Heart_4.png'
import Heart_5 from '../img/hearts/Heart_5.png'
import Heart_6 from '../img/hearts/Heart_6.png'
import Heart_7 from '../img/hearts/Heart_7.png'
import Heart_8 from '../img/hearts/Heart_8.png'
import Heart_9 from '../img/hearts/Heart_9.png'
import Heart_10 from '../img/hearts/Heart_10.png'
import Heart_11 from '../img/hearts/Heart_11.png'
import Heart_12 from '../img/hearts/Heart_12.png'

import Spade_0 from '../img/spades/Spade_0.png'
import Spade_1 from '../img/spades/Spade_1.png'
import Spade_2 from '../img/spades/Spade_2.png'
import Spade_3 from '../img/spades/Spade_3.png'
import Spade_4 from '../img/spades/Spade_4.png'
import Spade_5 from '../img/spades/Spade_5.png'
import Spade_6 from '../img/spades/Spade_6.png'
import Spade_7 from '../img/spades/Spade_7.png'
import Spade_8 from '../img/spades/Spade_8.png'
import Spade_9 from '../img/spades/Spade_9.png'
import Spade_10 from '../img/spades/Spade_10.png'
import Spade_11 from '../img/spades/Spade_11.png'
import Spade_12 from '../img/spades/Spade_12.png'

import CardBack_0 from '../img/backs/CardBack_0.png'
import CardBack_1 from '../img/backs/CardBack_1.png'
import CardBack_2 from '../img/backs/CardBack_2.png'
import CardBack_3 from '../img/backs/CardBack_3.png'
import CardBack_4 from '../img/backs/CardBack_4.png'
import CardBack_5 from '../img/backs/CardBack_5.png'
import CardBack_6 from '../img/backs/CardBack_6.png'
import CardBack_7 from '../img/backs/CardBack_7.png'
import CardBack_8 from '../img/backs/CardBack_8.png'
import CardBack_9 from '../img/backs/CardBack_9.png'
import CardBack_10 from '../img/backs/CardBack_10.png'
import CardBack_11 from '../img/backs/CardBack_11.png'

import CardSlot_0 from '../img/CardSlot_0.png'
import CardSlot_1 from '../img/CardSlot_1.png'
import CardSlot_2 from '../img/CardSlot_2.png'

export interface Card {
    suit: 'clubs' | 'diamonds' | 'hearts' | 'spades';
    value: number;
    image: string;
    faceUp: boolean;
}

export const CARD_BACKS = [
    CardBack_0, CardBack_1, CardBack_2, CardBack_3,
    CardBack_4, CardBack_5, CardBack_6, CardBack_7,
    CardBack_8, CardBack_9, CardBack_10, CardBack_11,
];

export const CARD_SLOTS = [CardSlot_0, CardSlot_1, CardSlot_2];

export const createDeck = (): Card[] => {
    const suits: Card['suit'][] = ['clubs', 'diamonds', 'hearts', 'spades'];
    const images = [
        [Club_0, Club_1, Club_2, Club_3, Club_4, Club_5, Club_6, Club_7, Club_8, Club_9, Club_10, Club_11, Club_12],
        [Diamond_0, Diamond_1, Diamond_2, Diamond_3, Diamond_4, Diamond_5, Diamond_6, Diamond_7, Diamond_8, Diamond_9, Diamond_10, Diamond_11, Diamond_12],
        [Heart_0, Heart_1, Heart_2, Heart_3, Heart_4, Heart_5, Heart_6, Heart_7, Heart_8, Heart_9, Heart_10, Heart_11, Heart_12],
        [Spade_0, Spade_1, Spade_2, Spade_3, Spade_4, Spade_5, Spade_6, Spade_7, Spade_8, Spade_9, Spade_10, Spade_11, Spade_12],
    ];

    const deck: Card[] = [];
    suits.forEach((suit, suitIndex) => {
        for (let value = 0; value < 13; value++) {
            deck.push({
                suit,
                value,
                image: images[suitIndex][value],
                faceUp: false,
            });
        }
    });
    return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
