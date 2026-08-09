import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   SHOP LOCATION (fixed GPS)
═══════════════════════════════════════════════════ */
const LAT = 30.227312;
const LNG = 71.472216;
const MAP_EMBED = `https://maps.google.com/maps?q=${LAT},${LNG}&z=17&hl=en&output=embed`;
const MAP_DIR   = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

/* ═══════════════════════════════════════════════════
   TRANSLATIONS — English & Urdu
═══════════════════════════════════════════════════ */
const T = {
  en: {
    nav: ["Home","About","Services","Portfolio","Contact"],
    bookNow:"Book Now", darkBtn:"🌙 Dark", lightBtn:"☀️ Light",
    urduBtn:"اردو", engBtn:"English",
    badge:"Premium Men's Tailoring · Punjab, Pakistan",
    heroSub:"Where every stitch tells a story of elegance & precision",
    bookBtn:"✂️ Book Appointment", viewPort:"View Portfolio", scroll:"Scroll",
    stats:[["1000+","Happy Customers"],["15+","Years Experience"],["5000+","Suits Crafted"],["100%","Satisfaction"]],
    aboutLabel:"About The Master", aboutT1:"Crafting Excellence", aboutT2:"Since Day One",
    aboutP1:"At Tossi Tailor, we believe every man deserves clothing that fits perfectly and reflects his personal style. With over 15 years of expertise in men's tailoring, we bring precision, passion, and premium craftsmanship to every garment we create.",
    aboutP2:"Serving over 1,000 satisfied customers across Pakistan, our atelier specialises in bespoke suits, sherwanis, and traditional Pakistani menswear — each piece crafted to your exact measurements.",
    skills:[["Suit & Formal Wear",98],["Sherwani & Cultural Wear",95],["Alterations & Repairs",99]],
    yrs:"Years of Mastery", addPhoto:"Add Your Photo Here", replaceTag:"Replace with <img> tag",
    srvLabel:"What We Offer", srvT1:"Our ", srvT2:"Services",
    srvSub:"From casual shalwar kameez to grand wedding sherwanis — stitched with care.",
    enquire:"Enquire Now →",
    portLabel:"Our Work", portT1:"Portfolio ", portT2:"Gallery",
    portSub:"Replace placeholders with your real garment photos", addPh:"Add Photo",
    revLabel:"Customer Love", revT1:"What Customers ", revT2:"Say",
    ctaLabel:"Get In Touch", ctaT1:"Book Your ", ctaT2:"Appointment",
    phoneL:"Phone / WhatsApp", emailL:"Email", locL:"Location", locV:"Punjab, Pakistan",
    hrsL:"Working Hours", hrsV:"Mon – Sat · 9AM – 8PM",
    wa:"💬 Chat on WhatsApp", formT:"Send a Message",
    nameP:"Your Name", phoneP:"Phone Number", selSrv:"Select a Service",
    msgP:"Your Message or Requirements", sendBtn:"Send Message ✉️",
    sentOk:"✅ Message sent! We'll contact you shortly.",
    dirBtn:"🗺️ Get Directions to Our Shop",
    mapNote:"📍 Tap above to open route in Google Maps",
    ftTag:"Premium Men's Tailoring · Pakistan",
    ftRights:"All rights reserved · Made with ❤️ in Pakistan",
    services:[
      {icon:"✂️",title:"Bespoke Suits",    desc:"Custom-crafted suits measured to your exact body dimensions — lapels, lining, and fabric all chosen by you."},
      {icon:"👔",title:"Dress Shirts",     desc:"Premium dress shirts tailored to your collar size, sleeve length, and preferred fit style."},
      {icon:"🪭",title:"Sherwani",         desc:"Stunning sherwanis for weddings and eid — traditional embroidery with modern silhouettes."},
      {icon:"🧵",title:"Shalwar Kameez",  desc:"Classic Pakistani menswear stitched with precision in your choice of fabric and cut."},
      {icon:"🪡",title:"Alterations",      desc:"Expert resizing, hemming, and repairs to breathe new life into any garment."},
      {icon:"💍",title:"Wedding Packages", desc:"Complete groom & groomsmen outfit packages with priority scheduling."},
    ],
    reviews:[
      {name:"Ahmed K.", stars:5, text:"Tossi Tailor stitched my wedding sherwani perfectly. The fit was immaculate. Highly recommended to everyone!"},
      {name:"Bilal R.",  stars:5, text:"Been coming here for 5 years. Suit quality is unmatched — every stitch is precise and fabric falls perfectly."},
      {name:"Usman S.", stars:5, text:"Got three office suits done. Every single one fits like machine-made. Exceptional craftsmanship and fair pricing!"},
    ],
    gallery:["Wedding Suit","Sherwani","Business Suit","Shalwar Kameez","Casual Wear","Formal Attire"],
  },
  ur: {
    nav:["گھر","ہمارے بارے میں","خدمات","پورٹ فولیو","رابطہ"],
    bookNow:"ابھی بک کریں", darkBtn:"🌙 تاریک", lightBtn:"☀️ روشن",
    urduBtn:"اردو", engBtn:"English",
    badge:"پریمیم مردوں کی سلائی · پنجاب، پاکستان",
    heroSub:"جہاں ہر سلائی خوبصورتی اور کمال کی کہانی سناتی ہے",
    bookBtn:"✂️ اپوائنٹمنٹ بک کریں", viewPort:"پورٹ فولیو دیکھیں", scroll:"نیچے",
    stats:[["1000+","خوش گاہک"],["15+","سال کا تجربہ"],["5000+","سوٹ تیار"],["100%","اطمینان"]],
    aboutLabel:"استاد کے بارے میں", aboutT1:"پہلے دن سے", aboutT2:"عمدگی کی کاریگری",
    aboutP1:"ٹوسی ٹیلر میں ہم یقین رکھتے ہیں کہ ہر مرد کو ایسے لباس کا حق ہے جو بالکل فٹ ہو اور اس کی شخصیت کی عکاسی کرے۔ مردوں کی سلائی میں 15 سال سے زیادہ تجربے کے ساتھ، ہم ہر لباس میں درستگی، جذبہ اور اعلیٰ کاریگری لاتے ہیں۔",
    aboutP2:"پاکستان میں 1,000 سے زیادہ مطمئن گاہکوں کی خدمت کرتے ہوئے، ہمارا ادارہ خصوصی سوٹ، شیروانی اور روایتی پاکستانی مردوں کے لباس میں مہارت رکھتا ہے۔",
    skills:[["سوٹ اور رسمی لباس",98],["شیروانی اور روایتی لباس",95],["ترمیم اور مرمت",99]],
    yrs:"سال کی مہارت", addPhoto:"یہاں اپنی تصویر شامل کریں", replaceTag:"img ٹیگ سے تبدیل کریں",
    srvLabel:"ہماری خدمات", srvT1:"ہماری ", srvT2:"خدمات",
    srvSub:"سادہ شلوار قمیض سے لے کر شاندار شادی کی شیروانی تک — محبت اور لگن سے تیار کردہ۔",
    enquire:"← ابھی پوچھیں",
    portLabel:"ہمارا کام", portT1:"پورٹ فولیو ", portT2:"گیلری",
    portSub:"اپنی اصل لباس کی تصاویر سے جگہ کی تبدیلی کریں", addPh:"تصویر شامل کریں",
    revLabel:"گاہکوں کی محبت", revT1:"گاہک کیا ", revT2:"کہتے ہیں",
    ctaLabel:"رابطہ کریں", ctaT1:"اپنی اپوائنٹمنٹ ", ctaT2:"بک کریں",
    phoneL:"فون / واٹس ایپ", emailL:"ای میل", locL:"مقام", locV:"پنجاب، پاکستان",
    hrsL:"کام کے اوقات", hrsV:"پیر – ہفتہ · صبح 9 – شام 8",
    wa:"💬 واٹس ایپ پر بات کریں", formT:"پیغام بھیجیں",
    nameP:"آپ کا نام", phoneP:"فون نمبر", selSrv:"خدمت منتخب کریں",
    msgP:"آپ کا پیغام یا ضروریات", sendBtn:"✉️ پیغام بھیجیں",
    sentOk:"✅ پیغام بھیج دیا گیا! ہم جلد رابطہ کریں گے۔",
    dirBtn:"🗺️ ہماری دکان کا راستہ حاصل کریں",
    mapNote:"📍 گوگل میپس میں راستہ کھولنے کے لیے اوپر دبائیں",
    ftTag:"پریمیم مردوں کی سلائی · پاکستان",
    ftRights:"تمام حقوق محفوظ ہیں · پاکستان میں محبت سے بنایا گیا",
    services:[
      {icon:"✂️",title:"خصوصی سوٹ",    desc:"آپ کے جسم کی پیمائش کے مطابق تیار کردہ سوٹ — لیپل، استر اور کپڑا سب آپ کی پسند کے مطابق۔"},
      {icon:"👔",title:"ڈریس شرٹس",     desc:"آپ کے کالر سائز، آستین کی لمبائی اور پسندیدہ فٹ کے مطابق پریمیم ڈریس شرٹس۔"},
      {icon:"🪭",title:"شیروانی",        desc:"شادیوں اور عید کے لیے شاندار شیروانی — روایتی کڑھائی کے ساتھ جدید سلائی۔"},
      {icon:"🧵",title:"شلوار قمیض",    desc:"آپ کی پسند کے کپڑے اور کٹ میں درستگی کے ساتھ سلی ہوئی روایتی پاکستانی پوشاک۔"},
      {icon:"🪡",title:"ترمیم",          desc:"کسی بھی لباس کو نئی زندگی دینے کے لیے ماہرانہ ترمیم اور مرمت۔"},
      {icon:"💍",title:"شادی پیکجز",    desc:"دولہا اور بارات کے لیے مکمل لباس پیکجز، ترجیحی وقت کے ساتھ۔"},
    ],
    reviews:[
      {name:"احمد ک.",  stars:5, text:"ٹوسی ٹیلر نے میری شادی کی شیروانی بالکل درست بنائی۔ فٹ بے مثال تھا۔ سب کو سفارش کرتا ہوں!"},
      {name:"بلال ر.",  stars:5, text:"5 سال سے یہاں آ رہا ہوں۔ سوٹ کا معیار بے مثال ہے — ہر سلائی درست اور کپڑا بالکل ٹھیک پڑتا ہے۔"},
      {name:"عثمان س.", stars:5, text:"تین آفس سوٹ بنوائے۔ ہر ایک بالکل مشین سے بنا لگتا ہے۔ شاندار کاریگری اور مناسب قیمت!"},
    ],
    gallery:["شادی کا سوٹ","شیروانی","دفتری سوٹ","شلوار قمیض","سادہ لباس","رسمی لباس"],
  },
};

