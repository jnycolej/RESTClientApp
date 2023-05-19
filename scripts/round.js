import * as http from './http.js';
//import * as view from './view.js';

const baseURL = `https://www.deckofcardsapi.com/api/deck`;
const GET_CARDS = `${baseURL}/new/shuffle/?deck_count=6`;
let deckID = null;
let dealerCards = [];
let playerCards = [];

async function getNewDeck() {
    const result = await http.sendGETRequest(GET_CARDS);
    //console.log(result);
    const data = result;
    deckID = data.deck_id;
}  

async function drawCard(deck, count) {
    const result = await http.sendGETRequest(`${baseURL}/${deck}/draw/?count=${count}`);
    const data = result;
    return data.cards;
}

function displayCards(cards, container) {
    container.innerHTML = '';
    cards.forEach(card => {
        const img = document.createElement('img');
        img.src = card.image;
        container.appendChild(img);
    });
}

//calculate the value of the cards in player/dealers hands
function calcHandValue(cards) {
    let value = 0;
    let hasAce = false;
    cards.forEach(card => {
        if(card.value === 'ACE'){
            value += 11;
            hasAce = true;
        } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) { 
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    });

    if (hasAce && value > 21) {
        value -= 10;
    }

    return value;

}

function hasBlackJack(cards) {
    if (cards.length === 2 && calcHandValue(cards) === 21){
        return true;
    }
}

export async function startGame() {
    await getNewDeck();
    dealerCards = await drawCard(deckID, 1);
    playerCards = await drawCard(deckID, 2);

    displayCards(dealerCards, document.getElementById('dealer-cards'));
    displayCards(playerCards, document.getElementById('player-cards'));

    
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');   

    if(hasBlackJack(playerCards)) {
        document.getElementById('message').textContent = 'Blackjack! You win!';
        return;
    }




    //Button for hitting (taking another card from the deck)
    const hitButtonClickHandler = async () => {
        const newCard = await drawCard(deckID, 1);
        playerCards.push(newCard[0]);
        displayCards(playerCards, document.getElementById('player-cards'));

        if(calcHandValue(playerCards) > 21){
            document.getElementById('message').textContent = 'Bust! You Lose!';
            hitButton.disabled = true;
            standButton.disabled = true;
        }
    };

    //Button for standing (aka not taking anymore cards and working with the hand you have)
    const standButtonClickHandler = async () => {
        hitButton.disabled = true;
        standButton.disabled = true;

        while(calcHandValue(dealerCards) < 17) {
            const newCard = await drawCard(deckID, 1);
            dealerCards.push(newCard[0]);
            displayCards(dealerCards, document.getElementById('dealer-cards'));
        }

        displayCards(dealerCards, document.getElementById('dealer-cards'));

        const playerValue = calcHandValue(playerCards);
        const dealerValue = calcHandValue(dealerCards);

        if(dealerValue > 21 || playerValue > dealerValue) {
            document.getElementById('message').textContent = 'You win!';
        } else if (dealerValue > playerValue) {
            document.getElementById('message').textContent = 'You Lose!';
        } else {
            document.getElementById('message').textContent = 'It\'s a tie! You push!';
        }
    };
    
    hitButton.addEventListener('click', hitButtonClickHandler);
    standButton.addEventListener('click', standButtonClickHandler);

};

export function resetGame() {
    location.reload();
  }
  