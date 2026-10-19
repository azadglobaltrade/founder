/* Lattice C1 — pan/zoom/hover/drag */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw,L=window._LAT,DR=window._LATDRAW;
var $=function(id){return document.getElementById(id)};
var cv=$("latticeCanvas"),tip=$("latTip"),P=L.P;
if(!cv||!tip)return;
function w2s(x,y){var r=cv.getBoundingClientRect();return{x:(x-r.left)*(cv.width/r.width),y:(y-r.top)*(cv.height/r.height)}}
function s2w(sx,sy){var zf=(L.P.base||0.6)*P.z;var ox=(cv.width-L.W*zf)/2,oy=(cv.height-L.H*zf)/2;return{x:(sx-ox)/zf-P.px,y:(sy-oy)/zf-P.py}}
function pick(sx,sy){
  var w=s2w(sx,sy),best=null,bd=1e12,pi=-1;
  for(var i=0;i<L.pillars.length;i++){var p=L.pillars[i];var d=(p.x-w.x)*(p.x-w.x)+(p.y-w.y)*(p.y-w.y);if(d<bd){bd=d;pi=i}}
  var thr=(34/((L.P.base||0.6)*P.z));thr=thr*thr;
  if(bd<thr)return{pillar:L.pillars[pi]};
  best=null;bd=1e12;
  for(var j=0;j<L.nodes.length;j++){var n=L.nodes[j];if(!DR.vis(n))continue;var d2=(n.x-w.x)*(n.x-w.x)+(n.y-w.y)*(n.y-w.y);if(d2<bd){bd=d2;best=n}}
  var px=(15/((L.P.base||0.6)*P.z));px=px*px;
  return bd<px?best:null;
}
window._LATPK={w2s:w2s,s2w:s2w,pick:pick};
cv.addEventListener("mousedown",function(e){P.downX=e.clientX;P.downY=e.clientY;P.moved=false;var s=w2s(e.clientX,e.clientY);var hit=pick(s.x,s.y);if(hit&&!hit.pillar)P.dragN=hit;P.drag={x:e.clientX,y:e.clientY,px:P.px,py:P.py}});
window.addEventListener("mousemove",function(e){
  if(P.drag){
    var zf=(L.P.base||0.6)*P.z;
    var dx=(e.clientX-P.drag.x)/zf,dy=(e.clientY-P.drag.y)/zf;
    if(Math.abs(e.clientX-P.downX)+Math.abs(e.clientY-P.downY)>4)P.moved=true;
    if(P.dragN){var s=w2s(e.clientX,e.clientY),w=s2w(s.x,s.y);P.dragN.x=w.x;P.dragN.y=w.y;P.dragN.vx=0;P.dragN.vy=0}
    else{P.px=P.drag.px+dx;P.py=P.drag.py+dy}
    return;
  }
  if(e.target!==cv){tip.hidden=true;return}
  var s2=w2s(e.clientX,e.clientY),hit=pick(s2.x,s2.y);
  P.hov=(hit&&!hit.pillar)?hit:null;
  var r=cv.getBoundingClientRect();
  if(hit&&!hit.pillar){tip.hidden=false;tip.style.left=(e.clientX-r.left+14)+"px";tip.style.top=(e.clientY-r.top-10)+"px";tip.innerHTML="<b>No "+LW.pad(hit.m.id)+" - "+hit.m.name+"</b><span>"+D[hit.m.d].n+" - "+(window.LINKS[hit.m.id]||[]).length+" links</span>";cv.style.cursor="pointer"}
  else if(hit&&hit.pillar){tip.hidden=false;tip.style.left=(e.clientX-r.left+14)+"px";tip.style.top=(e.clientY-r.top-10)+"px";tip.innerHTML="<b>"+D[hit.pillar.i].n+" pillar</b><span>"+window.DMEMBERS[hit.pillar.i].length+" plates - click to isolate</span>";cv.style.cursor="pointer"}
  else{tip.hidden=true;cv.style.cursor="grab"}
});
window.addEventListener("mouseup",function(e){
  if(!P.drag)return;var wasDrag=P.moved;P.drag=null;P.dragN=null;
  if(!wasDrag&&e.target===cv){
    var s=w2s(e.clientX,e.clientY),hit=pick(s.x,s.y);
    if(hit&&hit.pillar){P.focusDisc=(P.focusDisc===hit.pillar.i?-1:hit.pillar.i);window._LATUI.chips();window._LATUI.stats()}
    else if(hit){window._LATUI.select(hit)}
    else{window._LATUI.select(null)}
  }
});
cv.addEventListener("dblclick",function(){if(P.hov)window.openModal(P.hov.m.id);else if(P.sel&&P.sel.m)window.openModal(P.sel.m.id)});
cv.addEventListener("wheel",function(e){e.preventDefault();P.z=Math.min(4,Math.max(0.5,P.z*(e.deltaY<0?1.12:0.89)))},{passive:false});
/* touch: 1-finger pan / drag node, 2-finger pinch zoom, tap select, double-tap open */
(function(){
var lastT=0,lastD=0,lastTap=0,tapId=null;
function tp(e){var r=cv.getBoundingClientRect();var t=e.touches[0];return{x:(t.clientX-r.left)*(cv.width/r.width),y:(t.clientY-r.top)*(cv.height/r.height),cx:t.clientX,cy:t.clientY}}
cv.addEventListener("touchstart",function(e){
if(e.touches.length===2){var a=e.touches[0],b=e.touches[1];lastD=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);P.drag=null;P.dragN=null}
else if(e.touches.length===1){var s=tp(e);var hit=pick(s.x,s.y);if(hit&&!hit.pillar)P.dragN=hit;P.drag={x:s.cx,y:s.cy,px:P.px,py:P.py};P.downX=s.cx;P.downY=s.cy;P.moved=false}
},{passive:true});
cv.addEventListener("touchmove",function(e){
if(e.touches.length===2){e.preventDefault();var a2=e.touches[0],b2=e.touches[1];var d=Math.hypot(a2.clientX-b2.clientX,a2.clientY-b2.clientY);if(lastD>0)P.z=Math.min(4,Math.max(0.5,P.z*(d/lastD)));lastD=d;return}
if(!P.drag||e.touches.length!==1)return;
var zf=(L.P.base||0.6)*P.z;var t=e.touches[0];
var dx=(t.clientX-P.drag.x)/zf,dy=(t.clientY-P.drag.y)/zf;
if(Math.abs(t.clientX-P.downX)+Math.abs(t.clientY-P.downY)>6)P.moved=true;
if(P.dragN){var s2=tp(e),w=s2w(s2.x,s2.y);P.dragN.x=w.x;P.dragN.y=w.y;P.dragN.vx=0;P.dragN.vy=0}
else{P.px=P.drag.px+dx;P.py=P.drag.py+dy}
},{passive:false});
cv.addEventListener("touchend",function(e){
if(e.touches.length===0){
var wasDrag=P.moved;P.drag=null;
if(!wasDrag&&e.changedTouches.length){
var r=cv.getBoundingClientRect(),t=e.changedTouches[0];
var sx=(t.clientX-r.left)*(cv.width/r.width),sy=(t.clientY-r.top)*(cv.height/r.height);
var hit=pick(sx,sy);
if(hit&&hit.pillar){P.focusDisc=(P.focusDisc===hit.pillar.i?-1:hit.pillar.i);window._LATUI.chips();window._LATUI.stats()}
else if(hit){
var now=Date.now();
if(tapId===hit.m.id&&now-lastTap<350){window.openModal(hit.m.id);tapId=null}
else{tapId=hit.m.id;lastTap=now;window._LATUI.select(hit)}
}else window._LATUI.select(null);
}
P.dragN=null;lastD=0;
}
},{passive:true});
})();
})();
