
(function(){
  const W=300,H=280,R=72;
  const C=[[112,104],[188,104],[150,172]];
  const CENT={A:[78,86],B:[222,86],C:[150,218],AB:[150,76],AC:[108,156],BC:[192,156],ABC:[150,128]};
  function v(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';}
  function hex(c,a){const m=c.match(/^#([0-9a-f]{6})$/i);if(!m)return c;const n=parseInt(m[1],16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
  function draw(id,o){
    const host=document.getElementById(id); if(!host) return;
    const dpr=window.devicePixelRatio||1;
    const cv=document.createElement('canvas');cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.maxWidth='100%';
    cv.setAttribute('role','img');cv.setAttribute('aria-label',o.alt||'Vennův diagram');
    host.innerHTML='';host.appendChild(cv);
    const g=cv.getContext('2d');g.scale(dpr,dpr);
    const shade=new Set(o.shade||[]), hi=new Set(o.hi||[]);
    const cs=hex(v('--muted'),.55), ch=hex(v('--accent'),.35);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      let k='';['A','B','C'].forEach((n,i)=>{const dx=x-C[i][0],dy=y-C[i][1];if(dx*dx+dy*dy<R*R)k+=n;});
      if(!k)continue;
      if(shade.has(k)){g.fillStyle=cs;g.fillRect(x,y,1,1);}
      if(hi.has(k)&&(x%6<2)&&(y%6<2)){g.fillStyle=ch;g.fillRect(x,y,2,2);}
    }
    g.lineWidth=2;g.strokeStyle=v('--ink');
    C.forEach(c=>{g.beginPath();g.arc(c[0],c[1],R,0,Math.PI*2);g.stroke();});
    g.fillStyle=v('--ink');g.font='600 17px '+(v('--serif')||'serif');
    const L=o.labels||['A','B','C'];
    g.textAlign='right';g.fillText(L[0],C[0][0]-R+14,C[0][1]-R+8);
    g.textAlign='left';g.fillText(L[1],C[1][0]+R-14,C[1][1]-R+8);
    g.textAlign='center';g.fillText(L[2],C[2][0],C[2][1]+R+20);
    function cross(p){g.strokeStyle=v('--bad');g.lineWidth=3.5;g.beginPath();g.moveTo(p[0]-9,p[1]-9);g.lineTo(p[0]+9,p[1]+9);g.moveTo(p[0]+9,p[1]-9);g.lineTo(p[0]-9,p[1]+9);g.stroke();}
    (o.x||[]).forEach(k=>cross(CENT[k]));
    (o.line||[]).forEach(([a,b])=>{
      const p=CENT[a],q=CENT[b];let m=[(p[0]+q[0])/2,(p[1]+q[1])/2];
      const d=['A','B','C'].findIndex(n=>a.includes(n)!==b.includes(n));
      if(d>=0){const c=C[d],dx=m[0]-c[0],dy=m[1]-c[1],l=Math.hypot(dx,dy)||1;m=[c[0]+dx/l*R,c[1]+dy/l*R];}
      cross(m);});
    if(o.caption){const c=document.createElement('div');c.className='vcap';c.innerHTML=o.caption;host.appendChild(c);}
  }
  window.Venn={draw};
})();
