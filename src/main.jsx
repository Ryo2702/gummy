import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  X,
  ShoppingBag,
  Menu,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { variants, updateCart, readCart } from "./cart";
import "./style.css";
gsap.registerPlugin(ScrollTrigger);
const A = "/images/";
const photos = {
  work: "photo-1497366754035-f200968a6e72",
  gym: "photo-1534438327276-14e5300c3a48",
  city: "photo-1519608487953-e999c86e7455",
  home: "photo-1449247709967-d4461a6a6103",
  morning: "photo-1476480862126-209bfaa8edc8",
  commute: "photo-1519501025264-65ba15a82390",
};
function Photo({ kind, alt, className = "", eager = false }) {
  const local = kind === "runner" || kind === "macro";
  const src = local
    ? `${A}${kind}.webp`
    : `https://images.unsplash.com/${photos[kind]}?auto=format&fit=crop`;
  return (
    <img
      className={className}
      src={local ? src : `${src}&w=1000&q=80`}
      srcSet={
        local
          ? `${A}${kind}-small.webp 640w, ${src} 1536w`
          : `${src}&w=480&q=75 480w, ${src}&w=1000&q=80 1000w, ${src}&w=1600&q=80 1600w`
      }
      sizes="(max-width: 700px) 100vw, 65vw"
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
function ProductImage({ variant = "eclipse", className = "", eager = false }) {
  return (
    <img
      className={`product-image ${className}`}
      src={`${A}${variant}.webp`}
      alt={`AFTR. ${variants[variant].name} recovery gummy concept packaging`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
function Star({ className = "" }) {
  return (
    <svg
      className={`star ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M50 0 57 32 85 15 68 43 100 50 68 57 85 85 57 68 50 100 43 68 15 85 32 57 0 50 32 43 15 15 43 32Z"
        fill="currentColor"
      />
    </svg>
  );
}
function Label({ children, className = "" }) {
  return <span className={`label ${className}`}>{children}</span>;
}
function Button({ children, href, className = "", onClick }) {
  const reduced = useReducedMotion();
  const pointer = {
    onPointerMove: (event) => {
      if (reduced || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.translate = `${Math.max(-4, Math.min(4, (event.clientX - bounds.left - bounds.width / 2) * 0.08))}px ${Math.max(-3, Math.min(3, (event.clientY - bounds.top - bounds.height / 2) * 0.08))}px`;
    },
    onPointerLeave: (event) => {
      event.currentTarget.style.translate = "0px 0px";
    },
  };
  return href ? (
    <a href={href} className={`button ${className}`} {...pointer}>
      {children}
      <ArrowUpRight size={19} />
    </a>
  ) : (
    <motion.button
      {...pointer}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`button ${className}`}
    >
      {children}
      <ArrowUpRight size={19} />
    </motion.button>
  );
}
function Selector({ value, onChange }) {
  return (
    <div className="selector" role="group" aria-label="Packaging colorway">
      {Object.entries(variants).map(([key, v], i) => (
        <button
          key={key}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          <i style={{ background: v.color }} />
          <span>
            0{i + 1} / {v.name}
          </span>
          <span className="selected-mark">{value === key ? "↗" : "+"}</span>
        </button>
      ))}
    </div>
  );
}
function Quantity({ value, onChange, label = "Quantity" }) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <output aria-label={label}>{value}</output>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
const info = [
  [
    "The product",
    "AFTR. is a nighttime recovery gummy concept. Eclipse and Volt are two packaging identities for the same core product, not different formulations.",
  ],
  [
    "Ingredients & allergens",
    "Unverified placeholder. The final formula, ingredients and allergen information have not been supplied.",
  ],
  [
    "Your nighttime ritual",
    "Unverified placeholder. Dosage, directions, suitability and safety information must be supplied and verified before use.",
  ],
  [
    "Shipping & returns",
    "Demonstration only. This concept is not available to purchase. Pricing, shipping and return policies are not finalized.",
  ],
];
function Details({ all = false }) {
  return (
    <div className="details">
      {(all ? info : info.slice(1, 3)).map(([title, text]) => (
        <details key={title}>
          <summary>
            {title}
            <Plus size={17} />
          </summary>
          <p>{text}</p>
        </details>
      ))}
    </div>
  );
}
function Header({ count, openBag, page }) {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <>
      <div className="announcement">
        <span>FOR THE HOURS THAT MAKE YOU.</span>
        <span>RECOVER TONIGHT. OWN TOMORROW. ↗</span>
      </div>
      <header>
        <a className="logo" href="/" aria-label="AFTR. home">
          AFTR.
        </a>
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          <a
            href="/product"
            aria-current={page === "/product" ? "page" : undefined}
          >
            THE PRODUCT
          </a>
          <a href="/#ritual">THE RITUAL</a>
          <a
            href="/about"
            aria-current={page === "/about" ? "page" : undefined}
          >
            THE CLUB
          </a>
          <a
            href="/contact"
            aria-current={page === "/contact" ? "page" : undefined}
          >
            SAY HELLO <ArrowUpRight size={12} />
          </a>
        </nav>
        <div className="nav-actions">
          <button
            className="bag-button"
            onClick={openBag}
            aria-label={`Open bag, ${count} items`}
          >
            BAG <span>{String(count).padStart(2, "0")}</span>
            <ShoppingBag size={16} />
          </button>
          <button
            className="mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={menu ? "Close navigation" : "Open navigation"}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
function Hero({ variant, setVariant }) {
  const hero = useRef();
  const reduced = useReducedMotion();
  function parallax(e) {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(".hero-product", {
      x: (e.clientX - r.left - r.width / 2) * 0.025,
      y: (e.clientY - r.top - r.height / 2) * 0.02,
      duration: 0.8,
    });
    gsap.to(".hero-photo", {
      x: (e.clientX - r.left - r.width / 2) * 0.008,
      duration: 1,
    });
  }
  return (
    <section
      className="hero"
      ref={hero}
      onPointerMove={parallax}
      onPointerLeave={() => {
        gsap.to(".hero-product,.hero-photo", { x: 0, y: 0, duration: 0.8 });
      }}
    >
      <div className="hero-background-type" aria-hidden="true">
        AFTR.
      </div>
      <div className="hero-top">
        <Label>
          <i className="live-dot" /> THE AFTERHOURS CLUB
        </Label>
        <Label>EST. FOR THE EVERYDAY / VOL. 001</Label>
      </div>
      <div className="hero-photo">
        <Photo
          kind="runner"
          alt="Runner in motion under ultraviolet city lights"
          eager
        />
        <span className="photo-coordinate">35°40′ N / ALWAYS IN MOTION</span>
      </div>
      <div className="hero-city">
        <Photo kind="commute" alt="City lights after dark" />
      </div>
      <div className="hero-copy">
        <h1>
          <span>THE DAY</span>
          <span>ENDS.</span>
          <span className="lime">YOU DON'T.</span>
        </h1>
        <p>
          For everything you give to today,
          <br />
          make room for tomorrow.
        </p>
        <Button href="#colorways">EXPLORE THE RITUAL</Button>
      </div>
      <div className="hero-product">
        <ProductImage variant={variant} eager />
        <span className="product-note">
          NIGHTTIME RECOVERY
          <br />A NEW KIND OF RITUAL.
        </span>
      </div>
      <div className="club-sticker">
        <span>OFF DUTY.</span>
        <Star />
        <span>STILL YOU.</span>
      </div>
      <div className="hero-index">
        <Label>CHOOSE YOUR AFTERHOURS</Label>
        <Selector value={variant} onChange={setVariant} />
      </div>
      <a className="scroll-cue" href="#everyday">
        <span>SCROLL INTO THE NIGHT</span>
        <ArrowDown size={16} />
      </a>
      <div className="hero-baseline">
        <span>LESS GO. MORE AGAIN.</span>
        <span>NO FINISH LINE. JUST TOMORROW.</span>
        <span>01 — 06</span>
      </div>
    </section>
  );
}
function Marquee() {
  return (
    <div
      className="marquee"
      aria-label="Run harder. Live fuller. Rest deeper. Repeat."
    >
      <div className="marquee-track" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>
            RUN HARDER <Star />
            <b>LIVE FULLER</b>
            <Star /> REST DEEPER <Star />
            <b>REPEAT</b>
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
function Lifestyle() {
  return (
    <section className="lifestyle" id="everyday">
      <div className="section-top">
        <Label>01 / LIFE DOESN'T CLOCK OUT</Label>
        <Label>MADE FOR YOUR KIND OF EVERYDAY</Label>
      </div>
      <div className="life-heading">
        <h2>
          RECOVERY ISN'T
          <br />
          JUST FOR <span className="outline">ATHLETES.</span>
        </h2>
        <p>
          The last mile. The late shift. The long way home.
          <br />
          Whatever your day looks like, the night is yours.
        </p>
      </div>
      <div className="collage">
        <figure className="collage-run image-reveal">
          <Photo kind="runner" alt="Night runner moving through the city" />
          <figcaption>
            <b>01</b> THE EXTRA MILE.
          </figcaption>
        </figure>
        <figure className="collage-work image-reveal">
          <Photo kind="work" alt="Workspace at the end of a long workday" />
          <figcaption>02 / THE LAST EMAIL.</figcaption>
        </figure>
        <figure className="collage-gym image-reveal">
          <Photo kind="gym" alt="Training equipment in a gym" />
          <figcaption>03 / ONE MORE REP.</figcaption>
        </figure>
        <div className="collage-word">
          ALL IN.
          <br />
          <span>ALL DAY.</span>
          <Star />
        </div>
        <figure className="collage-commute image-reveal">
          <Photo kind="commute" alt="City skyline on the evening commute" />
          <figcaption>04 / THE WAY HOME.</figcaption>
        </figure>
        <figure className="collage-walk image-reveal">
          <Photo kind="city" alt="City atmosphere after sunset" />
          <figcaption>05 / YOUR OWN PACE.</figcaption>
        </figure>
        <figure className="collage-home image-reveal">
          <Photo kind="home" alt="A quiet corner to unwind at home" />
          <figcaption>06 / FINALLY, OFF.</figcaption>
        </figure>
        <div className="collage-caption">
          <span className="cross">+</span>
          <Label>
            YOU DON'T HAVE TO EARN YOUR REST.
            <br />
            YOU JUST HAVE TO MAKE ROOM FOR IT.
          </Label>
        </div>
      </div>
      <div className="life-bottom">
        <span>BIG DAYS. SMALL WINS. EVERYTHING IN BETWEEN.</span>
        <a className="text-link" href="/about">
          MEET YOUR CLUB <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
function Colorways({ variant, setVariant }) {
  const reduced = useReducedMotion();
  const [baseColor, setBaseColor] = useState(variants[variant].color);
  return (
    <section
      id="colorways"
      className={`colorways ${variant}`}
      style={{
        "--base": baseColor,
        "--accent": variants[variant].color,
        "--deep": variants[variant].dark,
      }}
    >
      <div
        className="color-spread"
        key={variant}
        onAnimationEnd={() => setBaseColor(variants[variant].color)}
      />
      <div className="section-top">
        <Label>02 / FIND YOUR FREQUENCY</Label>
        <Label>TWO EXPRESSIONS. ONE RITUAL.</Label>
      </div>
      <div className="colorway-layout">
        <div className="colorway-art">
          <span className="colorway-number">
            0{variant === "eclipse" ? 1 : 2}
          </span>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <Star className="colorway-star" />
          <AnimatePresence mode="wait">
            <motion.div
              key={variant}
              className="switch-product"
              initial={
                reduced
                  ? false
                  : { x: -140, rotate: -18, clipPath: "inset(0 100% 0 0)" }
              }
              animate={{ x: 0, rotate: 0, clipPath: "inset(0 0% 0 0)" }}
              exit={
                reduced
                  ? {}
                  : { x: 140, rotate: 12, clipPath: "inset(0 0 0 100%)" }
              }
              transition={{
                duration: reduced ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductImage variant={variant} />
            </motion.div>
          </AnimatePresence>
          <Label className="art-note">AFTR. / THE NIGHTTIME COLLECTION</Label>
        </div>
        <div className="colorway-copy">
          <h2>
            SAME RITUAL.
            <br />
            DIFFERENT ENERGY.
          </h2>
          <AnimatePresence mode="wait">
            <motion.h3
              key={variant}
              initial={reduced ? false : { y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              {variant.toUpperCase()}
              <span>↗</span>
            </motion.h3>
          </AnimatePresence>
          <p>
            {variant === "eclipse"
              ? "For your quieter kind of loud. Deep violet. After-dark energy."
              : "A little electric. Unapologetically bright. Your night, on your terms."}
          </p>
          <Selector value={variant} onChange={setVariant} />
          <Label>THE SAME CORE PRODUCT. YOUR CHOICE OF PACKAGING.</Label>
          <Button href={`/product?colorway=${variant}`} className="dark-button">
            FIND YOUR AFTERHOURS
          </Button>
        </div>
      </div>
    </section>
  );
}
const chapters = [
  {
    num: "01",
    title: "THE MOTION",
    headline: (
      <>
        YOU GAVE TODAY
        <br />
        EVERYTHING.
      </>
    ),
    photo: "runner",
    alt: "An athlete running through a dark city",
    copy: "Every mile. Every meeting. Every little thing.",
  },
  {
    num: "02",
    title: "THE RESET",
    headline: (
      <>
        NOW MAKE
        <br />
        ROOM FOR REST.
      </>
    ),
    photo: "macro",
    alt: "Translucent purple gummies in dramatic studio lighting",
    copy: "Close the laptop. Turn down the noise. Take your night back.",
  },
  {
    num: "03",
    title: "THE NEXT DAY",
    headline: (
      <>
        TOMORROW
        <br />
        IS WAITING.
      </>
    ),
    photo: "morning",
    alt: "Runner on a path in soft morning light",
    copy: "A fresh start. At your own pace.",
  },
];
function Ritual() {
  return (
    <section id="ritual" className="ritual">
      <div className="ritual-heading">
        <Label>03 / FROM ALL IN TO ALL OUT</Label>
        <h2>
          THERE'S AN <em>AFTR.</em>
          <br />
          TO EVERY DAY.
        </h2>
      </div>
      {chapters.map((c, i) => (
        <article className={`chapter chapter-${i}`} key={c.num}>
          <div className="chapter-photo image-reveal">
            <Photo kind={c.photo} alt={c.alt} />
          </div>
          <div className="chapter-shade" />
          <div className="chapter-top">
            <Label>
              CHAPTER {c.num} / {c.title}
            </Label>
            <span>AFTR. HOURS</span>
          </div>
          <h2>{c.headline}</h2>
          <div className="chapter-bottom">
            <p>{c.copy}</p>
            <span>
              {c.num} <span className="line" /> 03
            </span>
          </div>
          {i === 1 && <ProductImage className="reset-product" />}
        </article>
      ))}
    </section>
  );
}
function Closeup() {
  return (
    <section className="closeup">
      <div className="macro-art">
        <Photo
          kind="macro"
          alt="Close-up of the textured, translucent gummy concept"
        />
        <div className="macro-cross cross">+</div>
        <Label>TEXTURE STUDY / 001</Label>
        <span className="macro-caption">
          SMALL RITUAL.
          <br />
          BIG MAIN CHARACTER ENERGY.
        </span>
      </div>
      <div className="macro-copy">
        <Label>04 / GET A LITTLE CLOSER</Label>
        <h2>
          A LITTLE
          <br />
          <em>AFTR.</em>
          <br />
          GOES A LONG WAY.
        </h2>
        <p>
          A moment to call your own. A nighttime gummy concept for the hours
          between doing it all and doing it again.
        </p>
        <Details />
        <p className="fine">
          Concept imagery. Formula, ingredients and usage details are unverified
          placeholders.
        </p>
        <a href="/product" className="text-link">
          EXPLORE THE PRODUCT <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
function Manifesto() {
  return (
    <section className="manifesto">
      <div className="manifesto-first">
        <Label>05 / THE AFTERHOURS MANIFESTO</Label>
        <span className="manifesto-index">(01)</span>
        <h2>
          YOU ARE NOT
          <br />A <span className="outline">MACHINE.</span>
        </h2>
        <Star />
        <p>
          Being human is a full-time thing.
          <br />
          Taking a pause is part of it.
        </p>
      </div>
      <div className="manifesto-second">
        <Label>(02) / A NOTE TO YOURSELF</Label>
        <h2>
          REST IS PART
          <br />
          OF THE <em>ROUTINE.</em>
        </h2>
        <span className="vertical-note">RECOVERY IS A MINDSET.</span>
      </div>
      <div className="manifesto-third">
        <Photo kind="morning" alt="A new day on a sunlit running path" />
        <Label>(03) / SEE YOU ON THE OTHER SIDE</Label>
        <h2>
          SHOW UP
          <br />
          AGAIN
          <br />
          <span>TOMORROW.</span>
        </h2>
        <a
          href="/about"
          className="circle-link"
          aria-label="Read the AFTR. story"
        >
          <ArrowUpRight />
        </a>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Label>YOUR NIGHT. YOUR RITUAL. YOUR CLUB.</Label>
          <h2>
            AFTER HOURS.
            <br />
            <span>BEFORE ANYTHING.</span>
          </h2>
        </div>
        <Button href="/product">MAKE ROOM FOR AFTR.</Button>
      </div>
      <div className="footer-links">
        <a href="/" className="logo">
          AFTR.
        </a>
        <p>THE DAY ENDS. YOU DON'T.</p>
        <nav aria-label="Footer navigation">
          <a href="/product">PRODUCT</a>
          <a href="/about">THE CLUB</a>
          <a href="/contact">CONTACT ↗</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AFTR. — THE AFTERHOURS CLUB.</span>
        <span>AN INDEPENDENT BRAND CONCEPT / DEMO STORE</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
function Product({ variant, setVariant, addToBag }) {
  const [quantity, setQuantity] = useState(1),
    [view, setView] = useState("packaging");
  return (
    <>
      <section className="product-page">
        <div
          className="product-gallery"
          style={{
            "--accent": variants[variant].color,
            "--deep": variants[variant].dark,
          }}
        >
          <Label>THE AFTERHOURS COLLECTION / 001</Label>
          <span className="gallery-word" aria-hidden="true">
            {variant.toUpperCase()}
          </span>
          {view === "packaging" ? (
            <ProductImage variant={variant} eager />
          ) : (
            <Photo kind="macro" alt="Macro gummy concept photograph" eager />
          )}
          <Star />
          <div
            className="gallery-controls"
            role="group"
            aria-label="Product gallery"
          >
            <button
              aria-pressed={view === "packaging"}
              onClick={() => setView("packaging")}
            >
              01 / THE PACKAGING
            </button>
            <button
              aria-pressed={view === "detail"}
              onClick={() => setView("detail")}
            >
              02 / THE DETAIL
            </button>
          </div>
        </div>
        <div className="product-info">
          <Label>NOT ANOTHER TASK. YOUR NIGHTTIME RITUAL.</Label>
          <h1>
            A LITTLE
            <br />
            MORE <em>AFTR.</em>
          </h1>
          <p className="product-name">NIGHTTIME RECOVERY GUMMY CONCEPT</p>
          <p>
            For everything you give to today, make room for tomorrow. Two
            colorways. The same core product. One moment that's yours.
          </p>
          <div className="product-price">
            <b>$32.00</b>
            <Label>DEMO PRICE / NOT FOR SALE</Label>
          </div>
          <Label>CHOOSE YOUR COLORWAY — {variant.toUpperCase()}</Label>
          <Selector value={variant} onChange={setVariant} />
          <div className="buy-row">
            <Quantity value={quantity} onChange={setQuantity} />
            <Button onClick={() => addToBag(variant, quantity)}>
              ADD TO DEMO BAG
            </Button>
          </div>
          <p className="fine">
            Demonstration only. No payment, order or reservation is created.
          </p>
          <Details all />
        </div>
      </section>
      <div className="mobile-purchase">
        <span>
          AFTR. / {variant.toUpperCase()}
          <small>$32.00 · DEMO</small>
        </span>
        <Button onClick={() => addToBag(variant, quantity)}>ADD TO BAG</Button>
      </div>
      <Marquee />
      <Closeup />
    </>
  );
}
function About() {
  return (
    <>
      <section className="about-hero">
        <Label>THE AFTERHOURS CLUB / EVERYBODY'S INVITED</Label>
        <h1>
          FOR PEOPLE
          <br />
          WITH A{" "}
          <span className="lime">
            LOT
            <br />
            GOING ON.
          </span>
        </h1>
        <div className="about-photo image-reveal">
          <Photo
            kind="runner"
            alt="An everyday athlete running after dark"
            eager
          />
        </div>
        <div className="club-sticker">
          <span>ALL PACES.</span>
          <Star />
          <span>ALL PEOPLE.</span>
        </div>
        <p>
          We're here for the part of your day
          <br />
          that belongs to you.
        </p>
      </section>
      <section className="about-philosophy">
        <Label>01 / THE IDEA BEHIND AFTR.</Label>
        <h2>
          YOUR LIFE DOESN'T
          <br />
          COME WITH AN
          <br />
          <span className="outline">OFF SWITCH.</span>
        </h2>
        <div>
          <span className="cross">+</span>
          <p>
            Work runs late. The last train is packed. You squeeze a run into the
            space between everything else. We know the feeling.
            <br />
            <br />
            AFTR. starts with a simple idea: making time for yourself belongs in
            everyday life. Not as a reward for doing enough. Just because you're
            a person.
            <br />
            <br />
            Our nighttime gummy concept is an invitation to mark that
            transition. From being everywhere for everyone, to being here for
            yourself.
          </p>
        </div>
      </section>
      <Lifestyle />
      <section className="about-band">
        <Star />
        <h2>
          NO PERSONAL BEST
          <br />
          REQUIRED.
        </h2>
        <p>
          No qualifying time. No perfect routine.
          <br />
          Just you, as you are.
          <br />
          <a href="/contact" className="text-link">
            SAY HELLO TO THE CLUB ↗
          </a>
        </p>
      </section>
      <Manifesto />
    </>
  );
}
function Contact() {
  const [message, setMessage] = useState("");
  return (
    <section className="contact-page">
      <div className="contact-intro">
        <Label>GOOD CONVERSATIONS START AFTER HOURS.</Label>
        <h1>
          YOU UP?
          <br />
          <span className="outline">SAY</span>
          <br />
          <em>HELLO.</em>
        </h1>
        <Star />
        <p>
          Questions. Ideas. A little late-night inspiration.
          <br />
          There's room for all of it here.
        </p>
        <Label>THE AFTERHOURS CLUB / OPEN TO EVERYONE</Label>
      </div>
      <div className="contact-form">
        <Label>01 / DROP US A NOTE</Label>
        <h2>
          WHAT'S ON
          <br />
          YOUR MIND?
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            if (
              !String(data.get("name")).trim() ||
              !String(data.get("message")).trim()
            ) {
              setMessage(
                "Please enter your name and a message, not just spaces.",
              );
              return;
            }
            setMessage(
              "Your note is ready, but has not been sent. This demo has no messaging integration.",
            );
          }}
        >
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              placeholder="First and last name"
              maxLength={100}
              required
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />
          </label>
          <label>
            What's this about?
            <select name="topic">
              <option>Just saying hello</option>
              <option>Product question</option>
              <option>Creative collaboration</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            Your message
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us what's on your mind…"
              required
              minLength={5}
              maxLength={2000}
            />
          </label>
          <p className="fine">
            Demo form. Fields are validated locally; nothing is sent or stored.
          </p>
          <Button>CHECK YOUR MESSAGE</Button>
          <p className="form-status" role="status">
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}
function Bag({ dialog, cart, setCart }) {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <dialog
      ref={dialog}
      className="cart"
      aria-label="Your demo bag"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current.close();
      }}
    >
      <div className="cart-inner">
        <div className="cart-heading">
          <Label>YOUR AFTERHOURS / DEMO BAG</Label>
          <button aria-label="Close bag" onClick={() => dialog.current.close()}>
            <X />
          </button>
        </div>
        <h2>
          GOOD
          <br />
          CHOICE<span className="lime">.</span>
        </h2>
        {!count ? (
          <div className="empty">
            <p>Your bag is taking the night off.</p>
            <Button href="/product">FIND YOUR RITUAL</Button>
          </div>
        ) : (
          <>
            {Object.entries(cart)
              .filter(([, n]) => n > 0)
              .map(([key, n]) => (
                <div className="cart-item" key={key}>
                  <ProductImage variant={key} />
                  <div>
                    <h3>AFTR. / {key.toUpperCase()}</h3>
                    <Label>RECOVERY GUMMY CONCEPT · $32 DEMO</Label>
                    <Quantity
                      value={n}
                      label={key}
                      onChange={(q) => setCart((c) => updateCart(c, key, q))}
                    />
                    <button
                      className="remove"
                      onClick={() => setCart((c) => updateCart(c, key, 0))}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            <div className="cart-total">
              <span>DEMO SUBTOTAL</span>
              <b>${(count * 32).toFixed(2)}</b>
            </div>
            <p className="fine">
              This is a demonstration bag. Nothing is reserved, and checkout is
              not available. All commercial information is placeholder data.
            </p>
            <button className="button" onClick={() => dialog.current.close()}>
              KEEP EXPLORING <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
function App() {
  const page = window.location.pathname.replace(/\/$/, "") || "/";
  const [variant, setVariant] = useState(
    new URLSearchParams(location.search).get("colorway") === "volt"
      ? "volt"
      : "eclipse",
  );
  const [cart, setCart] = useState(() => {
    try {
      return readCart(sessionStorage.getItem("aftr-demo-cart"));
    } catch {
      return {};
    }
  });
  const dialog = useRef();
  const root = useRef();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  useEffect(() => {
    try {
      sessionStorage.setItem("aftr-demo-cart", JSON.stringify(cart));
    } catch {
      /* Cart remains usable when browser storage is unavailable. */
    }
  }, [cart]);
  useEffect(() => {
    document.title =
      page === "/product"
        ? "AFTR. — Your nighttime ritual"
        : page === "/about"
          ? "AFTR. — The Afterhours Club"
          : page === "/contact"
            ? "AFTR. — Say hello"
            : "AFTR. — The day ends. You don’t.";
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const lenis = new Lenis({
          anchors: true,
          duration: 0.9,
          prevent: (node) => node.closest("dialog"),
        });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        const intro = gsap.timeline();
        if (page === "/") {
          intro
            .fromTo(
              ".intro",
              { clipPath: "inset(0 0 0 0)" },
              {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.7,
                delay: 0.25,
                ease: "power4.inOut",
              },
            )
            .from(
              ".hero-copy h1 span",
              {
                yPercent: 115,
                rotation: 3,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power4.out",
              },
              "-.25",
            )
            .from(
              ".hero-photo",
              { clipPath: "polygon(0 0,0 0,0 100%,0 100%)", duration: 1 },
              "-.8",
            )
            .from(
              ".hero-product",
              { x: 180, rotation: 12, opacity: 0, duration: 1.1 },
              "-.8",
            )
            .from(
              ".hero-top,.hero-index,.scroll-cue",
              { opacity: 0, stagger: 0.15, duration: 0.5 },
              "-.5",
            );
        }
        gsap.utils.toArray(".image-reveal").forEach((el) =>
          gsap.fromTo(
            el,
            { clipPath: "inset(12% 0 12% 0)" },
            {
              clipPath: "inset(0% 0 0% 0)",
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 95%",
                end: "top 40%",
                scrub: 0.6,
              },
            },
          ),
        );
        if (document.querySelector(".marquee-track"))
          gsap.to(".marquee-track", {
            xPercent: -25,
            ease: "none",
            duration: 35,
            repeat: -1,
          });
        if (document.querySelector(".collage")) {
          gsap.from(".collage-work", {
            y: 80,
            scrollTrigger: {
              trigger: ".collage",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
          gsap.from(".collage-gym", {
            x: 55,
            scrollTrigger: {
              trigger: ".collage",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
        gsap.utils.toArray(".chapter h2").forEach((el) =>
          gsap.from(el, {
            x: -60,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 35%",
              scrub: 0.7,
            },
          }),
        );
        return () => {
          lenis.destroy();
          gsap.ticker.remove(tick);
        };
      },
      root,
    );
    return () => mm.revert();
  }, [page]);
  function addToBag(key, n) {
    setCart((c) => updateCart(c, key, (c[key] || 0) + n));
    dialog.current.showModal();
  }
  return (
    <MotionConfig reducedMotion="user">
      <div ref={root} id="top" style={{ "--accent": "#d5ff3f" }}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {page === "/" && (
          <div className="intro" aria-hidden="true">
            AFTR<span>.</span>
          </div>
        )}
        <Header
          count={count}
          page={page}
          openBag={() => dialog.current.showModal()}
        />
        <main id="main">
          {page === "/" ? (
            <>
              <Hero variant={variant} setVariant={setVariant} />
              <Marquee />
              <Lifestyle />
              <Colorways variant={variant} setVariant={setVariant} />
              <Ritual />
              <Closeup />
              <Manifesto />
            </>
          ) : page === "/product" ? (
            <Product
              variant={variant}
              setVariant={setVariant}
              addToBag={addToBag}
            />
          ) : page === "/about" ? (
            <About />
          ) : page === "/contact" ? (
            <Contact />
          ) : (
            <section className="not-found">
              <Label>404 / WRONG TURN, RIGHT CLUB</Label>
              <h1>
                LOST AFTER
                <br />
                HOURS?
              </h1>
              <Button href="/">TAKE ME HOME</Button>
            </section>
          )}
        </main>
        <Footer />
        <Bag dialog={dialog} cart={cart} setCart={setCart} />
      </div>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(<App />);
