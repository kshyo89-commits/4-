// === 참가자 4명 (네가 준 이름/경로 그대로) ===
const ITEMS = [
  { name: "Tralalero Tralala",    img: "images/1.webp" },
  { name: "Bombardiro Crocodilo", img: "images/2.webp" },
  { name: "Tung Tung Tung Sahur", img: "images/3.webp" },
  { name: "Lirilì Larilà",        img: "images/4.webp" }
];

const ROUND_NAMES = ["4강(준결승)", "결승"];

// 요소
const $title   = document.getElementById("round-title");
const $bar     = document.getElementById("progress-bar");
const $pct     = document.getElementById("progress-text");
const $img1    = document.getElementById("img1");
const $img2    = document.getElementById("img2");
const $match   = document.querySelector(".match");
const $restart = document.getElementById("restart-btn"); // index.html에 있음

// 상태
let currentRound = [];
let nextRound = [];
let matchIndex = 0;
let roundIndex = 0;

// 유틸
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

// 초기화
init();
function init(){
  currentRound = shuffle(ITEMS);
  nextRound = [];
  matchIndex = 0;
  roundIndex = 0;
  $restart.style.display = "none";
  $match.style.display = "";
  renderMatch();
  updateUI();
}

function updateUI(){
  const totalPairs = Math.ceil(currentRound.length/2);
  const percent = Math.floor((matchIndex/totalPairs)*100);
  $bar.style.width = percent + "%";
  $pct.textContent = `${percent}% 진행`;
  $title.textContent = `${ROUND_NAMES[roundIndex]} - 매치 ${Math.min(matchIndex+1,totalPairs)}/${totalPairs}`;
}

function renderMatch(){
  const a = currentRound[matchIndex*2];
  const b = currentRound[matchIndex*2 + 1];

  // 홀수 보호: b가 없으면 a 부전승
  if(!a && nextRound.length){ return finishRound(); }
  if(!b){
    nextRound.push(a);
    matchIndex++;
    updateUI();
    return renderMatch();
  }

  // 이미지 세팅
  $img1.src = a.img; $img1.alt = a.name;
  $img2.src = b.img; $img2.alt = b.name;

  // 클릭 시 선택
  $img1.onclick = () => pick(a);
  $img2.onclick = () => pick(b);

  updateUI();
}

function pick(winner){
  nextRound.push(winner);
  const totalPairs = Math.ceil(currentRound.length/2);
  matchIndex++;
  if(matchIndex >= totalPairs) finishRound();
  else renderMatch();
}

function finishRound(){
  // 우승자 확정
  if(nextRound.length === 1){
    const win = nextRound[0];
    showWinner(win);
    return;
  }
  // 다음 라운드 세팅
  currentRound = shuffle(nextRound);
  nextRound = [];
  matchIndex = 0;
  roundIndex = Math.min(roundIndex+1, ROUND_NAMES.length-1);
  renderMatch();
}

function showWinner(item){
  // 매치 숨기고 우승자 표시
  $match.style.display = "none";
  $title.textContent = `우승자: ${item.name}`;
  $pct.textContent = "축하합니다!";
  $bar.style.width = "100%";

  // 다시하기 버튼 노출
  if (typeof window.showRestartButton === "function") {
    window.showRestartButton();
  } else {
    // 혹시 inline 함수가 없더라도 안전하게 버튼 노출
    $restart.style.display = "block";
    $restart.onclick = () => location.reload();
  }
}
