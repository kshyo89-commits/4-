// ✅ 네가 준 “정확한” 이름/경로
const ITEMS = [
  { name: "Tralalero Tralala",    img: "images/1.webp" },
  { name: "Bombardiro Crocodilo", img: "images/2.webp" },
  { name: "Tung Tung Tung Sahur", img: "images/3.webp" },
  { name: "Lirilì Larilà",        img: "images/4.webp" }
];

const RoundNames = ["4강(준결승)", "결승"];

// Elements
const $versus   = document.getElementById('versus');
const $board    = document.getElementById('board');
const $result   = document.getElementById('result');
const $winner   = document.getElementById('winner');
const $roundChip= document.getElementById('roundChip');
const $title    = document.getElementById('title');
const $bar      = document.getElementById('bar');
document.getElementById('year').textContent = new Date().getFullYear();

// State
let roundIndex=0, currentRound=[], nextRound=[], matchIndex=0;

// Utils
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function esc(s){ return s.replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\'':'&#39;','"':'&quot;'}[c])); }

// Init
function initTournament(){
  currentRound = shuffle(ITEMS);
  nextRound = [];
  matchIndex = 0;
  roundIndex = 0;
  $result.hidden = true; $board.hidden = false;
  renderMatch(); updateUI();
}

function updateUI(){
  const pairs = Math.ceil(currentRound.length/2);
  document.getElementById('matchTotal').textContent = String(pairs);
  document.getElementById('matchIdx').textContent   = String(Math.min(matchIndex+1,pairs));
  const percent = Math.floor((matchIndex/pairs)*100);
  document.getElementById('percent').textContent = percent+'%';
  $bar.style.width = percent+'%';
  $roundChip.textContent = `${RoundNames[roundIndex]} 진행중`;
  $title.innerHTML = `${RoundNames[roundIndex]} — 매치 <span id="matchIdx">${Math.min(matchIndex+1,pairs)}</span>/<span id="matchTotal">${pairs}</span>`;
}

// Render two cards + VS
function renderMatch(){
  const i = matchIndex*2;
  const a = currentRound[i];
  const b = currentRound[i+1];

  if(!a && nextRound.length>0) return finishRound();
  if(!b){ nextRound.push(a); matchIndex++; updateUI(); return renderMatch(); }

  $versus.innerHTML = '';
  $versus.appendChild(makeCard(a));
  const vs = document.createElement('div'); vs.className='vs'; vs.textContent='VS'; $versus.appendChild(vs);
  $versus.appendChild(makeCard(b));
  updateUI();
}

function makeCard(item){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="imgbox">
      <img src="${item.img}" alt="${esc(item.name)}" />
      <div class="label">${esc(item.name)}</div>
    </div>`;
  // 1클릭: 확대 프리뷰 → 프리뷰에서 다시 클릭하면 확정
  card.addEventListener('click', () => openPreview(item));
  return card;
}

// Preview
let previewEl=null;
function openPreview(item){
  if(!previewEl){
    previewEl = document.createElement('div');
    previewEl.className='preview';
    previewEl.innerHTML = `
      <div class="frame">
        <div class="imgbox">
          <img id="pvImg" alt="">
          <div class="label" id="pvLabel"></div>
        </div>
        <div class="hint">이미지를 다시 클릭하면 선택이 확정됩니다. (ESC로 닫기)</div>
      </div>`;
    document.body.appendChild(previewEl);
    window.addEventListener('keydown', e => { if(e.key==='Escape') closePreview(); });
    previewEl.addEventListener('click', () => confirmPick(previewEl.itemData));
  }
  previewEl.querySelector('#pvImg').src = item.img;
  previewEl.querySelector('#pvLabel').textContent = item.name;
  previewEl.itemData = item;
  previewEl.classList.add('show');
}
function closePreview(){ if(previewEl) previewEl.classList.remove('show'); }

function confirmPick(item){
  closePreview();
  nextRound.push(item);
  const pairs = Math.ceil(currentRound.length/2);
  matchIndex++;
  if(matchIndex>=pairs) finishRound(); else renderMatch();
}

function finishRound(){
  if(nextRound.length===1){ showWinner(nextRound[0]); return; }
  currentRound = shuffle(nextRound);
  nextRound = [];
  matchIndex = 0;
  roundIndex = Math.min(roundIndex+1, RoundNames.length-1);
  renderMatch();
}

function showWinner(item){
  $board.hidden = true; $result.hidden = false;
  $roundChip.textContent = '우승자 발표';
  $winner.innerHTML = `
    <div class="imgbox">
      <img src="${item.img}" alt="${esc(item.name)}" />
      <div class="label">${esc(item.name)}</div>
    </div>`;
  document.getElementById('restartBtn').onclick = ()=>{ initTournament(); };
  document.getElementById('shareBtn').onclick = ()=>shareResult(item);
  setTimeout(()=>{ window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 200);
}

async function shareResult(item){
  const url = location.href.split('#')[0];
  const text = `이상형 월드컵 우승: ${item.name}`;
  if(navigator.share){ try{ await navigator.share({ title: document.title, text, url }); }catch(e){} }
  else{
    try{ await navigator.clipboard.writeText(`${text} — ${url}`); alert('클립보드에 복사되었습니다.'); }
    catch(e){ prompt('공유 링크를 복사하세요:', `${text} — ${url}`); }
  }
}

initTournament();