/* ═══════════════════════════════════════════════════
   GALLERY METADATA
═══════════════════════════════════════════════════ */
const GMETA = [
  {emoji:"🤵", c:"rgba(37,99,235,.32)",  tall:true},
  {emoji:"👘", c:"rgba(22,52,112,.50)",  tall:false},
  {emoji:"👔", c:"rgba(29,78,216,.30)",  tall:false},
  {emoji:"🪭", c:"rgba(15,40,90,.58)",   tall:true},
  {emoji:"👕", c:"rgba(37,99,235,.22)",  tall:false},
  {emoji:"🧥", c:"rgba(10,25,60,.72)",   tall:false},
];

/* ═══════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

:root {
  --bg:#05111f; --deep:#0a1f3d; --royal:#163470;
  --blue:#2563EB; --sky:#60A5FA; --ice:#DBEAFE;
  --gold:#D4AF37; --wh:#F1F5F9; --muted:#94A3B8; --dim:#475569;
  --card:rgba(22,52,112,.28); --cborder:rgba(96,165,250,.13);
  --navbg:rgba(5,17,31,.95); --inp:rgba(22,52,112,.20);
}
[data-theme="light"] {
  --bg:#EFF4FF; --deep:#E2EAFF; --royal:#163470;
  --blue:#2563EB; --sky:#1D4ED8; --ice:#1E3A8A;
  --gold:#B8860B; --wh:#0F172A; --muted:#475569; --dim:#64748B;
  --card:rgba(255,255,255,.88); --cborder:rgba(37,99,235,.18);
  --navbg:rgba(239,244,255,.97); --inp:rgba(37,99,235,.07);
}

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--wh);font-family:'Inter',sans-serif;overflow-x:hidden;transition:background .4s,color .4s}

/* ── Keyframes ── */
@keyframes fadeUp {from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn {from{opacity:0}to{opacity:1}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes float  {0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
@keyframes spin   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse  {0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.5)}70%{box-shadow:0 0 0 11px rgba(37,99,235,0)}}

.reveal{opacity:0;transform:translateY(30px);transition:opacity .75s ease,transform .75s ease}
.reveal.in{opacity:1;transform:translateY(0)}

/* ── Hero title ── */
.hero-title{
  font-family:'Playfair Display',serif;font-weight:900;
  font-size:clamp(4rem,12vw,10rem);line-height:.9;letter-spacing:-.02em;
  background:linear-gradient(120deg,#60A5FA 0%,#DBEAFE 35%,#D4AF37 65%,#60A5FA 100%);
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 5s linear infinite,fadeUp 1s ease forwards;
}

/* ── Navbar ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:9999;
  display:flex;align-items:center;justify-content:space-between;
  padding:1rem 2.5rem;transition:all .4s ease;
}
.nav.scrolled{
  background:var(--navbg);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--cborder);padding:.75rem 2.5rem;
  box-shadow:0 4px 24px rgba(0,0,0,.15);
}
.nav-logo{font-family:'Playfair Display',serif;font-weight:900;font-size:1.45rem;color:var(--gold);letter-spacing:.06em;cursor:pointer}
.nav-links{display:flex;gap:1.75rem;align-items:center}
.nl{
  color:var(--muted);font-size:.78rem;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;cursor:pointer;
  padding:.4rem 0;position:relative;text-decoration:none;transition:color .3s;
}
.nl::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--gold);transition:width .3s}
.nl:hover,.nl.active{color:var(--gold)}
.nl:hover::after,.nl.active::after{width:100%}

.btn-p{
  background:linear-gradient(135deg,var(--blue),var(--royal));
  color:#fff;border:none;padding:.6rem 1.3rem;border-radius:8px;
  font-weight:600;font-size:.78rem;letter-spacing:.05em;cursor:pointer;
  transition:all .3s;font-family:'Inter',sans-serif;
}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(37,99,235,.4)}

.tog{
  background:var(--card);border:1px solid var(--cborder);color:var(--wh);
  padding:.45rem .9rem;border-radius:20px;cursor:pointer;
  font-size:.72rem;font-weight:600;letter-spacing:.05em;
  transition:all .3s;font-family:'Inter',sans-serif;
  display:flex;align-items:center;gap:.35rem;white-space:nowrap;
}
.tog:hover{border-color:var(--sky);box-shadow:0 4px 14px rgba(37,99,235,.2)}

.ham{display:none;background:none;border:none;color:var(--wh);font-size:1.5rem;cursor:pointer}

.mob-menu{
  display:none;position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(5,17,31,.98);backdrop-filter:blur(24px);
  flex-direction:column;align-items:center;justify-content:center;
  gap:2rem;z-index:9998;
}
.mob-menu.open{display:flex}
.mob-menu .nl{font-size:1.25rem;letter-spacing:.15em}

/* ── Hero section ── */
.hero{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  padding-top:5.5rem; /* FIX: clears fixed navbar */
  padding-bottom:3rem;
  padding-left:1.5rem;padding-right:1.5rem;
}
.hero-grid{
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(37,99,235,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.04) 1px,transparent 1px);
  background-size:65px 65px;
}
.orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none}

