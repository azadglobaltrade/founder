/* Lattice C2 — panel + toolbar + filters */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw,L=window._LAT,DR=window._LATDRAW;
var $=function(id){return document.getElementById(id)};
var P=L.P;
if(!$("latChips")||!$("latticeCanvas"))return;
function select(n){P.sel=n;panel(n)}
function panel(n){
  if(!n){$("latName").textContent="Explore the lattice";$("latMeta").textContent="963 plates - 18 pillars - "+window.EDGES+" links";$("latDesc").textContent="Hover any dot to preview. Click a ringed pillar to isolate a discipline. Click a dot to trace its real connections. Double-click to open.";$("latPBar").innerHTML="";$("latExtra").innerHTML="";return}
  var m=n.m;
  $("latName").textContent="No "+LW.pad(m.id)+" - "+m.name;
  $("latMeta").textContent=D[m.d].n+" — "+m.tag;
  var st=Object.keys(LW.studied).length;
  $("latPBar").innerHTML='<div class="pbar"><i style="width:'+(100*st/M.length)+'%"></i></div><small>'+st+" / "+M.length+" studied</small>";
  $("latDesc").textContent=m.desc;
  var ids=window.LINKS[m.id]||[],h="";
  ids.forEach(function(id){var q=M[id-1];h+='<button data-id="'+id+'"><i style="background:'+window.dcolor(q.d)+'"></i>No '+LW.pad(id)+" "+q.name.slice(0,20)+"</button>"});
  $("latExtra").innerHTML="<h5>"+ids.length+" REAL CONNECTIONS</h5>"+'<div class="lat-links">'+h+"</div>";
  var bs=document.querySelectorAll("#latExtra button");
  bs.forEach(function(b){b.onclick=function(){var t=L.byId[+b.dataset.id];if(t)select(t)}});
  $("latOpen").onclick=function(){window.openModal(m.id)};
  $("latLib").onclick=function(){location.href="library.html?q="+encodeURIComponent(m.name)};
}
function chips(){
  var h='<button data-d="-1" class="'+(P.focusDisc<0?"on":"")+'">All 18 - 963</button>';
  D.forEach(function(d,i){h+='<button data-d="'+i+'" class="'+(P.focusDisc===i?"on":"")+'"><i style="background:'+window.dcolor(i)+'"></i>'+d.n+" - "+d.c+"</button>"});
  $("latChips").innerHTML=h;
  var bs=document.querySelectorAll("#latChips button");
  bs.forEach(function(b){b.onclick=function(){P.focusDisc=+b.dataset.d<0?-1:+b.dataset.d;chips();stats()}});
  var lg="";D.forEach(function(d,i){lg+='<span data-d="'+i+'"><i style="background:'+window.dcolor(i)+'"></i>'+d.n+"</span>"});
  $("latLegend").innerHTML=lg;
  var ss=document.querySelectorAll("#latLegend span");
  ss.forEach(function(s){s.onclick=function(){P.focusDisc=+s.dataset.d;chips();stats()}});
}
function stats(){
  var v=0;L.nodes.forEach(function(n){if(DR.vis(n))v++});
  $("latStats").textContent=(P.focusDisc>=0?D[P.focusDisc].n+" - ":"")+v+" visible - "+M.length+" total - "+window.EDGES+" links";
}
window._LATUI={select:select,panel:panel,chips:chips,stats:stats};
var deb;$("latSearch").addEventListener("input",function(){clearTimeout(deb);var v=this.value;deb=setTimeout(function(){P.q=v.toLowerCase();stats();
  if(P.q.length>1){for(var i=0;i<L.nodes.length;i++){var n=L.nodes[i];if((n.m.name+" "+n.m.tag).toLowerCase().indexOf(P.q)>=0){select(n);break}}}},150)});
var mbs=document.querySelectorAll(".lat-modes button[data-mode]");
mbs.forEach(function(b){b.onclick=function(){mbs.forEach(function(x){x.classList.remove("on")});b.classList.add("on");P.mode=b.dataset.mode;stats()}});
$("latReset").onclick=function(){P.px=0;P.py=0;P.z=1;P.focusDisc=-1;P.q="";$("latSearch").value="";chips();stats()};
$("tLinks").onchange=function(){P.showLinks=this.checked};
$("tLabels").onchange=function(){P.showLabels=this.checked};
$("tMotion").onchange=function(){P.motion=this.checked};
$("tStudied").onchange=function(){P.studiedOnly=this.checked;stats()};
chips();panel(null);stats();select(L.byId[11]);
$("latOpen").onclick=function(){if(P.sel&&P.sel.m)window.openModal(P.sel.m.id)};
})();
