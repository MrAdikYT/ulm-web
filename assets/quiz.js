
(function(){
  const css = `
  .quiz{margin:20px 0}
  .quiz .qq{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 18px;margin:12px 0}
  .quiz .qt{font-weight:600;margin-bottom:10px;font-size:1.15rem}
  .quiz .qt .f,.quiz button .f{font-size:1.12em;white-space:normal}
  .quiz .opts{display:grid;gap:8px}
  .quiz .opts.pics{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))}
  .quiz .opts.pics button{text-align:center;padding:8px}
  .quiz .usudek{font-weight:400;font-style:italic;margin:6px 0 4px;line-height:1.6}
  .quiz .usudek hr{border:0;border-top:1px solid var(--ink);width:60%;margin:4px 0}
  .quiz button{font:inherit;font-size:1.2rem;line-height:1.5;text-align:left;padding:12px 16px;border-radius:6px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer}
  .quiz button:hover:not(:disabled){border-color:var(--accent)}
  .quiz button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  .quiz button:disabled{cursor:default}
  .quiz button.right{background:var(--ok-soft);border-color:var(--ok)}
  .quiz button.wrong{background:var(--bad-soft);border-color:var(--bad)}
  .quiz .why{margin-top:8px;font-size:.92rem;color:var(--muted)}
  .quiz .score{position:sticky;bottom:12px;background:var(--ink);color:var(--bg);border-radius:8px;padding:8px 14px;font-size:.95rem;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
  .quiz .score button{background:var(--bg);color:var(--ink);border:0;padding:4px 10px}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  function mount(id, items, opt){
    const root=document.getElementById(id); if(!root) return;
    let got=0, done=0;
    function render(){
      root.innerHTML=''; got=0; done=0;
      items.forEach((it,i)=>{
        const box=document.createElement('div');box.className='qq';
        const t=document.createElement('div');t.className='qt';t.innerHTML=`${i+1}. ${it.q}`;box.appendChild(t);
        const opts=document.createElement('div');opts.className=it.pics?'opts pics':'opts';
        const why=document.createElement('div');why.className='why';why.hidden=true;
        it.a.forEach((txt,j)=>{
          const b=document.createElement('button');b.type='button';b.id=`${id}-${i}-${j}`;b.innerHTML=txt;
          b.addEventListener('click',()=>{
            done++; if(j===it.ok) got++;
            opts.querySelectorAll('button').forEach((x,k)=>{x.disabled=true; if(k===it.ok) x.classList.add('right');});
            if(j!==it.ok) b.classList.add('wrong');
            why.innerHTML=(j===it.ok?'<b>Správně.</b> ':'<b>Vedle.</b> ')+it.why; why.hidden=false; upd();
          });
          opts.appendChild(b);
        });
        box.append(opts,why); root.appendChild(box);
      });
      const sc=document.createElement('div');sc.className='score';
      sc.innerHTML=`<span class="s"></span><button type="button" id="${id}-reset">Znovu</button>`;
      root.appendChild(sc); sc.querySelector('button').addEventListener('click',render); upd();
      if(opt&&opt.onRender) opt.onRender(); 
    }
    function upd(){const s=root.querySelector('.score .s'); if(s) s.textContent=`Správně ${got} z ${done} (celkem ${items.length})`;}
    render();
  }
  window.Quiz={mount};
})();
