const STAGES={
  not_started:{label:'미착수',icon:'○'},
  contact:{label:'문의 준비',icon:'✎'},
  sent:{label:'문의·견적 요청',icon:'↗'},
  waiting:{label:'답변 대기',icon:'…'},
  deciding:{label:'결정 필요',icon:'◇'},
  ordered:{label:'주문 완료',icon:'▣'},
  scheduled:{label:'일정 확정',icon:'◷'},
  doing:{label:'진행 중',icon:'▶'},
  blocked:{label:'막힘·보류',icon:'!'},
  done:{label:'완료',icon:'✓'}
};
const LINK_TYPES={product:'🛒 상품',inquiry:'💬 문의',quote:'💰 견적',order:'📦 주문',tracking:'🚚 배송',contractor:'🧰 업체',reference:'🔖 참고',other:'🔗 기타'};
const REFS={
 'todo-entry-hidden-outlet':['en-04'],
 'todo-entry-shoecab-mirror':['custom-1789280829558','en-02'],
 'todo-living-tvwall-cluster':['li-09'],
 'todo-living-walllamp':['li-06'],
 'todo-curtain-quote':['custom-1789283607897','custom-1789284414726','custom-1789284511478'],
 'todo-curtain-clearance':['li-13','custom-1789283607897','custom-1789284414726','custom-1789284511478'],
 'todo-front-blind':['custom-1789285140238'],
 'todo-doorlock':['custom-1789285186197'],
 'todo-garden-cover':['custom-1789285596297'],
 'todo-screen':['custom-1789282498083']
};
const VENDOR_PACKS={
 'todo-curtain-quote':{
   title:'커튼 업체 상담용 실측 메모',
   measures:[
    ['거실','커튼박스 너비 3817 mm\n깊이 120 mm\n높이 2320~2335 mm\n벽 전체가 샷시'],
    ['침실','샷시 포함 너비 2615 mm\n벽 전체 3602 mm\n깊이 120 mm\n높이 2335 mm'],
    ['서재','너비 2705 mm\n깊이 120 mm\n높이 기록 2305 / 2335 mm 상충 → 재확인 필요']
   ],
   message:`안녕하세요. 거실·침실·서재 커튼 견적 문의드립니다.\n\n[현장 참고 실측]\n- 거실: 커튼박스 W3817 / D120 / H2320~2335 mm, 벽 전체 샷시\n- 침실: 샷시 포함 W2615 mm, 벽 전체 W3602 mm, D120 / H2335 mm\n- 서재: W2705 / D120 mm, 높이는 현장 기록이 2305와 2335 mm로 달라 재실측이 필요합니다.\n\n거실은 속커튼+겉커튼 2중 레일을 우선 고려하고 있습니다. 위 치수는 견적 참고용이며 실제 주문 전 업체 최종실측을 원합니다. 120 mm 커튼박스에서 2중 레일 가능 여부, 원단 주름 배수, 바닥 마감 후 최종 길이, 양옆으로 걷었을 때 스택 폭, 시스템에어컨/간접조명 간섭까지 같이 확인 부탁드립니다.`,
   questions:['120 mm 커튼박스에서 2중 레일 시공 가능한가?','업체가 주문 전 최종 실측하는가?','추천 주름 배수와 완성 폭은?','바닥 마감 후 커튼 하단 여유는 몇 mm가 적절한가?','커튼 스택 폭과 창 개방 면적은?','시스템에어컨 토출·점검구 및 간접조명과 간섭 없는가?']
 },
 'todo-front-blind':{
   title:'전면 베란다 블라인드 상담용 실측 메모',
   measures:[
    ['중앙','폭 3915 mm\n하부 바닥에서 245 mm'],
    ['왼쪽','폭 2345 mm\n하부 바닥에서 410 mm'],
    ['오른쪽','폭 2898 mm\n하부 바닥에서 410 mm'],
    ['공통','벽 높이 2420 mm\n현재 기록은 주문 높이로 바로 사용하지 말 것']
   ],
   message:`안녕하세요. 전면 베란다 블라인드 견적 문의드립니다.\n\n[현장 참고 실측]\n- 중앙: 폭 3915 mm / 하부 바닥에서 245 mm\n- 왼쪽: 폭 2345 mm / 하부 바닥에서 410 mm\n- 오른쪽: 폭 2898 mm / 하부 바닥에서 410 mm\n- 벽 높이: 2420 mm\n\n기존 블라인드는 철거 예정이며, 위 값은 제가 현장에서 잰 참고치입니다. 실제 주문 높이와 브라켓 설치점은 업체 최종실측으로 확정하고 싶습니다. 3구간 분할 방식, 내측/외측 설치, 샷시 손잡이·창 개폐 간섭, 체인 방향, 원단 개방률과 색상까지 같이 상담 부탁드립니다.`,
   questions:['현재 3구간 분할을 유지하는 것이 적절한가?','내측 설치와 외측 설치 중 어떤 방식이 가능한가?','브라켓이 고정될 천장/샷시 면 상태는 괜찮은가?','실제 주문 높이는 어디서 어디까지 재야 하는가?','창 손잡이 및 미닫이 개폐와 간섭 없는가?','체인 위치는 어느 쪽이 동선에 유리한가?','야간 프라이버시와 자연광을 고려한 원단 개방률은?']
 }
};

