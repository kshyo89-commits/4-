// 참가자 목록
const players = [
    { name: "Shark Runner", img: "images/shark.png" },
    { name: "Cactus Elephant", img: "images/cactus-elephant.png" },
    { name: "Frog Tire", img: "images/frog-tire.png" },
    { name: "Tralalero Tralala", img: "images/tralalero.png" }
];

let currentRound = [];
let nextRound = [];
let matchIndex = 0;
let roundNumber = 0;

const player1Img = document.getElementById("player1-img");
const player1Name = document.getElementById("player1-name");
const player2Img = document.getElementById("player2-img");
const player2Name = document.getElementById("player2-name");
const roundTitle = document.getElementById("round-title");
const progressText = document.getElementById("progress-text");

function startTournament() {
    currentRound = [...players];
    nextRound = [];
    matchIndex = 0;
    roundNumber = 1;
    document.getElementById("winner-screen").style.display = "none";
    document.getElementById("tournament").style.display = "block";
    showMatch();
}

function showMatch() {
    const matchesInRound = currentRound.length / 2;
    roundTitle.innerText = `${currentRound.length === 2 ? "결승" : currentRound.length + "강"} - 매치 ${matchIndex + 1}/${matchesInRound}`;
    progressText.innerText = `${Math.floor((matchIndex / matchesInRound) * 100)}% 진행`;

    const player1 = currentRound[matchIndex * 2];
    const player2 = currentRound[matchIndex * 2 + 1];

    player1Img.src = player1.img;
    player1Name.innerText = player1.name;
    player2Img.src = player2.img;
    player2Name.innerText = player2.name;

    player1Img.onclick = () => selectWinner(player1);
    player2Img.onclick = () => selectWinner(player2);
}

function selectWinner(winner) {
    nextRound.push(winner);
    matchIndex++;

    if (matchIndex >= currentRound.length / 2) {
        if (nextRound.length === 1) {
            showWinner(nextRound[0]);
        } else {
            currentRound = [...nextRound];
            nextRound = [];
            matchIndex = 0;
            roundNumber++;
            showMatch();
        }
    } else {
        showMatch();
    }
}

function showWinner(winner) {
    document.getElementById("tournament").style.display = "none";
    document.getElementById("winner-name").innerText = `우승자: ${winner.name}`;
    document.getElementById("winner-image").src = winner.img;
    document.getElementById("winner-screen").style.display = "block";
}

document.getElementById("restart-btn").onclick = startTournament;

// 시작
startTournament();
