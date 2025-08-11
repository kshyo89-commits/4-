// 참가자 4명 (이름/이미지 경로)
const ITEMS = [
    { name: "Trallalero Tralala", img: "images/1.webp" },
    { name: "Bombardino Crocodilo", img: "images/2.webp" },
    { name: "Tung Tung Tung Sahur", img: "images/3.webp" },
    { name: "Lirili Larila", img: "images/4.webp" }
];

const RoundNames = ["4강(준결승)", "결승"];

const versus = document.getElementById('versus');
const board = document.getElementById('board');
const result = document.getElementById('result');
const winnerImg = document.getElementById('winner');
const bar = document.getElementById('bar');
const title = document.getElementById('title');

document.getElementById('year').textContent = new Date().getFullYear();

let roundIndex = 0, currentRound = [], nextRound = [], matchIndex = 0;

function shuffle(array) {
    let a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initTournament() {
    currentRound = shuffle(ITEMS);
    nextRound = [];
    matchIndex = 0;
    roundIndex = 0;
    result.hidden = true;
    board.hidden = false;
    renderMatch();
    updateUI();
}

function updateUI() {
    const totalPairs = Math.ceil(currentRound.length / 2);
    const percent = Math.floor((matchIndex / totalPairs) * 100);
    bar.style.width = percent + '%';
    title.innerHTML = `${RoundNames[roundIndex]} - 매치 ${matchIndex + 1}/${totalPairs}`;
}

function renderMatch() {
    const a = currentRound[matchIndex * 2];
    const b = currentRound[matchIndex * 2 + 1];

    if (!b) {
        finishRound();
        return;
    }

    document.getElementById('leftImg').src = a.img;
    document.getElementById('rightImg').src = b.img;

    document.getElementById('leftImg').onclick = () => selectWinner(a);
    document.getElementById('rightImg').onclick = () => selectWinner(b);
}

function selectWinner(winner) {
    nextRound.push(winner);
    matchIndex++;
    if (matchIndex * 2 >= currentRound.length) {
        finishRound();
    } else {
        renderMatch();
        updateUI();
    }
}

function finishRound() {
    if (nextRound.length === 1) {
        showWinner(nextRound[0]);
    } else {
        currentRound = nextRound;
        nextRound = [];
        matchIndex = 0;
        roundIndex++;
        renderMatch();
        updateUI();
    }
}

function showWinner(winner) {
    board.hidden = true;
    result.hidden = false;
    winnerImg.src = winner.img;
}

initTournament();
