import { startGame } from './round.js';


const GET_CARDS = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
let dealerCards = [];
let playerCards = [];

const state = {};

window.addEventListener('load', startGame);