/* ── Sections ── */
.sec-label{font-size:.72rem;color:var(--sky);font-weight:600;text-transform:uppercase;letter-spacing:.22em}
.sec-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3rem);font-weight:700;margin-top:.6rem;line-height:1.2;color:var(--wh)}
.gold-bar{height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1.25rem 0}

/* ── Cards ── */
.card{
  background:var(--card);border:1px solid var(--cborder);
  border-radius:16px;padding:2rem;
  transition:all .4s cubic-bezier(.175,.885,.32,1.275);backdrop-filter:blur(10px);
}
[data-theme="light"] .card{box-shadow:0 2px 14px rgba(37,99,235,.08)}
.card:hover{transform:translateY(-8px);border-color:rgba(96,165,250,.45);box-shadow:0 24px 60px rgba(37,99,235,.15)}

/* ── Photo frame ── */
.photo-frame{
  width:270px;height:350px;border-radius:20px;
  background:linear-gradient(135deg,rgba(22,52,112,.4),rgba(37,99,235,.15));
  border:2px dashed rgba(96,165,250,.35);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:1rem;position:relative;overflow:hidden;
  animation:float 4s ease-in-out infinite;flex-shrink:0;
}
.photo-frame::before{
  content:'';position:absolute;inset:-60%;
  background:conic-gradient(from 0deg,transparent 0deg,rgba(37,99,235,.07) 60deg,transparent 120deg);
  animation:spin 10s linear infinite;
}

