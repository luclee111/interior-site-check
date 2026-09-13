(()=>{
  const TOP_HOME='./index.html';
  const TOP_TODO='./todo.html';
  function addStyles(){
    if(document.getElementById('cloudUiFixStyles'))return;
    const st=document.createElement('style');st.id='cloudUiFixStyles';st.textContent=`
      .cloudNavBtn{display:inline-flex;align-items:center;justify-content:center;border:1px solid #d8d5ce;background:#fff;color:#20242a;border-radius:999px;padding:9px 13px;text-decoration:none;font-weight:800;white-space:nowrap;font-size:13px}
      .cloudPhotoModal{position:fixed;inset:0;z-index:99999;background:rgba(12,14,17,.96);display:none;flex-direction:column;color:#fff}
      .cloudPhotoModal.open{display:flex}
      .cloudPhotoBar{display:flex;align-items:center;gap:8px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));background:rgba(24,28,33,.98);border-bottom:1px solid rgba(255,255,255,.15)}
      .cloudPhotoTitle{margin-right:auto;font-weight:800;font-size:13px}
      .cloudPhotoClose{border:1px solid rgba(255,255,255,.22);background:#303640;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800}
      .cloudPhotoStage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:auto;padding:10px;-webkit-overflow-scrolling:touch}
      .cloudPhotoStage img{display:block;max-width:100%;max-height:calc(100dvh - 76px);object-fit:contain;border-radius:6px;box-shadow:0 12px 40px rgba(0,0,0,.45)}
      @media(max-width:700px){.cloudNavBtn{padding:8px 10px;font-size:12px}.cloudPhotoStage{padding:6px}}
    `;document.head.appendChild(st);
  }
  function addModal(){
    if(document.getElementById('cloudPhotoModal'))return;
    const m=document.createElement('div');m.id='cloudPhotoModal';m.className='cloudPhotoModal';m.innerHTML=`<div class="cloudPhotoBar"><div class="cloudPhotoTitle">현장사진 크게 보기</div><button class="cloudPhotoClose" type="button">닫기</button></div><div class="cloudPhotoStage"><img alt="현장사진 확대"></div>`;
    document.body.appendChild(m);
    const close=()=>{m.classList.remove('open');m.querySelector('img').src='';document.body.style.overflow=''};
    m.querySelector('button').onclick=close;
    m.addEventListener('click',e=>{if(e.target===m||e.target.classList.contains('cloudPhotoStage'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open'))close()});
  }
  function openPhoto(src){
    const m=document.getElementById('cloudPhotoModal');if(!m)return;
    m.querySelector('img').src=src;m.classList.add('open');document.body.style.overflow='hidden';
  }
  function addNav(){
    const tb=document.querySelector('.toolbar');if(!tb)return false;
    if(!document.getElementById('cloudHomeBtn')){
      const home=document.createElement('a');home.id='cloudHomeBtn';home.className='cloudNavBtn';home.href=TOP_HOME;home.target='_top';home.textContent='⌂ 홈';tb.prepend(home);
    }
    if(!document.getElementById('cloudTodoBtn')){
      const todo=document.createElement('a');todo.id='cloudTodoBtn';todo.className='cloudNavBtn';todo.href=TOP_TODO;todo.target='_top';todo.textContent='✓ To-do';tb.prepend(todo);
    }
    return true;
  }
  addStyles();addModal();
  // 기존 bridge가 사진 클릭에 window.open을 걸어도 캡처 단계에서 막아 같은 화면의 모달로 표시한다.
  document.addEventListener('click',e=>{
    const img=e.target?.closest?.('img.thumb');
    if(!img||!img.src)return;
    const parent=img.closest('.photoWrap,.thumbs,.photos');
    if(!parent)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openPhoto(img.src);
  },true);
  if(!addNav()){
    const mo=new MutationObserver(()=>{if(addNav())mo.disconnect()});mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),15000);
  }
})();