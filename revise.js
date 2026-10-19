/* revision queue — spaced repetition 3/7/18/30 */
(function(){
var M=window.MODELS,LW=window._lw;
if(!M||!LW||!window._GH)return;
var $=function(id){return document.getElementById(id)};
var GAPS=[3,7,18,30];
function parseDay(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2],12,0,0)}
function addDays(s,n){var d=parseDay(s);d.setDate(d.getDate()+n);return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function diffDays(a,b){return Math.round((parseDay(a)-parseDay(b))/864e5)}
function learnedDates(){
var out={};
try{
var mem=window._MEM||{events:[]};
mem.events.forEach(function(e){if(e.kind==="studied"&&!out[e.id])out[e.id]=e.day});
}catch(e2){}
var h={};try{h=window._GH.getHist()}catch(e3){h={}}
Object.keys(h).forEach(function(id){if(!out[id])out[id]=h[id]});
return out;
}
function revisedSet(){
try{var m=window._MEM||{revised:{}};return m.revised||{}}catch(e){return{}}
}
function saveRevised(r){try{window._MEM.revised=r;localStorage.setItem("lw-memory-v1",JSON.stringify(window._MEM))}catch(e){}}
function dueList(){
var learned=learnedDates(),today=window._GH.dayKey(new Date()),rows=[];
Object.keys(learned).forEach(function(id){
var base=learned[id];
GAPS.forEach(function(g){
var due=addDays(base,g),d=diffDays(today,due);
var key=id+":"+g,rev=revisedSet()[key];
if(rev)return;
rows.push({id:+id,gap:g,due:due,late:d,base:base});
});
});
rows.sort(function(a,b){return a.late===b.late?(a.due<b.due?-1:1):(b.late-a.late)});
return rows;
}
window._REV={gaps:GAPS,due:dueList,learned:learnedDates};
function paintRev(){
if(!$("revList"))return;
var rows=dueList(),today=window._GH.dayKey(new Date());
var f=(window._DAILY&&window._DAILY.filter)||"all";
var counts={all:rows.length,due:0,week:0,done30:0};
rows.forEach(function(r){if(r.late>=0)counts.due++;if(r.late>=-7)counts.week++});
try{counts.done30=Object.keys(revisedSet()).length}catch(e){}
var sh="";
sh+='<button class="rev-chip'+(f==="all"?" on":"")+'" data-f="all">all · '+counts.all+"</button>";
sh+='<button class="rev-chip'+(f==="due"?" on":"")+(counts.due?" over":"")+'" data-f="due">due now · '+counts.due+"</button>";
sh+='<button class="rev-chip'+(f==="week"?" on":"")+'" data-f="week">due ±7d · '+counts.week+"</button>";
if($("revStats"))$("revStats").innerHTML=sh;
var chips=$("revStats").querySelectorAll(".rev-chip");
for(var ci=0;ci<chips.length;ci++)(function(el){el.onclick=function(){window._DAILY.filter=el.dataset.f;paintRev()}})(chips[ci]);
var list=rows.filter(function(r){
if(f==="due")return r.late>=0;
if(f==="week")return r.late>=-7;
return true;
}).slice(0,12);
if(!Object.keys(learnedDates()).length){
$("revList").innerHTML='<div class="rev-empty">📚 No learned plates yet. Study today\'s 10 above — each one will reappear here after <b>3, 7, 18 and 30 days</b> so you never forget it. Dates are computed from today\'s real date.</div>';
if($("revSub"))$("revSub").textContent="Learn a plate and it returns after 3, 7, 18 and 30 days. Today is "+today+".";
return;
}
if(!list.length){
$("revList").innerHTML='<div class="rev-empty">🎉 Nothing in this view. '+(f==="due"?"No revisions due today — come back tomorrow or study today's 10.":"All caught up!")+"</div>";
return;
}
var h="";
list.forEach(function(r){
var m=M[r.id-1];
var when=r.late>0?(r.late+"d overdue"):r.late===0?"due today":("in "+(-r.late)+"d");
var cls=r.late>=0?"now":(r.late>=-7?"soon":"later");
h+='<div class="rev-row" data-id="'+r.id+'"><span class="rt">№ '+LW.pad(r.id)+" · "+m.name+'</span><span class="due '+cls+'">'+when+" · +"+r.gap+'d</span><span class="rs">learned '+r.base+" → due "+r.due+" · "+m.tag+'</span><button class="rev-check" data-k="'+r.id+":"+r.gap+'">✓ mark revised</button></div>';
});
$("revList").innerHTML=h;
var cards=$("revList").querySelectorAll(".rev-row");
for(var i=0;i<cards.length;i++)(function(el){
el.onclick=function(e){
if(e.target&&e.target.className==="rev-check"){
var rs=revisedSet();rs[e.target.dataset.k]=today;saveRevised(rs);paintRev();
if(window._toast)window._toast("Revision logged ✓");
return;
}
window.openModal(parseInt(el.dataset.id,10));
};
})(cards[i]);
if($("revSub"))$("revSub").textContent=list.length+" shown · "+counts.due+" due now · today is "+today+". Tap a row to revise, ✓ when done.";
}
window._REVPAINT=paintRev;
document.addEventListener("click",function(e){if(e.target&&e.target.id==="studyBtn")setTimeout(paintRev,200)});
paintRev();
})();
