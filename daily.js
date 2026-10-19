/* daily 10 — date-rotating pack, stable per day */
(function(){
var M=window.MODELS,LW=window._lw;
if(!M||!LW||!window._GH)return;
var $=function(id){return document.getElementById(id)};
function parseDay(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2],12,0,0)}
function fmtDay(s){return parseDay(s).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function packFor(dayStr){
var h=hash("daily10:"+dayStr),n=M.length,out=[],used={};
var step=97+(h%500);
var start=h%n;
for(var k=0;k<10;k++){
var idx=(start+k*step)%n,in2=idx,guard=0;
while(used[in2]&&guard<20){in2=(in2+1)%n;guard++}
used[in2]=1;out.push(M[in2].id);
}
return out;
}
window._DAILY={packFor:packFor,fmtDay:fmtDay,parseDay:parseDay,offset:0,filter:"all"};
function paintDaily(){
if(!$("dailyGrid"))return;
var t=window._GH.dayKey(new Date());
var d=new Date();d.setDate(d.getDate()+window._DAILY.offset);
var day=window._GH.dayKey(d);
var ids=packFor(day);
if($("dailyDate"))$("dailyDate").textContent=fmtDay(day)+(window._DAILY.offset===0?" · today":"");
var done=0,h="";
ids.forEach(function(id){
var m=M[id-1],st=!!LW.studied[id];if(st)done++;
h+='<div class="daily-card'+(st?" done":"")+'" data-id="'+id+'"><span class="tick">'+(st?"✓":"+")
+"</span><span class=\"mn\">№ "+LW.pad(id)+"</span><h4>"+m.name+"</h4><p>"+m.tag+"</p></div>";
});
$("dailyGrid").innerHTML=h;
var cards=$("dailyGrid").querySelectorAll(".daily-card");
for(var i=0;i<cards.length;i++)(function(el){
el.onclick=function(){window.openModal(parseInt(el.dataset.id,10))};
})(cards[i]);
if($("dailyFill"))$("dailyFill").style.width=(100*done/ids.length)+"%";
if($("dailyLabel"))$("dailyLabel").textContent=done+" / "+ids.length+" studied";
}
window._DAILYPAINT=paintDaily;
var pv=$("dailyPrev"),nx=$("dailyNext"),td=$("dailyTodayBtn");
if(pv)pv.onclick=function(){window._DAILY.offset--;paintDaily()};
if(nx)nx.onclick=function(){window._DAILY.offset++;paintDaily()};
if(td)td.onclick=function(){window._DAILY.offset=0;paintDaily()};
document.addEventListener("click",function(e){if(e.target&&e.target.id==="studyBtn")setTimeout(paintDaily,160)});
paintDaily();
})();
