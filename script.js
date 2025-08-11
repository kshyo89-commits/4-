const ITEMS = [
  { id: 1, name: "Tralalero Tralala",      img: "./images/1.webp" },
  { id: 2, name: "Bombardiro Crocodilo",   img: "./images/2.webp" },
  { id: 3, name: "Tung Tung Tung Sahur",   img: "./images/3.webp" },
  { id: 4, name: "Lirilì Larilà",          img: "./images/4.webp" }
];
const RoundNames = ["4강(준결승)", "결승"];

const $versus = document.getElementById('versus');
const $board  = document.getElementById('board');
const $result = document.getElementById('result');
const $winner = document.getElementById('winner');
const $roundChip = document.getElementById('roundChip');
const $title = document.getElementById('title');
document.getElementById('year').textContent = new Date().getFullYear();

function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function escapeHtml(s){ return s.replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\'':'&#39;','"':'&quot;'}[c])); }

let roundIndex=0,currentRound=[],nextRound=[],matchIndex=0;

function initTournament(){
  currentRound = shuffle(ITEMS);
  nextRound = [];
  matchIndex = 0;
  roundIndex = 0;
  updateRoundUI();
  renderMatch();
}

function updateRoundUI(){
  const pairs = Math.ceil(currentRound.length / 2);
  document.getElementById('matchTotal').textContent = String(pairs);
  document.getElementById('matchIdx').textContent   = String(Math.min(matchIndex+1, pairs));
  const percent = Math.floor(((matchIndex)/pairs)*100);
  document.getElementById('percent').textContent = percent + '%';
  document.getElementById('bar').style.width = percent + '%';
  $roundChip.textContent = `${RoundNames[roundIndex]} 진행중`;
  $title.innerHTML = `${RoundNames[roundIndex]} — 매치 <span id="matchIdx">${Math.min(matchIndex+1, pairs)}</span>/<span id="matchTotal">${pairs}</span>`;
}

function renderMatch(){
  const i = matchIndex * 2;
  const a = currentRound[i];
  const b = currentRound[i+1];

  if(!a && nextRound.length>0){ return finishRound(); }
  if(!b){
    nextRound.push(a);
    matchIndex++;
    updateRoundUI();
    return renderMatch();
  }

  $versus.innerHTML = '';
  $versus.appendChild(makeCard(a));
  $versus.appendChild(makeCard(b));
  updateRoundUI();
}

function makeCard(item){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="imgbox">
      <img src="${item.img}" alt="${escapeHtml(item.name)}" loading="eager" />
      <div class="label">${escapeHtml(item.name)}</div>
    </div>`;
  card.addEventListener('click', () => onPick(item)); // 이미지 클릭으로 선택
  return card;
}

function onPick(winner){
  nextRound.push(winner);
  const pairs = Math.ceil(currentRound.length / 2);
  matchIndex++;
  if(matchIndex >= pairs){ finishRound(); } else { renderMatch(); }
}

function finishRound(){
  if(nextRound.length === 1){ return showWinner(nextRound[0]); }
  currentRound = shuffle(nextRound);
  nextRound = [];
  matchIndex = 0;
  roundIndex = Math.min(roundIndex + 1, RoundNames.length - 1);
  renderMatch();
}

function showWinner(item){
  $board.hidden = true;
  $result.hidden = false;
  $roundChip.textContent = '우승자 발표';
  $winner.innerHTML = `
    <div class="imgbox">
      <img src="${item.img}" alt="${escapeHtml(item.name)}" />
      <div class="label">${escapeHtml(item.name)}</div>
    </div>`;
  document.getElementById('shareBtn').onclick = () => shareResult(item);
  document.getElementById('restartBtn').onclick = () => { $result.hidden = true; $board.hidden = false; initTournament(); };
  setTimeout(()=>{ window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 300);
}

async function shareResult(item){
  const url = location.href.split('#')[0];
  const text = `이상형 월드컵 우승: ${item.name} (나랑 맞을까?)`;
  if(navigator.share){
    try { await navigator.share({ title: document.title, text, url }); } catch(e){}
  } else {
    try { await navigator.clipboard.writeText(`${text} — ${url}`); alert('클립보드에 복사되었습니다.'); }
    catch(e){ prompt('공유 링크를 복사하세요:', `${text} — ${url}`); }
  }
}

initTournament();
