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

/* =========================================================
   BIOME ENGINE — items, mobs, environment labels & themes
   ========================================================= */
const biomeData={
  plains:{name:"PLAINS",tip:"Overworld spawn • peaceful build zone",entities:["pig","apple","pickaxe","diamond"],accent:"grass"},
  lush:{name:"LUSH CAVES",tip:"Glow berries • exploration • hidden ideas",entities:["zombie","diamond","pickaxe","apple"],accent:"lush"},
  nether:{name:"NETHER",tip:"High heat • high risk • high creativity",entities:["ghast","sword","pickaxe","diamond"],accent:"nether"},
  cherry:{name:"CHERRY GROVE",tip:"Calm builds • creativity • free-time quests",entities:["pig","apple","diamond","sword"],accent:"cherry"},
  end:{name:"THE END",tip:"Achievements unlocked • final boss energy",entities:["enderman","ender-pearl","diamond","sword"],accent:"end"},
  ocean:{name:"DEEP OCEAN",tip:"Portal destination • let's build what comes next",entities:["diamond","apple","sword","ender-pearl"],accent:"ocean"}
};
const minecraftEntities={
  creeper:{type:"mob",label:"CREEPER",src:"assets/minecraft/creeper.svg"},
  pig:{type:"mob",label:"PIG",src:"assets/minecraft/pig.svg"},
  zombie:{type:"mob",label:"ZOMBIE",src:"assets/minecraft/zombie.svg"},
  enderman:{type:"mob",label:"ENDERMAN",src:"assets/minecraft/enderman.svg"},
  ghast:{type:"mob",label:"GHAST",src:"assets/minecraft/ghast.svg"},
  sword:{type:"item",label:"DIAMOND SWORD",src:"assets/minecraft/sword.svg"},
  pickaxe:{type:"item",label:"PICKAXE",src:"assets/minecraft/pickaxe.svg"},
  diamond:{type:"item",label:"DIAMOND",src:"assets/minecraft/diamond.svg"},
  apple:{type:"item",label:"APPLE",src:"assets/minecraft/apple.svg"},
  "ender-pearl":{type:"item",label:"ENDER PEARL",src:"assets/minecraft/ender-pearl.svg"}
};

function spawnBiomeFX(section){
  if(section.querySelector(".biome-fx")) return;
  const type=section.dataset.biome;
  const layer=document.createElement("div");
  layer.className="biome-fx";
  const names=biomeData[type]?.entities||["diamond","pickaxe"];
  const count=window.innerWidth<700?4:6;
  for(let i=0;i<count;i++){
    const key=names[i%names.length];
    const data=minecraftEntities[key];
    if(!data) continue;
    const e=document.createElement("div");
    e.className="pixel-entity "+data.type;
    e.style.left=(6+Math.random()*88)+"%";
    e.style.top=(8+Math.random()*76)+"%";
    e.style.setProperty("--size",(32+Math.random()*26)+"px");
    e.style.setProperty("--dur",(5+Math.random()*7)+"s");
    e.style.setProperty("--delay",(-Math.random()*8)+"s");
    const img=document.createElement("img");
    img.className="entity-image";
    img.src=data.src;
    img.alt="";
    img.draggable=false;
    const label=document.createElement("span");
    label.className="entity-name";
    label.textContent=data.label;
    e.append(img,label);
    layer.appendChild(e);
  }
  if(type==="ocean"||type==="lush"){
    for(let i=0;i<9;i++){
      const b=document.createElement("span");
      b.className="pixel-entity bubble";
      b.style.left=(5+Math.random()*90)+"%";
      b.style.top=(50+Math.random()*45)+"%";
      b.style.setProperty("--dur",(4+Math.random()*5)+"s");
      b.style.setProperty("--delay",(-Math.random()*7)+"s");
      b.innerHTML=`<span class="entity-icon">•</span>`;
      layer.appendChild(b);
    }
  }
  const stack=document.createElement("div");
  stack.className="block-stack";
  layer.appendChild(stack);
  section.prepend(layer);
}
$$('.biome-section').forEach(spawnBiomeFX);

