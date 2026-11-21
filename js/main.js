/* ripple nos botões */
document.querySelectorAll('.btn').forEach(b=>{
  b.addEventListener('pointerdown',e=>{
    const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),d=document.createElement('i');
    d.className='ripple';d.style.width=d.style.height=s+'px';
    d.style.left=(e.clientX-r.left-s/2)+'px';d.style.top=(e.clientY-r.top-s/2)+'px';
    b.appendChild(d);setTimeout(()=>d.remove(),700);
  });
});

/* aparece ao rolar */
(()=>{
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
  els.forEach(e=>io.observe(e));
})();

/* carrossel de vídeos: o da vez fica centralizado e toca; os outros ficam nas laterais */
(()=>{
  const track=document.getElementById('track');if(!track)return;
  const items=[...track.querySelectorAll('li')],vids=items.map(li=>li.querySelector('video'));
  let cur=-1,raf=0;
  const setActive=i=>{
    if(i===cur)return;cur=i;
    items.forEach((li,k)=>{
      const on=k===i;li.classList.toggle('active',on);
      if(on){vids[k].play().catch(()=>{})}else{vids[k].pause();vids[k].muted=true;li.classList.remove('sound')}
    });
  };
  const update=()=>{
    raf=0;const c=track.getBoundingClientRect(),mid=c.left+c.width/2;let best=0,bd=1e9;
    items.forEach((li,k)=>{const r=li.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-mid);if(d<bd){bd=d;best=k}});
    setActive(best);
  };
  track.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  addEventListener('resize',update);
  items.forEach((li,k)=>li.addEventListener('click',()=>{
    if(k!==cur){li.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});return}
    const v=vids[k],on=v.muted;
    items.forEach((o,n)=>{vids[n].muted=true;o.classList.remove('sound')});
    if(on){v.muted=false;li.classList.add('sound')}
    v.play().catch(()=>{});
  }));
  let tgt=0;['pointerdown','wheel','touchstart'].forEach(ev=>track.addEventListener(ev,()=>{tgt=cur},{passive:true}));
  const go=d=>{const n=Math.min(items.length-1,Math.max(0,tgt+d));tgt=n;items[n].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})};
  document.querySelector('.prev').onclick=()=>go(-1);
  document.querySelector('.next').onclick=()=>go(1);
  update();
})();

/* lightbox das fotos em destaque */
(()=>{
  const lb=document.getElementById('lb'),im=lb.querySelector('img');
  const close=()=>{lb.hidden=true;im.removeAttribute('src')};
  document.querySelectorAll('.tile,.shot').forEach(t=>t.addEventListener('click',()=>{im.src=t.dataset.full;im.alt=t.querySelector('img').alt;lb.hidden=false}));
  lb.addEventListener('click',close);
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();

document.getElementById('ano').textContent=new Date().getFullYear();
