/* Small enhancements: scroll reveal, count-up, draggable board, bookshelf, confetti */
(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{$('#today').textContent=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});$('#yr').textContent=new Date().getFullYear()}catch(e){}
var bar=$('#bar');
addEventListener('scroll',function(){var h=document.documentElement;bar.style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});
function count(el){var to=+el.dataset.to,t0=null;function f(t){t0=t0||t;var p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.count').forEach(count);io.unobserve(e.target)}})},{threshold:.1});
  $$('.rv').forEach(function(el){io.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')});$$('.count').forEach(function(c){c.textContent=c.dataset.to})}

/* cat eyes follow the pointer */
var svg=$('#catsvg'),pups=$$('.pupil');
addEventListener('pointermove',function(e){
  var r=svg.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.43,dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy)||1,m=Math.min(4,d/40);
  pups.forEach(function(p){p.setAttribute('transform','translate('+(dx/d*m)+' '+(dy/d*m*.8)+')')});
},{passive:true});

/* star confetti */
$$('.pop').forEach(function(el){el.addEventListener('click',function(e){
  if(calm||!el.animate)return;
  for(var i=0;i<12;i++){var s=document.createElement('span');s.className='star-pop';s.textContent='★';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';document.body.appendChild(s);
    var a=Math.random()*Math.PI*2,d=50+Math.random()*90;
    s.animate([{transform:'translate(0,0) scale(1) rotate(0)',opacity:1},{transform:'translate('+Math.cos(a)*d+'px,'+(Math.sin(a)*d-30)+'px) scale(.3) rotate('+(Math.random()*360)+'deg)',opacity:0}],{duration:800+Math.random()*400,easing:'ease-out'}).onfinish=(function(n){return function(){n.remove()}})(s);}
})});

/* draggable board */
var desk=$('#desk'),notes=$$('.note'),z=10;
function layout(anim){
  var w=desk.clientWidth,gap=14,nw=Math.min(w*.46,205),cols=Math.max(1,Math.floor((w-gap)/(nw+gap))),rowH=150,rows=Math.ceil(notes.length/cols),cw=(w-gap)/cols;
  desk.style.height=(rows*rowH+80)+'px';
  notes.forEach(function(n,i){
    var c=i%cols,r=Math.floor(i/cols),x=gap+c*cw+Math.random()*Math.max(0,cw-n.offsetWidth-gap)*.5,y=28+r*rowH+Math.random()*14;
    if(anim){n.style.transition='left .6s ease,top .6s ease,transform .2s';setTimeout(function(){n.style.transition=''},700)}
    n.style.left=x+'px';n.style.top=y+'px';
  });
}
layout();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){layout()});
notes.forEach(function(n){
  var drag=false,ox=0,oy=0;
  n.addEventListener('pointerdown',function(e){drag=true;n.setPointerCapture(e.pointerId);var r=n.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;n.style.zIndex=++z;n.classList.add('lift')});
  n.addEventListener('pointermove',function(e){if(!drag)return;var d=desk.getBoundingClientRect(),x=e.clientX-d.left-ox,y=e.clientY-d.top-oy;x=Math.max(0,Math.min(x,d.width-n.offsetWidth));y=Math.max(0,Math.min(y,d.height-n.offsetHeight));n.style.left=x+'px';n.style.top=y+'px'});
  function up(){drag=false;n.classList.remove('lift')}
  n.addEventListener('pointerup',up);n.addEventListener('pointercancel',up);
});
$('#reset').addEventListener('click',function(){layout(true)});

/* bookshelf */
var bks=$$('.bk'),ro=$('#readout');
function show(b){ro.innerHTML='';[['kick',b.dataset.g],['rt',b.dataset.t],['ra','by '+b.dataset.a]].forEach(function(p){var e=document.createElement('span');e.className=p[0];e.textContent=p[1];ro.appendChild(e)})}
bks.forEach(function(b){
  b.addEventListener('mouseenter',function(){show(b)});b.addEventListener('focus',function(){show(b)});
  b.addEventListener('click',function(){var on=b.classList.contains('out');bks.forEach(function(x){x.classList.remove('out')});if(!on){b.classList.add('out')}show(b)});
});
})();
