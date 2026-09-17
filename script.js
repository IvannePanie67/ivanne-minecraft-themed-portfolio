const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("hide"), 750);
  $("#worldVideo")?.play().catch(()=>{});
});

// Floating pixel particles
const particles = $("#particles");
for(let i=0;i<34;i++){
  const p=document.createElement("i");
  p.className="particle";
  p.style.left=(Math.random()*100)+"%";
  p.style.animationDuration=(7+Math.random()*14)+"s";
  p.style.animationDelay=(-Math.random()*18)+"s";
  p.style.opacity=(.18+Math.random()*.5).toFixed(2);
  p.style.transform=`scale(${.5+Math.random()*1.7})`;
  particles?.appendChild(p);
}

// Mobile navigation
const menu=$("#menuBtn"), nav=$("#nav");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
$$("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

// Reveal-on-scroll
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target);}
  });
},{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

// Active section + XP progression
const sections=$$("main section[id]");
const links=$$("nav a");
const xpBar=$("#xpBar"), xpValue=$("#xpValue");
const updateProgress=()=>{
  const scrollTop=window.scrollY;
  const doc= document.documentElement.scrollHeight-window.innerHeight;
  const pct=doc>0 ? Math.round((scrollTop/doc)*100) : 0;
  xpBar.style.width=pct+"%"; xpValue.textContent=pct+"%";
  let current="home";
  sections.forEach(s=>{if(scrollTop>=s.offsetTop-180) current=s.id;});
  links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
};
window.addEventListener("scroll",updateProgress,{passive:true});
updateProgress();

// Music: uses the audio file supplied with the portfolio.
// Browsers generally require a tap before audio can start.
const music=$("#bgMusic"), musicBtn=$("#musicBtn"), dock=document.querySelector(".music-dock"), status=$("#musicStatus");
async function toggleMusic(){
  if(!music) return;
  if(music.paused){
    try{
      await music.play();
      musicBtn.classList.add("playing"); dock.classList.add("playing");
      status.textContent="ON • LOOPING";
    }catch(err){
      status.textContent="TAP AGAIN TO PLAY";
    }
  }else{
    music.pause();
    musicBtn.classList.remove("playing"); dock.classList.remove("playing");
    status.textContent="OFF • TAP TO PLAY";
  }
}
musicBtn?.addEventListener("click",toggleMusic);
music?.addEventListener("ended",()=>{music.currentTime=0;music.play().catch(()=>{});});

// Certificate inspector
const modal=$("#certModal"), modalImg=$("#modalImg"), modalTitle=$("#modalTitle"), modalSub=$("#modalSub");
$$(".cert-card").forEach(card=>{
  card.addEventListener("click",()=>{
    modalImg.src=card.dataset.img;
    modalImg.alt=card.dataset.title;
    modalTitle.textContent=card.dataset.title;
    modalSub.textContent=card.dataset.sub;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  });
});
function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
$$("[data-close]").forEach(x=>x.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape") closeModal();});

// Back to top
$("#topBtn")?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

// Small parallax effect for the world video on desktop
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  window.addEventListener("mousemove",e=>{
    const x=(e.clientX/window.innerWidth-.5)*2;
    const y=(e.clientY/window.innerHeight-.5)*2;
    const video=$("#worldVideo");
    if(video && window.innerWidth>900) video.style.transform=`scale(1.04) translate(${x*3}px,${y*3}px)`;
  },{passive:true});
}
