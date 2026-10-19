/* Lattice A — layout + physics state */
(function(){
var D=window.DISCIPLINES,M=window.MODELS;
var W=1400,H=900;
var P={showLinks:true,showLabels:true,motion:true,studiedOnly:false,mode:"all",q:"",focusDisc:-1,sel:null,hov:null,px:0,py:0,z:1,drag:null,dragN:null,moved:false,downX:0,downY:0};
var pillars=[],nodes=[],byId={};
function hsh(id,s){var x=(id*2654435761)^(s*40503);x^=x>>>15;x=Math.imul(x,2246822519);x^=x>>>13;return(x>>>0)}
D.forEach(function(d,i){
  var a=(i/18)*Math.PI*2-Math.PI/2;
  pillars.push({i:i,x:W/2+Math.cos(a)*430,y:H/2+Math.sin(a)*300,cx:W/2+Math.cos(a)*430,cy:H/2+Math.sin(a)*300});
});
M.forEach(function(m){
  var p=pillars[m.d],members=window.DMEMBERS[m.d],k=members.indexOf(m.id);
  var a=(k/members.length)*Math.PI*2+hsh(m.id,3)%100/100;
  var rr=70+((k*47)%70)+members.length*0.55;
  nodes.push({m:m,x:p.cx+Math.cos(a)*rr*1.5,y:p.cy+Math.sin(a)*rr,
    vx:0,vy:0,ph:hsh(m.id,11)%628/100,ax:0,ay:0});
});
nodes.forEach(function(n){byId[n.m.id]=n});
function step(){
  if(P.motion){
    nodes.forEach(function(n){
      var p=pillars[n.m.d];
      n.vx+=(p.x-n.x)*0.0035;n.vy+=(p.y-n.y)*0.0035;
      n.vx+=Math.cos(n.ph+=0.012)*0.05;n.vy+=Math.sin(n.ph)*0.05;
      n.vx*=0.90;n.vy*=0.90;
      if(P.dragN!==n){n.x+=n.vx;n.y+=n.vy}
    });
  } else if(P.dragN){P.dragN.x+=P.dragN.vx=0;P.dragN.y+=P.dragN.vy=0}
}
window._LAT={W:W,H:H,P:P,pillars:pillars,nodes:nodes,byId:byId,step:step};
})();