/* ── Progress bar ── */
.prog{height:4px;background:var(--inp);border-radius:2px;overflow:hidden;margin-top:.4rem}
.prog-f{height:100%;background:linear-gradient(90deg,var(--blue),var(--sky));border-radius:2px;transition:width 1.4s ease}

/* ── Gallery ── */
.gal-item{
  border-radius:14px;border:1px solid var(--cborder);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:.5rem;overflow:hidden;cursor:pointer;transition:all .35s;position:relative;
}
.gal-item:hover{border-color:rgba(96,165,250,.5);transform:scale(1.03);box-shadow:0 16px 48px rgba(37,99,235,.2)}
.gal-ov{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(5,17,31,.9),transparent);
  display:flex;align-items:flex-end;padding:1rem;opacity:0;transition:opacity .3s;
}
.gal-item:hover .gal-ov{opacity:1}

/* ── Form ── */
.ci{
  width:100%;background:var(--inp);border:1px solid var(--cborder);
  border-radius:10px;padding:.85rem 1rem;color:var(--wh);
  font-family:'Inter',sans-serif;font-size:.9rem;outline:none;transition:border-color .3s;
}
.ci:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.ci::placeholder{color:var(--dim)}

/* ── WhatsApp ── */
.wa{
  display:flex;align-items:center;justify-content:center;gap:.75rem;
  background:linear-gradient(135deg,#25D366,#128C7E);
  color:#fff;text-decoration:none;padding:.9rem;border-radius:12px;
  font-weight:600;font-size:.95rem;transition:all .3s;cursor:pointer;
  border:none;font-family:'Inter',sans-serif;
}
.wa:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(37,211,102,.3)}

/* ── Map ── */
.map-wrap{border-radius:18px;overflow:hidden;border:1px solid var(--cborder)}

/* ── Footer ── */
.footer{border-top:1px solid var(--cborder);padding:3.5rem 2rem 2rem;text-align:center;background:var(--deep)}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--royal);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--blue)}