const biomeName=$("#biomeName"), biomeTip=$("#biomeTip"), biomeHud=document.querySelector(".biome-hud");
const biomeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && entry.intersectionRatio>.28){
      const data=biomeData[entry.target.dataset.biome];
      if(data){
        biomeName.textContent=data.name;
        biomeTip.textContent=data.tip;
        biomeHud.style.setProperty("--biome-a",getComputedStyle(entry.target).getPropertyValue("--biome-a"));
      }
    }
  });
},{threshold:[.28,.55]});
$$(".biome-section").forEach(s=>biomeObserver.observe(s));

// Light / dark mode, persisted locally.
const themeToggle=$("#themeToggle"), themeLabel=$("#themeLabel");
function setTheme(light){
  document.body.classList.toggle("light-mode",light);
  if(themeLabel) themeLabel.textContent=light?"DAY MODE":"NIGHT MODE";
  localStorage.setItem("kyne-theme",light?"light":"dark");
}
const savedTheme=localStorage.getItem("kyne-theme");
setTheme(savedTheme==="light");
themeToggle?.addEventListener("click",()=>setTheme(!document.body.classList.contains("light-mode")));

// Minecraft-style block cursor and interactive item pickup sparks
const blockCursor=$("#blockCursor");
window.addEventListener("mousemove",e=>{
  if(blockCursor){
    blockCursor.style.left=e.clientX+"px";blockCursor.style.top=e.clientY+"px";blockCursor.style.opacity=".55";
  }
},{passive:true});
window.addEventListener("mouseleave",()=>{if(blockCursor) blockCursor.style.opacity="0"});
document.addEventListener("click",e=>{
  if(e.target.closest("a,button,input,textarea")) return;
  const burst=document.createElement("div");
  burst.className="pickup-burst";
  burst.style.left=e.clientX+"px";burst.style.top=e.clientY+"px";
  burst.innerHTML="<i>✦</i><i>◆</i><i>✦</i><i>•</i>";
  document.body.appendChild(burst);
  setTimeout(()=>burst.remove(),700);
});

// Section-aware video tint and depth shift
const biomeSections=$$(".biome-section");
const tintObserver=new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const cs=getComputedStyle(en.target);
      document.documentElement.style.setProperty("--active-biome",cs.getPropertyValue("--biome-a"));
      document.documentElement.style.setProperty("--active-glow",cs.getPropertyValue("--section-glow"));
    }
  });
},{threshold:.35});
biomeSections.forEach(s=>tintObserver.observe(s));

// Add subtle 3D tilt to cards without affecting touch screens.
if(window.matchMedia("(pointer:fine)").matches){
  $$(".skill-card,.cert-card,.player-card,.contact-panel").forEach(card=>{
    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-2.2}deg) rotateY(${x*2.2}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave",()=>card.style.transform="");
  });
}

/* =========================================================
   ADVENTURE SYSTEM — map, hotbar, coordinates, advancements
   ========================================================= */
const journey = [
  {id:"home", biome:"plains", title:"Getting Started", text:"Entered the portfolio world.", icon:"assets/minecraft/apple.svg", coords:"0, 72, 0"},
  {id:"about", biome:"lush", title:"Into the Caves", text:"Discovered the player lore chamber.", icon:"assets/minecraft/pickaxe.svg", coords:"38, 54, -21"},
  {id:"skills", biome:"nether", title:"We Need to Go Deeper", text:"Entered the crafting zone.", icon:"assets/minecraft/sword.svg", coords:"-84, 68, 41"},
  {id:"crafting", biome:"crafting", title:"Crafting Table", text:"Combined skills into build recipes.", icon:"assets/minecraft/diamond.svg", coords:"-120, 70, 86"},
  {id:"hobbies", biome:"cherry", title:"A Beautiful Place", text:"Explored the free-time grove.", icon:"assets/minecraft/pig.svg", coords:"142, 75, -63"},
  {id:"certificates", biome:"end", title:"Diamonds!", text:"Opened the achievement vault.", icon:"assets/minecraft/diamond.svg", coords:"-240, 78, -140"},
  {id:"contact", biome:"ocean", title:"The End?", text:"Reached the final quest.", icon:"assets/minecraft/ender-pearl.svg", coords:"320, 64, 210"}
];

// Add crafting biome metadata without changing the existing engine structure.
biomeData.crafting={name:"CRAFTING TABLE",tip:"Combine skills • turn ideas into builds",entities:["pickaxe","diamond","apple","sword"],accent:"crafting"};

