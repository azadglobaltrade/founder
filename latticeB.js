/* Lattice B — renderer */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw,L=window._LAT;
var cv=document.getElementById("latticeCanvas");if(!cv)return;var ctx=cv.getContext("2d");
function fit(){var w=cv.parentElement.clientWidth||900;cv.width=w;var mob=window.innerWidth<760;cv.height=mob?380:560;L.P.base=Math.min(w/L.W,cv.height/L.H)}
function vis(n){
  var P=L.P;
  if(P.studiedOnly&&!LW.studied[n.m.id])return false;
  if(P.focusDisc>=0&&n.m.d!==P.focusDisc&&!(P.sel&&isNb(P.sel,n)))return false;
  if(P.q){var s=(n.m.name+" "+n.m.tag+" "+D[n.m.d].n).toLowerCase();if(s.indexOf(P.q)<0&&!(P.sel&&isNb(P.sel,n)))return false}
  return true;
}
function isNb(a,b){if(!a)return false;var l=window.LINKS[a.m.id]||[];return l.indexOf(b.m.id)>=0}
function SX(x){return(x+L.P.px)*L.P.z*zoomFit()+offX()}
function SY(y){return(y+L.P.py)*L.P.z*zoomFit()+offY()}
function zoomFit(){return L.P.base||0.6}
function offX(){return(cv.width-L.W*zoomFit()*L.P.z)/2}
function offY(){return(cv.height-L.H*zoomFit()*L.P.z)/2}
function draw(){
  L.step();
  ctx.clearRect(0,0,cv.width,cv.height);
  var P=L.P,sel=P.sel,hov=P.hov;
  var nbSet={};if(sel)(window.LINKS[sel.m.id]||[]).forEach(function(id){nbSet[id]=1});
  function dim(n){if(!sel&&!hov)return false;if(sel&&(n===sel||nbSet[n.m.id]))return false;if(!sel&&hov&&(n===hov))return false;return true}
  if(P.showLinks){
    Object.keys(window.LINKS).forEach(function(k){
      var a=L.byId[k];if(!a||!vis(a))return;
      (window.LINKS[k]||[]).forEach(function(j){
        if(j<+k)return;var b=L.byId[j];if(!b||!vis(b))return;
        var hot=sel&&(a===sel||b===sel)||(hov&&(a===hov||b===hov));
        ctx.strokeStyle=hot?"#211D14":(a.m.d===b.m.d?window.dcolor(a.m.d):"#b9ac8f");
        ctx.globalAlpha=hot?0.9:(P.mode==="pillars"?0.05:0.22);
        ctx.lineWidth=hot?1.6:1;
        ctx.beginPath();ctx.moveTo(SX(a.x),SY(a.y));ctx.lineTo(SX(b.x),SY(b.y));ctx.stroke();
      });
    });
    ctx.globalAlpha=1;
  }
  if(P.mode==="all"||P.focusDisc>=0){
    L.nodes.forEach(function(n){
      if(!vis(n))return;var c=window.dcolor(n.m.d);
      var R=n===sel?9:n===hov?7:(n.m.id%9===0?4.5:3);
      ctx.globalAlpha=dim(n)?0.18:1;
      ctx.fillStyle=n===sel?"#211D14":c;
      ctx.beginPath();ctx.arc(SX(n.x),SY(n.y),R,0,7);ctx.fill();
      if(LW.studied[n.m.id]){ctx.strokeStyle=n===sel?"#F3EFE4":"#fff";ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(SX(n.x),SY(n.y),R+2.4,0,7);ctx.stroke()}
      ctx.globalAlpha=1;
    });
  }
  L.pillars.forEach(function(p){
    var show=P.mode==="pillars"||P.focusDisc===p.i||!P.focusDisc&&P.mode==="pillars";
    if(P.mode==="all"&&P.focusDisc<0){drawHub(p,0.85)}
    else if(P.focusDisc===p.i||P.mode==="pillars"){drawHub(p,1)}
  });
  function drawHub(p,al){
    var c=window.dcolor(p.i),X=SX(p.x),Y=SY(p.y);
    ctx.globalAlpha=al;
    ctx.strokeStyle=c;ctx.lineWidth=2;ctx.setLineDash([5,5]);
    ctx.beginPath();ctx.arc(X,Y,26,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(X,Y,17,0,7);ctx.fill();
    ctx.fillStyle="#FBF8F0";ctx.font="bold 11px monospace";ctx.textAlign="center";
    ctx.fillText(String(window.DMEMBERS[p.i].length),X,Y+4);ctx.textAlign="left";
    if(P.showLabels){ctx.fillStyle="#211D14";ctx.font="bold 12px monospace";ctx.fillText(D[p.i].e+"  "+D[p.i].n.toUpperCase(),X+32,Y+4)}
    ctx.globalAlpha=1;
  }
  if(P.showLabels&&(hov||sel)){
    var n=hov||sel;
    if(n.m){ctx.fillStyle="#211D14";ctx.font="bold 12px monospace";
      ctx.fillText("No "+LW.pad(n.m.id)+"  "+n.m.name.slice(0,34),SX(n.x)+12,SY(n.y)-8)}
  }
  requestAnimationFrame(draw);
}
window._LATDRAW={fit:fit,draw:draw,vis:vis,SX:SX,SY:SY};
fit();window.addEventListener("resize",fit);draw();
})();
