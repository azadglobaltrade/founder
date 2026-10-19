/* Colophon: 18-discipline table with library deep links */
(function(){
var D=window.DISCIPLINES;
var t=document.getElementById("discTable");if(!t)return;
var h='<tr><th>#</th><th>Discipline</th><th>Plates</th><th>Lens</th><th>Explore</th></tr>';
D.forEach(function(d,i){
  h+="<tr><td>"+(i+1)+"</td><td><b>"+d.e+" "+d.n+"</b></td><td>"+d.c+"</td><td>"+d.d+'</td><td><a href="library.html#d'+i+'">browse</a></td></tr>';
});
t.innerHTML=h;
/* honour #dN deep link target hint on library page */
})();
