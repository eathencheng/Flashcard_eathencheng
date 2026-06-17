let allWords=[],studyWords=[],currentIndex=0,knownCount=0,unknownCount=0,isFlipped=false;const el=id=>document.getElementById(id);
function progressKey(){const c=el('categoryFilter')?.value||'All';const l=el('levelFilter')?.value||'All';return `flashcardProgress_${c}_${l}`}
function saveStudyProgress(){const data={currentIndex,knownCount,unknownCount,total:studyWords.length,category:el('categoryFilter')?.value||'All',level:el('levelFilter')?.value||'All',savedAt:new Date().toISOString()};setStorage(progressKey(),data);setStorage('flashcardLastProgress',data);setStorage('flashcardLastFilters',{category:data.category,level:data.level});updateResumeText(data)}
function loadStudyProgress(){const data=getStorage(progressKey(),null);if(data&&data.currentIndex>=0&&data.currentIndex<studyWords.length){currentIndex=data.currentIndex;knownCount=data.knownCount||0;unknownCount=data.unknownCount||0;updateResumeText(data);return true}updateResumeText(null);return false}
function updateResumeText(data){const resume=el('resumeText'),saved=el('lastSavedText');if(!resume)return;if(data){resume.textContent=`已載入上次進度：第 ${data.currentIndex+1} / ${data.total||studyWords.length} 張`;saved.textContent=data.savedAt?`最後儲存：${new Date(data.savedAt).toLocaleString('zh-TW')}`:''}else{resume.textContent='目前沒有此分類的學習紀錄，將從第一張開始。';if(saved)saved.textContent=''}}
function populateFilters(words){const cf=el('categoryFilter');[...new Set(words.map(w=>w.category))].forEach(cat=>{const o=document.createElement('option');o.value=cat;o.textContent=cat;cf.appendChild(o)});const last=getStorage('flashcardLastFilters',null);if(last){if([...cf.options].some(o=>o.value===last.category))cf.value=last.category;if([...el('levelFilter').options].some(o=>o.value===last.level))el('levelFilter').value=last.level}}
function applyFilters(){const c=el('categoryFilter').value,l=el('levelFilter').value;studyWords=allWords.filter(w=>(c==='All'||w.category===c)&&(l==='All'||w.level===l));currentIndex=0;knownCount=0;unknownCount=0;loadStudyProgress();showCard();}
function currentWord(){return studyWords[currentIndex]}
//function showCard(){if(!studyWords.length){el('frontWord').textContent='No Words';el('frontPart').textContent='請調整篩選條件';return}isFlipped=false;el('flashcard').classList.remove('flipped');const w=currentWord();el('frontWord').textContent=w.word;el('frontPart').textContent=w.partOfSpeech;el('frontCategory').textContent=`${w.category}｜${w.level}`;el('backCategory').textContent=`${w.category}｜${w.level}`;el('backWord').textContent=w.word;el('meaning').textContent=w.meaning;el('partOfSpeech').textContent=w.partOfSpeech;el('example').textContent=w.example;el('translation').textContent=w.translation;el('synonyms').textContent=w.synonyms;el('collocation').textContent=w.collocation;updateProgress();saveStudyProgress();}

function showCard(){
  if(!studyWords.length){
    el('frontWord').textContent='No Words';
    el('frontPart').textContent='請調整篩選條件';
    return;
  }

  isFlipped=false;
  el('flashcard').classList.remove('flipped');

  const w=currentWord();

  el('frontWord').textContent = w.word;
  el('frontPart').textContent = w.pos;
  el('frontCategory').textContent = `${w.category}｜${w.level}`;

  el('backCategory').textContent = `${w.category}｜${w.level}`;
  el('backWord').textContent = w.word;

  el('meaning').textContent = w.meaning;
  el('partOfSpeech').textContent = w.pos;
  el('example').textContent = w.example;
  el('translation').textContent = w.translation;

  // ✅ 重點
  el('synonyms').textContent = w.synonyms.join(", ");

  el('collocation').textContent = w.collocation;

  updateProgress();
  saveStudyProgress();
}


function updateProgress(){const total=studyWords.length||1;el('progressText').textContent=`${Math.min(currentIndex+1,total)} / ${total}`;el('knownText').textContent=knownCount;el('unknownText').textContent=unknownCount;el('progressBar').style.width=`${Math.round(((currentIndex+1)/total)*100)}%`}
function flipCard(){if(!studyWords.length)return;isFlipped=!isFlipped;el('flashcard').classList.toggle('flipped',isFlipped)}
function nextCard(){if(!studyWords.length)return;if(currentIndex<studyWords.length-1){currentIndex++;showCard()}else{el('progressBar').style.width='100%';saveStudyProgress();alert('本輪字卡已完成！')}}
function previousCard(){if(!studyWords.length)return;if(currentIndex>0){currentIndex--;showCard()}else alert('已經是第一張了！')}
function knowWord(){if(!studyWords.length)return;addUniqueByWord('masteredWords',currentWord());knownCount++;nextCard()}
function addReview(){if(!studyWords.length)return;const added=addUniqueByWord('reviewWords',currentWord());if(added)unknownCount++;updateProgress();saveStudyProgress();alert(added?`已將 ${currentWord().word} 加入錯題本`:`${currentWord().word} 已經在錯題本中`) }
function resetCurrentProgress(){localStorage.removeItem(progressKey());currentIndex=0;knownCount=0;unknownCount=0;showCard();alert('已重置目前分類/難度的進度')}
async function initFlashcards(){try{allWords=await loadWords();populateFilters(allWords);applyFilters();el('categoryFilter').addEventListener('change',applyFilters);el('levelFilter').addEventListener('change',applyFilters);el('shuffleBtn').addEventListener('click',()=>{studyWords=shuffleArray(studyWords);currentIndex=0;showCard()});el('resetProgressBtn').addEventListener('click',resetCurrentProgress);el('flipBtn').addEventListener('click',flipCard);el('nextBtn').addEventListener('click',nextCard);el('prevBtn').addEventListener('click',previousCard);el('knowBtn').addEventListener('click',knowWord);el('reviewBtn').addEventListener('click',addReview);document.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Space')flipCard();if(e.code==='ArrowRight')nextCard();if(e.code==='ArrowLeft')previousCard();if(e.code==='ArrowUp')addReview();if(e.key.toLowerCase()==='k')knowWord();});}catch(err){alert(err.message+'\n請用 VS Code Live Server 開啟 index.html。')}}document.addEventListener('DOMContentLoaded',initFlashcards);