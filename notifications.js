/* ════════════════════════════════════════════════════════════════
   AZZA — notifications.js  (النظام المركزي للإشعارات)
   ملف واحد يُضمَّن بكل الصفحات — Supabase هو المصدر الوحيد
   الأحداث: تعليق، رد، لايك تعليق، تصويت، اهتمام، متابعة، رسالة، توثيق
   ════════════════════════════════════════════════════════════════ */

window.AzzaNotif = (function(){

  let _db  = null;
  let _me  = null;
  let _ch  = null;   /* Realtime channel */
  let _cb  = null;   /* callback عند وصول إشعار جديد */

  /* ── تهيئة — يُستدعى مرة واحدة عند تحميل أي صفحة ── */
  function init(db, me, onNewNotif, postAuthorId=null){
    _db = db;
    _me = me;
    _cb = onNewNotif;
    /* مسح مفاتيح التكرار القديمة عند كل تهيئة */
    try{
      Object.keys(localStorage)
        .filter(k=>k.startsWith('az_notif_'))
        .forEach(k=>localStorage.removeItem(k));
    }catch{}
  }

  /* ════════════════════════════════════════════════════════════
     send() — الدالة الوحيدة لإرسال أي إشعار
     toUserId  : مستقبل الإشعار
     type      : نوع الإشعار (قائمة أدناه)
     meta      : بيانات إضافية (post_id, post_text, إلخ)
  ════════════════════════════════════════════════════════════ */
  async function send(toUserId, type, meta={}){
    /* لا إشعار لنفسك */
    if(!toUserId || toUserId === _me?.id) return;

    /* منع التكرار: نفس الإشعار < 30 ثانية فقط */
    const dupKey = `az_notif_${type}_${toUserId}_${meta.post_id||meta.related_id||''}`;
    const lastSent = parseInt(localStorage.getItem(dupKey)||'0');
    if(Date.now() - lastSent < 30 * 1000) return;
    localStorage.setItem(dupKey, Date.now().toString());

    try{
      await _db.from('notifications').insert({
        user_id:    toUserId,
        type,
        content: JSON.stringify({
          from_id:       _me.id,
          from_name:     _me.name,
          from_username: _me.username||'',
          from_photo:    _me.photo||null,
          ...meta,
        }),
        related_id: meta.post_id || meta.related_id || null,
        read: false,
      });
    }catch(e){
      console.warn('AzzaNotif.send failed:', e.message);
    }
  }

  /* ════════════════════════════════════════════════════════════
     دوال مختصرة لكل نوع حدث
  ════════════════════════════════════════════════════════════ */

  /* شخص علّق على منشورك */
  function onComment(post){
    send(post.author_id, 'comment', {
      post_id:   post.id,
      post_text: post.title || post.text?.substring(0,60),
    });
  }

  /* شخص ردّ على تعليقك */
  function onReply(commentAuthorId, post){
    send(commentAuthorId, 'reply', {
      post_id:   post?.id,
      post_text: post?.title || post?.text?.substring(0,60),
    });
  }

  /* شخص أعطى لايك على تعليقك */
  function onCommentLike(commentAuthorId, postId){
    send(commentAuthorId, 'comment_like', { post_id: postId });
  }

  /* شخص صوّت على منشورك */
  function onVote(post){
    send(post.author_id, 'vote', {
      post_id:   post.id,
      post_text: post.title || post.text?.substring(0,60),
    });
  }

  /* شخص أبدى اهتماماً بمنشورك */
  function onInterest(post){
    send(post.author_id, 'interest', {
      post_id:   post.id,
      post_text: post.title || post.text?.substring(0,60),
    });
  }

  /* شخص تابعك */
  function onFollow(toUserId){
    send(toUserId, 'follow', {});
  }

  /* شخص أرسل لك رسالة */
  function onMessage(toUserId, previewText){
    send(toUserId, 'message', {
      post_text: previewText?.substring(0,60),
    });
  }

  /* تم توثيق حسابك */
  function onVerification(toUserId){
    send(toUserId, 'verification', {});
  }

  /* ════════════════════════════════════════════════════════════
     subscribe() — Realtime: استقبال إشعاراتك الجديدة فوراً
  ════════════════════════════════════════════════════════════ */
  function subscribe(){
    if(!_me?.id || !_db) return;
    if(_ch) _db.removeChannel(_ch);

    _ch = _db.channel('notifs_'+_me.id)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${_me.id}`,
      }, payload => {
        updateBadge(); /* حدّث الشارة فوراً */
        if(_cb) _cb(payload.new); /* أشعر الصفحة بالإشعار الجديد */
      })
      .subscribe();
  }

  function unsubscribe(){
    if(_ch){ _db.removeChannel(_ch); _ch=null; }
  }

  /* ════════════════════════════════════════════════════════════
     getUnread() — عدد الإشعارات غير المقروءة
  ════════════════════════════════════════════════════════════ */
  async function getUnreadCount(){
    if(!_me?.id) return 0;
    try{
      const {count} = await _db.from('notifications')
        .select('*', {count:'exact', head:true})
        .eq('user_id', _me.id)
        .eq('read', false);
      return count || 0;
    }catch{ return 0; }
  }

  /* ════════════════════════════════════════════════════════════
     updateBadge() — تحديث شارة العدد بكل أيقونات الإشعارات
  ════════════════════════════════════════════════════════════ */
  async function updateBadge(){
    const count = await getUnreadCount();
    /* تحديث كل العناصر اللي تحمل data-notif-badge بالصفحة */
    document.querySelectorAll('[data-notif-badge]').forEach(el=>{
      el.textContent  = count > 0 ? (count > 99 ? '99+' : count) : '';
      el.style.display= count > 0 ? 'inline-flex' : 'none';
    });
    /* تحديث title الصفحة */
    if(count > 0){
      document.title = document.title.replace(/^\(\d+\)\s*/,'');
      document.title = `(${count}) ${document.title}`;
    }else{
      document.title = document.title.replace(/^\(\d+\)\s*/,'');
    }
  }

  /* ════════════════════════════════════════════════════════════
     markRead(id?) — تعليم إشعار (أو الكل) كمقروء
  ════════════════════════════════════════════════════════════ */
  async function markRead(notifId=null){
    if(!_me?.id) return;
    try{
      const q = _db.from('notifications').update({read:true}).eq('user_id',_me.id);
      if(notifId) q.eq('id', notifId); else q.eq('read', false);
      await q;
      updateBadge();
    }catch(e){ console.warn('markRead:', e.message); }
  }

  /* ════════════════════════════════════════════════════════════
     أنواع الإشعارات — للعرض في notifications.html
  ════════════════════════════════════════════════════════════ */
  const TYPES = {
    comment:      { emoji:'💬', text:'علّق على منشورك',        color:'#1c5b38' },
    reply:        { emoji:'↩️', text:'ردّ على تعليقك',          color:'#0F6E56' },
    comment_like: { emoji:'❤️', text:'أعجب بتعليقك',            color:'#ce1126' },
    vote:         { emoji:'▲',  text:'صوّت على منشورك',         color:'#854F0B' },
    interest:     { emoji:'⭐', text:'أبدى اهتمامه بمنشورك',    color:'#854F0B' },
    follow:       { emoji:'👤', text:'بدأ متابعتك',              color:'#185FA5' },
    message:      { emoji:'✉️', text:'أرسل لك رسالة',           color:'#0F6E56' },
    verification: { emoji:'✅', text:'تمّ توثيق حسابك',          color:'#1c5b38' },
    like:         { emoji:'❤️', text:'أعجب بمنشورك',            color:'#ce1126' },
  };

  function getType(type){ return TYPES[type] || {emoji:'🔔', text:'إشعار جديد', color:'#6b6555'}; }

  /* API العام */
  return {
    init, send, subscribe, unsubscribe,
    onComment, onReply, onCommentLike,
    onVote, onInterest, onFollow,
    onMessage, onVerification,
    getUnreadCount, updateBadge, markRead,
    TYPES, getType,
  };
})();