/* growth paint part 2 — ring + week chart */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw;
if(!D||!M||!LW||!window._GH)return;
var $=function(id){return document.getElementById(id)};
var GH=window._GH;
function counts(){
var h=GH.getHist(),t=GH.dayKey(new Date()),today=0,week=0;
var days=[];for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);days.push(GH.dayKey(d))}
var per={};days.forEach(function(k){per[k]=0});
Object.keys(h).forEach(function(id){
var k=h[id];if(per[k]!==undefined)per[k]++;if(k===t)today++;
var diff=(new Date(t)-new Date(k))/864e5;if(diff>=0&&diff<7)week++;
});
return{today:today,week:week,per:per,days:days,hist:h};
}
function streak(hist){
var s=0,d=new Date(),tk=GH.dayKey(d);
var has=function(k){for(var id in hist){if(hist[id]===k)return true}return false};
if(!has(tk)){d.setDate(d.getDate()-1);tk=GH.dayKey(d);if(!has(tk))return 0}
while(has(tk)){s++;d.setDate(d.getDate()-1);tk=GH.dayKey(d)}
return s;
}
window._GCOUNT={counts:counts,streak:streak};
function ago(ts){
var s=Math.floor((Date.now()-ts)/1000);
if(s<60)return"just now";
if(s<3600)return Math.floor(s/60)+"m ago";
if(s<86400)return Math.floor(s/3600)+"h ago";
return Math.floor(s/86400)+"d ago";
}
function paintHead(c,st,n,total,goal){
var gt=$("growthTitle"),gs=$("growthSub"),ml=$("memoryLine");
var mem=window._MEM||{events:[]},evs=mem.events||[];
var last=evs.length?evs[evs.length-1]:null;
if(gt){
if(!n)gt.textContent="Start your growth streak.";
else if(st>=7)gt.textContent="🔥 "+st+"-day streak — unstoppable.";
else if(st>=2)gt.textContent="🔥 "+st+"-day streak — keep it alive.";
else if(c.today>0)gt.textContent="Nice — "+c.today+" studied today.";
else gt.textContent="Welcome back — grow one plate today.";
}
if(gs){
if(!n)gs.textContent="Mark your first plate studied and this dashboard starts remembering every step.";
else if(c.today>=goal)gs.textContent="Daily goal smashed ("+c.today+"/"+goal+"). Your journal remembers all "+evs.length+" study events.";
else gs.textContent=(goal-c.today)+" more to hit today's goal of "+goal+". Your journal remembers all "+evs.length+" study events.";
}
if(ml){
var f=mem.firstSeen||GH.dayKey(new Date());
ml.textContent="🧠 memory: since "+f+" · "+evs.length+" events"+(last?(" · last "+ago(last.ts)):"")+" · never erased by unmarking";
}
}
function paint(){
if(!$("growth"))return;
var c=counts(),st=streak(c.hist),total=M.length,n=Object.keys(LW.studied).length;
var goal=GH.getGoal();
paintHead(c,st,n,total,goal);
var C=326.7,ring=$("ringFg");
if(ring)ring.style.strokeDashoffset=String(C*(1-n/total));
if($("ringNum"))$("ringNum").textContent=Math.round(100*n/total)+"%";
if($("ringLabel"))$("ringLabel").textContent=n+" / "+total+" studied";
if($("streakLabel"))$("streakLabel").textContent="🔥 "+st+"-day streak";
if($("gToday"))$("gToday").textContent=c.today;
if($("gWeek"))$("gWeek").textContent=c.week;
if($("gStreak"))$("gStreak").textContent=st;
if($("goalInput")&&document.activeElement!==$("goalInput"))$("goalInput").value=goal;
if($("gGoalPct"))$("gGoalPct").textContent=Math.min(100,Math.round(100*c.today/Math.max(1,goal)))+"%";
if($("goalMsg"))$("goalMsg").textContent=c.today>=goal?("✓ Goal smashed ("+c.today+"/"+goal+")."):(("📈 "+(goal-c.today)+" more to hit "+goal+"/day."));
var wc=$("weekChart");
if(wc){
var max=1;c.days.forEach(function(k){max=Math.max(max,c.per[k])});
var h="";
c.days.forEach(function(k){
var v=c.per[k],pctH=Math.max(7,Math.round(100*v/max));
var dt=new Date(k+"T12:00:00"),wd="SMTWTFS"[dt.getDay()];
var cls=v>=goal?"bar hot":(v>0?"bar warm":"bar");
h+='<div class="day"><b>'+v+'</b><div class="'+cls+'" style="height:'+pctH+'px"></div><span>'+wd+"</span></div>";
});
wc.innerHTML=h;
if($("weekLabel"))$("weekLabel").textContent=c.week+" in last 7 days · best "+max;
}
var dp=$("discProg");
if(dp){
var per2=[];D.forEach(function(){per2.push(0)});
M.forEach(function(m){if(LW.studied[m.id])per2[m.d]++});
var rows=D.map(function(d,i){return{i:i,d:d,done:per2[i]}}).sort(function(a,b){return(a.done/a.d.c)-(b.done/b.d.c)});
var dh="";
rows.forEach(function(r){
var p=Math.round(100*r.done/r.d.c);
dh+='<div class="drow"><span class="t">'+r.d.e+" "+r.d.n+'</span><span class="n">'+r.done+"/"+r.d.c+" · "+p+'%</span><span class="pbar"><i style="width:'+p+'%"></i></span></div>';
});
dp.innerHTML=dh;
}
var ng=$("nextGrid");
if(ng){
var un=M.filter(function(m){return!LW.studied[m.id]});
var weak={};
D.forEach(function(d,i){var t2=M.filter(function(m){return m.d===i&&LW.studied[m.id]}).length;weak[i]=t2/d.c});
un.sort(function(a,b){return weak[a.d]-weak[b.d]||a.id-b.id});
var nh="";
un.slice(0,4).forEach(function(m){
nh+='<div class="mini-card" data-id="'+m.id+'"><span class="mn">№ '+LW.pad(m.id)+"</span><h4>"+m.name+"</h4><p>"+m.tag+"</p></div>";
});
if(!un.length)nh='<p style="font-size:13px">🎉 All 963 done. Full lattice built.</p>';
ng.innerHTML=nh;
var cards=ng.querySelectorAll(".mini-card");
for(var i=0;i<cards.length;i++)(function(el){el.onclick=function(){window.openModal(parseInt(el.dataset.id,10))}})(cards[i]);
}
}
window._GROWTH=paint;
document.addEventListener("click",function(e){if(e.target&&e.target.id==="studyBtn")setTimeout(paint,150)});
var g=$("goalSave");
if(g)g.onclick=function(){var v=parseInt(($("goalInput").value||"").replace(/[^0-9]/g,""),10);if(!v||v<1)v=1;if(v>50)v=50;GH.setGoal(v);paint();if(window._toast)window._toast("Daily goal: "+v+"/day")};
var cb=$("continueBtn");
if(cb)cb.onclick=function(){
var un2=M.filter(function(m){return!LW.studied[m.id]});
if(!un2.length){if(window._toast)window._toast("All studied");return}
var same=-1;
try{var ids=Object.keys(LW.studied).map(Number);if(ids.length)same=M[Math.max.apply(null,ids)-1].d}catch(e){}
var nxt=null;for(var j=0;j<un2.length;j++){if(un2[j].d===same){nxt=un2[j];break}}
window.openModal((nxt||un2[0]).id);
};
var tb=$("todayBtn");
if(tb)tb.onclick=function(){
var t=GH.dayKey(new Date()),seed=0;
for(var k=0;k<t.length;k++)seed+=t.charCodeAt(k);
var un3=M.filter(function(m){return!LW.studied[m.id]});
var pool=un3.length?un3:M;
window.openModal(pool[(seed*7919)%pool.length].id);
};
var eb=$("exportBtn");
if(eb)eb.onclick=function(){
var blob=new Blob([JSON.stringify(window._MEM||{},null,2)],{type:"application/json"});
var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="latticework-memory.json";a.click();
setTimeout(function(){URL.revokeObjectURL(a.href)},2000);
if(window._toast)window._toast("Memory exported");
};
var rb=$("resetBtn");
if(rb)rb.onclick=function(){
if(!confirm("Erase growth memory + studied progress on this device?"))return;
try{localStorage.removeItem("lw-memory-v1");localStorage.removeItem("lw-history");localStorage.removeItem("lw-studied");localStorage.removeItem("lw-goal")}catch(e){}
location.reload();
};
paint();
})();
