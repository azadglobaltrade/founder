/* hero + header wiring — safe on every page */
(function(){
var LW=window._lw;
var $=function(id){return document.getElementById(id)};
function on(id,ev,fn){var el=$(id);if(el)el.addEventListener(ev,fn);return el}
on("heroSearch","input",function(){var q=$("q");if(q){q.value=this.value;LW.state.q=this.value;LW.state.shown=48;LW.renderGrid()}});
on("heroGo","click",function(){var lb=document.getElementById("library");if(lb&&window._ONINDEX)lb.scrollIntoView({behavior:"smooth"});else if(document.getElementById("grid"))document.getElementById("grid").scrollIntoView({behavior:"smooth"});else location.href="library.html"});
on("brandHome","click",function(e){e.preventDefault();location.href="index.html"});
on("brandHomeIdx","click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})});
on("randomBtn","click",function(){if(window.openModal)window.openModal(1+Math.floor(Math.random()*window.MODELS.length))});
/* ?q= / ?open= / #dN deep links (library entry points from sibling pages) */
try{
  var qs=location.search||"",m=/[?&]q=([^&]*)/.exec(qs),o=/[?&]open=(\d+)/.exec(qs);
  if(m&&$("q")){var v=decodeURIComponent(m[1].replace(/\+/g," "));$("q").value=v;LW.state.q=v;LW.state.shown=60;LW.renderGrid()}
  var dh=location.hash||"";
  if(/^#d\d+$/.test(dh)){var di=parseInt(dh.slice(2),10);if(!isNaN(di)){LW.state.disc=di;LW.state.shown=60;LW.renderPills();LW.renderGrid()}}
  if(o&&window.openModal){setTimeout(function(){window.openModal(parseInt(o[1],10))},400)}
}catch(e){}
})();


