/* ---------- ملف المريض ---------- */
const get=p=>p.split('.').reduce((o,k)=>o?.[k],D);
window.setP=(p,v)=>{const k=p.split('.'),l=k.pop();k.reduce((o,x)=>o[x],D)[l]=v};
const I=(p,l,t='text')=>`<div><label>${l}</label><input type="${t}" value="${e(get(p))}" oninput="setP('${p}',this.value)"></div>`;
const isDoc=()=>['admin','doctor'].includes(S.u?.role);
const TYPES=['كشف جديد','متابعة','عملية','استشارة'],PRE=['booked','confirmed'];
const tag=p=>p.rex?'<span class="bd" style="--c:#dc2626">🔁 إعادة كشف</span>':(p.type&&p.type!=='كشف جديد'?`<span class="bd" style="--c:#0ea5e9">${e(p.type)}</span>`:'');
const LOGO=()=>S.cfg.logo||new URL('logo.png.png',location.href).href;
let mode='',SR=[];
window.rstLogo=async()=>{const {logo,...o}=S.cfg;await setDoc(doc(db,'settings','clinic'),o)};
window.openP=async(id,m='')=>{
  const p=id==='new'?{}:S.p.find(x=>x.id===id);
  D={...BLANK(),...structuredClone(p)};D.res={...BLANK().res,...D.res};D.op={...BLANK().op,...D.op};mode=m;
  if(id!=='new'&&D.status==='waiting'&&!D.num&&isDoc()){D.num=await nextNum();updateDoc(doc(db,'patients',id),{num:D.num})}
  M();$('#modal').style.display='flex';
};
window.closeM=()=>{$('#modal').style.display='none';D=null};
window.toArrive=()=>{mode='arrive';M()};
window.fdel=i=>{D.files.splice(i,1);M()};
window.srch=q=>{
  q=q.trim();SR=[];const seen=new Set();
  if(q)[...S.p].sort((a,b)=>(b.date||'')>(a.date||'')?1:-1).forEach(p=>{const k=p.name+'|'+p.phone;if(!seen.has(k)&&((p.name||'').includes(q)||(p.phone||'').includes(q))){seen.add(k);SR.push(p)}});
  $('#sr').innerHTML=SR.slice(0,6).map((p,i)=>`<div class="row" style="cursor:pointer" onclick="pick(${i})"><span><b>${e(p.name)}</b> ${e(p.phone||'')} ${p.age?'— '+e(p.age)+' سنة':''}</span><span class="btn s">اختيار</span></div>`).join('')||(q?'<div class="empty" style="padding:8px">لا توجد نتائج</div>':'');
};
window.pick=i=>{const p=SR[i];Object.assign(D,{name:p.name,phone:p.phone||'',age:p.age||'',gender:p.gender||'',hist:p.hist||'',prevDiag:p.diag||''});M()};
function M(){
  const rec=mode==='arrive'||!PRE.includes(D.status),dr=isDoc()&&!PRE.includes(D.status),nw=!D.id;
  const al=D.rex?'🔁 إعادة كشف لمريض تم الكشف عليه من قبل':D.type!=='كشف جديد'?'🔁 نوع الزيارة: '+D.type:'';
  $('#modal').innerHTML=`<div class="mb"><div class="top"><h2>${nw?'حجز جديد':'ملف المريض'} ${D.num?`<span class="bd" style="--c:#7c3aed">رقم ${D.num}</span>`:''} <span class="bd ${D.status}">${ST[D.status]}</span> ${tag(D)}</h2><button class="btn g" onclick="closeM()">✕</button></div>
  ${dr&&D.status==='waiting'&&al?`<div class="alert">${al}${D.prevDiag?`<br>آخر تشخيص: ${e(D.prevDiag)}`:''}</div>`:''}
  <h4>بيانات الحجز</h4>
  <div class="f"><div><label>نوع الزيارة</label><select onchange="setP('type',this.value);M()">${TYPES.map(t=>`<option ${D.type===t?'selected':''}>${t}</option>`).join('')}</select></div></div>
  ${nw&&D.type!=='كشف جديد'?`<label>ابحث عن المريض بالاسم أو الهاتف</label><input placeholder="ابدأ الكتابة..." oninput="srch(this.value)"><div id="sr"></div>`:''}
  <div class="f">${I('name','الاسم')}${I('phone','الهاتف')}${I('date','تاريخ الحجز','date')}${I('time','الوقت','time')}</div>
  <label>ملاحظات الحجز</label><textarea oninput="setP('notes',this.value)">${e(D.notes)}</textarea>
  ${rec?`<h4>${mode==='arrive'?'استكمال بيانات الاستقبال':'بيانات الاستقبال'}</h4><div class="f">${I('age','السن','number')}<div><label>النوع</label><select onchange="setP('gender',this.value)"><option></option>${['ذكر','أنثى'].map(g=>`<option ${D.gender===g?'selected':''}>${g}</option>`).join('')}</select></div></div>
  <label>التاريخ المرضي / ملاحظات الاستقبال</label><textarea oninput="setP('hist',this.value)">${e(D.hist)}</textarea>
  <label>المستندات (تُحفظ على Google Drive)</label><input type="file" multiple onchange="up(this)">${D.files.map((f,i)=>`<div class="row"><a href="${e(f.url)}" target="_blank">📎 ${e(f.name)}</a><button class="btn s r" onclick="fdel(${i})">✕</button></div>`).join('')}`:''}
  ${dr?`<h4>التشخيص</h4><textarea oninput="setP('diag',this.value)">${e(D.diag)}</textarea><div class="acts" style="margin-top:10px"><button class="btn" onclick="openRx()">💊 الروشتة (${D.rx.filter(r=>r.drug).length} دواء)</button></div>
  <h4>انتظار نتائج</h4><div class="f"><div><label>النوع</label><select onchange="setP('res.type',this.value);M()"><option></option>${['تحاليل','أشعة','أخرى'].map(g=>`<option ${D.res.type===g?'selected':''}>${g}</option>`).join('')}</select></div>${I('res.note','تفاصيل المطلوب')}</div>
  <h4>عملية جراحية (تُحوَّل للحسابات)</h4><div class="f">${I('op.name','اسم العملية')}${I('op.type','نوع العملية')}${I('op.total','التكلفة','number')}${I('op.paid','المدفوع','number')}${I('op.date','موعد العملية','date')}</div>`:''}
  <div class="acts" style="margin-top:20px;border-top:1px solid var(--line);padding-top:14px">
  ${mode==='arrive'?`<button class="btn" onclick="sv('waiting')">✔ حفظ وتحويل للطبيب</button>`:`<button class="btn" onclick="sv()">💾 حفظ</button>`}
  ${!nw&&D.status==='booked'&&mode!=='arrive'?`<button class="btn g" onclick="sv('confirmed')">تأكيد الحجز</button>`:''}
  ${!nw&&PRE.includes(D.status)&&mode!=='arrive'?`<button class="btn g" onclick="toArrive()">وصل العيادة</button>`:''}
  ${dr&&!nw?`<button class="btn" style="background:#059669" onclick="sv('done')">✔ تم الكشف</button><button class="btn" style="background:#db2777" onclick="sv('results')" ${D.res.type?'':'disabled title="اختر نوع النتائج"'}>🧪 انتظار نتائج</button>`:''}</div></div>`;
}
window.M=M;
window.sv=async st=>{
  if(!D.name)return alert('اكتب اسم المريض');
  if(st)D.status=st;if(D.status==='waiting'&&!D.num)D.num=await nextNum();if(st==='done'){D.doneAt=Date.now();D.rex=false}
  const {id,...x}=D;if(id)await setDoc(doc(db,'patients',id),x);else await addDoc(collection(db,'patients'),x);closeM();
};
window.up=async inp=>{
  if(!APPS_URL)return alert('ضع رابط Apps Script في APPS_URL');inp.disabled=true;
  try{for(const f of inp.files){const b=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(f)});
    const j=await(await fetch(APPS_URL,{method:'POST',body:JSON.stringify({name:f.name,mime:f.type,data:b,patient:(D.num?D.num+' - ':'')+(D.name||'بدون اسم')})})).json();
    if(j.url)D.files.push({name:f.name,url:j.url});else alert(j.error||'فشل الرفع')}}catch(x){alert('فشل الرفع: '+x.message)}
  M();
};
/* ---------- الروشتة (شاشة منبثقة) ---------- */
window.openRx=()=>{if(!D.rx.length)D.rx.push({drug:'',times:'',note:''});RX();$('#rxm').style.display='flex'};
function RX(){
  $('#rxm').innerHTML=`<div class="mb"><div class="top"><h2>💊 الروشتة — ${e(D.name)}</h2><button class="btn g" onclick="closeRx()">✕</button></div>
  <datalist id="dl">${S.drugs.map(d=>`<option value="${e(d.name)}">`).join('')}</datalist>
  ${D.rx.map((r,i)=>`<div class="rxr"><input list="dl" placeholder="اسم الدواء (اكتب أول حروفه للتذكير)" value="${e(r.drug)}" oninput="rxDrug(${i},this.value)"><input id="rt${i}" placeholder="عدد المرات" value="${e(r.times)}" oninput="rxSet(${i},'times',this.value)"><input id="rn${i}" placeholder="توصيات" value="${e(r.note)}" oninput="rxSet(${i},'note',this.value)"><button class="btn s r" onclick="rxDel(${i})">✕</button></div>`).join('')}
  <button class="btn" onclick="rxAdd()">＋ إضافة دواء</button>
  <label>توصيات عامة</label><textarea oninput="setP('rxNote',this.value)">${e(D.rxNote)}</textarea>
  <div class="acts" style="margin-top:16px"><button class="btn g" onclick="saveRxClose()">💾 حفظ وإغلاق</button><button class="btn" onclick="printRx()">🖨 طباعة الروشتة</button></div></div>`;
}
window.rxSet=(i,k,v)=>{D.rx[i][k]=v};
window.rxDrug=(i,v)=>{const r=D.rx[i];r.drug=v;const d=S.drugs.find(x=>x.name.toLowerCase()===v.trim().toLowerCase());
  if(d){if(!r.times&&d.times){r.times=d.times;$('#rt'+i).value=d.times}if(!r.note&&d.note){r.note=d.note;$('#rn'+i).value=d.note}}};
