//const CSV_PATH="data/words.csv";
const JSON_PATH="data/words.json";
//function parseCSV(text){const rows=[];let cur="",row=[],q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cur+='"';i++;}else if(c==='"'){q=!q;}else if(c===','&&!q){row.push(cur.trim());cur="";}else if((c==='\n'||c==='\r')&&!q){if(cur.length||row.length){row.push(cur.trim());rows.push(row);row=[];cur="";}if(c==='\r'&&n==='\n')i++;}else cur+=c;}if(cur.length||row.length){row.push(cur.trim());rows.push(row);}const headers=rows.shift().map(h=>h.replace(/^\uFEFF/,''));return rows.filter(r=>r.length===headers.length).map(r=>{const o={};headers.forEach((h,i)=>o[h]=r[i]);return o;});}
async function loadWords(){const res=await fetch(CSV_PATH);if(!res.ok)throw new Error('CSV 讀取失敗，請使用 Live Server 開啟網站。');return parseCSV(await res.text());}
async function loadWords(){
  const res = await fetch(JSON_PATH);
  if(!res.ok) throw new Error('JSON 讀取失敗');
  return await res.json();
}
function getStorage(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function setStorage(key,val){localStorage.setItem(key,JSON.stringify(val))}
function getReviewWords(){return getStorage('reviewWords',[])} function setReviewWords(v){setStorage('reviewWords',v)}
function getMasteredWords(){return getStorage('masteredWords',[])}
function addUniqueByWord(key,item){const list=getStorage(key,[]);if(!list.some(w=>w.word===item.word)){list.push(item);setStorage(key,list);return true}return false}
function shuffleArray(array){const arr=[...array];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function applyTheme(theme){document.body.classList.toggle('dark-mode',theme==='dark');document.querySelectorAll('#themeSelect').forEach(s=>s.value=theme)}
function setupTheme(){const saved=localStorage.getItem('themeMode')||'light';applyTheme(saved);document.querySelectorAll('#themeSelect').forEach(select=>{select.addEventListener('change',e=>{const mode=e.target.value;localStorage.setItem('themeMode',mode);applyTheme(mode)})})}
function setupMenu(){const btn=document.getElementById('menuBtn'),nav=document.getElementById('navMenu');if(btn&&nav)btn.addEventListener('click',()=>nav.classList.toggle('open'))}
function setupHomeStats(){const m=document.getElementById('masteredCount'),r=document.getElementById('reviewCount'),lp=document.getElementById('lastProgressText');if(m)m.textContent=getMasteredWords().length;if(r)r.textContent=getReviewWords().length;if(lp){const last=getStorage('flashcardLastProgress',null);lp.textContent=last?`${last.currentIndex+1}/${last.total}`:'尚未開始'}}
function getGoal(){return getStorage('toeicGoalSettings',{examDate:'2026-08-31',targetScore:800})}
function setupExamCountdown(){const days=document.getElementById('daysLeft'),score=document.getElementById('targetScoreText'),dateInput=document.getElementById('examDateInput'),scoreInput=document.getElementById('targetScoreInput'),saveBtn=document.getElementById('saveGoalBtn');if(!days||!score)return;function render(){const g=getGoal();if(dateInput)dateInput.value=g.examDate;if(scoreInput)scoreInput.value=g.targetScore;const exam=new Date(g.examDate+'T00:00:00');const today=new Date();const diff=Math.ceil((exam-today)/(1000*60*60*24));days.textContent=diff>0?diff:0;score.textContent=g.targetScore||800;}if(saveBtn)saveBtn.addEventListener('click',()=>{setStorage('toeicGoalSettings',{examDate:dateInput.value||'2026-08-31',targetScore:Number(scoreInput.value)||800});render();alert('已儲存考試目標！')});render();}
document.addEventListener('DOMContentLoaded',()=>{setupTheme();setupMenu();setupHomeStats();setupExamCountdown();});