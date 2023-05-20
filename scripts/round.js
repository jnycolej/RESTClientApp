import * as http from './http.js';
//import * as view from './view.js';

const baseURL = `https://www.deckofcardsapi.com/api/deck`;
const GET_CARDS = `${baseURL}/new/shuffle/?deck_count=6`;
let deckID = null;
let dealerCards = [];
let playerCards = [];

//retrieves new deck from API
async function getNewDeck() {
    const result = await http.sendGETRequest(GET_CARDS);
    //console.log(result);
    const data = result;
    deckID = data.deck_id;
}  

//Deals cards to player and dealer
async function drawCard(deck, count) {
    const result = await http.sendGETRequest(`${baseURL}/${deck}/draw/?count=${count}`);
    const data = result;
    return data.cards;
}

//Show the images of the cards dealt with Draw Card
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

//If the hand adds up to 21 it is a winning hand
function hasBlackJack(cards) {
    if (cards.length === 2 && calcHandValue(cards) === 21){
        return true;
    }
}

//Starts the game
export async function startGame() {
    await getNewDeck();
    dealerCards = await drawCard(deckID, 1);
    playerCards = await drawCard(deckID, 2);

    displayCards(dealerCards, document.getElementById('dealer-cards'));
    displayCards(playerCards, document.getElementById('player-cards'));

    //Allows the player to get dealt one more card
    const hitButton = document.getElementById('hit');
    //Allows the player to stay at the cards that they have before the dealer flips their cards
    const standButton = document.getElementById('stand');   
    //if the player has blackjack they automatically win
    if(hasBlackJack(playerCards)) {
        document.getElementById('message').textContent = 'Blackjack! You win!';
        return;
    }




    //Button Handler for hitting (taking another card from the deck)
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

    //Button handler for standing (aka not taking anymore cards and working with the hand you have)
    const standButtonClickHandler = async () => {
        hitButton.disabled = true;
        standButton.disabled = true;


        //dealer must pull cards until they reach 17
        while(calcHandValue(dealerCards) < 17) {
            const newCard = await drawCard(deckID, 1);
            dealerCards.push(newCard[0]);
            displayCards(dealerCards, document.getElementById('dealer-cards'));
        }

        displayCards(dealerCards, document.getElementById('dealer-cards'));

        const playerValue = calcHandValue(playerCards);
        const dealerValue = calcHandValue(dealerCards);

        //Checks the hands of the player and the dealer
        //If the dealer has the highest hand value without going bust they win otherwise, you win
        if(dealerValue > 21 || playerValue > dealerValue) {
            document.getElementById('message').textContent = 'You win!';
        } else if (dealerValue > playerValue) {
            document.getElementById('message').textContent = 'You Lose!';
        } else {
            document.getElementById('message').textContent = 'It\'s a tie! You push!';
        }
    };
    
    //Adds functionality to the buttons
    hitButton.addEventListener('click', hitButtonClickHandler);
    standButton.addEventListener('click', standButtonClickHandler);

};

export function resetGame() {
    location.reload();
  }
  