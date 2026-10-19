/* Military study-map renderer (library.html section) */
(function(){
var M=window.MODELS,LW=window._lw;
var NAMES=(window.SEEDSMIL1||[]).concat(window.SEEDSMIL2||[]).map(function(s){return s[1]});
function findId(nm){for(var i=0;i<M.length;i++)if(M[i].name===nm)return M[i].id;return null}
function paint(){
  var g=document.getElementById("milGrid");if(!g)return;
  var h="",done=0;
  NAMES.forEach(function(nm){
    var id=findId(nm);if(!id)return;var m=M[id-1];
    var st=!!LW.studied[id];if(st)done++;
    h+='<article class="fcard'+(st?" done":"")+'" data-id="'+id+'"><span class="fnum">No '+LW.pad(id)+'</span><h4>'+m.name+'</h4><p>'+m.tag+'</p><span class="fopen">'+(st?"studied · open":"open plate")+"</span></article>";
  });
  g.innerHTML=h;
  var cs=g.querySelectorAll(".fcard");
  cs.forEach(function(c){c.onclick=function(){window.openModal(+c.dataset.id);setTimeout(paint,900)}});
  var f=document.getElementById("milFill"),l=document.getElementById("milLabel");
  if(f)f.style.width=(100*done/NAMES.length)+"%";
  if(l)l.textContent=done+" / "+NAMES.length+" warfare plates studied";
}
window._MILPAINT=paint;
document.addEventListener("click",function(e){if(e.target&&e.target.id==="studyBtn")setTimeout(paint,120)});
paint();
})();