const mapButtons=$$(".world-map button[data-target]");
const mapPlayer=$("#mapPlayer");
const miniXp=$("#miniXp");
const levelValue=$("#levelValue");
const coordsValue=$("#coordsValue");
const advancementToast=$("#advancementToast");
const advancementIcon=$("#advancementIcon");
const advancementTitle=$("#advancementTitle");
const advancementText=$("#advancementText");
let lastJourney="";

function setHotbar(target){
  $$("#hotbar .slot").forEach(slot=>slot.classList.toggle("selected",slot.dataset.target===target));
  mapButtons.forEach(btn=>btn.classList.toggle("current",btn.dataset.target===target));
}

function showAdvancement(id){
  const item=journey.find(x=>x.id===id);
  if(!item || item.id===lastJourney) return;
  lastJourney=item.id;
  advancementIcon.src=item.icon;
  advancementTitle.textContent=item.title;
  advancementText.textContent=item.text;
  advancementToast.classList.remove("show");
  void advancementToast.offsetWidth;
  advancementToast.classList.add("show");
  clearTimeout(window.__advTimer);
  window.__advTimer=setTimeout(()=>advancementToast.classList.remove("show"),4200);
}

function updateAdventure(id){
  const idx=Math.max(0,journey.findIndex(x=>x.id===id));
  const pct=Math.round((idx/(journey.length-1))*100);
  if(miniXp) miniXp.style.width=pct+"%";
  if(levelValue) levelValue.textContent="LV "+String(Math.min(30,1+Math.floor(idx*4))).padStart(2,"0");
  const item=journey[idx];
  if(coordsValue) coordsValue.textContent=item?.coords||"0, 72, 0";
  if(mapPlayer){
    const btn=mapButtons[idx];
    if(btn){ mapPlayer.style.left=(btn.offsetLeft+btn.offsetWidth/2-6)+"px"; mapPlayer.style.top=(btn.offsetTop+btn.offsetHeight/2-6)+"px"; }
  }
  setHotbar(id);
  showAdvancement(id);
}

mapButtons.forEach(btn=>btn.addEventListener("click",()=>{
  document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth",block:"start"});
}));
$$('#hotbar .slot[data-target]').forEach(btn=>btn.addEventListener('click',()=>{
  document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'});
}));

const adventureObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && entry.intersectionRatio>.35) updateAdventure(entry.target.id);
  });
},{threshold:[.35,.6]});
$$('main section[id]').forEach(s=>adventureObserver.observe(s));

// Keyboard hotbar navigation (1–6) for desktop visitors.
document.addEventListener('keydown',e=>{
  if(e.target.matches('input,textarea')) return;
  const n=parseInt(e.key,10);
  if(n>=1 && n<=6){
    const target=journey[n-1]?.id;
    if(target) document.getElementById(target)?.scrollIntoView({behavior:'smooth'});
  }
});

// Slight coordinate drift while scrolling, giving the HUD a living-world feel.
let coordTick=0;
window.addEventListener('scroll',()=>{
  if(performance.now()-coordTick<120) return;
  coordTick=performance.now();
  const active=journey.find(x=>document.getElementById(x.id)?.getBoundingClientRect().top<=window.innerHeight*.45 && document.getElementById(x.id)?.getBoundingClientRect().bottom>window.innerHeight*.25);
  if(active && coordsValue){
    const base=active.coords.split(',').map(v=>parseInt(v.trim(),10));
    const drift=Math.round(window.scrollY/140);
    coordsValue.textContent=`${base[0]+drift}, ${base[1]}, ${base[2]-Math.round(drift/2)}`;
  }
},{passive:true});

window.addEventListener('resize',()=>{
  const active=journey.find(x=>document.getElementById(x.id)?.classList.contains('active')) || journey.find(x=>document.getElementById(x.id)?.getBoundingClientRect().top<=window.innerHeight*.45);
  if(active) updateAdventure(active.id);
});

setTimeout(()=>updateAdventure('home'),900);
setTimeout(()=>{
  const crafting=document.querySelector('.biome-section[data-biome="crafting"]');
  if(crafting) spawnBiomeFX(crafting);
},50);
