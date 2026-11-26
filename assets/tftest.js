
(function(){
  const css = `
  .tf{margin:20px 0}
  .tf .tq{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 18px;margin:14px 0}
  .tf .tt{font-weight:600;font-size:1.15rem;margin-bottom:10px;line-height:1.5}
  .tf .tt .f,.tf .ti .f{font-size:1.12em;white-space:normal}
  .tf .ti{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:10px 0;border-top:1px solid var(--line);font-size:1.2rem;line-height:1.5}
  .tf .ti .l{font-weight:600;color:var(--muted)}
  .tf .pn{display:flex;gap:6px}
  .tf .pn button{font:inherit;font-size:1.05rem;font-weight:600;width:44px;height:40px;border-radius:6px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer}
  .tf .pn button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
  .tf .pn button:disabled{cursor:default}
  .tf .ti.good{background:var(--ok-soft)} .tf .ti.bad{background:var(--bad-soft)} .tf .ti.skip{background:var(--warn-soft)}
  .tf .ti .why{grid-column:2 / 4;font-size:.95rem;color:var(--muted)}
  .tf .bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:12px}
  .tf .bar button{font:inherit;font-size:1rem;padding:10px 18px;border-radius:6px;border:0;background:var(--ink);color:var(--bg);cursor:pointer}
  .tf .res{font-size:1.1rem;font-weight:600}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const L='abcdefgh';

  function mount(id, qs){
    const root=document.getElementById(id); if(!root) return;
    root.classList.add('tf');
    function render(){
      root.innerHTML='';
      const picks=qs.map(q=>q.items.map(()=>null));
      qs.forEach((q,i)=>{
        const box=document.createElement('div');box.className='tq';
        box.innerHTML=`<div class="tt">${i+1}. ${q.q}</div>`;
        q.items.forEach((it,j)=>{
          const row=document.createElement('div');row.className='ti';
          row.innerHTML=`<span class="l">${L[j]})</span><span>${it.t}</span>`;
          const pn=document.createElement('div');pn.className='pn';
          ['P','N'].forEach(v=>{
            const b=document.createElement('button');b.type='button';b.textContent=v;b.setAttribute('aria-pressed','false');
            b.addEventListener('click',()=>{
              const cur=picks[i][j]===v?null:v; picks[i][j]=cur;
              pn.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x.textContent===cur)));
            });
            pn.appendChild(b);
          });
          row.appendChild(pn); row.dataset.i=i; row.dataset.j=j; box.appendChild(row);
        });
        root.appendChild(box);
      });
      const bar=document.createElement('div');bar.className='bar';
      bar.innerHTML=`<button type="button" class="eval">Vyhodnotit</button><span class="res"></span>`;
      root.appendChild(bar);
      bar.querySelector('.eval').addEventListener('click',()=>{
        let pts=0,max=0;
        root.querySelectorAll('.ti').forEach(row=>{
          const i=+row.dataset.i,j=+row.dataset.j,it=qs[i].items[j],p=picks[i][j]; max++;
          row.querySelectorAll('button').forEach(b=>b.disabled=true);
          let cls,txt;
          if(p===null){cls='skip';txt='nevyplněno, 0 b.';}
          else if((p==='P')===it.ok){cls='good';pts++;txt='+1';}
          else{cls='bad';pts--;txt='−1';}
          row.classList.add(cls);
          const w=document.createElement('div');w.className='why';
          w.innerHTML=`<b>${it.ok?'Pravda':'Nepravda'}</b> (${txt}). ${it.why}`;
          row.appendChild(w);
        });
        const b=bar.querySelector('.eval'); b.textContent='Znovu'; b.onclick=null;
        b.replaceWith(b.cloneNode(true)); bar.querySelector('.eval').addEventListener('click',render);
        bar.querySelector('.res').textContent=`Body: ${pts} z ${max}`;
      });
    }
    render();
  }
  window.TfTest={mount};
})();