const sb=createInteriorSupabase();
let user=null,project=null,rows=[],allField=[],photoMeta=[],photoByItem=new Map(),summaryFilter='',openIds=new Set(),dirtyIds=new Set();
const $=id=>document.getElementById(id);const list=$('list');
function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')}
function raw(x){return x&&x.raw_data&&typeof x.raw_data==='object'&&!Array.isArray(x.raw_data)?x.raw_data:{}}
function stageOf(x){if(x.workflow_status==='done'||x.finalized)return'done';const s=raw(x).progressStage;if(s&&STAGES[s])return s;if(x.workflow_status==='hold')return'waiting';return'not_started'}
function stageLabel(s){return(STAGES[s]||STAGES.not_started).label}
function priorityOf(x){return raw(x).priority|| (x.critical?'P0':'P1')}
function lastUpdated(x){const r=raw(x),logs=Array.isArray(r.progressLog)?r.progressLog:[];return r.lastUpdatedAt||logs[0]?.at||x.created_at||''}
function fmtDateTime(v){if(!v)return'';try{return new Intl.DateTimeFormat('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v))}catch{return''}}
function todayStr(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dayDiff(dateStr){if(!dateStr)return null;const a=new Date(todayStr()+'T00:00:00'),b=new Date(dateStr+'T00:00:00');return Math.round((b-a)/86400000)}
function dueClass(x){const d=dayDiff(raw(x).dueDate);return d===null?'':d<0?'over':d<=7?'soon':''}
function dueText(x){const v=raw(x).dueDate;if(!v)return'';const d=dayDiff(v);if(d<0)return`${v} · ${Math.abs(d)}일 지남`;if(d===0)return`${v} · 오늘`;if(d<=7)return`${v} · D-${d}`;return v}
function isStale(x){if(stageOf(x)==='done')return false;const u=lastUpdated(x);if(!u)return false;return(Date.now()-new Date(u).getTime())/86400000>7}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),1800)}
async function guard(){const {data,error}=await sb.auth.getUser();if(error||!data.user){location.href='./cloud-login.html?next='+encodeURIComponent(location.pathname+location.search);return false}user=data.user;return true}
async function getProject(){const requested=new URLSearchParams(location.search).get('project');const {data,error}=await sb.from('projects').select('*').order('created_at',{ascending:false}).limit(20);if(error)throw error;project=requested?(data||[]).find(x=>x.id===requested):(data||[])[0];if(!project)throw new Error('현장 프로젝트가 없습니다.');$('projectLabel').textContent=(project.name||'현장 프로젝트')+(project.meeting_date?' · '+project.meeting_date:'')+' · Supabase 동기화'}
async function loadAll(){
 const {data,error}=await sb.from('field_items').select('*').eq('project_id',project.id).order('sort_order');if(error)throw error;
 allField=data||[];rows=allField.filter(x=>x.source==='todo');
 const {data:ps,error:pe}=await sb.from('field_photos').select('*').eq('project_id',project.id);if(pe)throw pe;photoMeta=ps||[];
 const paths=photoMeta.map(x=>x.storage_path);if(paths.length){const {data:signed,error:se}=await sb.storage.from('site-photos').createSignedUrls(paths,3600);if(se)throw se;(signed||[]).forEach((x,i)=>{if(photoMeta[i])photoMeta[i].url=x.signedUrl})}
 photoByItem=new Map();for(const p of photoMeta){if(!photoByItem.has(p.item_id))photoByItem.set(p.item_id,[]);photoByItem.get(p.item_id).push(p)}
 buildFilters();renderAll();
}
function sourceRowsFor(todo){const refs=REFS[todo.source_item_id]||[];return allField.filter(r=>r.source!=='todo'&&refs.includes(r.source_item_id))}
function sourceContext(todo){return sourceRowsFor(todo).map(r=>{const a=[`[${r.room_name||''}] ${r.title||''}`];if(r.consult_note)a.push('현장메모: '+r.consult_note);if(r.decision_text)a.push('결정: '+r.decision_text);if(r.action)a.push('후속: '+r.action);return a.join('\n')}).join('\n\n')}
function relatedPhotos(todo){
 const out=[];for(const p of(photoByItem.get(todo.id)||[]))out.push({...p,label:'To-do 사진',own:true});
 for(const r of sourceRowsFor(todo))for(const p of(photoByItem.get(r.id)||[]))out.push({...p,label:r.title||r.room_name||'현장사진',own:false});
 if(out.length)return out.slice(0,16);
 const rooms=String(todo.room_name||'').split('·').map(x=>x.trim()).filter(Boolean);if(!rooms.length||rooms.includes('공통'))return out;
 for(const r of allField){if(r.source==='todo')continue;if(rooms.some(k=>String(r.room_name||'').includes(k)))for(const p of(photoByItem.get(r.id)||[]))out.push({...p,label:'같은 공간 · '+(r.title||r.room_name),own:false})}
 return out.slice(0,10)
}
function linksOf(x){return Array.isArray(raw(x).links)?raw(x).links:[]}
function logsOf(x){return Array.isArray(raw(x).progressLog)?raw(x).progressLog:[]}
function buildFilters(){
 const cats=[...new Set(rows.map(x=>raw(x).category).filter(Boolean))].sort();const owners=[...new Set(rows.map(x=>x.owner_name).filter(Boolean))].sort();
 const c=$('category'),o=$('owner'),cv=c.value,ov=o.value;c.innerHTML='<option value="">모든 카테고리</option>'+cats.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');o.innerHTML='<option value="">모든 담당</option>'+owners.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');if(cats.includes(cv))c.value=cv;if(owners.includes(ov))o.value=ov;
 const sf=$('stageFilter'),sv=sf.value;sf.innerHTML='<option value="">모든 진행단계</option>'+Object.entries(STAGES).map(([k,v])=>`<option value="${k}">${v.icon} ${v.label}</option>`).join('');if(STAGES[sv])sf.value=sv
}
function setSummaryFilter(v){summaryFilter=v;renderAll()}
function renderSummary(){
 const done=rows.filter(x=>stageOf(x)==='done').length,active=rows.length-done,p0=rows.filter(x=>priorityOf(x)==='P0'&&stageOf(x)!=='done').length,waiting=rows.filter(x=>['waiting','blocked'].includes(stageOf(x))).length,over=rows.filter(x=>{const d=dayDiff(raw(x).dueDate);return stageOf(x)!=='done'&&d!==null&&d<0}).length;
 const defs=[['active','진행 필요',active],['p0','P0 지금',p0],['waiting','대기·막힘',waiting],['overdue','기한 지남',over],['done','완료',done]];
 $('summary').innerHTML=defs.map(([k,n,c])=>`<button class="${summaryFilter===k?'on':''}" onclick="setSummaryFilter('${summaryFilter===k?'':k}')"><b>${c}</b><span>${n}</span></button>`).join('');
 const pct=rows.length?Math.round(done/rows.length*100):0;$('progressBar').style.width=pct+'%';$('progressText').textContent=`${done}/${rows.length} 완료 · ${pct}%`
}
function renderOverview(){
 const focus=rows.filter(x=>stageOf(x)!=='done').sort((a,b)=>focusScore(b)-focusScore(a)).slice(0,5);
 $('focusList').innerHTML=focus.length?focus.map(x=>`<div class="miniItem"><span class="dot"></span><button onclick="openTodo('${x.id}')">${esc(x.title)}</button><span class="miniTime">${esc(focusHint(x))}</span></div>`).join(''):'<div class="subtle">당장 집중할 항목이 없습니다.</div>';
 const events=[];for(const x of rows){for(const l of logsOf(x))events.push({title:x.title,...l})}events.sort((a,b)=>new Date(b.at)-new Date(a.at));
 $('recentList').innerHTML=events.length?events.slice(0,6).map(e=>`<div class="miniItem"><span class="dot" style="background:#315d8c"></span><div><b style="font-size:11px">${esc(e.title)}</b><div class="subtle">${esc(e.text)}</div></div><span class="miniTime">${esc(fmtDateTime(e.at))}</span></div>`).join(''):'<div class="subtle">아직 진행기록이 없습니다. 각 할 일에서 진행상황을 한 줄씩 남겨보세요.</div>'
}
function focusScore(x){let s=0;const d=dayDiff(raw(x).dueDate);if(d!==null&&d<0)s+=1000;if(priorityOf(x)==='P0')s+=500;if(stageOf(x)==='blocked')s+=450;if(stageOf(x)==='deciding')s+=350;if(stageOf(x)==='waiting')s+=180;if(d!==null&&d<=7)s+=250;return s}
function focusHint(x){const d=dayDiff(raw(x).dueDate);if(d!==null&&d<0)return'기한 지남';if(priorityOf(x)==='P0')return'P0';return stageLabel(stageOf(x))}
function searchable(x){const r=raw(x);return [x.title,x.room_name,x.owner_name,x.action,x.decision_text,x.consult_note,r.category,r.priority,r.vendor,...logsOf(x).map(v=>v.text),...linksOf(x).flatMap(v=>[v.title,v.url,LINK_TYPES[v.type]])].join(' ').toLowerCase()}
function match(x){const q=$('search').value.trim().toLowerCase(),cat=$('category').value,pr=$('priority').value,st=$('stageFilter').value,own=$('owner').value,s=stageOf(x);if(q&&!searchable(x).includes(q))return false;if(cat&&raw(x).category!==cat)return false;if(pr&&priorityOf(x)!==pr)return false;if(st&&s!==st)return false;if(own&&x.owner_name!==own)return false;if(summaryFilter==='active'&&s==='done')return false;if(summaryFilter==='p0'&&(priorityOf(x)!=='P0'||s==='done'))return false;if(summaryFilter==='waiting'&&!['waiting','blocked'].includes(s))return false;if(summaryFilter==='done'&&s!=='done')return false;if(summaryFilter==='overdue'){const d=dayDiff(raw(x).dueDate);if(s==='done'||d===null||d>=0)return false}return true}
function sortedRows(){const arr=rows.filter(match),mode=$('sort').value;const pri={P0:0,P1:1,P2:2};return arr.sort((a,b)=>{if(mode==='due'){const ad=raw(a).dueDate||'9999-12-31',bd=raw(b).dueDate||'9999-12-31';return ad.localeCompare(bd)||((pri[priorityOf(a)]??9)-(pri[priorityOf(b)]??9))}if(mode==='recent')return new Date(lastUpdated(b)||0)-new Date(lastUpdated(a)||0);if(mode==='default')return(a.sort_order||0)-(b.sort_order||0);return((pri[priorityOf(a)]??9)-(pri[priorityOf(b)]??9))||((a.sort_order||0)-(b.sort_order||0))})}
function stageOptions(cur){return Object.entries(STAGES).map(([k,v])=>`<option value="${k}" ${k===cur?'selected':''}>${v.icon} ${v.label}</option>`).join('')}
function linkTypeOptions(){return Object.entries(LINK_TYPES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
function renderAll(){renderSummary();renderOverview();renderList()}
function renderList(){
 const arr=sortedRows();if(!rows.length){list.innerHTML='<div class="empty">To-do 데이터가 아직 없습니다.<br><br><a class="btn" href="./todo-plus.html">기존 To-do에서 초기 항목 만들기</a></div>';return}if(!arr.length){list.innerHTML='<div class="empty">조건에 맞는 할 일이 없습니다.</div>';return}
 list.innerHTML=arr.map(renderCard).join('')
}
function renderCard(x){
 const r=raw(x),st=stageOf(x),open=openIds.has(x.id),photos=relatedPhotos(x),links=linksOf(x),logs=logsOf(x),due=dueText(x),dc=dueClass(x),ctx=sourceContext(x),vendor=VENDOR_PACKS[x.source_item_id],stale=isStale(x);
 const next=x.action||'';const cls=['todo',open?'open':'',st==='done'?'done':'',dc==='over'?'overdue':''].filter(Boolean).join(' ');
 return `<article class="${cls}" id="todo-${x.id}">
 <div class="head"><button class="check ${st==='done'?'done':''}" onclick="toggleDone('${x.id}')" aria-label="완료 전환">${st==='done'?'✓':'□'}</button>
 <div><div class="title">${esc(x.title)}</div><div class="meta"><span class="tag ${priorityOf(x).toLowerCase()}">${esc(priorityOf(x))}</span><span class="tag">${esc(x.room_name||'')}</span><span class="tag">${esc(x.owner_name||'담당 미정')}</span><span class="stage ${st}">${esc((STAGES[st]||STAGES.not_started).icon+' '+stageLabel(st))}</span>${due?`<span class="tag due ${dc}">${esc(due)}</span>`:''}${stale?'<span class="tag warnText">7일+ 업데이트 없음</span>':''}</div>
 <div class="nextLine">${next?`<b>다음 행동</b> · ${esc(next)}`:'<span class="subtle">다음 행동이 아직 기록되지 않았습니다.</span>'}</div><div class="quickMeta"><span class="tag">🔗 ${links.length}</span><span class="tag">📷 ${photos.length}</span><span class="tag">🕘 ${logs.length}</span>${r.vendor?`<span class="tag">🧰 ${esc(r.vendor)}</span>`:''}</div></div>
 <button class="detailBtn" onclick="toggleCard('${x.id}')">${open?'접기':'세부 보기'}</button></div>
 <div class="body">${renderCore(x)}${vendor?renderVendor(x,vendor):''}${renderHistory(x,logs)}${renderLinks(x,links)}${ctx?renderContext(ctx):''}${renderPhotos(x,photos)}</div></article>`
}
function renderCore(x){const r=raw(x),st=stageOf(x);return `<section class="section"><div class="sectionHead"><h3>📍 현재 진행상황</h3><small>가장 최신 상태만 위에 유지하고, 변화는 아래 진행기록에 남깁니다.</small></div><div class="grid">
 <div class="field"><label>진행 단계</label><select data-stage="${x.id}" oninput="markDirty('${x.id}')">${stageOptions(st)}</select></div>
 <div class="field"><label>목표/확인 기한</label><input type="date" data-due="${x.id}" value="${esc(r.dueDate||'')}" oninput="markDirty('${x.id}')"></div>
 <div class="field"><label>담당</label><input data-owner="${x.id}" value="${esc(x.owner_name||'')}" placeholder="나 / 팀장님 / 업체" oninput="markDirty('${x.id}')"></div>
 <div class="field"><label>업체·상대방</label><input data-vendor="${x.id}" value="${esc(r.vendor||'')}" placeholder="업체명·담당자" oninput="markDirty('${x.id}')"></div>
 <div class="field wide"><label>결정 / 현재 결과</label><input data-decision="${x.id}" value="${esc(x.decision_text||'')}" placeholder="확정된 결과를 한 줄로" oninput="markDirty('${x.id}')"></div>
 <div class="field wide"><label>다음 행동</label><input data-action="${x.id}" value="${esc(x.action||'')}" placeholder="다음에 실제로 할 한 가지" oninput="markDirty('${x.id}')"></div>
 </div><div class="saveRow"><button id="save-${x.id}" onclick="saveCore('${x.id}')">진행상황 저장</button></div></section>`}
function renderVendor(x,v){return `<section class="section"><div class="sectionHead"><h3>📐 ${esc(v.title)}</h3><small>실측값은 견적 참고용 · 주문 전 업체 재실측 권장</small></div><div class="vendorBox"><div class="measureGrid">${v.measures.map(([a,b])=>`<div class="measure"><b>${esc(a)}</b><span>${esc(b).replaceAll('\n','<br>')}</span></div>`).join('')}</div><div class="vendorText">${esc(v.message)}</div><div class="links">${v.questions.map(q=>`<span class="linkChip">✓ ${esc(q)}</span>`).join('')}</div><div class="saveRow"><button onclick="copyVendor('${x.source_item_id}')">업체 전달문 복사</button></div></div></section>`}
function renderHistory(x,logs){return `<section class="section"><div class="sectionHead"><h3>🕘 진행상황 기록</h3><small>전화·문의·견적·주문·일정 변경을 시간순으로 남기세요.</small></div><div class="history">${logs.length?logs.map(l=>`<div class="historyItem"><time>${esc(fmtDateTime(l.at))}</time><p>${esc(l.text)}</p><button class="iconBtn" onclick="removeProgress('${x.id}','${esc(l.id)}')">삭제</button></div>`).join(''):'<div class="subtle">아직 기록이 없습니다.</div>'}</div><div class="addRow"><textarea id="progress-${x.id}" placeholder="예: 9/13 팀장님께 문의 전달. 샷시팀 답변 기다리는 중."></textarea><button class="primary" onclick="addProgress('${x.id}')">기록 추가</button></div></section>`}
function renderLinks(x,links){return `<section class="section"><div class="sectionHead"><h3>🔗 관련 링크</h3><small>상품·문의내역·견적서·주문·배송 링크를 이 할 일에 묶어둡니다.</small></div><div class="links">${links.length?links.map(l=>`<span class="linkChip"><span>${esc(LINK_TYPES[l.type]||LINK_TYPES.other)}</span><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title||l.url)}</a><button class="iconBtn" onclick="removeLink('${x.id}','${esc(l.id)}')">×</button></span>`).join(''):'<span class="subtle">등록된 링크가 없습니다.</span>'}</div><div class="linkAdd"><select id="linkType-${x.id}">${linkTypeOptions()}</select><input id="linkTitle-${x.id}" placeholder="이름 (예: 도어락 상품)"><input id="linkUrl-${x.id}" inputmode="url" placeholder="https://…"><button onclick="addLink('${x.id}')">링크 추가</button></div></section>`}
function renderContext(ctx){return `<section class="section"><div class="sectionHead"><h3>📝 연결된 현장기록</h3><small>조명·콘센트·현장회의 기록에서 가져온 참고정보</small></div><div class="context">${esc(ctx)}</div></section>`}
function renderPhotos(x,photos){return `<section class="section"><div class="sectionHead"><h3>📷 관련 현장사진</h3><button class="iconBtn" onclick="pickPhoto('${x.id}')">+ 사진 추가</button></div>${photos.length?`<div class="photos">${photos.map(p=>`<div class="photo"><img src="${esc(p.url||'')}" alt="${esc(p.label||'현장사진')}" onclick="openPhoto('${esc(p.url||'')}')">${p.own?`<button class="del" onclick="event.stopPropagation();deleteTodoPhoto('${x.id}','${p.id}')">×</button>`:''}<small>${esc(p.label||'현장사진')}</small></div>`).join('')}</div>`:'<div class="subtle">연결된 현장사진이 없습니다.</div>'}</section>`}
function toggleCard(id){openIds.has(id)?openIds.delete(id):openIds.add(id);renderList();requestAnimationFrame(()=>document.getElementById('todo-'+id)?.scrollIntoView({block:'nearest'}))}
function openTodo(id){openIds.add(id);renderList();requestAnimationFrame(()=>document.getElementById('todo-'+id)?.scrollIntoView({behavior:'smooth',block:'start'}))}
function markDirty(id){dirtyIds.add(id);const b=document.getElementById('save-'+id);if(b){b.classList.add('dirty');b.textContent='저장 필요'}}
async function saveCore(id){
 const x=rows.find(v=>v.id===id);if(!x)return;const r={...raw(x)},old=stageOf(x),st=document.querySelector(`[data-stage="${id}"]`).value,now=new Date().toISOString();
 r.progressStage=st;r.dueDate=document.querySelector(`[data-due="${id}"]`).value||null;r.vendor=document.querySelector(`[data-vendor="${id}"]`).value.trim();r.lastUpdatedAt=now;
 let logs=[...logsOf(x)];if(old!==st)logs.unshift({id:crypto.randomUUID(),at:now,text:`상태 변경: ${stageLabel(old)} → ${stageLabel(st)}`});r.progressLog=logs;
 const owner_name=document.querySelector(`[data-owner="${id}"]`).value.trim(),decision_text=document.querySelector(`[data-decision="${id}"]`).value.trim(),action=document.querySelector(`[data-action="${id}"]`).value.trim();const workflow_status=st==='done'?'done':(['waiting','blocked'].includes(st)?'hold':'todo');
 const {data,error}=await sb.from('field_items').update({workflow_status,finalized:st==='done',checked:st==='done',owner_name,decision_text,action,raw_data:r}).eq('id',id).select().single();if(error)return alert('저장 실패: '+error.message);Object.assign(x,data);dirtyIds.delete(id);toast('진행상황 저장됨');renderAll()
}
async function toggleDone(id){const x=rows.find(v=>v.id===id);if(!x)return;const current=stageOf(x),next=current==='done'?'not_started':'done',r={...raw(x)},now=new Date().toISOString(),logs=[...logsOf(x)];logs.unshift({id:crypto.randomUUID(),at:now,text:`상태 변경: ${stageLabel(current)} → ${stageLabel(next)}`});Object.assign(r,{progressStage:next,progressLog:logs,lastUpdatedAt:now});const {data,error}=await sb.from('field_items').update({workflow_status:next==='done'?'done':'todo',finalized:next==='done',checked:next==='done',raw_data:r}).eq('id',id).select().single();if(error)return alert('저장 실패: '+error.message);Object.assign(x,data);toast(next==='done'?'완료 처리됨':'완료 취소됨');renderAll()}
async function updateRaw(id,mutator,msg){const x=rows.find(v=>v.id===id);if(!x)return;const r={...raw(x)};mutator(r);r.lastUpdatedAt=new Date().toISOString();const {data,error}=await sb.from('field_items').update({raw_data:r}).eq('id',id).select().single();if(error)return alert('저장 실패: '+error.message);Object.assign(x,data);if(msg)toast(msg);renderAll()}
async function addProgress(id){const el=document.getElementById('progress-'+id),text=el.value.trim();if(!text)return toast('진행내용을 입력해주세요');await updateRaw(id,r=>{const logs=Array.isArray(r.progressLog)?[...r.progressLog]:[];logs.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),text});r.progressLog=logs},'진행기록 추가됨')}
async function removeProgress(id,logId){if(!confirm('이 진행기록을 삭제할까요?'))return;await updateRaw(id,r=>{r.progressLog=(Array.isArray(r.progressLog)?r.progressLog:[]).filter(v=>v.id!==logId)},'진행기록 삭제됨')}
function normalizeUrl(v){let s=v.trim();if(!s)return null;if(!/^https?:\/\//i.test(s))s='https://'+s;try{const u=new URL(s);if(!['http:','https:'].includes(u.protocol))return null;return u.href}catch{return null}}
async function addLink(id){const type=document.getElementById('linkType-'+id).value,title=document.getElementById('linkTitle-'+id).value.trim(),url=normalizeUrl(document.getElementById('linkUrl-'+id).value);if(!url)return toast('올바른 링크를 입력해주세요');const fallback=new URL(url).hostname;await updateRaw(id,r=>{const links=Array.isArray(r.links)?[...r.links]:[];links.push({id:crypto.randomUUID(),type,title:title||fallback,url,createdAt:new Date().toISOString()});r.links=links},'링크 추가됨')}
async function removeLink(id,linkId){if(!confirm('이 링크를 삭제할까요?'))return;await updateRaw(id,r=>{r.links=(Array.isArray(r.links)?r.links:[]).filter(v=>v.id!==linkId)},'링크 삭제됨')}
async function copyVendor(sourceId){const v=VENDOR_PACKS[sourceId];if(!v)return;try{await navigator.clipboard.writeText(v.message);toast('업체 전달문 복사됨')}catch{window.prompt('아래 내용을 복사하세요.',v.message)}}
function openPhoto(url){$('modalImg').src=url;$('photoModal').classList.add('open');document.body.style.overflow='hidden'}function closePhoto(){$('photoModal').classList.remove('open');$('modalImg').src='';document.body.style.overflow=''}
function safeName(v){return String(v||'todo').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,80)}
async function compressImage(file){if(!file.type.startsWith('image/'))return file;return new Promise(resolve=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{try{const max=1800,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(b=>{URL.revokeObjectURL(url);resolve(b||file)},'image/jpeg',.82)}catch{URL.revokeObjectURL(url);resolve(file)}};img.onerror=()=>{URL.revokeObjectURL(url);resolve(file)};img.src=url})}
function pickPhoto(id){const i=document.createElement('input');i.type='file';i.accept='image/*';i.setAttribute('capture','environment');i.onchange=()=>uploadTodoPhoto(id,i.files?.[0]);i.click()}
async function uploadTodoPhoto(id,file){if(!file)return;try{toast('사진 업로드 중…');const x=rows.find(v=>v.id===id),blob=await compressImage(file),path=`${user.id}/${project.id}/todo/${safeName(x.source_item_id)}/${crypto.randomUUID()}.jpg`;const {error:ue}=await sb.storage.from('site-photos').upload(path,blob,{contentType:blob.type||'image/jpeg',upsert:false});if(ue)throw ue;const {data:meta,error:me}=await sb.from('field_photos').insert({project_id:project.id,item_id:id,source_photo_id:'todo-live-'+Date.now()+'-'+Math.random().toString(36).slice(2),storage_path:path,file_name:path.split('/').pop(),mime_type:blob.type||'image/jpeg'}).select().single();if(me)throw me;const {data:signed,error:se}=await sb.storage.from('site-photos').createSignedUrl(path,3600);if(se)throw se;meta.url=signed.signedUrl;photoMeta.push(meta);if(!photoByItem.has(id))photoByItem.set(id,[]);photoByItem.get(id).push(meta);toast('사진 저장됨');renderList()}catch(e){console.error(e);alert('사진 업로드 실패: '+e.message)}}
async function deleteTodoPhoto(todoId,photoId){if(!confirm('이 To-do 사진을 삭제할까요?'))return;const p=(photoByItem.get(todoId)||[]).find(v=>v.id===photoId);if(!p)return;const {error:se}=await sb.storage.from('site-photos').remove([p.storage_path]);if(se)return alert('사진 삭제 실패: '+se.message);const {error:de}=await sb.from('field_photos').delete().eq('id',photoId);if(de)return alert('사진 기록 삭제 실패: '+de.message);photoByItem.set(todoId,(photoByItem.get(todoId)||[]).filter(v=>v.id!==photoId));photoMeta=photoMeta.filter(v=>v.id!==photoId);toast('사진 삭제됨');renderList()}
['search','category','priority','stageFilter','owner','sort'].forEach(id=>$(id).addEventListener('input',renderAll));
window.addEventListener('beforeunload',e=>{if(dirtyIds.size){e.preventDefault();e.returnValue=''}});window.addEventListener('keydown',e=>{if(e.key==='Escape')closePhoto()});
(async()=>{try{if(!await guard())return;await getProject();await loadAll()}catch(e){console.error(e);list.innerHTML=`<div class="empty">불러오기 실패: ${esc(e.message)}<br><br><button onclick="location.reload()">다시 불러오기</button></div>`}})();