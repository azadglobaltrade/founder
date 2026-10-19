/* Latticework app */
(function(){
var D=window.DISCIPLINES,M=window.MODELS;
var $=function(id){return document.getElementById(id)};
var studied={};try{studied=JSON.parse(localStorage.getItem("lw-studied")||"{}")}catch(e){}
function save(){localStorage.setItem("lw-studied",JSON.stringify(studied))}
function studiedCount(){return Object.keys(studied).length}
var PAL=[["#C65A2E","#2E7F74"],["#211D14","#C65A2E"],["#2E7F74","#211D14"],["#8A5A2B","#C65A2E"],["#3E5C76","#2E7F74"]];
function art(id,disc,kind){
  var p=PAL[(id+disc)%PAL.length],c1=p[0],c2=p[1],v=id%5;
  var bg="url(#g"+id+")";
  var inner="";
  if(v===0)inner='<circle cx="150" cy="70" r="42" fill="none" stroke="'+c1+'" stroke-width="3"/><circle cx="150" cy="70" r="8" fill="'+c1+'"/><line x1="150" y1="112" x2="150" y2="140" stroke="'+c1+'" stroke-width="3"/><circle cx="110" cy="130" r="14" fill="'+c2+'"/><circle cx="190" cy="130" r="14" fill="'+c2+'"/>';
  else if(v===1)inner='<rect x="90" y="40" width="120" height="70" fill="none" stroke="'+c1+'" stroke-width="3"/><line x1="90" y1="75" x2="210" y2="75" stroke="'+c1+'" stroke-dasharray="6 5"/><circle cx="150" cy="75" r="10" fill="'+c2+'"/>';
  else if(v===2)inner='<path d="M60 120 L150 35 L240 120 Z" fill="none" stroke="'+c1+'" stroke-width="3"/><circle cx="150" cy="95" r="12" fill="'+c2+'"/><line x1="150" y1="35" x2="150" y2="12" stroke="'+c1+'" stroke-width="3"/>';
  else if(v===3)inner='<line x1="40" y1="70" x2="260" y2="70" stroke="'+c1+'" stroke-width="2"/><rect x="120" y="45" width="60" height="50" fill="'+c2+'"/><circle cx="80" cy="70" r="9" fill="'+c1+'"/><circle cx="220" cy="70" r="9" fill="'+c1+'"/>';
  else inner='<circle cx="150" cy="70" r="46" fill="none" stroke="'+c1+'" stroke-width="3" stroke-dasharray="4 6"/><path d="M150 24 L150 116 M104 70 L196 70" stroke="'+c2+'" stroke-width="3"/>';
  return '<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF8F0"/><stop offset="1" stop-color="#EFE6D2"/></linearGradient></defs><rect width="300" height="150" fill="'+bg+'"/>'+inner+'<text x="12" y="140" font-family="Space Mono,monospace" font-size="9" fill="#6f675a">PLATE '+String(id).padStart(3,"0")+" · "+D[disc].n.toUpperCase()+'</text></svg>';
}
var state={q:"",disc:-1,sort:"num",hide:false,only:false,shown:48};
function filtered(){
  var q=state.q.toLowerCase(),out=[];
  for(var i=0;i<M.length;i++){var m=M[i];
    if(state.disc>=0&&m.d!==state.disc)continue;
    if(state.hide&&studied[m.id])continue;
    if(state.only&&!studied[m.id])continue;
    if(q&&(m.name+" "+m.tag+" "+m.desc+" "+D[m.d].n).toLowerCase().indexOf(q)<0)continue;
    out.push(m);
  }
  if(state.sort==="az")out.sort(function(a,b){return a.name.localeCompare(b.name)});
  else if(state.sort==="discipline")out.sort(function(a,b){return a.d-b.d||a.id-b.id});
  else if(state.sort==="numDesc")out.sort(function(a,b){return b.id-a.id});
  else out.sort(function(a,b){return a.id-b.id});
  return out;
}
function pad(n){return String(n).padStart(3,"0")}
function renderPills(){
  var pe=$("pills");
  if(pe){
  var h='<button class="pill'+(state.disc<0?" on":"")+'" data-d="-1">All · 963</button>';
  D.forEach(function(d,i){h+='<button class="pill'+(state.disc===i?" on":"")+'" data-d="'+i+'">'+d.e.split(" ")[0]+" "+d.n+' <span class="n">'+d.c+"</span></button>"});
  pe.innerHTML=h;
  var els=pe.querySelectorAll(".pill");
  els.forEach(function(b){b.onclick=function(){state.disc=parseInt(b.dataset.d,10);state.shown=48;renderPills();renderGrid();}});
  }
  var mqe=$("marquee");
  if(mqe){
  var mq="";D.forEach(function(d,i){mq+='<span class="mq" data-d="'+i+'">'+d.e+" "+d.n+" · "+d.c+"</span>"});
  mqe.innerHTML=mq;
  mqe.querySelectorAll(".mq").forEach(function(s){s.onclick=function(){state.disc=parseInt(s.dataset.d,10);state.shown=48;renderPills();renderGrid();var lb=document.getElementById("library");if(lb)lb.scrollIntoView()}});
  }
}
function renderGrid(){
  if(!$("grid")){updateProgress();return}
  var list=filtered(),slice=list.slice(0,state.shown),h="";
  for(var i=0;i<slice.length;i++){var m=slice[i];
    h+='<article class="card'+(studied[m.id]?" studied":"")+'" data-id="'+m.id+'"><div class="plate-art"><span class="plate-num">№ '+pad(m.id)+'</span><span class="plate-star">'+(studied[m.id]?"★":"☆")+"</span>"+art(m.id,m.d)+'</div><div class="card-body"><span class="disc">'+D[m.d].e+" · "+D[m.d].n+'</span><h3>'+m.name+'</h3><p class="tag">'+m.tag+'</p><div class="card-foot"><span>⁘ '+(window.LINKS?window.LINKS[m.id].length:(2+(m.id%5)))+' links</span><span>open →</span></div></div></article>';
  }
  if(state.shown<list.length)h+='<div class="loadmore" style="grid-column:1/-1"><button class="btn" id="moreBtn">Show more ('+(list.length-state.shown)+" remaining) ↓</button></div>";
  $("grid").innerHTML=h;if($("empty"))$("empty").hidden=list.length>0;
  if($("count"))$("count").textContent="Showing "+slice.length+" of "+list.length+" plates — "+studiedCount()+" studied";
  document.querySelectorAll(".card").forEach(function(c){c.onclick=function(){openModal(parseInt(c.dataset.id,10))}});
  var mb=$("moreBtn");if(mb)mb.onclick=function(e){e.stopPropagation();state.shown+=60;renderGrid()};
  updateProgress();
}
function updateProgress(){
  var n=studiedCount(),el;
  el=$("progressLabel");if(el)el.textContent=n+" / "+M.length+" studied";
  el=$("progressFill");if(el)el.style.width=(100*n/M.length)+"%";
  el=$("statStudied");if(el)el.textContent=n;
  el=$("statModels");if(el)el.textContent=M.length;
}
window._lw={renderGrid:renderGrid,renderPills:renderPills,updateProgress:updateProgress,art:art,pad:pad,filtered:filtered,state:state,studied:studied,save:save};
renderPills();renderGrid();
})();
