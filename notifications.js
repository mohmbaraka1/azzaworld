/* ════════════════════════════════════════════════════════════════
   AZZA — notifications.js v2 (Production Ready)
   يعمل مع نظام الإشعارات الجديد بـSupabase Triggers
   الـTriggers تُنشئ الإشعارات تلقائياً عند:
   - التعليق (post_comments trigger)
   - التفاعل (post_reactions trigger)
   - المتابعة (follows trigger)
   - الرسائل (messages trigger)
   لا حاجة لإرسال يدوي من Frontend إلا للحالات الخاصة
   ════════════════════════════════════════════════════════════════ */

window.AzzaNotif = (function(){

  let _db      = null;
  let _me      = null;
  let _channel = null;
  let _onNew   = null;   /* callback عند إشعار جديد */
  let _badge   = 0;      /* عدد غير المقروءة */

  /* ── أنواع الإشعارات وأيقوناتها ── */
  const TYPES = {
    comment:      { emoji:'💬', label:'علّق على منشورك',        color:'#1c5b38' },
    reply:        { emoji:'↩️', label:'ردّ على تعليقك',          color:'#0F6E56' },
    vote:         { emoji:'▲',  label:'صوّت على منشورك',         color:'#854F0B' },
    insightful:   { emoji:'💡', label:'وجد منشورك ثاقباً',       color:'#854F0B' },
    collab:       { emoji:'🤝', label:'يريد التعاون معك',        color:'#185FA5' },
    follow:       { emoji:'👤', label:'بدأ متابعتك',              color:'#185FA5' },
    message:      { emoji:'✉️', label:'أرسل لك رسالة',           color:'#0F6E56' },
    verification: { emoji:'✅', label:'تمّ توثيق حسابك',          color:'#1c5b38' },
    interest:     { emoji:'⭐', label:'أبدى اهتمامه بمنشورك',    color:'#854F0B' },
  };

  /* ══════════════════════════════════════════
     init() — تهيئة النظام فوراً عند تحميل الصفحة
  ══════════════════════════════════════════ */
  function init(db, me, onNewCallback){
    _db    = db;
    _me    = me;
    _onNew = onNewCallback;
    /* مسح cache التكرار القديم */
    try{
      Object.keys(localStorage)
        .filter(k => k.startsWith('az_notif_'))
        .forEach(k => localStorage.removeItem(k));
    }catch{}
  }

  /* ══════════════════════════════════════════
     subscribe() — Realtime (لا polling إطلاقاً)
  ══════════════════════════════════════════ */
  function subscribe(){
    if(!_me?.id || !_db) return;
    if(_channel){ try{ _db.removeChannel(_channel); }catch{} }

    _channel = _db.channel('notifs_realtime_' + _me.id)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `recipient_id=eq.${_me.id}`,
      }, payload => {
        _badge++;
        updateBadge();
        if(_onNew) _onNew(payload.new);
      })
      .subscribe();
  }

  function unsubscribe(){
    if(_channel){ try{ _db.removeChannel(_channel); }catch{} _channel = null; }
  }

  /* ══════════════════════════════════════════
     getNotifications() — جلب مع Pagination
  ══════════════════════════════════════════ */
  async function getNotifications(limit=20, offset=0){
    if(!_me?.id) return [];
    try{
      const {data, error} = await _db
        .from('notifications')
        .select('*, actor:actor_id(id,name,photo,username)')
        .eq('recipient_id', _me.id)
        .order('created_at', {ascending:false})
        .range(offset, offset + limit - 1);
      if(error) throw error;
      return data || [];
    }catch(e){
      console.error('getNotifications:', e.message);
      return [];
    }
  }

  /* ══════════════════════════════════════════
     getUnreadCount() — بدون تحميل كل الإشعارات
  ══════════════════════════════════════════ */
  async function getUnreadCount(){
    if(!_me?.id) return 0;
    try{
      const {count, error} = await _db
        .from('notifications')
        .select('*', {count:'exact', head:true})
        .eq('recipient_id', _me.id)
        .eq('is_read', false);
      if(error) throw error;
      _badge = count || 0;
      return _badge;
    }catch(e){
      console.error('getUnreadCount:', e.message);
      return 0;
    }
  }

  /* ══════════════════════════════════════════
     updateBadge() — تحديث كل عناصر الشارة بالصفحة
  ══════════════════════════════════════════ */
  async function updateBadge(){
    const count = _badge > 0 ? _badge : await getUnreadCount();
    document.querySelectorAll('[data-notif-badge]').forEach(el => {
      el.textContent   = count > 99 ? '99+' : (count > 0 ? count : '');
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
    /* تحديث عنوان الصفحة */
    const title = document.title.replace(/^\(\d+\)\s*/, '');
    document.title = count > 0 ? `(${count}) ${title}` : title;
  }

  /* ══════════════════════════════════════════
     markRead / markAllRead / delete / clear
  ══════════════════════════════════════════ */
  async function markRead(notifId){
    if(!_me?.id) return;
    try{
      await _db.from('notifications')
        .update({is_read:true, read:true, updated_at:new Date().toISOString()})
        .eq('id', notifId)
        .eq('recipient_id', _me.id);
      if(_badge > 0) _badge--;
      updateBadge();
    }catch(e){ console.error('markRead:', e.message); }
  }

  async function markAllRead(){
    if(!_me?.id) return;
    try{
      await _db.from('notifications')
        .update({is_read:true, read:true, updated_at:new Date().toISOString()})
        .eq('recipient_id', _me.id)
        .eq('is_read', false);
      _badge = 0;
      updateBadge();
    }catch(e){ console.error('markAllRead:', e.message); }
  }

  async function deleteNotif(notifId){
    if(!_me?.id) return;
    try{
      await _db.from('notifications')
        .delete()
        .eq('id', notifId)
        .eq('recipient_id', _me.id);
    }catch(e){ console.error('deleteNotif:', e.message); }
  }

  async function clearAll(){
    if(!_me?.id) return;
    try{
      await _db.from('notifications')
        .delete()
        .eq('recipient_id', _me.id);
      _badge = 0;
      updateBadge();
    }catch(e){ console.error('clearAll:', e.message); }
  }

  /* ══════════════════════════════════════════
     send() — للإشعارات اليدوية فقط (مثل التوثيق)
     الإشعارات العادية تُنشأ تلقائياً بالـTriggers
  ══════════════════════════════════════════ */
  async function send(toUserId, type, meta={}){
    if(!toUserId || toUserId === _me?.id || !_db) return;

    /* منع التكرار: 30 ثانية */
    const dupKey = `az_notif_${type}_${toUserId}_${meta.post_id||meta.entity_id||''}`;
    const lastSent = parseInt(localStorage.getItem(dupKey)||'0');
    if(Date.now() - lastSent < 30000) return;
    localStorage.setItem(dupKey, Date.now().toString());

    try{
      const msg = meta.message || TYPES[type]?.label || 'إشعار جديد';
      await _db.from('notifications').insert({
        user_id:      toUserId,
        recipient_id: toUserId,
        actor_id:     _me.id,
        type,
        entity_id:    meta.post_id || meta.entity_id || null,
        entity_type:  meta.entity_type || 'post',
        message:      (_me.name||'') + ' ' + msg,
        metadata:     JSON.stringify({
          from_id:       _me.id,
          from_name:     _me.name,
          from_username: _me.username||'',
          from_photo:    _me.photo||null,
          ...meta,
        }),
        related_id:   meta.post_id || null,
        read:         false,
        is_read:      false,
      });
    }catch(e){
      if(!e.message?.includes('unique')) /* تجاهل duplicate */
        console.warn('AzzaNotif.send:', e.message);
    }
  }

  /* دوال مختصرة للتوافق مع الكود القديم */
  const onComment    = post  => send(post?.author_id, 'comment',  {post_id:post?.id, post_text:post?.title||post?.text?.substring(0,60)});
  const onReply      = (uid, post) => send(uid, 'reply', {post_id:post?.id});
  const onVote       = post  => send(post?.author_id, 'vote',     {post_id:post?.id, post_text:post?.title||post?.text?.substring(0,60)});
  const onInterest   = post  => send(post?.author_id, 'interest', {post_id:post?.id, post_text:post?.title||post?.text?.substring(0,60)});
  const onFollow     = uid   => send(uid, 'follow', {});
  const onMessage    = (uid, text) => send(uid, 'message', {post_text:text?.substring(0,60)});
  const onVerification = uid => send(uid, 'verification', {});
  const getType      = type  => TYPES[type] || {emoji:'🔔', label:'إشعار جديد', color:'#6b6555'};

  return {
    init, subscribe, unsubscribe,
    getNotifications, getUnreadCount,
    updateBadge,
    markRead, markAllRead,
    deleteNotif, clearAll,
    send,
    onComment, onReply, onVote, onInterest,
    onFollow, onMessage, onVerification,
    getType, TYPES,
  };
})();