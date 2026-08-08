import React, { useState, useEffect, useRef } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --navy:    #05111f;
    --deep:    #0a1f3d;
    --royal:   #163470;
    --blue:    #2563EB;
    --sky:     #60A5FA;
    --ice:     #DBEAFE;
    --gold:    #D4AF37;
    --goldlt:  #F0D060;
    --white:   #F1F5F9;
    --muted:   #94A3B8;
    --dim:     #475569;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* ── Keyframes ──────────────────────────────── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes blink    { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.5)} 70%{box-shadow:0 0 0 12px rgba(37,99,235,0)} }
  @keyframes lineGrow { from{width:0} to{width:100%} }
  @keyframes orbit    { from{transform:rotate(0deg) translateX(220px) rotate(0deg)} to{transform:rotate(360deg) translateX(220px) rotate(-360deg)} }
  @keyframes typeText { from{width:0} to{width:100%} }
  @keyframes bgMove   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }

  /* ── Utility ────────────────────────────────── */
  .reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity .8s ease, transform .8s ease;
  }
  .reveal.in { opacity:1; transform:translateY(0); }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: clamp(4.5rem, 13vw, 11rem);
    line-height: .92;
    letter-spacing: -.02em;
    background: linear-gradient(120deg, #60A5FA 0%, #DBEAFE 35%, #D4AF37 65%, #60A5FA 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 5s linear infinite, fadeUp 1s ease forwards;
  }

  /* ── Navbar ─────────────────────────────────── */
  .nav {
    position: fixed; top:0; left:0; right:0; z-index:9999;
    display: flex; align-items:center; justify-content:space-between;
    padding: 1.1rem 3rem;
    transition: all .4s ease;
  }
  .nav.scrolled {
    background: rgba(5,17,31,.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(96,165,250,.12);
    padding: .8rem 3rem;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-weight: 900; font-size:1.5rem;
    color: var(--gold);
    letter-spacing: .06em;
    cursor: pointer;
  }
  .nav-links { display:flex; gap:2.25rem; align-items:center; }
  .nl {
    color: var(--ice); font-size:.8rem; font-weight:500;
    letter-spacing:.12em; text-transform:uppercase;
    cursor:pointer; padding:.4rem 0;
    position:relative; text-decoration:none;
    transition: color .3s;
  }
  .nl::after {
    content:''; position:absolute; bottom:0; left:0;
    width:0; height:1px;
    background: var(--gold);
    transition: width .3s ease;
  }
  .nl:hover { color: var(--gold); }
  .nl:hover::after, .nl.active::after { width:100%; }
  .nl.active { color: var(--gold); }

  .btn-book {
    background: linear-gradient(135deg, var(--blue), var(--royal));
    color:#fff; border:none;
    padding:.65rem 1.5rem;
    border-radius:8px; font-weight:600;
    font-size:.8rem; letter-spacing:.06em;
    cursor:pointer; transition: all .3s;
    font-family:'Inter',sans-serif;
  }
  .btn-book:hover {
    transform:translateY(-2px);
    box-shadow: 0 8px 24px rgba(37,99,235,.45);
  }

  /* ── Mobile hamburger ───────────────────────── */
  .ham { display:none; background:none; border:none; color:var(--white); font-size:1.6rem; cursor:pointer; }

  @media(max-width:768px){
    .nav { padding:.9rem 1.25rem; }
    .nav.scrolled { padding:.7rem 1.25rem; }
    .nav-links { display:none; }
    .ham { display:block; }
    .btn-book { display:none; }
    .mobile-menu {
      position:fixed; top:0; left:0; right:0; bottom:0;
      background:rgba(5,17,31,.98);
      backdrop-filter:blur(20px);
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      gap:2.5rem; z-index:9998;
    }
    .mobile-menu .nl { font-size:1.2rem; }
    .contact-grid { grid-template-columns:1fr !important; }
    .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
  }

  /* ── Hero ───────────────────────────────────── */
  .hero {
    min-height: 100vh;
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden;
    padding: 2rem 2rem 4rem;
  }
  .hero-grid {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(37,99,235,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(37,99,235,.04) 1px, transparent 1px);
    background-size: 65px 65px;
  }
  .orb {
    position:absolute; border-radius:50%;
    filter:blur(60px); pointer-events:none;
  }

  /* ── Section headings ───────────────────────── */
  .sec-label {
    font-size:.72rem; color:var(--sky); font-weight:600;
    text-transform:uppercase; letter-spacing:.22em;
  }
  .sec-title {
    font-family:'Playfair Display',serif;
    font-size:clamp(2rem,5vw,3.2rem);
    font-weight:700; margin-top:.6rem; line-height:1.15;
  }
  .gold-bar {
    height:2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin:1.25rem 0;
  }

  /* ── Cards ──────────────────────────────────── */
  .card {
    background: linear-gradient(135deg, rgba(22,52,112,.28) 0%, rgba(10,31,61,.75) 100%);
    border:1px solid rgba(96,165,250,.12);
    border-radius:16px; padding:2rem;
    transition: all .4s cubic-bezier(.175,.885,.32,1.275);
    backdrop-filter:blur(10px);
  }
  .card:hover {
    transform:translateY(-8px);
    border-color:rgba(96,165,250,.45);
    box-shadow:0 24px 64px rgba(37,99,235,.18);
  }

  /* ── Photo frame ────────────────────────────── */
  .photo-frame {
    width:290px; height:370px;
    border-radius:20px;
    background:linear-gradient(135deg,rgba(22,52,112,.4),rgba(37,99,235,.15));
    border:2px dashed rgba(96,165,250,.35);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:1rem; position:relative; overflow:hidden;
    animation: float 4s ease-in-out infinite;
    flex-shrink:0;
  }
  .photo-frame::before {
    content:''; position:absolute; inset:-60%;
    background: conic-gradient(from 0deg, transparent 0deg, rgba(37,99,235,.07) 60deg, transparent 120deg);
    animation: spinSlow 10s linear infinite;
  }
  .photo-frame img {
    width:100%; height:100%;
    object-fit:cover; border-radius:18px;
  }

  /* ── Progress bar ───────────────────────────── */
  .prog-bar {
    height:4px; background:rgba(37,99,235,.18);
    border-radius:2px; overflow:hidden; margin-top:.4rem;
  }
  .prog-fill {
    height:100%;
    background:linear-gradient(90deg,var(--blue),var(--sky));
    border-radius:2px; transition:width 1.4s ease;
  }

  /* ── Gallery ────────────────────────────────── */
  .gal-item {
    border-radius:14px;
    border:1px solid rgba(96,165,250,.12);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:.5rem; overflow:hidden;
    cursor:pointer; transition:all .35s ease;
    position:relative;
  }
  .gal-item:hover {
    border-color:rgba(96,165,250,.5);
    transform:scale(1.03);
    box-shadow:0 16px 48px rgba(37,99,235,.2);
  }
  .gal-item .overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(5,17,31,.9),transparent);
    display:flex; align-items:flex-end;
    padding:1rem; opacity:0; transition:opacity .3s;
  }
  .gal-item:hover .overlay { opacity:1; }

  /* ── Contact input ──────────────────────────── */
  .ci {
    width:100%;
    background:rgba(22,52,112,.18);
    border:1px solid rgba(96,165,250,.18);
    border-radius:10px; padding:.85rem 1rem;
    color:var(--white);
    font-family:'Inter',sans-serif; font-size:.9rem;
    outline:none; transition:border-color .3s;
  }
  .ci:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(37,99,235,.12); }
  .ci::placeholder { color:var(--dim); }

  /* ── WhatsApp ───────────────────────────────── */
  .wa {
    display:flex; align-items:center; justify-content:center; gap:.75rem;
    background:linear-gradient(135deg,#25D366,#128C7E);
    color:#fff; text-decoration:none;
    padding:.9rem; border-radius:12px;
    font-weight:600; font-size:.95rem;
    transition:all .3s;
  }
  .wa:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(37,211,102,.3); }

  /* ── Map ────────────────────────────────────── */
  .map-wrap {
    border-radius:18px; overflow:hidden;
    border:1px solid rgba(96,165,250,.2);
    min-height:340px;
  }

  /* ── Scroll indicator ───────────────────────── */
  .scroll-ind {
    position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:.4rem;
    animation: float 2.5s ease-in-out infinite;
  }

  /* ── Footer ─────────────────────────────────── */
  .footer {
    border-top:1px solid rgba(96,165,250,.1);
    padding:3.5rem 2rem 2rem;
    text-align:center;
    background:rgba(5,17,31,.9);
  }

  /* ── Scrollbar ──────────────────────────────── */
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:var(--navy); }
  ::-webkit-scrollbar-thumb { background:var(--royal); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--blue); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; }
  }
