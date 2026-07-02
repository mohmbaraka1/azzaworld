<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>عزّة — الإشعارات</title>
<link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens.css">
<style>
body{transition:background-color .25s,color .25s}
.theme-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--line);background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s;flex-shrink:0}
.theme-btn:hover{border-color:var(--olive);color:var(--olive)}
.theme-btn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;background:var(--cream);color:var(--ink);-webkit-font-smoothing:antialiased}
.ic{stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block;flex-shrink:0}

/* ══ هيدر ══ */
.top{position:sticky;top:0;z-index:50;background:rgba(247,241,227,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.top-in{display:flex;align-items:center;gap:12px;height:62px;padding:0 18px;max-width:680px;margin:0 auto}
.brand{display:flex;align-items:center;gap:9px;text-decoration:none}
.brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--olive),var(--olive-deep));display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:'Aref Ruqaa',serif;font-size:20px}
.brand-text{font-family:'Aref Ruqaa',serif;font-size:22px;color:var(--olive-deep)}
.top-actions{margin-right:auto;display:flex;align-items:center;gap:8px}
.hbtn{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;border:1.5px solid var(--line);background:transparent;color:var(--muted);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:.2s}
.hbtn:hover{border-color:var(--olive);color:var(--olive)}
.sound-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--line);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;position:relative}
.sound-btn:hover{border-color:var(--olive);color:var(--olive)}
.sound-btn.on{border-color:var(--olive);background:rgba(28,91,56,.08);color:var(--olive)}
/* نقطة اختيار الصوت */
.sound-menu{position:absolute;top:calc(100% + 6px);left:0;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:6px;min-width:180px;box-shadow:0 8px 28px rgba(28,26,20,.14);z-index:200;display:none}
.sound-menu.open{display:block}
.sound-opt{display:flex;align-items:center;gap:9px;width:100%;padding:9px 12px;border:none;background:transparent;font-family:inherit;font-size:13px;font-weight:600;color:var(--ink);cursor:pointer;border-radius:10px;transition:.13s;text-align:right}
.sound-opt:hover{background:var(--cream)}
.sound-opt.active{color:var(--olive);background:rgba(28,91,56,.07)}
.sound-opt .preview-btn{margin-right:auto;font-size:11px;color:var(--olive);background:none;border:none;cursor:pointer;padding:0;font-family:inherit;font-weight:700}

/* ══ صفحة ══ */
.page{max-width:680px;margin:0 auto;padding:18px 18px 60px}

/* رأس الصفحة */
.page-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px}
.page-title{font-family:'Aref Ruqaa',serif;font-size:1.55rem;color:var(--ink)}
.unread-badge{background:var(--olive);color:#fff;font-size:12px;font-weight:700;border-radius:999px;padding:2px 9px;margin-right:8px}
.mark-all-btn{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:999px;border:1.5px solid var(--line);background:transparent;color:var(--muted);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:.2s;white-space:nowrap}
.mark-all-btn:hover{border-color:var(--olive);color:var(--olive)}

/* ══ قائمة الإشعارات ══ */
.notif-list{background:var(--card);border:1px solid var(--line);border-radius:var(--rxl);overflow:hidden}

/* إشعار واحد */
.notif-item{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-bottom:.5px solid rgba(28,26,20,.06);cursor:pointer;transition:.15s;position:relative}
.notif-item:last-child{border-bottom:none}
.notif-item:hover{background:var(--cream)}
.notif-item.unread{background:rgba(28,91,56,.035)}
.notif-item.unread:hover{background:rgba(28,91,56,.065)}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.notif-item.new-in{animation:slideIn .28s ease-out}
@keyframes slideOut{to{opacity:0;transform:translateX(60px)}}
.notif-item.removing{animation:slideOut .22s ease-in forwards}

/* نقطة غير مقروء */
.unread-dot{width:8px;height:8px;border-radius:50%;background:var(--olive);flex-shrink:0;margin-top:6px}

/* أفاتار */
.notif-av-wrap{position:relative;flex-shrink:0}
.notif-av{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--olive),var(--olive-deep));display:flex;align-items:center;justify-content:center;color:var(--gold-soft);font-weight:900;font-size:1.15rem;overflow:hidden}
.notif-av img{width:100%;height:100%;object-fit:cover}
.type-badge{position:absolute;bottom:-2px;left:-2px;width:20px;height:20px;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;font-size:11px;border:2px solid var(--card)}

