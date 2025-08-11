// 참가자 4명 (파일명/표시명)
const ITEMS = [
  { id: 1, name: "Tralalero Tralala",    img: "images/1.webp" },
  { id: 2, name: "Bombardiro Crocodilo", img: "images/2.webp" },
  { id: 3, name: "Tung Tung Tung Sahur", img: "images/3.webp" },
  { id: 4, name: "Lirilì Larilà",        img: "images/4.webp" }
];

const RoundNames = ["4강(준결승)", "결승"];

// 엘리먼트
const $versus    = document.getElementById('versus');
const $board     = document.getElementById('board');
const $result    = document.getElementById('result');
const $winner    = document.getElementById('winner');
const $roundChip = document.getElementById('roundChip');
const $title     = document.getElementById('title');
const $bar       = document.getElementById('bar');
const $year      = document.getElementById('year') || document.createElement('span');
if ($year) $year.textContent = new Date().getFullYear();

// 유틸
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function esc(s){ return s.replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\'':'&#39;','"':'&quot;'}[c])); }

// 상태
let roundIndex=0, currentRound=[], nextRound=[], matchIndex=0;

// 초기화
function initTournament(){
  $versus.innerHTML = '';
  currentRound = shuffle(ITEMS);
  nextRound = [];
  matchIndex = 0;
  roundIndex = 0;
  updateUI();
  renderMatch();
}

// UI 갱신
function updateUI(){
  const pairs = Math.ceil(currentRound.length / 2);
  document.getElementById('matchTotal').textContent = String(pairs);
  document.getElementById('matchIdx').textContent   = String(Math.min(matchIndex+1, pairs));
  const percent = Math.floor((matchIndex / pairs) * 100);
  document.getElementById('percent').textContent = percent + '%';
  $bar.style.width = percent + '%';
  $roundChip.textContent = `${RoundNames[roundIndex]} 진행중`;
  $title.innerHTML = `${RoundNames[roundIndex]} — 매치 <span id="matchIdx">${Math.min(matchIndex+1,pairs)}</span>/<span id="matchTotal">${pairs}</span>`;
}

// 매치 렌더
function renderMatch(){
  const i = matchIndex * 2;
  const a = currentRound[i];
  const b = currentRound[i+1];

  if(!a && nextRound.length>0){ return finishRound(); }
  if(!b){ // 홀수일 때 부전승 처리
    nextRound.push(a);
    matchIndex++;
    updateUI();
    return renderMatch();
  }

  $versus.innerHTML = '';
  $versus.appendChild(makeCard(a));
  $versus.appendChild(makeCard(b));
  updateUI();
}

// 카드 생성 (이미지 자체 클릭)
function makeCard(item){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="imgbox">
      <img src="${item.img}" alt="${esc(item.name)}" loading="eager" />
      <div class="label">${esc(item.name)}</div>
    </div>`;
  card.addEventListener('click', () => onPick(item));
  return card;
}

// 선택 처리
function onPick(winner){
  nextRound.push(winner);
  const pairs = Math.ceil(currentRound.length / 2);
  matchIndex++;
  if (matchIndex >= pairs) finishRound();
  else renderMatch();
}

// 라운드 종료
function finishRound(){
  if (nextRound.length === 1) return showWinner(nextRound[0]); // 우승
  currentRound = shuffle(nextRound);
  nextRound = [];
  matchIndex = 0;
  roundIndex = Math.min(roundIndex + 1, RoundNames.length - 1);
  renderMatch();
}

// 우승자 표시
function showWinner(item){
  $board.hidden = true;
  $result.hidden = false;
  $roundChip.textContent = '우승자 발표';
  $winner.innerHTML = `
    <div class="imgbox">
      <img src="${item.img}" alt="${esc(item.name)}" />
      <div class="label">${esc(item.name)}</div>
    </div>`;
  document.getElementById('restartBtn').onclick = () => { $result.hidden=false; $board.hidden=false; initTournament(); };
  document.getElementById('shareBtn').onclick = () => shareResult(item);
  setTimeout(()=>{ window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 300);
}

// 공유
async function shareResult(item){
  const url = location.href.split('#')[0];
  const text = `이상형 월드컵 우승: ${item.name}`;
  if(navigator.share){
    try { await navigator.share({ title: document.title, text, url }); } catch(e){}
  } else {
    try { await navigator.clipboard.writeText(`${text} — ${url}`); alert('클립보드에 복사되었습니다.'); }
    catch(e){ prompt('공유 링크를 복사하세요:', `${text} — ${url}`); }
  }
}

initTournament();