`;

const SERVICES = [
  {
    icon: '✂️',
    title: 'Bespoke Suits',
    desc: 'Custom-crafted suits measured to your exact body dimensions — lapels, lining, and fabric all chosen by you.',
  },
  {
    icon: '👔',
    title: 'Dress Shirts',
    desc: 'Premium dress shirts tailored to your collar size, sleeve length, and preferred fit style.',
  },
  {
    icon: '🪭',
    title: 'Sherwani',
    desc: 'Stunning sherwanis for weddings and eid — traditional embroidery with modern silhouettes.',
  },
  {
    icon: '🧵',
    title: 'Shalwar Kameez',
    desc: 'Classic Pakistani menswear stitched with precision in your choice of fabric and cut.',
  },
  {
    icon: '🪡',
    title: 'Alterations',
    desc: 'Expert resizing, hemming, and repairs to breathe new life into any garment.',
  },
  {
    icon: '💍',
    title: 'Wedding Packages',
    desc: 'Complete groom & groomsmen outfit packages with priority scheduling.',
  },
];

const GALLERY = [
  { label: 'Wedding Suit', emoji: '🤵', c: 'rgba(37,99,235,.3)', tall: true },
  { label: 'Sherwani', emoji: '👘', c: 'rgba(22,52,112,.45)', tall: false },
  { label: 'Business Suit', emoji: '👔', c: 'rgba(29,78,216,.3)', tall: false },
  { label: 'Shalwar Kameez', emoji: '🪭', c: 'rgba(15,40,90,.55)', tall: true },
  { label: 'Casual Wear', emoji: '👕', c: 'rgba(37,99,235,.22)', tall: false },
  { label: 'Formal Attire', emoji: '🧥', c: 'rgba(10,25,60,.7)', tall: false },
];

const REVIEWS = [
  {
    name: 'Ahmed K.',
    stars: 5,
    text: 'Toosi Tailor stitched my wedding sherwani perfectly. The fit was immaculate. Highly recommended to everyone in Karachi!',
  },
  {
    name: 'Bilal R.',
    stars: 5,
    text: 'Been coming here for 5 years. The suit quality is unmatched — every stitch is precise and the fabric falls perfectly.',
  },
  {
    name: 'Usman S.',
    stars: 5,
    text: 'Got three office suits done. Every single one fits like it was machine-made. Exceptional craftsmanship and fair pricing!',
  },
];

export default function TossiTailor() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: '',
    msg: '',
  });
  const styleRef = useRef(null);

  /* inject CSS */
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => document.head.removeChild(el);
  }, []);

  /* scroll spy */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const ids = ['home', 'about', 'services', 'portfolio', 'contact'];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* reveal on scroll */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in');
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', phone: '', service: '', msg: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const navItems = ['home', 'about', 'services', 'portfolio', 'contact'];

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      {/* ── NAVBAR ─────────────────────────────── */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => go('home')}>
          TT
        </div>

        <div className="nav-links">
          {navItems.map((n) => (
            <span
              key={n}
              className={`nl${active === n ? ' active' : ''}`}
              onClick={() => go(n)}
            >
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </span>
          ))}
          <button className="btn-book" onClick={() => go('contact')}>
            Book Now
          </button>
        </div>

        <button className="ham" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map((n) => (
            <span
              key={n}
              className={`nl${active === n ? ' active' : ''}`}
              onClick={() => go(n)}
            >
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </span>
          ))}
          <button
            className="btn-book"
            style={{ fontSize: '1rem', padding: '.85rem 2.5rem' }}
            onClick={() => go('contact')}
          >
            Book Appointment
          </button>
        </div>
      )}

      {/* ── HERO ───────────────────────────────── */}
      <section id="home" className="hero">
        <div className="hero-grid" />

        {/* Orbs */}
        <div
          className="orb"
          style={{
            top: '18%',
            left: '8%',
            width: '420px',
            height: '420px',
            background:
              'radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%)',
          }}
        />
        <div
          className="orb"
          style={{
            bottom: '15%',
            right: '5%',
            width: '320px',
            height: '320px',
            background:
              'radial-gradient(circle,rgba(212,175,55,.12) 0%,transparent 70%)',
          }}
        />
        <div
          className="orb"
          style={{
            top: '55%',
            left: '45%',
            width: '260px',
            height: '260px',
            background:
              'radial-gradient(circle,rgba(96,165,250,.08) 0%,transparent 70%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '1100px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.75rem',
          }}
        >
          {/* Badge */}
          <div
            style={{
              animation: 'fadeIn .7s ease forwards',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.75rem',
              background: 'rgba(37,99,235,.1)',
              border: '1px solid rgba(96,165,250,.3)',
              borderRadius: '999px',
              padding: '.4rem 1.4rem',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--sky)',
                display: 'inline-block',
                animation: 'blink 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: '.75rem',
                color: 'var(--sky)',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Premium Men's Tailoring · Karachi, Pakistan
            </span>
          </div>

          {/* MAIN TITLE */}
          <h1 className="hero-title">
            Toosi
            <br />
            TAILOR
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.05rem,2.5vw,1.45rem)',
              color: 'rgba(219,234,254,.8)',
              animation: 'fadeUp 1s ease .35s both',
              maxWidth: '480px',
            }}
          >
            Where every stitch tells a story of elegance & precision
          </p>

          {/* Gold divider */}
          <div className="gold-bar" style={{ width: '130px', margin: '0' }} />

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              animation: 'fadeUp 1s ease .55s both',
            }}
          >
            <button
              className="btn-book"
              style={{
                padding: '.9rem 2.25rem',
                fontSize: '.95rem',
                borderRadius: '10px',
              }}
              onClick={() => go('contact')}
            >
              ✂️ Book Appointment
            </button>
            <button
              onClick={() => go('portfolio')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(96,165,250,.35)',
                color: 'var(--ice)',
                padding: '.9rem 2.25rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '.95rem',
                transition: 'all .3s',
                fontFamily: "'Inter',sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--sky)';
                e.currentTarget.style.background = 'rgba(37,99,235,.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(96,165,250,.35)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              View Portfolio
            </button>
          </div>

          {/* Stats */}
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: '1.5rem',
              marginTop: '1.5rem',
              width: '100%',
              maxWidth: '680px',
              animation: 'fadeUp 1s ease .75s both',
            }}
          >
            {[
              ['1000+', 'Happy Customers'],
              ['15+', 'Years Experience'],
              ['5000+', 'Suits Crafted'],
              ['100%', 'Satisfaction'],
            ].map(([n, l]) => (
              <div
                key={l}
                style={{
                  textAlign: 'center',
                  padding: '.75rem',
                  background: 'rgba(22,52,112,.18)',
                  border: '1px solid rgba(96,165,250,.1)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 'clamp(1.5rem,4vw,2.4rem)',
                    fontWeight: 700,
                    color: 'var(--sky)',
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: '.65rem',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                    marginTop: '.2rem',
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-ind">
          <span
            style={{
              fontSize: '.65rem',
              color: 'var(--muted)',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '42px',
              background: 'linear-gradient(to bottom,var(--sky),transparent)',
            }}
          />
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────── */}
      <section
        id="about"
        style={{ padding: '7rem 2rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div
          className="reveal"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Photo */}
          <div style={{ position: 'relative' }}>
            <div className="photo-frame">
              {/* Replace the content below with <img src="YOUR_PHOTO_URL" alt="Toosi Tailor" /> */}
              <span
                style={{ fontSize: '4.5rem', position: 'relative', zIndex: 1 }}
              >
                👤
              </span>
              <p
                style={{
                  color: 'var(--sky)',
                  fontSize: '.8rem',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  padding: '0 1.5rem',
                  lineHeight: 1.5,
                }}
              >
                Add Your Photo Here
              </p>
              <p
                style={{
                  color: 'var(--dim)',
                  fontSize: '.68rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Replace with &lt;img&gt; tag
              </p>
            </div>

            {/* Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-24px',
                right: '-24px',
                background: 'linear-gradient(135deg,var(--royal),var(--blue))',
                borderRadius: '14px',
                padding: '1rem 1.4rem',
                border: '1px solid rgba(96,165,250,.3)',
                boxShadow: '0 12px 36px rgba(37,99,235,.35)',
                textAlign: 'center',
                animation: 'float 3.5s ease-in-out infinite',
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--gold)',
                }}
              >
                15+
              </div>
              <div
                style={{
                  fontSize: '.62rem',
                  color: 'var(--ice)',
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                }}
              >
                Years of Mastery
              </div>
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '280px', maxWidth: '560px' }}>
            <span className="sec-label">About The Master</span>
            <h2 className="sec-title">
              Crafting Excellence
              <br />
              <span style={{ color: 'var(--sky)' }}>Since Day One</span>
            </h2>
            <div className="gold-bar" style={{ width: '80px' }} />

            <p
              style={{
                color: '#CBD5E1',
                lineHeight: 1.85,
                marginBottom: '1rem',
                fontSize: '.95rem',
              }}
            >
              At <strong style={{ color: 'var(--ice)' }}>Toosi Tailor</strong>,
              we believe every man deserves clothing that fits perfectly and
              reflects his personal style. With over 15 years of expertise in
              men's tailoring, we bring precision, passion, and premium
              craftsmanship to every garment we create.
            </p>
            <p
              style={{
                color: '#CBD5E1',
                lineHeight: 1.85,
                marginBottom: '2rem',
                fontSize: '.95rem',
              }}
            >
              Serving over{' '}
              <strong style={{ color: 'var(--sky)' }}>
                1,000 satisfied customers
              </strong>{' '}
              across Karachi, our atelier specialises in bespoke suits,
              sherwanis, and traditional Pakistani menswear — each piece crafted
              to your exact measurements.
            </p>

            {[
              ['Suit & Formal Wear Crafting', 98],
              ['Sherwani & Cultural Wear', 95],
              ['Custom Alterations & Repairs', 99],
            ].map(([l, p]) => (
              <div key={l} style={{ marginBottom: '1.1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '.35rem',
                  }}
                >
                  <span style={{ fontSize: '.85rem', color: 'var(--ice)' }}>
                    {l}
                  </span>
                  <span
                    style={{
                      fontSize: '.85rem',
                      color: 'var(--sky)',
                      fontWeight: 600,
                    }}
                  >
                    {p}%
                  </span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────── */}
      <section
        id="services"
        style={{
          padding: '7rem 2rem',
          background:
            'linear-gradient(180deg,transparent,rgba(10,31,61,.5) 50%,transparent)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            className="reveal"
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span className="sec-label">What We Offer</span>
            <h2 className="sec-title">
              Our <span style={{ color: 'var(--sky)' }}>Services</span>
            </h2>
            <div
              className="gold-bar"
              style={{ width: '80px', margin: '1.25rem auto' }}
            />
            <p
              style={{
                color: 'var(--muted)',
                maxWidth: '480px',
                margin: '0 auto',
                fontSize: '.95rem',
              }}
            >
              From casual shalwar kameez to grand wedding sherwanis — stitched
              with the care it deserves.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))',
              gap: '1.5rem',
            }}
          >
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="card reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div style={{ fontSize: '2.6rem', marginBottom: '1rem' }}>
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    marginBottom: '.7rem',
                    color: 'var(--ice)',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    lineHeight: 1.75,
                    fontSize: '.88rem',
                  }}
                >
                  {s.desc}
                </p>
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(96,165,250,.1)',
                    color: 'var(--sky)',
                    fontSize: '.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  onClick={() => go('contact')}
                >
                  Enquire Now →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ──────────────────────────── */}
      <section
        id="portfolio"
        style={{ padding: '7rem 2rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="sec-label">Our Work</span>
          <h2 className="sec-title">
            Portfolio <span style={{ color: 'var(--sky)' }}>Gallery</span>
          </h2>
          <div
            className="gold-bar"
            style={{ width: '80px', margin: '1.25rem auto' }}
          />
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            Replace placeholders with your real garment photos
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))',
            gap: '1rem',
          }}
        >
          {GALLERY.map(({ label, emoji, c, tall }) => (
            <div
              key={label}
              className="gal-item reveal"
              style={{
                height: tall ? '290px' : '210px',
                background: `linear-gradient(135deg,${c},rgba(5,17,31,.85))`,
              }}
            >
              <span
                style={{ fontSize: '2.2rem', position: 'relative', zIndex: 1 }}
              >
                {emoji}
              </span>
              <span
                style={{
                  color: 'var(--ice)',
                  fontSize: '.82rem',
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color: 'var(--dim)',
                  fontSize: '.7rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Add Photo
              </span>
              <div className="overlay">
                <span
                  style={{
                    color: 'var(--ice)',
                    fontSize: '.8rem',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────── */}
      <section
        style={{
          padding: '7rem 2rem',
          background:
            'linear-gradient(180deg,transparent,rgba(10,31,61,.45) 50%,transparent)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            className="reveal"
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span className="sec-label">Customer Love</span>
            <h2 className="sec-title">
              What Customers <span style={{ color: 'var(--sky)' }}>Say</span>
            </h2>
            <div
              className="gold-bar"
              style={{ width: '80px', margin: '1.25rem auto' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))',
              gap: '1.5rem',
            }}
          >
            {REVIEWS.map(({ name, stars, text }) => (
              <div key={name} className="card reveal">
                <div
                  style={{
                    display: 'flex',
                    gap: '.2rem',
                    marginBottom: '1rem',
                  }}
                >
                  {Array(stars)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} style={{ fontSize: '1rem' }}>
                        ⭐
                      </span>
                    ))}
                </div>
                <p
                  style={{
                    color: '#CBD5E1',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                    fontSize: '.9rem',
                  }}
                >
                  "{text}"
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(96,165,250,.1)',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg,var(--blue),var(--royal))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.9rem' }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '.72rem', color: 'var(--dim)' }}>
                      Verified Customer
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT + MAP ──────────────────────── */}
      <section
        id="contact"
        style={{ padding: '7rem 2rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="sec-label">Get In Touch</span>
          <h2 className="sec-title">
            Book Your <span style={{ color: 'var(--sky)' }}>Appointment</span>
          </h2>
          <div
            className="gold-bar"
            style={{ width: '80px', margin: '1.25rem auto' }}
          />
        </div>

        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Info + Form */}
          <div
            className="reveal"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Info cards */}
            {[
              {
                icon: '📞',
                label: 'Phone / WhatsApp',
                value: '03056957968',
                href: 'tel:03056957968',
              },
              {
                icon: '📧',
                label: 'Email',
                value: 'toositailor@gmail.com',
                href: 'mailto:toositailor@gmail.com',
              },
              {
                icon: '📍',
                label: 'Location',
                value: 'Karachi, Pakistan',
                href: null,
              },
              {
                icon: '🕐',
                label: 'Working Hours',
                value: 'Mon – Sat · 9AM – 9PM except Friday',
                href: null,
              },
            ].map(({ icon, label, value, href }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '.95rem 1.25rem',
                  background: 'rgba(22,52,112,.15)',
                  border: '1px solid rgba(96,165,250,.1)',
                  borderRadius: '12px',
                  transition: 'all .3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(96,165,250,.4)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(96,165,250,.1)')
                }
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '11px',
                    background:
                      'linear-gradient(135deg,var(--royal),var(--blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '.65rem',
                      color: 'var(--dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '.12em',
                      marginBottom: '.1rem',
                    }}
                  >
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      style={{
                        color: 'var(--ice)',
                        fontWeight: 500,
                        textDecoration: 'none',
                        fontSize: '.92rem',
                      }}
                    >
                      {value}
                    </a>
                  ) : (
                    <div
                      style={{
                        color: 'var(--ice)',
                        fontWeight: 500,
                        fontSize: '.92rem',
                      }}
                    >
                      {value}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              className="wa"
              href="https://wa.me/923056957968"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Chat on WhatsApp
            </a>

            {/* Quick form */}
            <div
              style={{
                background: 'rgba(22,52,112,.15)',
                border: '1px solid rgba(96,165,250,.12)',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '1.2rem',
                  marginBottom: '1.25rem',
                  color: 'var(--ice)',
                }}
              >
                Send a Message
              </h3>

              {sent && (
                <div
                  style={{
                    background: 'rgba(37,211,102,.12)',
                    border: '1px solid rgba(37,211,102,.3)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    color: '#4ade80',
                    fontSize: '.9rem',
                  }}
                >
                  ✅ Message sent! We'll contact you shortly.
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.85rem',
                }}
              >
                <input
                  className="ci"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="ci"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
                <select
                  className="ci"
                  value={form.service}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, service: e.target.value }))
                  }
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="" disabled>
                    Select a Service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s.title} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <textarea
                  className="ci"
                  placeholder="Your Message or Requirements"
                  rows={3}
                  value={form.msg}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, msg: e.target.value }))
                  }
                  required
                />
                <button
                  type="submit"
                  className="btn-book"
                  style={{
                    padding: '.9rem',
                    fontSize: '.95rem',
                    borderRadius: '10px',
                  }}
                >
                  Send Message ✉️
                </button>
              </form>
            </div>
          </div>

          {/* Right: Map */}
          <div
            className="reveal"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div className="map-wrap" style={{ height: '680px' }}>
              {/*
                UPDATE: Replace the src below with your exact shop address on Google Maps.
                Go to maps.google.com → find your shop → Share → Embed a map → Copy the src URL.
              */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231203.33397690595!2d66.87484649999999!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C+Karachi+City%2C+Sindh%2C+Pakistan!5e0!3m2!1sen!2s!4v1558621085477!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'invert(90%) hue-rotate(180deg) saturate(1.1)',
                  display: 'block',
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Toosi Tailor Location — Karachi"
              />
            </div>
            <p
              style={{
                fontSize: '.75rem',
                color: 'var(--dim)',
                textAlign: 'center',
              }}
            >
              📍 Replace map src with your exact shop coordinates for a precise
              pin
            </p>

            {/* Directions CTA */}
            <a
              href="https://maps.google.com/?q=Karachi+Pakistan"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '.6rem',
                background: 'rgba(22,52,112,.25)',
                border: '1px solid rgba(96,165,250,.2)',
                color: 'var(--ice)',
                textDecoration: 'none',
                padding: '.85rem',
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '.9rem',
                transition: 'all .3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = 'var(--sky)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(96,165,250,.2)')
              }
            >
              🗺️ Get Directions on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="footer">
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '2.4rem',
            fontWeight: 900,
            color: 'var(--gold)',
            marginBottom: '.6rem',
            letterSpacing: '.05em',
          }}
        >
          Toosi TAILOR
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontStyle: 'italic',
            color: 'var(--dim)',
            fontSize: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          Premium Men's Tailoring · Karachi, Pakistan
        </p>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {navItems.map((n) => (
            <span
              key={n}
              className="nl"
              onClick={() => go(n)}
              style={{ cursor: 'pointer', fontSize: '.78rem' }}
            >
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </span>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          {[
            { label: '📞 03056957968', href: 'tel:03056957968' },
            {
              label: '📧 toositailor@gmail.com',
              href: 'mailto:toositailor@gmail.com',
            },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                color: 'var(--muted)',
                textDecoration: 'none',
                fontSize: '.82rem',
                transition: 'color .3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sky)')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--muted)')
              }
            >
              {label}
            </a>
          ))}
        </div>
        <div
          className="gold-bar"
          style={{ maxWidth: '180px', margin: '0 auto 1.5rem' }}
        />
        <p style={{ color: 'var(--dim)', fontSize: '.75rem' }}>
          © {new Date().getFullYear()} Toosi Tailor. All rights reserved. · Made
          with ❤️ in Karachi
        </p>
      </footer>
    </div>
  );
}
