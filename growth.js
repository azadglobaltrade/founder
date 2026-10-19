/* growth tracking part 1 — append-only memory + live header */
(function(){
var D=window.DISCIPLINES,M=window.MODELS,LW=window._lw;
if(!D||!M||!LW)return;
var MEM_KEY="lw-memory-v1",HIST_KEY="lw-history",GOAL_KEY="lw-goal";
function dayKey(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function today(){return dayKey(new Date())}
function loadMem(){
try{
var m=JSON.parse(localStorage.getItem(MEM_KEY)||"null");
if(m&&m.events&&m.firstSeen)return m;
}catch(e){}
var legacy={};
try{legacy=JSON.parse(localStorage.getItem(HIST_KEY)||"{}")}catch(e2){legacy={}}
var evs=[];
Object.keys(legacy).forEach(function(id){
evs.push({id:+id,day:legacy[id]||today(),ts:Date.now(),kind:"studied"});
});
var mem={v:1,firstSeen:today(),goal:3,events:evs};
try{localStorage.setItem(MEM_KEY,JSON.stringify(mem))}catch(e3){}
return mem;
}
function saveMem(mem){try{localStorage.setItem(MEM_KEY,JSON.stringify(mem))}catch(e){}}
if(!window._MEM)window._MEM=loadMem();
if(!window._MEM.revised)window._MEM.revised={};
function logEvent(id,kind){
var mem=window._MEM;
mem.events.push({id:+id,day:today(),ts:Date.now(),kind:kind||"studied"});
if(mem.events.length>5000)mem.events=mem.events.slice(-5000);
saveMem(mem);
syncHistory();
}
function syncHistory(){
var h={};
window._MEM.events.forEach(function(e){if(e.kind==="studied")h[e.id]=e.day});
try{localStorage.setItem(HIST_KEY,JSON.stringify(h))}catch(e2){}
}
function getHist(){syncHistory();try{return JSON.parse(localStorage.getItem(HIST_KEY)||"{}")}catch(e){return{}}}
function setHist(h){try{localStorage.setItem(HIST_KEY,JSON.stringify(h))}catch(e){}}
function getGoal(){return window._MEM.goal||3}
function setGoal(g){window._MEM.goal=g;saveMem(window._MEM)}
window._GH={dayKey:dayKey,getHist:getHist,setHist:setHist,getGoal:getGoal,setGoal:setGoal,log:logEvent,mem:function(){return window._MEM}};
/* detect newly-studied ids on every save and journal them (never delete history) */
var seen={};
Object.keys(LW.studied).forEach(function(id){seen[id]=1});
var rawSave=LW.save;
LW.save=function(){
var fresh=[];
Object.keys(LW.studied).forEach(function(id){if(!seen[id]){fresh.push(id);seen[id]=1}});
Object.keys(seen).forEach(function(id){if(!LW.studied[id])delete seen[id]});
fresh.forEach(function(id){logEvent(id,"studied")});
rawSave();
if(window._GROWTH)window._GROWTH();
if(window._DAILYPAINT)window._DAILYPAINT();
if(window._REVPAINT)window._REVPAINT();
if(window._AGTPAINT)window._AGTPAINT();
if(window._MILPAINT)window._MILPAINT();
};
syncHistory();
})();
