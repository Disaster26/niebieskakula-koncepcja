(function(){
  var CK_KEY='nk_cookies_v1';
  document.querySelectorAll('.yr').forEach(function(e){e.textContent=new Date().getFullYear();});

  /* menu mobilne */
  var nav=document.getElementById('nav'),bur=document.getElementById('burger');
  if(bur){bur.addEventListener('click',function(){var o=nav.classList.toggle('open');bur.setAttribute('aria-expanded',o);bur.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.style.overflow=o?'hidden':'';});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');bur.setAttribute('aria-expanded','false');document.body.style.overflow='';});});}

  /* aktywna pozycja menu = bieżąca sekcja */
  var links=[].slice.call(document.querySelectorAll('.nav a[href^="#"]:not(.navcta)'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  function spy(){var y=window.scrollY+window.innerHeight*0.35,cur=null;secs.forEach(function(s){if(s.offsetTop<=y)cur=s;});
    links.forEach(function(a){a.classList.toggle('on',!!cur&&a.getAttribute('href')==='#'+cur.id);});}
  window.addEventListener('scroll',spy,{passive:true});spy();

  /* pasek dolny po przewinięciu za przycisk w pierwszym ekranie */
  var mob=document.getElementById('mob'),cta=document.getElementById('heroCta');
  if(mob&&cta&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var e=en[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);}).observe(cta);}

  /* przeciąganie myszą (rzędy i galerie) */
  function dragScroll(r,snap){
    var down=false,sx=0,sl=0,moved=false;
    r.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=r.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;r.classList.add('drag');}r.scrollLeft=sl-dx;});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;r.classList.remove('drag');if(moved)snap();});
    r.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
    r.addEventListener('dragstart',function(e){e.preventDefault();});
  }
  function idx(r){var k=0,best=1e9;[].forEach.call(r.children,function(c,i){var d=Math.abs(c.offsetLeft-r.children[0].offsetLeft-r.scrollLeft);if(d<best){best=d;k=i;}});
    if(r.scrollLeft+r.clientWidth>=r.scrollWidth-4)k=r.children.length-1;return k;}
  function go(r,i){i=Math.max(0,Math.min(r.children.length-1,i));r.scrollTo({left:r.children[i].offsetLeft-r.children[0].offsetLeft,behavior:'smooth'});}
  document.querySelectorAll('.rail').forEach(function(r){
    var ctl=document.querySelector('.rail-ctl[data-for="'+r.id+'"]');
    dragScroll(r,function(){go(r,idx(r));});
    function upd(){if(ctl)ctl.querySelector('.cnt').textContent=(idx(r)+1)+' / '+r.children.length;}
    if(ctl){ctl.querySelector('.prev').addEventListener('click',function(){go(r,idx(r)-1);});ctl.querySelector('.next').addEventListener('click',function(){go(r,idx(r)+1);});}
    r.addEventListener('scroll',upd,{passive:true});
    r.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(r,idx(r)+1);e.preventDefault();}if(e.key==='ArrowLeft'){go(r,idx(r)-1);e.preventDefault();}});
    upd();
  });
  document.querySelectorAll('.gal').forEach(function(g){
    var t=g.querySelector('.gal-track'),c=g.querySelector('.cnt');
    dragScroll(t,function(){go(t,idx(t));});
    function upd(){c.textContent=(idx(t)+1)+' / '+t.children.length;}
    g.querySelector('.p').addEventListener('click',function(){go(t,idx(t)-1);});
    g.querySelector('.n').addEventListener('click',function(){var i=idx(t);go(t,i>=t.children.length-1?0:i+1);});
    t.addEventListener('scroll',upd,{passive:true});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(t,idx(t)+1);e.preventDefault();}if(e.key==='ArrowLeft'){go(t,idx(t)-1);e.preventDefault();}});
  });

  /* temat w formularzu z przycisku */
  document.querySelectorAll('[data-temat]').forEach(function(a){a.addEventListener('click',function(){var s=document.getElementById('temat');if(s)s.value=a.getAttribute('data-temat');});});

  /* formularz pokazowy */
  var f=document.getElementById('form');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var m=document.getElementById('formMsg');
    if(!f.checkValidity()){m.textContent='Uzupełnij imię, e-mail i zaznacz zgodę.';return;}
    m.textContent='To podgląd strony - po wdrożeniu formularz wyśle wiadomość na biuro@niebieskakula.pl.';});

  /* baner cookies */
  var ck=document.getElementById('ck');
  function read(){try{var v=JSON.parse(localStorage.getItem(CK_KEY)||'null');if(v&&Date.now()-v.t<365*864e5)return v;}catch(e){}return null;}
  function save(a,m){try{localStorage.setItem(CK_KEY,JSON.stringify({a:a,m:m,t:Date.now()}));}catch(e){}ck.classList.remove('show','more');}
  if(ck){
    if(!read())ck.classList.add('show');
    ck.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var k=b.getAttribute('data-ck');
      if(k==='all')save(true,true);
      else if(k==='min')save(false,false);
      else if(k==='more'){if(ck.classList.contains('more')){save(document.getElementById('ckA').checked,document.getElementById('ckM').checked);}else{ck.classList.add('more');b.textContent='Zapisz wybór';}}});
    document.querySelectorAll('[data-ck-open]').forEach(function(b){b.addEventListener('click',function(){var v=read();if(v){document.getElementById('ckA').checked=v.a;document.getElementById('ckM').checked=v.m;}ck.classList.add('show','more');var mb=ck.querySelector('[data-ck="more"]');if(mb)mb.textContent='Zapisz wybór';});});
  }
})();
