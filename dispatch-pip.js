/* Desktop companion is a read-only view. All progress remains in the opener. */
(()=>{
  'use strict';
  const dock=document.getElementById('dispatch-travel-dock');
  const button=document.getElementById('dispatch-pip-button');
  const status=document.getElementById('dispatch-pip-status');
  if(!dock||!button||!status)return;
  if(!window.documentPictureInPicture?.requestWindow){
    button.hidden=true;
    status.textContent='此浏览器不支持桌面悬浮，可继续使用页内小窗';
    return;
  }
  let pip=null,opening=false;
  button.addEventListener('click',async()=>{
    if(opening)return;
    if(pip&&!pip.closed){pip.close();return;}
    opening=true;button.disabled=true;
    let win=null,observer=null,timer=null;
    const cleanup=()=>{
      observer?.disconnect();
      if(timer!==null)win?.clearInterval(timer);
      if(pip===win)pip=null;
      button.textContent='桌面悬浮';status.textContent='';
    };
    try{
      win=await window.documentPictureInPicture.requestWindow({width:360,height:220});
      pip=win;
      win.addEventListener('pagehide',cleanup,{once:true});
      const doc=win.document;
      doc.title='Qinster · 派遣旅伴';
      const base=doc.createElement('base');base.href=document.baseURI;doc.head.append(base);
      document.querySelectorAll('style,link[rel="stylesheet"]').forEach(node=>doc.head.append(node.cloneNode(true)));
      const css=doc.createElement('style');
      css.textContent='html,body{margin:0;min-height:100%;background:#414d46;overflow:hidden}#dispatch-travel-dock{position:relative;inset:auto;width:100%;margin:0;border:0;box-shadow:none}#dispatch-travel-dock .dispatch-mission-scene{height:calc(100vh - 34px);min-height:130px}#dispatch-travel-dock summary{pointer-events:none}.dock-collapse,.dispatch-dock-tools{display:none!important}';
      doc.head.append(css);
      const copy=dock.cloneNode(true);copy.hidden=false;copy.open=true;doc.body.append(copy);
      const view=copy.querySelector('#dispatch-dock-view');
      const clock=copy.querySelector('#dispatch-dock-clock');
      let key=null;
      function sync(){
        if(win.closed)return;
        doc.documentElement.style.cssText=document.documentElement.style.cssText;
        doc.body.classList.toggle('still',document.body.classList.contains('still'));
        const source=document.getElementById('dispatch-dock-view');
        const state=window.QinsterRuntime?.getState();
        const dispatch=state?.dispatch;
        if(!dispatch||dock.hidden){
          if(key!=='empty'){view.innerHTML='<p style="padding:24px;color:#344839">暂无派遣队伍 · 返回牧场开始派遣</p>';key='empty';}
          clock.textContent='休息中';return;
        }
        if(source&&key!==source._key){view.innerHTML=source.innerHTML;key=source._key;}
        const seconds=Math.max(0,Math.ceil((dispatch.end-Date.now())/1000));
        clock.textContent=seconds===0?'已抵达 · 返回牧场领取':Math.floor(seconds/60)+'分 '+(seconds%60)+'秒';
        view.querySelector('.dispatch-mission-scene')?.classList.toggle('mission-arrived',seconds===0);
      }
      sync();
      observer=new MutationObserver(sync);
      observer.observe(dock,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
      timer=win.setInterval(sync,1000);
      button.textContent='关闭悬浮';status.textContent='已浮在桌面 · 请保留游戏标签页';
    }catch(error){
      if(win&&!win.closed)win.close();
      cleanup();
      status.textContent='未能打开悬浮窗，请在支持画中画的桌面浏览器重试';
    }finally{opening=false;button.disabled=false;}
  });
})();
