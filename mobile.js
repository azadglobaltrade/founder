/* mobile nav + tabbar — shared all pages */
(function(){
var links=[["index.html","⌂","Home"],["library.html","▤","Library"],["lattice.html","⟡","Lattice"],["founder.html","▲","Founder"],["colophon.html","✎","Guide"]];
var file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
function isOn(h){return file===h||(file===""&&h==="index.html")}
var nav=document.getElementById("mastNav");
if(nav&&!nav.dataset.built){
nav.dataset.built="1";
var h="";
links.forEach(function(l){h+='<a href="'+l[0]+'"'+(isOn(l[0])?' class="on"':"")+">"+l[2]+"</a>"});
nav.innerHTML=h;
}
var t=document.getElementById("navToggle"),bg=null;
function close(){if(nav)nav.classList.remove("open");if(t){t.setAttribute("aria-expanded","false");t.textContent="☰"}if(bg&&bg.parentNode)bg.parentNode.removeChild(bg);bg=null;if(window.innerWidth<=760)document.body.style.overflow=""}
if(t&&nav&&!t.dataset.wired){
t.dataset.wired="1";
t.onclick=function(e){
e.stopPropagation();
var open=nav.classList.toggle("open");
t.setAttribute("aria-expanded",open?"true":"false");
t.textContent=open?"✕":"☰";
if(open){bg=document.createElement("div");bg.style.cssText="position:fixed;inset:0;background:rgba(33,29,20,.4);z-index:85";bg.onclick=close;document.body.appendChild(bg);if(window.innerWidth<=760)document.body.style.overflow="hidden"}
else if(bg&&bg.parentNode){bg.parentNode.removeChild(bg);bg=null}
};
nav.addEventListener("click",function(e){if(e.target.tagName==="A")close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
}
if(!document.querySelector(".tabbar")){
var bar=document.createElement("nav");bar.className="tabbar";bar.setAttribute("aria-label","Primary");
links.forEach(function(l){var a=document.createElement("a");a.href=l[0];if(isOn(l[0]))a.className="on";a.innerHTML="<span>"+l[1]+"</span><span>"+l[2]+"</span>";bar.appendChild(a)});
document.body.appendChild(bar);
}
document.body.classList.add("has-tabbar");
/* lock body scroll only on small screens when menu open */
/* swipe-down to close bottom-sheet modal */
var mb=document.getElementById("modalBack"),sy=0;
if(mb&&!mb.dataset.swipe){
mb.dataset.swipe="1";
mb.addEventListener("touchstart",function(e){sy=e.touches[0].clientY},{passive:true});
mb.addEventListener("touchend",function(e){
var dy=e.changedTouches[0].clientY-sy;
if(dy>110&&!mb.hidden){mb.hidden=true;document.body.style.overflow=""}
},{passive:true});
}
})();
