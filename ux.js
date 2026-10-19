/* modal + search */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw;
var $=function(id){return document.getElementById(id)};
var cur=1;
function rel(m){return window.LINKS?window.LINKS[m.id].slice(0,6):[]}
function openModal(id){
  cur=id;var m=M[id-1];
  $("mNum").textContent="No "+LW.pad(m.id);
  $("mDisc").textContent=D[m.d].n;
  $("mConn").textContent="links "+(window.LINKS?window.LINKS[m.id].length:0);
  $("mName").textContent=m.name;$("mTag").textContent=m.tag;
  $("mDesc").textContent=m.desc;$("mArt").innerHTML=LW.art(m.id,m.d);
  $("mCap").textContent=m.cap;$("mEx").textContent=m.ex;$("mPrompt").textContent=m.prompt;
  var rh="";rel(m).forEach(function(r){rh+='<button data-r="'+r+'">No '+LW.pad(r)+" - "+M[r-1].name+"</button>"});
  $("mRel").innerHTML=rh;
  var bs=document.querySelectorAll("#mRel button");
  bs.forEach(function(b){b.onclick=function(){openModal(parseInt(b.dataset.r,10))}});
  paintStudy();$("modalBack").hidden=false;document.body.style.overflow="hidden";
}
function paintStudy(){var on=!!LW.studied[cur];$("studyBtn").textContent=on?"Studied - tap to undo":"Mark studied";$("studyBtn").className=on?"btn ember done":"btn ember"}
function on(id,ev,fn){var el=$(id);if(el)el.addEventListener(ev,fn);return el}
window.openModal=openModal;
on("modalX","click",closeM);
$("modalBack").onclick=function(e){if(e.target===$("modalBack"))closeM()};
function closeM(){$("modalBack").hidden=true;document.body.style.overflow=""}
document.addEventListener("keydown",function(e){
  var q=$("q"),mb=$("modalBack");
  if(e.key==="Escape"&&mb&&!mb.hidden)closeM();
  if(e.key==="/"&&q&&document.activeElement!==q&&mb&&mb.hidden){e.preventDefault();q.focus()}
  if(mb&&!mb.hidden){if(e.key==="ArrowRight")step(1);if(e.key==="ArrowLeft")step(-1)}
});
function step(d){var n=cur+d;if(n<1)n=M.length;if(n>M.length)n=1;openModal(n)}
function on(id,ev,fn){var el=$(id);if(el)el.addEventListener(ev,fn);return el}
on("prevBtn","click",function(){step(-1)});
on("nextBtn","click",function(){step(1)});
function toast(s){var t=$("toast");t.textContent=s;t.hidden=false;clearTimeout(t._h);t._h=setTimeout(function(){t.hidden=true},1500)}
window._toast=toast;
var el;
var deb=null;
el=$("studyBtn");if(el)el.onclick=function(){if(LW.studied[cur])delete LW.studied[cur];else LW.studied[cur]=1;LW.save();paintStudy();LW.renderGrid();if(window._AGTPAINT)window._AGTPAINT();toast(LW.studied[cur]?"Marked studied":"Unmarked")};
el=$("copyBtn");if(el)el.onclick=function(){var t=$("mPrompt").textContent;if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){toast("Prompt copied")})}else{toast("Prompt selected")} };
on("q","input",function(){clearTimeout(deb);deb=setTimeout(function(){LW.state.q=$("q").value;LW.state.shown=48;LW.renderGrid()},120)});
el=$("sort");if(el)el.onchange=function(){LW.state.sort=el.value;LW.renderGrid()};
el=$("hideStudied");if(el)el.onchange=function(){LW.state.hide=el.checked;LW.renderGrid()};
el=$("onlyStudied");if(el)el.onchange=function(){LW.state.only=el.checked;LW.renderGrid()};
function reset(){LW.state.q="";LW.state.disc=-1;LW.state.shown=48;LW.state.hide=false;LW.state.only=false;var q=$("q");if(q)q.value="";var h1=$("hideStudied");if(h1)h1.checked=false;var h2=$("onlyStudied");if(h2)h2.checked=false;LW.renderPills();LW.renderGrid()}
el=$("clearBtn");if(el)el.onclick=reset;el=$("emptyReset");if(el)el.onclick=reset;
el=$("randomBtn");if(el)el.onclick=function(){openModal(1+Math.floor(Math.random()*M.length))};
})();
