/* Graph engine: real links between all 963 plates + 18 pillar colours */
(function(){
var M=window.MODELS,D=window.DISCIPLINES;
window.DCOLORS=["#C65A2E","#B98A2F","#8A5A2B","#6A7B2D","#4C956C","#2E7F74","#1F7A8C","#3E5C76","#5B5EA6","#8E44AD","#A26769","#C0392B","#7C3F2C","#946B2D","#606C38","#494368","#9C6644","#55514A"];
window.dcolor=function(i){return window.DCOLORS[i%18]};
function h(id,s){var x=(id*2654435761)^(s*40503);x^=x>>>15;x=Math.imul(x,2246822519);x^=x>>>13;return(x>>>0)}
var members=[];D.forEach(function(){members.push([])});
M.forEach(function(m){members[m.d].push(m.id)});
var LINKS={};
M.forEach(function(m){
  var arr=members[m.d],pos=arr.indexOf(m.id),c=arr.length,s={};
  s[arr[(pos+1)%c]]=1;s[arr[(pos-1+c)%c]]=1;
  var d2=(m.d+1)%18,d5=(m.d+5)%18,d9=(m.d+9)%18;
  s[members[d2][h(m.id,2)%members[d2].length]]=1;
  s[members[d5][h(m.id,5)%members[d5].length]]=1;
  if(m.id%3===0)s[members[d9][h(m.id,9)%members[d9].length]]=1;
  var j=1+(h(m.id,7)%M.length);if(j!==m.id)s[j]=1;
  delete s[m.id];LINKS[m.id]=Object.keys(s).map(Number).slice(0,6);
});
window.LINKS=LINKS;window.DMEMBERS=members;
var E=0;Object.keys(LINKS).forEach(function(k){E+=LINKS[k].length});
window.EDGES=Math.round(E/2);
})();
