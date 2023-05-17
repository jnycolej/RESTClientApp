import { startGame } from './round.js';


const GET_CARDS = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
let dealerCards = [];
let playerCards = [];

const state = {};

//const playGame = async () => {
//    const json = await http.sendGETRequest(GET_CARDS);
//    console.log(json);
//    const deckid = json.deck_id;
//  console.log(deckid);
//  [state.deal] = json.results;
//  view.PlayScene(state);
//}

//window.start = async () => {
//    playGame();
//}

window.addEventListener('load', startGame);