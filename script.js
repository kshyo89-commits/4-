// === 참가자 4명: 네가 준 이름/경로 그대로 ===
const ITEMS = [
  { name: "Tralalero Tralala",    img: "images/1.webp" },
  { name: "Bombardiro Crocodilo", img: "images/2.webp" },
  { name: "Tung Tung Tung Sahur", img: "images/3.webp" },
  { name: "Lirilì Larilà",        img: "images/4.webp" }
];

const RoundNames = ["4강(준결승)", "결승"];

// 요소
const $title    = document.getElementById("title");
const $bar      = document.getElementById("bar");
const $percent  = document.getElementById("percent");
const $board    = document.getElementById("board");
const $result   = document.getElementById("result");
const $winnerH2 = document.getElementById("winner");
const $leftImg  = document.getElementById("leftImage");
const $rightImg = document.getElementById("rightImage");

// 상태
let currentRound = [];
let nextRound = [];
let matchIndex = 0;
let roundIndex = 0;

// 유틸
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function setProgress() {
  const totalPairs = Math.ceil(currentRound.length / 2);
  const percent = Math.floor((matchIndex / totalPairs) * 100);
  $bar.style.width = percent + "%";
  $percent.textContent = `${percent}% 진행`;
  $title.textContent = `${RoundNames[roundIndex]} - 매치 ${Math.min(matchIndex + 1, totalPairs)}/${totalPairs}`;
}

function renderMatch() {
  const a = currentRound[matchIndex * 2];
  const b = currentRound[matchIndex * 2 + 1];

  // 홀수 보호: b가 없으면 a 부전승
  if (!a && nextRound.length) return finishRound();
  if (!b) {
    nextRound.push(a);
    matchIndex++;
    setProgress();
    return renderMatch();
  }

  // 이미지 세팅
  $leftImg.src = a.img;
  $leftImg.alt = a.name;
  $rightImg.src = b.img;
  $rightImg.alt = b.name;

  // 클릭 핸들러
  $leftImg.onclick = () => pick(a);
  $rightImg.onclick = () => pick(b);

  setProgress();
}

function pick(winner) {
  nextRound.push(winner);
  const totalPairs = Math.ceil(currentRound.length / 2);
  matchIndex++;
  if (matchIndex >= totalPairs) finishRound();
  else renderMatch();
}

function finishRound() {
  // 우승자 확정
  if (nextRound.length === 1) {
    showWinner(nextRound[0]);
    return;
  }
  // 다음 라운드 세팅
  currentRound = shuffle(nextRound);
  nextRound = [];
  matchIndex = 0;
  roundIndex = Math.min(roundIndex + 1, RoundNames.length - 1);
  renderMatch();
}

function showWinner(item) {
  $board.hidden = true;
  $result.hidden = false;
  $winnerH2.textContent = `우승자: ${item.name}`;
}

function restart() {
  $result.hidden = true;
  $board.hidden = false;
  init();
}

// 초기화
function init() {
  currentRound = shuffle(ITEMS);
  nextRound = [];
  matchIndex = 0;
  roundIndex = 0;
  renderMatch();
}

// 다시하기 버튼이 index.html에 없다면 아래 이벤트는 무시됨
document.addEventListener("click", (e) => {
  if (e.target && e.target.matches("button, .btn")) {
    // index.html에 재시작 버튼 id가 없으니, 공통 버튼(.btn) 누르면 재시작하도록 안전 처리
    restart();
  }
});

// 시작
init();