window.rxAdd=()=>{D.rx.push({drug:'',times:'',note:''});RX()};
window.rxDel=i=>{D.rx.splice(i,1);RX()};
window.closeRx=()=>{$('#rxm').style.display='none';M()};
window.saveRx=async()=>{
  D.rx=D.rx.filter(r=>r.drug.trim());
  for(const r of D.rx){const k=r.drug.trim().toLowerCase().replace(/[\/\s]+/g,'_');await setDoc(doc(db,'drugs',k),{name:r.drug.trim(),times:r.times||'',note:r.note||''},{merge:true})}
  if(D.id)await updateDoc(doc(db,'patients',D.id),{rx:D.rx,rxNote:D.rxNote||''});
};
window.saveRxClose=async()=>{await saveRx();closeRx()};
window.printRx=async()=>{await saveRx();pr()};
window.pr=()=>{
  const c=S.cfg,w=open('','_blank');
  w.document.write(`<html dir="rtl"><head><meta charset="utf-8"><title>روشتة</title><style>body{font-family:Cairo,Tahoma,sans-serif;margin:0;padding:30px;color:#12262a}.h{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f766e;padding-bottom:12px}.h img{height:80px;max-width:220px;object-fit:contain}.h h1{margin:0;color:#0f766e}.p{display:flex;justify-content:space-between;background:#eef5f3;padding:10px 14px;margin:14px 0;border-radius:8px}.rx{font-size:44px;color:#0f766e;font-weight:800}li{margin:12px 0;font-size:18px}li small{display:block;color:#63777a;font-size:14px}.f{position:fixed;bottom:20px;right:30px;left:30px;border-top:2px solid #0f766e;padding-top:8px;text-align:center;font-size:13px;color:#63777a}</style></head><body>
  <div class="h"><div><h1>${e(c.doctor||'')}</h1><div>${e(c.spec||'')}</div><div style="font-size:13px">${e(c.extra||'')}</div></div><img src="${LOGO()}" onerror="this.style.display='none'"></div>
  <div class="p"><span>المريض: <b>${e(D.name)}</b>${D.age?' — '+e(D.age)+' سنة':''}</span><span>التاريخ: ${today()}${D.num?' — رقم '+D.num:''}</span></div>
  ${D.diag?`<div><b>التشخيص:</b> ${e(D.diag)}</div>`:''}<div class="rx">℞</div><ol>${D.rx.filter(r=>r.drug).map(r=>`<li><b>${e(r.drug)}</b> — ${e(r.times)}<small>${e(r.note)}</small></li>`).join('')}</ol>${D.rxNote?`<p><b>توصيات:</b> ${e(D.rxNote)}</p>`:''}
  <div class="f">${[c.addr,c.phone&&'☎ '+c.phone,c.wa&&'واتساب '+c.wa,c.email,c.hours].filter(Boolean).map(e).join(' • ')}</div><script>onload=()=>setTimeout(print,400)<\/script></body></html>`);
  w.document.close();
};
