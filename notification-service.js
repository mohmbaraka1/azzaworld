/* =====================================================
   AZZA Notification Service — Unified Platform
   يعمل على: Web + PWA + (FCM/APNs مستقبلاً)
   ===================================================== */

const AZZA_NOTIF = (() => {
  const SB_URL  = 'https://iecniydswotsilaueogq.supabase.co';
  const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY25peWRzd290c2lsYXVlb2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTg1OTcsImV4cCI6MjA5Nzc3NDU5N30.69LfEBHUwToTHue3EPS_KYq9BvDSZJ9jcW_P1yRKReA';
  let db, me, channel, _badge, _onNew;

  /* أنواع الإشعارات */
  const TYPES = {
    like:           {icon:'❤️', color:'#ef4444', url: e=>`post.html?id=${e.entity_id}`},
    comment:        {icon:'💬', color:'#2563eb', url: e=>`post.html?id=${e.entity_id}`},
    reply:          {icon:'↩️', color:'#7c3aed', url: e=>`post.html?id=${e.entity_id}`},
    mention:        {icon:'📢', color:'#f59e0b', url: e=>`post.html?id=${e.entity_id}`},
    follow:         {icon:'👤', color:'#1c5b38', url: e=>`user.html?id=${e.actor_id}`},
    follow_request: {icon:'🤝', color:'#059669', url: e=>`user.html?id=${e.actor_id}`},
    follow_accept:  {icon:'✅', color:'#16a34a', url: e=>`user.html?id=${e.actor_id}`},
    message:        {icon:'💌', color:'#1c5b38', url: e=>`messages.html?to=${e.actor_id}`},
    msg_request:    {icon:'📩', color:'#0891b2', url: e=>`messages.html`},
    msg_accept:     {icon:'✉️', color:'#059669', url: e=>`messages.html?to=${e.actor_id}`},
    job:            {icon:'💼', color:'#16a34a', url: e=>`post.html?id=${e.entity_id}`},
    investment:     {icon:'💰', color:'#c69749', url: e=>`user.html?id=${e.actor_id}`},
    grant:          {icon:'🏅', color:'#b45309', url: e=>`post.html?id=${e.entity_id}`},
    certificate:    {icon:'🏆', color:'#c69749', url: e=>`certificates.html`},
    course_complete:{icon:'🎓', color:'#1c5b38', url: e=>`certificates.html`},
    verified:       {icon:'✅', color:'#16a34a', url: e=>`profile.html`},
    security:       {icon:'🔐', color:'#ef4444', url: e=>`settings.html`},
    ai_rec:         {icon:'🤖', color:'#7c3aed', url: e=>`ai-assistant.html`},
    job_alert:      {icon:'🔔', color:'#16a34a', url: e=>`post.html?id=${e.entity_id}`},
    system:         {icon:'⚙️', color:'#6b7280', url: e=>`app.html`},
  };

  /* ── Init ── */
  async function init(supabaseClient, currentUser) {
    db = supabaseClient;
    me = currentUser;
    if (!me?.id) return;
    await subscribeRealtime();
    await registerDevice();
    updateBadge();
  }

  /* ── Realtime ── */
  async function subscribeRealtime() {
    if (channel) channel.unsubscribe();
    channel = db.channel(`notif:${me.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${me.id}`
      }, payload => {
        const n = payload.new;
        showToast(n);
        updateBadge();
        if (_onNew) _onNew(n);
      })
      .subscribe();
  }

  /* ── Toast ── */
  function showToast(n) {
    const t = TYPES[n.type] || TYPES.system;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-80px);
      z-index:99999;background:var(--card,#fff);border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,.18);border:1px solid rgba(0,0,0,.06);
      padding:12px 16px;display:flex;align-items:center;gap:12px;
      min-width:280px;max-width:360px;cursor:pointer;
      transition:transform .35s cubic-bezier(.34,1.06,.64,1);
      font-family:Tajawal,sans-serif;direction:rtl;`;
    el.innerHTML = `
      <div style="width:38px;height:38px;border-radius:12px;background:${t.color}18;
        display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${t.icon}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:var(--ink,#18160f);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${esc(n.title||getTitle(n))}
        </div>
        <div style="font-size:11px;color:var(--muted,#9a9080);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${esc(n.body||'')}
        </div>
      </div>
      <div style="width:8px;height:8px;border-radius:50%;background:${t.color};flex-shrink:0"></div>`;
    el.onclick = () => { markRead(n.id); navigate(n); el.remove(); };
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = 'translateX(-50%) translateY(0)';
    }));
    setTimeout(() => { el.style.transform = 'translateX(-50%) translateY(-80px)'; setTimeout(()=>el.remove(),400); }, 4000);
  }

  /* ── Badge ── */
  async function updateBadge() {
    const { count } = await db.from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', me.id).eq('is_read', false);
    const n = count || 0;
    if (_badge) _badge(n);
    /* Update tab title */
    document.title = n > 0 ? `(${n}) ${document.title.replace(/^\(\d+\) /,'')}` : document.title.replace(/^\(\d+\) /,'');
    /* PWA Badge API */
    if ('setAppBadge' in navigator) navigator.setAppBadge(n).catch(()=>{});
    return n;
  }

  /* ── Mark Read ── */
  async function markRead(id) {
    if (id) {
      await db.from('notifications').update({ is_read:true }).eq('id', id);
    } else {
      await db.from('notifications').update({ is_read:true }).eq('recipient_id', me.id).eq('is_read', false);
    }
    updateBadge();
  }

  /* ── Navigate ── */
  function navigate(n) {
    const t = TYPES[n.type];
    const url = n.url || (t?.url ? t.url(n) : 'app.html');
    if (url) location.href = url;
  }

  /* ── Register Device (للـPush مستقبلاً) ── */
  async function registerDevice() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const platform = /android/i.test(navigator.userAgent) ? 'android' :
                       /iphone|ipad/i.test(navigator.userAgent) ? 'ios' : 'web';
      /* عند تفعيل FCM: احفظ الـtoken هنا */
      await db.from('user_devices').upsert({
        user_id: me.id,
        token: `web_${me.id}_${Date.now()}`,
        platform,
        device_name: navigator.userAgent.slice(0,80),
        is_active: true,
        last_seen: new Date().toISOString()
      }, { onConflict: 'user_id,token' });
    } catch(e) {}
  }

  /* ── Helpers ── */
  const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  function getTitle(n) {
    const labels = {
      like:'أعجب بمنشورك',comment:'علّق على منشورك',reply:'رد على تعليقك',
      mention:'ذكرك في منشور',follow:'بدأ بمتابعتك',message:'أرسل لك رسالة',
      investment:'أبدى اهتماماً بمشروعك',certificate:'حصلت على شهادة جديدة',
      verified:'تم توثيق حسابك',security:'تنبيه أمني',job_alert:'وظيفة مناسبة لك',
    };
    return labels[n.type] || 'إشعار جديد';
  }

  /* ── Public API ── */
  return {
    init,
    markRead,
    navigate,
    updateBadge,
    onBadgeUpdate: fn => { _badge = fn; },
    onNewNotif: fn => { _onNew = fn; },
    TYPES,
    /* إرسال إشعار (للاستخدام من أي صفحة) */
    async send(recipientId, type, entityId, entityType, url) {
      return db.rpc('send_notification', {
        p_recipient: recipientId,
        p_actor: me.id,
        p_type: type,
        p_entity_id: entityId,
        p_entity_type: entityType,
        p_url: url
      });
    }
  };
})();