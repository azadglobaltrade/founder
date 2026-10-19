/* AGT founder track renderer (shared: index section + founder.html page) */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw;
var NAMES1=(window.SEEDSAGT1||[]).map(function(s){return s[1]});
var NAMES2=(window.SEEDSAGT2||[]).map(function(s){return s[1]});
var ALL=NAMES1.concat(NAMES2);
function findId(nm){for(var i=0;i<M.length;i++)if(M[i].name===nm)return M[i].id;return null}
window._AGTFIND=findId;
function paint(){
  var g=document.getElementById("agtGrid");if(!g)return;
  var h="",done=0;
  ALL.forEach(function(nm){
    var id=findId(nm);if(!id)return;var m=M[id-1];
    var st=!!LW.studied[id];if(st)done++;
    h+='<article class="fcard'+(st?" done":"")+'" data-id="'+id+'"><span class="fnum">No '+LW.pad(id)+'</span><span class="fdisc" style="color:'+(window.dcolor?window.dcolor(m.d):"#C65A2E")+'">'+D[m.d].n+'</span><h4>'+m.name+'</h4><p>'+m.tag+'</p><span class="fopen">'+(st?"studied · open in Library":"open in Library")+"</span></article>";
  });
  g.innerHTML=h;
  var cs=g.querySelectorAll(".fcard");
  cs.forEach(function(c){c.onclick=function(){location.href="library.html?open="+c.dataset.id}});
  var f=document.getElementById("agtFill"),l=document.getElementById("agtLabel");
  if(f)f.style.width=(100*done/ALL.length)+"%";
  if(l)l.textContent=done+" / "+ALL.length+" founder plates studied";
  var lv=document.getElementById("agtLev"),lh="";
  (window.AGTLEV||[]).forEach(function(c){lh+='<div class="lev"><h4>'+c.t+'</h4><p class="ls">'+c.s+'</p><p>'+c.x+"</p></div>"});
  if(lv)lv.innerHTML=lh;
  var tr=document.getElementById("agtTracks"),th="";
  (window.AGTTRACKS||[]).slice(0,2).forEach(function(t){
    th+='<div class="track scr"><h4>'+t.t+"</h4><table><tr><th>Study</th><th>What you learn</th><th>Founder leverage</th></tr>";
    t.rows.forEach(function(r){th+="<tr><td><b>"+r[0]+"</b></td><td>"+r[1]+"</td><td>"+r[2]+"</td></tr>"});
    th+="</table></div>";
  });
  if(tr)tr.innerHTML=th;
  var sq=document.getElementById("agtSeq"),sh="";
  if(sq&&(window.AGTTRACKS||[])[2]){
  (window.AGTTRACKS||[])[2].rows.forEach(function(r){
    var nm=(window.AGTSEQ||[]).filter(function(n){return r[0].toLowerCase().indexOf(n.split(" ")[0].toLowerCase())>=0})[0];
    var id=nm?findId(nm):null;
    sh+="<li>"+r[0]+" — <span>"+r[2]+"</span>"+(id?' <button data-id="'+id+'">open plate</button>':"")+"</li>";
  });
  sq.innerHTML=sh;
  var bs=sq.querySelectorAll("button");bs.forEach(function(b){b.onclick=function(){location.href="library.html?open="+b.dataset.id}});
  }
}
window._AGTPAINT=paint;
document.addEventListener("click",function(e){if(e.target&&e.target.id==="studyBtn")setTimeout(paint,100)});
paint();
})();

