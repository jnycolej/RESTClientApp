import round from './Round.js';

const renderDOM = (html) => document.getElementById('view').innerHTML = html;

export const PlayScene = (props) => {
    const {deal} = props;
    renderDOM(
        `${Round(deal)}`
    )
}