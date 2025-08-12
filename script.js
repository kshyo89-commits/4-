// Players — keep EXACT names & image filenames you set originally
const players = [
  { name: "Tralalero Tralala",    img: "images/1.webp" },
  { name: "Bombardiro Crocodilo", img: "images/2.webp" },
  { name: "Tung Tung Tung Sahur", img: "images/3.webp" },
  { name: "Lirilì Larilà",        img: "images/4.webp" }
];

let currentRound = [];
let nextRound = [];
let matchIndex = 0;

const p1Img = document.getElementById("player1-img");
const p1Name = document.getElementById("player1-name");
const p2Img = document.getElementById("player2-img");
const p2Name = document.getElementById("player2-name");
const roundTitle = document.getElementById("round-title");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const tournamentWrap = document.getElementById("tournament");
const winnerScreen = document.getElementById("winner-screen");
const winnerName = document.getElementById("winner-name");
const winnerImage = document.getElementById("winner-image");
const restartBtn = document.getElementById("restart-btn");

// Shuffle helper
function shuffle(a){
  const arr = a.slice();
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function startTournament(){
  currentRound = shuffle(players);
  nextRound = [];
  matchIndex = 0;

  tournamentWrap.style.display = "block";
  winnerScreen.style.display = "none";

  renderMatch();
  updateUI();
}

function updateUI(){
  const matchesInRound = currentRound.length / 2;
  const isFinal = currentRound.length === 2;
  roundTitle.textContent = `${isFinal ? "Final" : currentRound.length + " Round"} - Match ${Math.min(matchIndex+1,matchesInRound)}/${matchesInRound}`;

  const percent = Math.floor((matchIndex / matchesInRound) * 100);
  progressText.textContent = `${percent}% Progress`;
  progressBar.style.width = `${percent}%`;
}

function renderMatch(){
  const a = currentRound[matchIndex*2];
  const b = currentRound[matchIndex*2 + 1];

  // Defensive: odd count fallback
  if (!a && nextRound.length){ return finishRound(); }
  if (!b){
    nextRound.push(a);
    matchIndex++;
    updateUI();
    return renderMatch();
  }

  p1Img.src = a.img; p1Img.alt = a.name; p1Name.textContent = a.name;
  p2Img.src = b.img; p2Img.alt = b.name; p2Name.textContent = b.name;

  p1Img.onclick = () => pick(a);
  p2Img.onclick = () => pick(b);

  updateUI();
}

function pick(winner){
  nextRound.push(winner);
  const matchesInRound = currentRound.length / 2;
  matchIndex++;
  if (matchIndex >= matchesInRound) finishRound();
  else renderMatch();
}

function finishRound(){
  // Winner decided
  if (nextRound.length === 1){
    showWinner(nextRound[0]);
    return;
  }
  // Next round
  currentRound = shuffle(nextRound);
  nextRound = [];
  matchIndex = 0;
  renderMatch();
}

function showWinner(winner){
  tournamentWrap.style.display = "none";
  winnerName.textContent = `Winner: ${winner.name}`;
  winnerImage.src = winner.img;
  winnerImage.alt = winner.name;
  winnerScreen.style.display = "block";
}

restartBtn.onclick = startTournament;

// Start
startTournament();
