/* ════════════════════════════════════════════════════════════════
   AZZA — comments.js  (النظام المركزي للتعليقات)
   المبدأ: ملف واحد يُضمَّن بكل الصفحات — Supabase هو المصدر الوحيد
   ════════════════════════════════════════════════════════════════ */

window.AzzaComments = (function(){

  /* ── أدوات مساعدة داخلية ── */
  const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const timeAgo = iso => {
    const m = Math.floor((Date.now()-new Date(iso))/60000);
    if(m<1)  return 'الآن';
    if(m<60) return m+'د';
    const h=Math.floor(m/60);
    if(h<24) return h+'س';
    return Math.floor(h/24)+' يوم';
  };

  /* ── المتغيرات المشتركة ── */
  let _db      = null;  /* Supabase client */
  let _me      = null;  /* المستخدم الحالي */
  let _channel = null;  /* Realtime subscription */
  let _onUpdate= null;  /* callback عند تغيير بيانات */

  /* ─────────────────────────────────────────────────────────────
     init() — يُستدعى مرة واحدة عند تحميل الصفحة
     db: Supabase client  |  me: كائن المستخدم الحالي
  ───────────────────────────────────────────────────────────── */
  function init(db, me, onUpdateCallback){
    _db       = db;
    _me       = me;
    _onUpdate = onUpdateCallback;
  }

  /* ─────────────────────────────────────────────────────────────
     fetch(postId) — جلب تعليقات منشور من Supabase
     يُرجع: مصفوفة تعليقات مرتبة
  ───────────────────────────────────────────────────────────── */
  async function fetch(postId){
    const {data,error} = await _db
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .neq('is_deleted', true)  /* يجلب is_deleted=false وis_deleted=null معاً */
      .order('created_at', {ascending:true});
    if(error) throw error;
    return data || [];
  }

  /* ─────────────────────────────────────────────────────────────
     add(postId, text, parentId?) — إضافة تعليق جديد
  ───────────────────────────────────────────────────────────── */
  async function add(postId, text, parentId=null){
    if(!text?.trim()) throw new Error('التعليق فاضي');
    const {data,error} = await _db.from('post_comments').insert({
      post_id:         postId,
      author_id:       _me.id,
      author_name:     _me.name,
      author_username: _me.username||'',
      content:         text.trim(),
      parent_id:       parentId,
      is_deleted:      false,
      is_edited:       false,
    }).select().single();
    if(error) throw error;
    return data;
  }

  /* ─────────────────────────────────────────────────────────────
     edit(commentId, newText) — تعديل تعليق
  ───────────────────────────────────────────────────────────── */
  async function edit(commentId, newText){
    if(!newText?.trim()) throw new Error('النص فاضي');
    const {error} = await _db.from('post_comments').update({
      content:    newText.trim(),
      is_edited:  true,
      updated_at: new Date().toISOString(),
    }).eq('id', commentId).eq('author_id', _me.id);
    if(error) throw error;
  }

  /* ─────────────────────────────────────────────────────────────
     remove(commentId) — حذف ناعم (soft delete)
  ───────────────────────────────────────────────────────────── */
  async function remove(commentId){
    const {error} = await _db.from('post_comments').update({
      is_deleted: true,
      content:    '[تم حذف هذا التعليق]',
    }).eq('id', commentId).eq('author_id', _me.id);
    if(error) throw error;
  }

  /* ─────────────────────────────────────────────────────────────
     subscribe(postId) — Realtime: استقبال التغييرات فوراً
  ───────────────────────────────────────────────────────────── */
  function subscribe(postId){
    if(_channel) _db.removeChannel(_channel);
    _channel = _db.channel('comments_'+postId)
      .on('postgres_changes', {
        event:  '*',
        schema: 'public',
        table:  'post_comments',
        filter: `post_id=eq.${postId}`,
      }, () => { if(_onUpdate) _onUpdate(postId); })
      .subscribe();
  }

  /* ─────────────────────────────────────────────────────────────
     unsubscribe() — إيقاف الاستماع (عند مغادرة المنشور)
  ───────────────────────────────────────────────────────────── */
  function unsubscribe(){
    if(_channel){ _db.removeChannel(_channel); _channel=null; }
  }

  /* ─────────────────────────────────────────────────────────────
     renderList(comments, containerId) — رسم قائمة التعليقات
  ───────────────────────────────────────────────────────────── */
  function renderList(comments, containerId){
    const el = document.getElementById(containerId);
    if(!el) return;

    if(!comments.length){
      el.innerHTML = `<div class="az-no-cmt">لا تعليقات بعد — كن أول من يعلّق 💬</div>`;
      return;
    }

    /* فصل التعليقات الرئيسية عن الردود */
    const roots   = comments.filter(c => !c.parent_id);
    const byParent = {};
    comments.filter(c => c.parent_id).forEach(r => {
      (byParent[r.parent_id] = byParent[r.parent_id]||[]).push(r);
    });

    el.innerHTML = roots.map(c => _buildComment(c, byParent[c.id]||[])).join('');
  }

  /* بناء HTML لتعليق واحد مع ردوده */
  function _buildComment(c, replies=[]){
    const mine  = c.author_id === _me?.id;
    const av    = (c.author_name||'م')[0].toUpperCase();
    const label = c.is_deleted ? '' : (c.is_edited ? '<span class="az-edited">تم التعديل</span>' : '');
    const text  = c.is_deleted
      ? '<span style="color:var(--muted);font-style:italic">[تم حذف هذا التعليق]</span>'
      : esc(c.content);

    const actions = c.is_deleted ? '' : `
      <button class="az-cmt-act" onclick="AzzaComments.startReply(${c.id},'${esc(c.author_name).replace(/'/g,"\\'")}')">↩ رد</button>
      ${mine ? `
        <button class="az-cmt-act" onclick="AzzaComments.startEdit(${c.id},'${esc(c.content).replace(/'/g,"\\'")}')">تعديل</button>
        <button class="az-cmt-act danger" onclick="AzzaComments.confirmDelete(${c.id})">حذف</button>
      ` : ''}`;

    /* زر "عرض الردود" — يظهر فقط لو فيه ردود */
    const repliesHTML = replies.length ? `
      <button class="az-replies-toggle" onclick="AzzaComments.toggleReplies(${c.id},this)">
        <span class="az-replies-line"></span>
        عرض ${replies.length} ${replies.length===1?'رد':'ردود'}
      </button>
      <div class="az-replies" id="az-replies-${c.id}" style="display:none">
        ${replies.map(r => _buildComment(r)).join('')}
      </div>` : '';

    return `
      <div class="az-cmt" id="az-cmt-${c.id}">
        <div class="az-cmt-av">${av}</div>
        <div class="az-cmt-body">
          <div class="az-cmt-bubble">
            <div class="az-cmt-name">
              ${esc(c.author_name)}
              ${c.author_username ? `<span class="az-cmt-handle">@${esc(c.author_username)}</span>` : ''}
            </div>
            <div class="az-cmt-text" id="az-text-${c.id}">${text}</div>
            ${label}
          </div>
          <div class="az-cmt-footer">
            <span class="az-cmt-time">${timeAgo(c.created_at)}</span>
            ${actions}
          </div>
          <div id="az-reply-box-${c.id}" style="display:none"></div>
          <div id="az-edit-box-${c.id}"  style="display:none"></div>
        </div>
      </div>
      ${repliesHTML}`;
  }

  /* ─────────────────────────────────────────────────────────────
     renderInput(postId, containerId) — رسم صندوق إدخال التعليق
  ───────────────────────────────────────────────────────────── */
  function renderInput(postId, containerId){
    const el = document.getElementById(containerId);
    if(!el) return;
    const av = (_me?.name||'م')[0].toUpperCase();
    el.innerHTML = `
      <div class="az-add-cmt">
        <div class="az-my-av">${av}</div>
        <div class="az-input-wrap" id="az-input-wrap-${postId}">
          <textarea
            class="az-cmt-ta"
            id="az-ta-${postId}"
            placeholder="أضف تعليقاً..."
            rows="1"
            oninput="AzzaComments._autoR(this);document.getElementById('az-send-${postId}').disabled=!this.value.trim()"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();AzzaComments.submit('${postId}')}"
          ></textarea>
          <button class="az-send-btn" id="az-send-${postId}" disabled
            onclick="AzzaComments.submit('${postId}')">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>`;
  }

  /* ─────────────────────────────────────────────────────────────
     submit(postId) — إرسال التعليق مع Optimistic UI
  ───────────────────────────────────────────────────────────── */
  async function submit(postId, parentId=null){
    const taId  = parentId ? `az-reply-ta-${parentId}` : `az-ta-${postId}`;
    const btnId = parentId ? `az-reply-send-${parentId}` : `az-send-${postId}`;
    const ta    = document.getElementById(taId);
    const btn   = document.getElementById(btnId);
    const text  = ta?.value?.trim();
    if(!text) return;

    /* Optimistic: أظهر التعليق فوراً */
    const tempId = 'temp_'+Date.now();
    const tempCmt = {
      id:              tempId,
      post_id:         postId,
      author_id:       _me.id,
      author_name:     _me.name,
      author_username: _me.username||'',
      content:         text,
      parent_id:       parentId,
      created_at:      new Date().toISOString(),
      is_edited:       false,
      is_deleted:      false,
    };

    _insertOptimistic(tempCmt);
    ta.value=''; ta.style.height='auto';
    if(btn) btn.disabled=true;

    try{
      await add(postId, text, parentId);
      /* Realtime سيحدّث تلقائياً — لكن نعمل refresh احتياطي */
      if(_onUpdate) _onUpdate(postId);
    }catch(e){
      /* تراجع عن Optimistic لو فشل */
      document.getElementById('az-cmt-'+tempId)?.remove();
      _showError('تعذّر نشر التعليق، تحقق من اتصالك');
      console.error('submit:', e.message);
    }

    if(parentId) closeReply(parentId);
    if(btn) btn.disabled=false;
  }

  /* إدراج تعليق مؤقت في الواجهة مع auto-scroll */
  function _insertOptimistic(c){
    const listEl = document.querySelector(`#az-list-${c.post_id}, .az-cmt-list`);
    if(!listEl) return;
    /* إزالة رسالة "لا تعليقات" لو موجودة */
    const empty = listEl.querySelector('.az-no-cmt');
    if(empty) empty.remove();
    const div = document.createElement('div');
    div.innerHTML = _buildComment(c).trim();
    const node = div.firstElementChild;
    if(node){
      node.style.animation = 'az-slide-in .25s ease';
      listEl.appendChild(node);
      /* auto-scroll للتعليق الجديد */
      setTimeout(()=>node.scrollIntoView({behavior:'smooth',block:'nearest'}), 50);
    }
  }

  /* إظهار/إخفاء الردود */
  function toggleReplies(parentId, btn){
    const repliesEl = document.getElementById('az-replies-'+parentId);
    if(!repliesEl) return;
    const isHidden = repliesEl.style.display === 'none';
    repliesEl.style.display = isHidden ? 'block' : 'none';
    const count = repliesEl.querySelectorAll('.az-cmt').length;
    btn.innerHTML = isHidden
      ? `<span class="az-replies-line"></span> إخفاء الردود`
      : `<span class="az-replies-line"></span> عرض ${count} ${count===1?'رد':'ردود'}`;
  }

  /* ─────────────────────────────────────────────────────────────
     startReply / closeReply — واجهة الرد على تعليق
  ───────────────────────────────────────────────────────────── */
  function startReply(parentId, authorName){
    closeAllBoxes();
    const box = document.getElementById('az-reply-box-'+parentId);
    if(!box) return;
    const av = (_me?.name||'م')[0].toUpperCase();
    box.style.display = 'block';
    box.innerHTML = `
      <div class="az-add-cmt az-reply-input">
        <div class="az-my-av sm">${av}</div>
        <div class="az-input-wrap">
          <textarea class="az-cmt-ta" id="az-reply-ta-${parentId}"
            placeholder="ردّ على ${esc(authorName)}..." rows="1"
            oninput="AzzaComments._autoR(this);document.getElementById('az-reply-send-${parentId}').disabled=!this.value.trim()"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();AzzaComments.submit('${document.querySelector('[data-post-id]')?.dataset?.postId||''}',${parentId})}"
          ></textarea>
          <button class="az-send-btn" id="az-reply-send-${parentId}" disabled
            onclick="AzzaComments.submit('${document.querySelector('[data-post-id]')?.dataset?.postId||''}',${parentId})">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
          <button class="az-cancel-btn" onclick="AzzaComments.closeReply(${parentId})">إلغاء</button>
        </div>
      </div>`;
    document.getElementById('az-reply-ta-'+parentId)?.focus();
  }

  function closeReply(parentId){
    const box = document.getElementById('az-reply-box-'+parentId);
    if(box){ box.style.display='none'; box.innerHTML=''; }
  }

  /* ─────────────────────────────────────────────────────────────
     startEdit / confirmEdit / cancelEdit — تعديل تعليق
  ───────────────────────────────────────────────────────────── */
  function startEdit(commentId, currentText){
    closeAllBoxes();
    const textEl = document.getElementById('az-text-'+commentId);
    const editBox= document.getElementById('az-edit-box-'+commentId);
    if(!textEl||!editBox) return;
    textEl.style.display='none';
    editBox.style.display='block';
    editBox.innerHTML = `
      <div class="az-edit-wrap">
        <textarea class="az-cmt-ta" id="az-edit-ta-${commentId}" rows="2">${esc(currentText)}</textarea>
        <div class="az-edit-actions">
          <button class="az-send-btn sm" onclick="AzzaComments.confirmEdit(${commentId})">حفظ</button>
          <button class="az-cancel-btn" onclick="AzzaComments.cancelEdit(${commentId},'${esc(currentText).replace(/'/g,"\\'")}')">إلغاء</button>
        </div>
      </div>`;
    document.getElementById('az-edit-ta-'+commentId)?.focus();
  }

  async function confirmEdit(commentId){
    const ta   = document.getElementById('az-edit-ta-'+commentId);
    const text = ta?.value?.trim();
    if(!text) return;
    try{
      await edit(commentId, text);
      /* تحديث فوري بدون انتظار Realtime */
      const textEl = document.getElementById('az-text-'+commentId);
      if(textEl) textEl.innerHTML = esc(text);
      cancelEdit(commentId, text);
      if(_onUpdate) _onUpdate(null);
    }catch(e){
      _showError('تعذّر التعديل');
      console.error('confirmEdit:', e.message);
    }
  }

  function cancelEdit(commentId, originalText){
    const textEl = document.getElementById('az-text-'+commentId);
    const editBox= document.getElementById('az-edit-box-'+commentId);
    if(textEl){ textEl.style.display='block'; if(originalText) textEl.innerHTML=esc(originalText); }
    if(editBox){ editBox.style.display='none'; editBox.innerHTML=''; }
  }

  /* ─────────────────────────────────────────────────────────────
     confirmDelete — حذف تعليق
  ───────────────────────────────────────────────────────────── */
  async function confirmDelete(commentId){
    if(!confirm('حذف هذا التعليق؟')) return;
    try{
      await remove(commentId);
      const el = document.getElementById('az-cmt-'+commentId);
      if(el) el.querySelector('.az-cmt-text').innerHTML =
        '<span style="color:var(--muted);font-style:italic">[تم حذف هذا التعليق]</span>';
      if(_onUpdate) _onUpdate(null);
    }catch(e){
      _showError('تعذّر الحذف');
      console.error('confirmDelete:', e.message);
    }
  }

  /* ── أدوات داخلية ── */
  function closeAllBoxes(){
    document.querySelectorAll('[id^="az-reply-box-"],[id^="az-edit-box-"]').forEach(b=>{
      b.style.display='none'; b.innerHTML='';
    });
    document.querySelectorAll('[id^="az-text-"]').forEach(t=>t.style.display='block');
  }
  function _autoR(el){ el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,120)+'px'; }
  function _showError(msg){
    const t=document.getElementById('toast');
    if(!t)return;
    t.textContent=msg; t.style.background='#c0392b'; t.style.opacity='1';
    clearTimeout(t._e); t._e=setTimeout(()=>t.style.opacity='0',3000);
  }

  /* ── CSS المشترك — يُضاف مرة واحدة ── */
  function injectCSS(){
    if(document.getElementById('az-comments-css')) return;
    const s=document.createElement('style');
    s.id='az-comments-css';
    s.textContent=`
.az-section{background:var(--card);border:1px solid var(--line);border-radius:var(--rxl);overflow:hidden;margin-top:12px}
.az-section-head{padding:14px 18px;border-bottom:1px solid var(--line);font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px}
.az-cmt-list{padding:4px 12px;max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.az-cmt{display:flex;gap:9px;padding:10px 4px;position:relative;align-items:flex-start}
.az-cmt-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-soft));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;color:var(--olive-deep)}
.az-my-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--olive),var(--olive-deep));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;color:var(--gold)}
.az-my-av.sm{width:26px;height:26px;font-size:10px}
.az-cmt-body{flex:1;min-width:0}
.az-cmt-bubble{background:var(--cream);border-radius:0 14px 14px 14px;padding:9px 13px;display:inline-block;max-width:100%}
.az-cmt-name{font-size:12.5px;font-weight:700;color:var(--olive);margin-bottom:2px}
.az-cmt-handle{font-size:11px;color:var(--muted);font-weight:400;margin-right:4px}
.az-cmt-text{font-size:13.5px;line-height:1.65;color:var(--ink);word-break:break-word;white-space:pre-wrap}
.az-edited{font-size:10.5px;color:var(--muted);font-style:italic;margin-top:2px;display:block}
.az-cmt-footer{display:flex;align-items:center;gap:8px;margin-top:4px;padding-right:2px}
.az-cmt-time{font-size:11px;color:var(--muted)}
.az-cmt-act{background:none;border:none;font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;padding:0;font-family:inherit;transition:.15s}
.az-cmt-act:hover{color:var(--olive)}
.az-cmt-act.danger:hover{color:var(--red,#c0392b)}
.az-replies{padding-right:28px;border-right:2px solid var(--line);margin:4px 8px 4px 0;display:flex;flex-direction:column;gap:2px}
.az-replies-toggle{background:none;border:none;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--olive);cursor:pointer;padding:4px 0 4px 8px;font-family:inherit;transition:.15s}
.az-replies-toggle:hover{color:var(--olive-deep)}
.az-replies-line{display:inline-block;width:24px;height:2px;background:var(--line);border-radius:2px;flex-shrink:0}
@keyframes az-slide-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.az-no-cmt{padding:32px;text-align:center;color:var(--muted);font-size:14px}
.az-add-cmt{display:flex;gap:9px;padding:12px 14px;border-top:1px solid var(--line);align-items:flex-start}
.az-reply-input{border-top:none;padding:6px 4px 4px 0;margin-top:4px}
.az-input-wrap{flex:1;border:1.5px solid var(--line);border-radius:16px;overflow:hidden;background:var(--cream);transition:.2s;display:flex;align-items:flex-end;gap:4px;padding:4px 4px 4px 10px}
.az-input-wrap:focus-within{border-color:var(--olive);background:var(--card)}
.az-cmt-ta{flex:1;border:none;background:transparent;padding:7px 0;font-family:inherit;font-size:13.5px;color:var(--ink);outline:none;resize:none;line-height:1.55;min-height:34px;max-height:120px}
.az-cmt-ta::placeholder{color:#b3aa92}
.az-send-btn{width:30px;height:30px;border-radius:50%;background:var(--olive);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;flex-shrink:0;margin-bottom:2px}
.az-send-btn:disabled{background:var(--line);cursor:not-allowed}
.az-send-btn.sm{width:26px;height:26px}
.az-send-btn:not(:disabled):hover{background:var(--olive-deep)}
.az-cancel-btn{background:none;border:none;font-size:12px;color:var(--muted);cursor:pointer;font-family:inherit;padding:4px 6px;border-radius:6px;transition:.15s;margin-bottom:2px}
.az-cancel-btn:hover{background:var(--cream);color:var(--ink)}
.az-edit-wrap{padding:4px 0}
.az-edit-actions{display:flex;gap:6px;margin-top:6px}
    `;
    document.head.appendChild(s);
  }

  /* ── API العام ── */
  return {
    init, fetch, add, edit, remove,
    subscribe, unsubscribe,
    renderList, renderInput,
    submit, startReply, closeReply,
    startEdit, confirmEdit, cancelEdit,
    confirmDelete, toggleReplies,
    injectCSS, _autoR,
  };
})();