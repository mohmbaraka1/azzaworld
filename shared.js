/* ════════════════════════════════════════════════════════════════
   AZZA — shared.js
   مصدر واحد لكل الدوال المشتركة بين الصفحات
   القاعدة: أي دالة مكررة بأكثر من صفحة تنتمي هنا
   ════════════════════════════════════════════════════════════════ */

/* ── Supabase ── */
const SB_URL  = 'https://iecniydswotsilaueogq.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY25peWRzd290c2lsYXVlb2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTg1OTcsImV4cCI6MjA5Nzc3NDU5N30.69LfEBHUwToTHue3EPS_KYq9BvDSZJ9jcW_P1yRKReA';
const azzaDB  = supabase.createClient(SB_URL, SB_ANON);

/* ── المستخدم الحالي ── */
const AZZA = window.AZZA || {};
AZZA.getUser  = () => { try{ return JSON.parse(localStorage.getItem('azza_user')); }catch{ return null; } };
AZZA.saveUser = u => localStorage.setItem('azza_user', JSON.stringify(u));

/* ── التحقق من جلسة Auth — يُستدعى بكل صفحة ── */
AZZA.checkAuth = async (redirectTo='login.html') => {
  const user = AZZA.getUser();
  if(!user){ location.href = redirectTo; return null; }
  const {data} = await azzaDB.auth.getSession();
  if(!data?.session){
    localStorage.removeItem('azza_user');
    localStorage.removeItem('azza_token');
    location.href = redirectTo;
    return null;
  }
  return user;
};

/* ── الوضع الليلي ── */
const THEME_KEY = 'azza_theme';
AZZA.applyTheme = () => {
  const dark = localStorage.getItem(THEME_KEY) === 'dark';
  document.body.classList.toggle('dark', dark);
  const icon = document.getElementById('theme-icon');
  if(!icon) return;
  icon.innerHTML = dark
    ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
    : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
};
AZZA.toggleTheme = () => {
  const dark = !document.body.classList.contains('dark');
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  AZZA.applyTheme();
};

/* ── Toast ── */
AZZA.toast = (msg, type='ok') => {
  let el = document.getElementById('toast');
  if(!el){
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 22px;border-radius:11px;font-size:14px;font-weight:700;color:#fff;z-index:9999;opacity:0;transition:.3s;pointer-events:none;max-width:90vw;text-align:center;font-family:inherit';
    document.body.appendChild(el);
  }
  const colors = {ok:'#1c5b38', err:'#c0392b', info:'#854F0B'};
  el.textContent = msg;
  el.style.background = colors[type] || colors.ok;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.style.opacity = '0', 2800);
};

/* ── الوقت النسبي ── */
AZZA.timeAgo = iso => {
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if(m < 1)  return 'الآن';
  if(m < 60) return m + ' دقيقة';
  const h = Math.floor(m / 60);
  if(h < 24) return h + ' ساعة';
  const d = Math.floor(h / 24);
  if(d < 7)  return d + ' يوم';
  return new Date(iso).toLocaleDateString('ar');
};

/* ── مساعدات HTML ── */
AZZA.esc  = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
AZZA.ini  = n => (n||'م').trim()[0].toUpperCase();
AZZA.genId= () => Date.now().toString(36) + Math.random().toString(36).slice(2);

/* ── شارات التوثيق ── */
const BADGE_COLORS = {
  idea:'#1c5b38', skill:'#0F6E56', investor:'#854F0B',
  company:'#D85A30', institution:'#185FA5'
};
AZZA.shieldBadgeSVG = (type, size=15) => {
  const c = BADGE_COLORS[type] || BADGE_COLORS.idea;
  return `<svg viewBox="0 0 22 22" width="${size}" height="${size}">
    <path d="M11 1.5L17.5 4.8V10.5C17.5 14.8 14.7 18.6 11 20C7.3 18.6 4.5 14.8 4.5 10.5V4.8L11 1.5Z" fill="${c}"/>
    <path d="M7.3 11l2.4 2.4 5-5.4" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
};
AZZA.checkmark = (user, size=15) => {
  if(!user?.id_verified) return '';
  const type = user.subtype === 'institution' ? 'institution' : (user.type || 'idea');
  return `<span style="display:inline-flex;align-items:center;width:${size}px;height:${size}px;vertical-align:middle;flex-shrink:0" title="حساب موثّق">${AZZA.shieldBadgeSVG(type, size)}</span>`;
};

/* ── Trust Score — معادلة واحدة فقط ── */
AZZA.calcTrustScore = u => {
  if(!u) return 0;
  let s = 0;
  /* الملف الشخصي (30 نقطة) */
  if(u.photo)    s += 10;
  if(u.bio)      s += 10;
  if(u.contact)  s += 10;
  /* النشاط (40 نقطة) */
  const posts = parseInt(u.posts_count  || 0);
  const views = parseInt(u.views_count  || 0);
  const votes = parseInt(u.votes_count  || 0);
  s += Math.min(posts * 4, 20);
  s += Math.min(votes * 2, 10);
  s += Math.min(Math.floor(views / 10), 10);
  /* المجتمع (30 نقطة) */
  const followers = parseInt(u.followers_count || 0);
  const reviews   = parseInt(u.reviews_count   || 0);
  s += Math.min(followers * 3, 20);
  s += Math.min(reviews   * 5, 10);
  return Math.min(s, 100);
};

/* ── تسجيل الخروج ── */
AZZA.logout = async () => {
  try{ await azzaDB.auth.signOut(); }catch{}
  localStorage.removeItem('azza_user');
  localStorage.removeItem('azza_token');
  location.href = 'login.html';
};

/* ── فتح صفحة مستخدم ── */
AZZA.openUser = (id, myId) => {
  if(!id) return;
  location.href = id === myId ? 'profile.html' : `user.html?id=${id}`;
};

/* ── Lightbox للصور ── */
AZZA.openLightbox = src => {
  let lb = document.getElementById('az-lightbox');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'az-lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out';
    lb.innerHTML = '<img id="az-lb-img" style="max-width:94vw;max-height:92vh;border-radius:8px;object-fit:contain">';
    lb.onclick = () => lb.style.display = 'none';
    document.body.appendChild(lb);
  }
  document.getElementById('az-lb-img').src = src;
  lb.style.display = 'flex';
};

/* ── تطبيق الثيم فوراً عند التحميل ── */
AZZA.applyTheme();

/* ── تعريض للـ window للتوافق مع الكود القديم ── */
window.azzaDB      = azzaDB;
window.applyTheme  = AZZA.applyTheme;
window.toggleTheme = AZZA.toggleTheme;
window.showToast   = AZZA.toast;
window.toast       = AZZA.toast;
window.timeAgo     = AZZA.timeAgo;
window.shieldBadgeSVG = AZZA.shieldBadgeSVG;
window.openLightbox   = AZZA.openLightbox;
window.closeLightbox  = () => { const lb = document.getElementById('az-lightbox'); if(lb) lb.style.display='none'; };

window.AZZA = AZZA;