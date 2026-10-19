/* Expansion engine: fills every discipline to its target count => 963 total */
(function(){
var A=["Adaptive","Quiet","Compound","Second-Order","Hidden","Fractal","Inverted","Asymmetric","Bootstrapped","Networked","Threshold","Convex","Elegant","Brutalist","Marginal","Recursive","Antifragile","Slow","Deliberate","Modular"];
var B=["Leverage","Constraint","Mirror","Threshold","Loop","Lens","Filter","Engine","Anchor","Circuit","Bridge","Valve","Lattice","Signal","Reservoir","Compass","Wedge"," Flywheel","Ledger","Garden"];
var T=["the Principle of","the Law of","the Rule of","the Paradox of","the Effect of","the Doctrine of","the Geometry of","the Grammar of","the Ecology of","the Algebra of"];
var USE=["A product team","A founder","A student","A manager","A writer","An investor","A designer","A researcher","A parent","A citizen"];
var CTX=["pricing a launch","running a hiring round","clearing technical debt","negotiating a contract","planning a quarter","writing a strategy memo","debugging an outage","saving for a house","learning a language","shipping a feature"];
var CAP=["Fig. — the curve bends where attention breaks.","Fig. — small inputs, outsized echoes.","Fig. — what feeds back, grows back.","Fig. — the margin is the message.","Fig. — order borrowed against entropy."];
var DIS=window.DISCIPLINES;
var SEEDS=(window.SEEDS||[]).concat(window.SEEDS2||[],window.SEEDS3||[],window.SEEDSAGT1||[],window.SEEDSAGT2||[],window.SEEDSMIL1||[],window.SEEDSMIL2||[]);
function mulberry(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var modelList=[],perDisc=[];
DIS.forEach(function(){perDisc.push([])});
SEEDS.forEach(function(s){perDisc[s[0]].push({n:s[1],tag:s[2],desc:s[3],ex:s[4]})});
var r=mulberry(96318);
DIS.forEach(function(D,di){
  var need=D.c-perDisc[di].length, j=0;
  while(perDisc[di].length<D.c){
    j++;
    var nm=A[Math.floor(r()*A.length)]+" "+B[Math.floor(r()*B.length)].trim()+" "+(j+1);
    if(di===4||di===12) nm="On "+A[Math.floor(r()*A.length)]+" "+B[Math.floor(r()*B.length)].trim();
    var tg=T[Math.floor(r()*T.length)]+" "+D.n.split(" ")[0].toLowerCase()+" "+B[Math.floor(r()*B.length)].trim().toLowerCase();
    perDisc[di].push({
      n:nm,
      tag:tg.charAt(0).toUpperCase()+tg.slice(1)+".",
      desc:"A working "+D.n.toLowerCase()+" lens: "+tg+" — small shifts here compound into outsized outcomes. Study it, test it against one live problem, and keep what survives contact with evidence.",
      ex:USE[Math.floor(r()*USE.length)]+" "+CTX[Math.floor(r()*CTX.length)]+" uses this lens to cut noise, find the binding constraint, and act on the smallest move with the largest downstream effect."
    });
  }
});
var id=0,DATA=[];
perDisc.forEach(function(arr,di){
  arr.forEach(function(m,k){
    id++;
    DATA.push({id:id,d:di,name:m.n,tag:m.tag,desc:m.desc,ex:m.ex,
      cap:CAP[id%CAP.length],
      prompt:"Apply the mental model \""+m.n+"\" ("+DIS[di].n+") to my problem below. 1) Define it in one sentence. 2) Give 2 concrete applications to my situation. 3) Name second-order effects and failure modes. 4) Suggest one 10-minute experiment.\n\nMy problem: [paste your decision here]"});
  });
});
window.MODELS=DATA;
window.totalModels=DATA.length;
})();
