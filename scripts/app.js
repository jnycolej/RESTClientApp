import { resetGame, startGame} from './round.js';


const GET_CARDS = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
let dealerCards = [];
let playerCards = [];

const state = {};

//Loads initial game
window.addEventListener('load', () => {
    startGame();
    start();
});

//Functionality for starting a new game after one has ended.
function start() {
    document.getElementById('new-game').addEventListener('click', () => {
        resetGame();
        startGame();
    });
}