/* ══ RESPONSIVE ════════════════════════════════ */
@media(max-width:900px){
  .nav{padding:.85rem 1.25rem}
  .nav.scrolled{padding:.65rem 1.25rem}
  .nav-links{display:none}
  .ham{display:block}
  .tog span.tl{display:none}
  .tog{padding:.4rem .7rem;font-size:.68rem}
}
@media(max-width:650px){
  .hero{padding-top:5rem;padding-left:1rem;padding-right:1rem;padding-bottom:2.5rem}
  .hero-title{font-size:clamp(3.8rem,18vw,5.5rem) !important}
  .stats-grid{grid-template-columns:repeat(2,1fr) !important}
  .about-wrap{flex-direction:column !important;gap:3rem !important}
  .photo-frame{width:220px;height:280px}
  .contact-grid{grid-template-columns:1fr !important}
  .gal-grid{grid-template-columns:repeat(2,1fr) !important}
  .srv-grid{grid-template-columns:1fr !important}
  .rev-grid{grid-template-columns:1fr !important}
  .hero-btns{flex-direction:column;align-items:center}
  .hero-btns button{width:100%;max-width:300px}
  .nav-toggles{gap:.4rem}
  .footer-links{flex-direction:column !important;gap:.75rem !important}
  .contact-info-row span.ci-val{font-size:.82rem}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}
}
`;

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function App() {
  const [theme,   setTheme]   = useState("dark");
  const [lang,    setLang]    = useState("en");
  const [scrolled,setScrolled]= useState(false);
  const [active,  setActive]  = useState("home");
  const [menuOpen,setMenuOpen]= useState(false);
  const [sent,    setSent]    = useState(false);
  const [form,    setForm]    = useState({name:"",phone:"",service:"",msg:""});
  const styleRef = useRef(null);
  const t = T[lang];
  const isUr = lang === "ur";

  /* inject CSS */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { try { document.head.removeChild(el); } catch(_){} };
  }, []);

  /* theme + lang on root */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-lang", lang);
  }, [theme, lang]);

  /* scroll spy */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 55);
      const ids = ["home","about","services","portfolio","contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    }, 100);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [lang]); // re-run on lang change

  const go = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); };
  const toggleTheme = () => setTheme(p => p === "dark" ? "light" : "dark");
  const toggleLang  = () => setLang(p => p === "en" ? "ur" : "en");

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setForm({name:"",phone:"",service:"",msg:""});
    setTimeout(() => setSent(false), 4000);
  };

  const dir = isUr ? "rtl" : "ltr";
  const urFont = isUr ? "'Noto Nastaliq Urdu', serif" : undefined;

  /* ── Shared style helpers ── */
  const iconBox = { width:"46px",height:"46px",borderRadius:"11px",background:"linear-gradient(135deg,var(--royal),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0 };
  const outlineBtn = (extra={}) => ({
    background:"transparent",border:"1px solid rgba(96,165,250,.35)",
    color:"var(--ice)",padding:".9rem 2rem",borderRadius:"10px",
    cursor:"pointer",fontWeight:500,fontSize:".95rem",
    transition:"all .3s",fontFamily:"'Inter',sans-serif",
    ...extra,
  });

  return (
    <div dir={dir} style={{background:"var(--bg)",minHeight:"100vh",fontFamily:urFont}}>

      {/* ══ NAVBAR ══════════════════════════════════════ */}
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-logo" onClick={()=>go("home")}>TT</div>

        <div className="nav-links">
          {t.nav.map((n,i)=>(
            <span key={i} className={`nl${active===["home","about","services","portfolio","contact"][i]?" active":""}`}
                  onClick={()=>go(["home","about","services","portfolio","contact"][i])}
                  style={urFont?{fontFamily:urFont}:{}}>
              {n}
            </span>
          ))}
          <button className="btn-p" onClick={()=>go("contact")} style={urFont?{fontFamily:urFont}:{}}>{t.bookNow}</button>
        </div>

        {/* Toggle buttons — always visible */}
        <div className="nav-toggles" style={{display:"flex",gap:".6rem",alignItems:"center"}}>
          <button className="tog" onClick={toggleTheme}>
            {theme==="dark"? t.lightBtn : t.darkBtn}
          </button>
          <button className="tog" onClick={toggleLang} style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif"}:{}}>
            {isUr ? t.engBtn : t.urduBtn}
          </button>
          <button className="ham" onClick={()=>setMenuOpen(o=>!o)}>{menuOpen?"✕":"☰"}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu${menuOpen?" open":""}`}>
        <button className="tog" onClick={toggleTheme} style={{fontSize:".9rem",padding:".6rem 1.2rem"}}>
          {theme==="dark"? t.lightBtn : t.darkBtn}
        </button>
        <button className="tog" onClick={toggleLang} style={{fontSize:".9rem",padding:".6rem 1.2rem",fontFamily:isUr?"'Noto Nastaliq Urdu',serif":undefined}}>
          {isUr ? t.engBtn : t.urduBtn}
        </button>
        {t.nav.map((n,i)=>(
          <span key={i} className="nl" onClick={()=>go(["home","about","services","portfolio","contact"][i])}
                style={{fontSize:"1.2rem",letterSpacing:".12em",fontFamily:urFont}}>
            {n}
          </span>
        ))}
        <button className="btn-p" onClick={()=>go("contact")} style={{fontSize:"1rem",padding:".8rem 2rem",fontFamily:urFont}}>{t.bookNow}</button>
      </div>

      {/* ══ HERO ════════════════════════════════════════ */}
      <section id="home" className="hero">
        <div className="hero-grid"/>
        <div className="orb" style={{top:"18%",left:"8%",width:"420px",height:"420px",background:"radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%)"}}/>
        <div className="orb" style={{bottom:"18%",right:"6%",width:"300px",height:"300px",background:"radial-gradient(circle,rgba(212,175,55,.12) 0%,transparent 70%)"}}/>

        <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:"1100px",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:"1.6rem"}}>

          {/* Badge */}
          <div style={{animation:"fadeIn .7s ease forwards",display:"inline-flex",alignItems:"center",gap:".7rem",background:"rgba(37,99,235,.1)",border:"1px solid rgba(96,165,250,.3)",borderRadius:"999px",padding:".4rem 1.3rem"}}>
            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"var(--sky)",display:"inline-block",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:".75rem",color:"var(--sky)",letterSpacing:".15em",textTransform:"uppercase",fontWeight:600,fontFamily:urFont}}>{t.badge}</span>
          </div>

          <h1 className="hero-title">TOSSI<br/>TAILOR</h1>

          <p style={{fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Cormorant Garamond',serif",fontStyle:isUr?"normal":"italic",fontSize:"clamp(1rem,2.5vw,1.4rem)",color:"rgba(219,234,254,.85)",animation:"fadeUp 1s ease .35s both",maxWidth:"500px"}}>
            {t.heroSub}
          </p>

          <div className="gold-bar" style={{width:"120px",margin:"0"}}/>

          <div className="hero-btns" style={{display:"flex",gap:"1rem",flexWrap:"wrap",justifyContent:"center",animation:"fadeUp 1s ease .55s both"}}>
            <button className="btn-p" style={{padding:".9rem 2.1rem",fontSize:".95rem",borderRadius:"10px",fontFamily:urFont}} onClick={()=>go("contact")}>
              {t.bookBtn}
            </button>
            <button style={outlineBtn()} onClick={()=>go("portfolio")}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--sky)";e.currentTarget.style.background="rgba(37,99,235,.1)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(96,165,250,.35)";e.currentTarget.style.background="transparent"}}>
              <span style={{fontFamily:urFont}}>{t.viewPort}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.25rem",marginTop:"1.5rem",width:"100%",maxWidth:"700px",animation:"fadeUp 1s ease .75s both"}}>
            {t.stats.map(([n,l])=>(
              <div key={l} style={{textAlign:"center",padding:".75rem",background:"rgba(22,52,112,.18)",border:"1px solid rgba(96,165,250,.1)",borderRadius:"12px"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,4vw,2.3rem)",fontWeight:700,color:"var(--sky)"}}>{n}</div>
                <div style={{fontSize:".63rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginTop:".2rem",fontFamily:urFont}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:".4rem",animation:"float 2.5s ease-in-out infinite"}}>
          <span style={{fontSize:".62rem",color:"var(--muted)",letterSpacing:".15em",textTransform:"uppercase",fontFamily:urFont}}>{t.scroll}</span>
          <div style={{width:"1px",height:"40px",background:"linear-gradient(to bottom,var(--sky),transparent)"}}/>
        </div>
      </section>

      {/* ══ ABOUT ═══════════════════════════════════════ */}
      <section id="about" style={{padding:"6rem 1.5rem",maxWidth:"1200px",margin:"0 auto"}}>
        <div className="about-wrap reveal" style={{display:"flex",flexWrap:"wrap",gap:"4.5rem",alignItems:"center",justifyContent:"center"}}>

          {/* Photo placeholder */}
          <div style={{position:"relative"}}>
            <div className="photo-frame">
              <span style={{fontSize:"4rem",position:"relative",zIndex:1}}>👤</span>
              <p style={{color:"var(--sky)",fontSize:".78rem",textAlign:"center",position:"relative",zIndex:1,padding:"0 1.5rem",lineHeight:1.6,fontFamily:urFont}}>{t.addPhoto}</p>
              <p style={{color:"var(--dim)",fontSize:".65rem",position:"relative",zIndex:1,fontFamily:urFont}}>{t.replaceTag}</p>
            </div>
            <div style={{position:"absolute",bottom:"-22px",right:isUr?"auto":"-22px",left:isUr?"-22px":"auto",background:"linear-gradient(135deg,var(--royal),var(--blue))",borderRadius:"14px",padding:"1rem 1.4rem",border:"1px solid rgba(96,165,250,.3)",boxShadow:"0 12px 36px rgba(37,99,235,.35)",textAlign:"center",animation:"float 3.5s ease-in-out infinite"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:"var(--gold)"}}>15+</div>
              <div style={{fontSize:".62rem",color:"var(--ice)",textTransform:"uppercase",letterSpacing:".1em",fontFamily:urFont}}>{t.yrs}</div>
            </div>
          </div>

          {/* Text */}
          <div style={{flex:1,minWidth:"270px",maxWidth:"560px"}}>
            <span className="sec-label" style={{fontFamily:urFont}}>{t.aboutLabel}</span>
            <h2 className="sec-title">
              {t.aboutT1}<br/><span style={{color:"var(--sky)"}}>{t.aboutT2}</span>
            </h2>
            <div className="gold-bar" style={{width:"80px"}}/>
            <p style={{color:"#CBD5E1",lineHeight:1.9,marginBottom:"1rem",fontSize:".93rem",fontFamily:urFont}}>{t.aboutP1}</p>
            <p style={{color:"#CBD5E1",lineHeight:1.9,marginBottom:"2rem",fontSize:".93rem",fontFamily:urFont}}>{t.aboutP2}</p>
            {t.skills.map(([l,p])=>(
              <div key={l} style={{marginBottom:"1.1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:".35rem"}}>
                  <span style={{fontSize:".84rem",color:"var(--ice)",fontFamily:urFont}}>{l}</span>
                  <span style={{fontSize:".84rem",color:"var(--sky)",fontWeight:600}}>{p}%</span>
                </div>
                <div className="prog"><div className="prog-f" style={{width:`${p}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════ */}
      <section id="services" style={{padding:"6rem 1.5rem",background:"linear-gradient(180deg,transparent,rgba(10,31,61,.5) 50%,transparent)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div className="reveal" style={{textAlign:"center",marginBottom:"4rem"}}>
            <span className="sec-label" style={{fontFamily:urFont}}>{t.srvLabel}</span>
            <h2 className="sec-title">{t.srvT1}<span style={{color:"var(--sky)"}}>{t.srvT2}</span></h2>
            <div className="gold-bar" style={{width:"80px",margin:"1.25rem auto"}}/>
            <p style={{color:"var(--muted)",maxWidth:"500px",margin:"0 auto",fontSize:".93rem",fontFamily:urFont}}>{t.srvSub}</p>
          </div>
          <div className="srv-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
            {t.services.map((s,i)=>(
              <div key={i} className="card reveal" style={{transitionDelay:`${i*.07}s`}}>
                <div style={{fontSize:"2.4rem",marginBottom:"1rem"}}>{s.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",fontWeight:600,marginBottom:".7rem",color:"var(--ice)"}}>{s.title}</h3>
                <p style={{color:"var(--muted)",lineHeight:1.8,fontSize:".87rem",fontFamily:urFont}}>{s.desc}</p>
                <div style={{marginTop:"1.4rem",paddingTop:"1rem",borderTop:"1px solid var(--cborder)",color:"var(--sky)",fontSize:".8rem",fontWeight:500,cursor:"pointer",fontFamily:urFont}}
                  onClick={()=>go("contact")}>{t.enquire}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO ═══════════════════════════════════ */}
      <section id="portfolio" style={{padding:"6rem 1.5rem",maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:"4rem"}}>
          <span className="sec-label" style={{fontFamily:urFont}}>{t.portLabel}</span>
          <h2 className="sec-title">{t.portT1}<span style={{color:"var(--sky)"}}>{t.portT2}</span></h2>
          <div className="gold-bar" style={{width:"80px",margin:"1.25rem auto"}}/>
          <p style={{color:"var(--muted)",fontSize:".87rem",fontFamily:urFont}}>{t.portSub}</p>
        </div>
        <div className="gal-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem"}}>
          {GMETA.map(({emoji,c,tall},i)=>(
            <div key={i} className="gal-item reveal" style={{height:tall?"290px":"210px",background:`linear-gradient(135deg,${c},rgba(5,17,31,.85))`}}>
              <span style={{fontSize:"2.1rem",position:"relative",zIndex:1}}>{emoji}</span>
              <span style={{color:"var(--ice)",fontSize:".8rem",fontWeight:500,position:"relative",zIndex:1,fontFamily:urFont}}>{t.gallery[i]}</span>
              <span style={{color:"var(--dim)",fontSize:".7rem",position:"relative",zIndex:1,fontFamily:urFont}}>{t.addPh}</span>
              <div className="gal-ov"><span style={{color:"var(--ice)",fontSize:".8rem",fontWeight:500,fontFamily:urFont}}>{t.gallery[i]}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════ */}
      <section style={{padding:"6rem 1.5rem",background:"linear-gradient(180deg,transparent,rgba(10,31,61,.45) 50%,transparent)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div className="reveal" style={{textAlign:"center",marginBottom:"4rem"}}>
            <span className="sec-label" style={{fontFamily:urFont}}>{t.revLabel}</span>
            <h2 className="sec-title">{t.revT1}<span style={{color:"var(--sky)"}}>{t.revT2}</span></h2>
            <div className="gold-bar" style={{width:"80px",margin:"1.25rem auto"}}/>
          </div>
          <div className="rev-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
            {t.reviews.map(({name,stars,text},i)=>(
              <div key={i} className="card reveal">
                <div style={{display:"flex",gap:".2rem",marginBottom:"1rem"}}>
                  {Array(stars).fill(0).map((_,j)=><span key={j}>⭐</span>)}
                </div>
                <p style={{color:"#CBD5E1",lineHeight:1.85,fontStyle:"italic",marginBottom:"1.5rem",fontSize:".88rem",fontFamily:urFont}}>"{text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:".75rem",paddingTop:"1rem",borderTop:"1px solid var(--cborder)"}}>
                  <div style={{width:"42px",height:"42px",borderRadius:"50%",background:"linear-gradient(135deg,var(--blue),var(--royal))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>👤</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:".88rem",fontFamily:urFont}}>{name}</div>
                    <div style={{fontSize:".72rem",color:"var(--dim)",fontFamily:urFont}}>Verified Customer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT + MAP ═══════════════════════════════ */}
      <section id="contact" style={{padding:"6rem 1.5rem",maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:"4rem"}}>
          <span className="sec-label" style={{fontFamily:urFont}}>{t.ctaLabel}</span>
          <h2 className="sec-title">{t.ctaT1}<span style={{color:"var(--sky)"}}>{t.ctaT2}</span></h2>
          <div className="gold-bar" style={{width:"80px",margin:"1.25rem auto"}}/>
        </div>

        <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"start"}}>

          {/* Left: info + form */}
          <div className="reveal" style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>
            {[
              {icon:"📞",label:t.phoneL, value:"03056957968",        href:"tel:03056957968"},
              {icon:"📧",label:t.emailL, value:"toositailor@gmail.com",href:"mailto:toositailor@gmail.com"},
              {icon:"📍",label:t.locL,   value:t.locV,               href:null},
              {icon:"🕐",label:t.hrsL,   value:t.hrsV,               href:null},
            ].map(({icon,label,value,href},i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"1rem",padding:".95rem 1.2rem",background:"rgba(22,52,112,.15)",border:"1px solid var(--cborder)",borderRadius:"12px",transition:"all .3s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(96,165,250,.4)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--cborder)"}>
                <div style={iconBox}>{icon}</div>
                <div>
                  <div style={{fontSize:".62rem",color:"var(--dim)",textTransform:"uppercase",letterSpacing:".12em",fontFamily:urFont}}>{label}</div>
                  {href
                    ? <a href={href} style={{color:"var(--ice)",fontWeight:500,textDecoration:"none",fontSize:".9rem"}}>{value}</a>
                    : <div style={{color:"var(--ice)",fontWeight:500,fontSize:".9rem",fontFamily:urFont}}>{value}</div>
                  }
                </div>
              </div>
            ))}

            <a className="wa" href="https://wa.me/923056957968" target="_blank" rel="noopener noreferrer">
              <span style={{fontFamily:urFont}}>{t.wa}</span>
            </a>

            {/* Form */}
            <div style={{background:"rgba(22,52,112,.15)",border:"1px solid var(--cborder)",borderRadius:"16px",padding:"1.75rem"}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",marginBottom:"1.25rem",color:"var(--ice)"}}>{t.formT}</h3>
              {sent && (
                <div style={{background:"rgba(37,211,102,.12)",border:"1px solid rgba(37,211,102,.3)",borderRadius:"10px",padding:"1rem",marginBottom:"1rem",color:"#4ade80",fontSize:".88rem",fontFamily:urFont}}>
                  {t.sentOk}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:".85rem"}}>
                <input  className="ci" placeholder={t.nameP} value={form.name}    onChange={e=>setForm(f=>({...f,name:e.target.value}))}    required style={{fontFamily:urFont,direction:dir}}/>
                <input  className="ci" placeholder={t.phoneP} value={form.phone}  onChange={e=>setForm(f=>({...f,phone:e.target.value}))}   required style={{direction:"ltr"}}/>
                <select className="ci" value={form.service} onChange={e=>setForm(f=>({...f,service:e.target.value}))} required style={{cursor:"pointer",fontFamily:urFont}}>
                  <option value="" disabled>{t.selSrv}</option>
                  {t.services.map((s,i)=><option key={i} value={s.title}>{s.title}</option>)}
                </select>
                <textarea className="ci" placeholder={t.msgP} rows={3} value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} required style={{fontFamily:urFont,direction:dir}}/>
                <button type="submit" className="btn-p" style={{padding:".9rem",fontSize:".93rem",borderRadius:"10px",fontFamily:urFont}}>
                  {t.sendBtn}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Map */}
          <div className="reveal" style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div className="map-wrap" style={{height:"420px"}}>
              <iframe
                src={MAP_EMBED}
                width="100%" height="100%"
                style={{border:0,display:"block",filter:theme==="dark"?"invert(92%) hue-rotate(180deg) saturate(1.1)":"none"}}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tossi Tailor Shop Location"
              />
            </div>

            {/* Directions button — opens exact GPS route */}
            <a href={MAP_DIR} target="_blank" rel="noopener noreferrer"
               style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".65rem",background:"linear-gradient(135deg,var(--blue),var(--royal))",color:"#fff",textDecoration:"none",padding:".95rem",borderRadius:"12px",fontWeight:600,fontSize:".95rem",transition:"all .3s",fontFamily:urFont}}
               onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 30px rgba(37,99,235,.45)"}}
               onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
              {t.dirBtn}
            </a>

            <p style={{fontSize:".75rem",color:"var(--dim)",textAlign:"center",fontFamily:urFont}}>{t.mapNote}</p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════ */}
      <footer className="footer">
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2.3rem",fontWeight:900,color:"var(--gold)",marginBottom:".6rem",letterSpacing:".05em"}}>
          TOSSI TAILOR
        </div>
        <p style={{color:"var(--dim)",fontSize:".9rem",marginBottom:"1.75rem",fontFamily:urFont}}>{t.ftTag}</p>
        <div className="footer-links" style={{display:"flex",gap:"2rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"2rem"}}>
          {t.nav.map((n,i)=>(
            <span key={i} className="nl" onClick={()=>go(["home","about","services","portfolio","contact"][i])}
                  style={{cursor:"pointer",fontSize:".78rem",fontFamily:urFont}}>
              {n}
            </span>
          ))}
        </div>
        <div style={{display:"flex",gap:"1.5rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"2rem"}}>
          {[{l:"📞 03056957968",h:"tel:03056957968"},{l:"📧 toositailor@gmail.com",h:"mailto:toositailor@gmail.com"}].map(({l,h})=>(
            <a key={h} href={h} style={{color:"var(--muted)",textDecoration:"none",fontSize:".82rem",transition:"color .3s"}}
               onMouseEnter={e=>e.currentTarget.style.color="var(--sky)"}
               onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
              {l}
            </a>
          ))}
        </div>
        <div className="gold-bar" style={{maxWidth:"180px",margin:"0 auto 1.5rem"}}/>
        <p style={{color:"var(--dim)",fontSize:".72rem",fontFamily:urFont}}>
          © {new Date().getFullYear()} Tossi Tailor · {t.ftRights}
        </p>
      </footer>

    </div>
  );
}