/* محتوى */
.notif-content{flex:1;min-width:0}
.notif-text{font-size:14px;color:var(--ink);line-height:1.5;margin-bottom:6px}
.notif-text strong{font-weight:700}
.notif-text .action{color:var(--muted)}

/* معاينة البوست */
.post-preview{display:flex;align-items:center;gap:8px;background:var(--cream);border:1px solid var(--line);border-radius:10px;padding:8px 11px;margin-bottom:7px;max-width:100%;overflow:hidden}
.post-preview-stripe{width:3px;height:28px;border-radius:999px;flex-shrink:0}
.post-preview-text{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
.post-preview-arrow{font-size:11px;color:var(--olive);flex-shrink:0;font-weight:700}

/* وقت */
.notif-time{font-size:11.5px;color:var(--muted)}

/* زر حذف (يظهر عند hover) */
.del-btn{position:absolute;top:50%;left:12px;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;border:none;background:rgba(206,17,38,.08);color:var(--red);cursor:pointer;display:none;align-items:center;justify-content:center;transition:.15s}
.del-btn:hover{background:var(--red);color:#fff}
.notif-item:hover .del-btn{display:flex}

/* فارغ */
.empty-state{padding:64px 20px;text-align:center}
.empty-icon{font-size:3rem;margin-bottom:14px}
.empty-state b{display:block;font-size:17px;color:var(--ink);margin-bottom:6px}
.empty-state span{font-size:14px;color:var(--muted)}

/* إشعار منبثق (toast للإشعارات الجديدة) */
.notif-toast{position:fixed;top:20px;right:20px;max-width:320px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 14px;display:flex;align-items:flex-start;gap:10px;box-shadow:0 8px 32px rgba(28,26,20,.16);z-index:500;transform:translateX(calc(100% + 24px));transition:transform .3s cubic-bezier(.22,1,.36,1);cursor:pointer}
.notif-toast.show{transform:translateX(0)}
[dir="rtl"] .notif-toast{right:auto;left:20px;transform:translateX(calc(-100% - 24px))}
[dir="rtl"] .notif-toast.show{transform:translateX(0)}
.nt-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--olive),var(--olive-deep));display:flex;align-items:center;justify-content:center;color:var(--gold-soft);font-weight:700;font-size:.9rem;overflow:hidden;flex-shrink:0}
.nt-av img{width:100%;height:100%;object-fit:cover}
.nt-body{flex:1;min-width:0}
.nt-text{font-size:13px;color:var(--ink);line-height:1.45;margin-bottom:2px}
.nt-text strong{font-weight:700}
.nt-preview{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nt-close{background:none;border:none;color:var(--muted);cursor:pointer;padding:2px;font-size:16px;flex-shrink:0;line-height:1}

/* toast عادي */
#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 22px;border-radius:11px;font-size:14px;font-weight:700;color:#fff;z-index:999;opacity:0;transition:.3s;pointer-events:none;max-width:90vw;text-align:center}

@media(max-width:600px){
  .del-btn{display:flex}
  .notif-item:hover{background:inherit}
  .notif-item.unread:hover{background:rgba(28,91,56,.035)}
}
</style>
</head>
<body>

<header class="top">
  <div class="top-in">
    <a href="app.html" class="brand">
      <div class="brand-mark">ع</div>
      <span class="brand-text">عزّة</span>
    </a>
    <div class="top-actions">
      <button class="theme-btn" id="theme-btn" onclick="toggleTheme()" title="تبديل المظهر">
        <svg id="theme-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
      <!-- زر الصوت مع القائمة -->
      <div style="position:relative">
        <button class="sound-btn" id="sound-toggle-btn" onclick="toggleSoundMenu()" title="نغمة الإشعارات">
          <svg class="ic" width="16" height="16" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path id="sound-wave2" d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </button>
        <div class="sound-menu" id="sound-menu">
          <div style="font-size:11px;color:var(--muted);padding:4px 12px 6px;font-weight:700">نغمة الإشعارات</div>
          <button class="sound-opt active" data-sound="none" onclick="selectSound('none',this)">🔕 بلا صوت</button>
          <button class="sound-opt" data-sound="ding" onclick="selectSound('ding',this)">🔔 نغمة خفيفة <span class="preview-btn" onclick="event.stopPropagation();playPreview('ding')">▶</span></button>
          <button class="sound-opt" data-sound="pop" onclick="selectSound('pop',this)">💬 نبضة <span class="preview-btn" onclick="event.stopPropagation();playPreview('pop')">▶</span></button>
          <button class="sound-opt" data-sound="chime" onclick="selectSound('chime',this)">✨ رنين <span class="preview-btn" onclick="event.stopPropagation();playPreview('chime')">▶</span></button>
          <button class="sound-opt" data-sound="alert" onclick="selectSound('alert',this)">📣 تنبيه <span class="preview-btn" onclick="event.stopPropagation();playPreview('alert')">▶</span></button>
        </div>
      </div>
      <button class="hbtn" onclick="history.back()">
        <svg class="ic" width="14" height="14" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        رجوع
      </button>
    </div>
  </div>
</header>

<div class="page">
  <div class="page-top">
    <div style="display:flex;align-items:center">
      <span class="page-title">الإشعارات</span>
      <span class="unread-badge" id="unread-badge" style="display:none">0</span>
    </div>
    <button class="mark-all-btn" onclick="markAllRead()">
      <svg class="ic" width="14" height="14" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      قراءة الكل
    </button>
  </div>

  <div class="notif-list" id="notif-list"></div>
</div>

<!-- إشعار منبثق -->
<div class="notif-toast" id="notif-toast" onclick="goToastNotif()">
  <div class="nt-av" id="nt-av">م</div>
  <div class="nt-body">
    <div class="nt-text" id="nt-text"></div>
    <div class="nt-preview" id="nt-preview"></div>
  </div>
  <button class="nt-close" onclick="event.stopPropagation();hideToastNotif()">✕</button>
</div>

<div id="toast"></div>

<script>
/* ── الوضع الليلي ── */
const THEME_KEY='azza_theme';
function applyTheme(){
  const saved=localStorage.getItem(THEME_KEY);
  document.body.classList.toggle('dark',saved==='dark');
  const icon=document.getElementById('theme-icon');
  if(icon)icon.innerHTML=saved==='dark'
    ?'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
    :'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
}
function toggleTheme(){
  const isDark=document.body.classList.contains('dark');
  localStorage.setItem(THEME_KEY,isDark?'light':'dark');
  applyTheme();
}
applyTheme();

/* ══ AZZA — notifications.html — يستخدم AzzaNotif المركزية ══ */
const SB_URL ='https://iecniydswotsilaueogq.supabase.co';
const SB_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY25peWRzd290c2lsYXVlb2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTg1OTcsImV4cCI6MjA5Nzc3NDU5N30.69LfEBHUwToTHue3EPS_KYq9BvDSZJ9jcW_P1yRKReA';
const azzaDB =supabase.createClient(SB_URL,SB_ANON);

const user=JSON.parse(localStorage.getItem('azza_user')||'null');
if(!user){location.href='login.html';}

/* تحقق من جلسة Auth */
(async()=>{
  const {data}=await azzaDB.auth.getSession();
  if(!data?.session){localStorage.removeItem('azza_user');location.href='login.html';}
})();

/* ── أدوات مساعدة ── */
const ini=n=>(n||'م').trim()[0].toUpperCase();
const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const timeAgo=iso=>{const m=Math.floor((Date.now()-new Date(iso))/60000);if(m<1)return'الآن';if(m<60)return m+' دقيقة';const h=Math.floor(m/60);if(h<24)return h+' ساعة';const d=Math.floor(h/24);if(d<7)return d+' يوم';return new Date(iso).toLocaleDateString('ar');};
function showToast(m,t='ok'){const e=document.getElementById('toast');e.textContent=m;e.style.background=t==='ok'?'#1c5b38':'#c0392b';e.style.opacity='1';clearTimeout(e._t);e._t=setTimeout(()=>e.style.opacity='0',2600);}

/* ── تهيئة AzzaNotif ── */
AzzaNotif.init(azzaDB, user, ()=>{ fetchAndRender(); });

/* ── جلب الإشعارات وعرضها ── */
let _notifs=[];

async function fetchAndRender(){
  try{
    const {data,error}=await azzaDB.from('notifications')
      .select('*').eq('user_id',user.id)
      .order('created_at',{ascending:false}).limit(50);
    if(error)throw error;
    _notifs=(data||[]).map(row=>{
      let meta={};try{meta=JSON.parse(row.content||'{}');}catch{}
      return {...row, meta, _db_id:row.id};
    });
    render();
    AzzaNotif.markRead(); /* تعليم الكل مقروء عند فتح الصفحة */
  }catch(e){console.error('fetchNotifs:',e.message);}
}

function render(){
  const unread=_notifs.filter(n=>!n.read).length;
  const badge=document.getElementById('unread-badge');
  if(badge){badge.style.display=unread?'inline':'none';badge.textContent=unread;}

  const el=document.getElementById('notif-list');
  if(!_notifs.length){
    el.innerHTML=`<div class="empty-state"><div class="empty-icon">🔔</div><b>لا إشعارات بعد</b><span>ستظهر هنا عندما يتفاعل الآخرون مع منشوراتك</span></div>`;
    return;
  }

  el.innerHTML=_notifs.map(n=>{
    const t=AzzaNotif.getType(n.type);
    const av=n.meta.from_photo?`<img src="${esc(n.meta.from_photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:ini(n.meta.from_name||'م');
    const preview=n.meta.post_text?`
      <div class="post-preview">
        <div class="post-preview-stripe" style="background:${t.color}"></div>
        <span class="post-preview-text">${esc(n.meta.post_text)}</span>
        <span class="post-preview-arrow">←</span>
      </div>`:'';
    return `<div class="notif-item${n.read?'':' unread'}" data-id="${n.id}" onclick="goNotif(${JSON.stringify(n).replace(/"/g,'&quot;')})">
      ${!n.read?'<div class="unread-dot"></div>':'<div style="width:8px;flex-shrink:0"></div>'}
      <div class="notif-av-wrap">
        <div class="notif-av">${av}</div>
        <div class="type-badge">${t.emoji}</div>
      </div>
      <div class="notif-content">
        <div class="notif-text"><strong>${esc(n.meta.from_name||'مستخدم')}</strong> <span class="action">${t.text}</span></div>
        ${preview}
        <div class="notif-time">${timeAgo(n.created_at)}</div>
      </div>
      <button class="del-btn" onclick="event.stopPropagation();deleteNotif(${n._db_id})">
        <svg style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`;
  }).join('');
}

/* ── إجراءات ── */
async function goNotif(n){
  await azzaDB.from('notifications').update({read:true}).eq('id',n._db_id);
  if(n.type==='message'){
    const convs=JSON.parse(localStorage.getItem('azza_conversations')||'[]');
    const conv=convs.find(c=>c.participants.some(p=>p.id===n.meta.from_id)&&c.participants.some(p=>p.id===user.id));
    location.href=conv?`messages.html?conv=${conv.id}`:'messages.html';
  }else if(n.type==='follow'){
    location.href='user.html?id='+n.meta.from_id;
  }else if(n.meta.post_id||n.related_id){
    location.href='post.html?id='+(n.meta.post_id||n.related_id);
  }else{
    location.href='app.html';
  }
}

async function markAllRead(){
  await azzaDB.from('notifications').update({read:true}).eq('user_id',user.id).eq('read',false);
  _notifs=_notifs.map(n=>({...n,read:true}));
  render();showToast('تم تحديد الكل كمقروء ✅');
}

async function deleteNotif(dbId){
  document.querySelector(`[data-id="${dbId}"]`)?.classList.add('removing');
  await azzaDB.from('notifications').delete().eq('id',dbId);
  _notifs=_notifs.filter(n=>n._db_id!==dbId);
  setTimeout(render,220);
}

/* ── التشغيل ── */
fetchAndRender();
AzzaNotif.subscribe(); /* Realtime من AzzaNotif مباشرة */
initSoundUI();
</script>
</body>
</html>