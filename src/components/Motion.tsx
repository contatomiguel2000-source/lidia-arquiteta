"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { faq, nav, projects, sectors, steps, studio, testimonials, timeline, videos, type Project } from "@/lib/data";
import { asset } from "@/lib/base-path";
import { IconArrow, IconPlus, IconRight } from "./Icons";
import { Magnetic, RevealImage, Split } from "./FX";

/* ---------- utilitários ---------- */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Progresso (0 a 1) do elemento atravessando a tela. */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(clamp((window.innerHeight - r.top) / (r.height + window.innerHeight)));
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p] as const;
}

/** Progresso (0 a 1) de uma seção "presa" (sticky): 0 quando o topo chega ao topo da tela, 1 quando o fim chega ao fim. */
function usePinProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      setP(run > 0 ? clamp(-r.top / run) : 0);
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p] as const;
}

function useEsc(active: boolean, close: () => void, extra?: (e: KeyboardEvent) => void) {
  useEffect(() => {
    if (!active) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      extra?.(e);
    };
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", k);
    };
  }, [active, close, extra]);
}

const wrap = "mx-auto w-full max-w-[calc(1160px+2rem)] px-4 md:max-w-[calc(1160px+4rem)] md:px-8";

/* ---------- cabeçalho + menu em tela cheia ---------- */
const menuImages = ["/img/ranch-fachada-0.webp", "/img/agrobox-3.webp", "/img/beauty-3.webp", "/img/lidia-blazer.webp", "/img/suite-1.webp", "/img/valinhos-living-0.webp"];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const close = useCallback(() => setOpen(false), []);
  useEsc(open, close);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.75);
      setHidden(y > 600 && y > last);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const light = !solid && !open;
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open ? "-translate-y-full" : ""} ${solid && !open ? "bg-paper/90 backdrop-blur-md" : ""}`}>
        <div className={`${wrap} grid h-16 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr] ${light ? "text-paper" : "text-ink"}`}>
          <a href="#inicio" className="text-[1.05rem] font-semibold tracking-[-0.04em]" onClick={close}>
            Lidia Penteado<sup className="ml-0.5 text-[0.6rem] font-medium">arq.</sup>
          </a>
          <p className={`label hidden md:block ${light ? "text-paper/85" : "text-muted"}`}>Desde 2010 · Valinhos · São Paulo</p>
          <div className="flex items-center justify-self-end gap-2">
            <a href={studio.waitlist} target="_blank" rel="noopener noreferrer" className="btn max-sm:hidden bg-pitaya py-2 text-[0.82rem] text-paper hover:bg-ink">
              Lista de espera
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className={`flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md transition-colors ${light ? "bg-paper/15 backdrop-blur hover:bg-paper/30" : "bg-mist hover:bg-line"}`}
            >
              <span className={`h-px w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 bg-paper transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] ${open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"}`} aria-hidden={!open}>
        <div className={`${wrap} grid h-full items-center gap-10 pt-16 md:grid-cols-[1.2fr_1fr]`}>
          <nav aria-label="Menu principal">
            {nav.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                tabIndex={open ? 0 : -1}
                onClick={close}
                onMouseEnter={() => setHover(i)}
                className="group flex items-baseline gap-4 border-b border-line py-3 transition-colors md:py-4"
                style={{ transition: `opacity .6s ${open ? 0.25 + i * 0.05 : 0}s, transform .6s ${open ? 0.25 + i * 0.05 : 0}s`, opacity: open ? 1 : 0, transform: open ? "none" : "translateY(20px)" }}
              >
                <span className="label w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(1.9rem,4.4vw,3.4rem)] font-medium leading-none tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-3">
                  {n.label === "Projetos" ? (
                    <>
                      <span className="t-serif">Projetos</span>
                    </>
                  ) : (
                    n.label
                  )}
                </span>
              </a>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="btn bg-ink text-paper hover:bg-pitaya">
                Conversar no WhatsApp <IconRight />
              </a>
              <a href={studio.waitlist} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="btn bg-mist hover:bg-line">
                Entrar na lista de espera
              </a>
            </div>
          </nav>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-md md:block">
            {menuImages.map((src, i) => (
              <Image key={src} src={asset(src)} alt="" fill quality={90} sizes="460px" className={`object-cover transition-all duration-700 ${hover === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- topo: Casa Ranch em tela cheia, nome gigante, parallax do mouse ---------- */
const heroWords = ["casas de alto padrão", "interiores", "retrofit de fachadas", "clínicas", "escritórios"];

export function Hero() {
  const [y, setY] = useState(0);
  const [m, setM] = useState({ x: 0, y: 0 });
  const [w, setW] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", on, { passive: true });
    const t = setInterval(() => setW((v) => (v + 1) % heroWords.length), 2400);
    return () => {
      window.removeEventListener("scroll", on);
      clearInterval(t);
    };
  }, []);
  const k = reduced() ? 0 : clamp(y / 900);
  return (
    <section
      id="inicio"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-night text-paper"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduced()) return;
        setM({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
      }}
    >
      <div className="absolute inset-0 animate-[heroIn_1.6s_cubic-bezier(0.77,0,0.18,1)_both]">
        <div className="absolute inset-0" style={{ transform: `translateY(${k * 180}px) scale(${1 + k * 0.08})` }}>
          <div className="absolute -inset-6 transition-transform duration-[1.2s] ease-out" style={{ transform: `translate(${m.x * -16}px, ${m.y * -12}px)` }}>
            <div className="absolute inset-0 animate-[kenburns_2.6s_cubic-bezier(0.16,1,0.3,1)_both]">
              <Image src={asset("/img/hero-ranch.webp")} alt="Casa Ranch, projeto de Lidia Penteado em Vitória da Conquista (BA)" fill priority unoptimized sizes="100vw" className="object-cover object-[50%_40%] max-md:hidden" />
              <Image src={asset("/img/ranch-fachada-4.webp")} alt="" fill priority unoptimized sizes="100vw" className="object-cover object-[62%_50%] md:hidden" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/55" />
      </div>

      <div className={`${wrap} relative flex h-full flex-col justify-between pb-8 pt-24 md:pt-28`}>
        <h1 className="flex items-start gap-3 transition-transform duration-[1.2s] ease-out" style={{ transform: `translate(${m.x * 10}px, ${m.y * 6}px)` }} aria-label="Lidia Penteado, arquiteta">
          <span className="t-hero rise flex overflow-hidden pb-[0.06em]" aria-hidden>
            {"Lidia".split("").map((c, i) => (
              <span key={i} style={{ animationDelay: `${0.45 + i * 0.07}s` }}>
                <span className="inline-block" style={{ transform: `translateY(${k * (i + 1) * -55}px) rotate(${k * (i - 2) * 4}deg)`, opacity: 1 - k * 1.3 }}>
                  {c}
                </span>
              </span>
            ))}
          </span>
          <span className="mt-[0.4em] overflow-hidden pb-[0.15em]" style={{ opacity: 1 - k * 1.6 }} aria-hidden>
            <span className="t-serif block animate-[riseIn_1.2s_0.9s_cubic-bezier(0.16,1,0.3,1)_both] text-[clamp(1.5rem,3vw,2.8rem)] leading-none">Penteado</span>
          </span>
        </h1>
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]" style={{ opacity: 1 - k * 1.6, transform: `translateY(${k * 60}px)` }}>
          <div className="max-w-[28rem] animate-[fadeUp_1s_1.1s_cubic-bezier(0.16,1,0.3,1)_both]">
            <p className="label flex gap-1.5 text-paper">
              Arquitetura para
              <span className="relative inline-flex h-[1.2em] min-w-[11rem] overflow-hidden">
                {heroWords.map((hw, i) => (
                  <span
                    key={hw}
                    className="absolute left-0 top-0 whitespace-nowrap font-semibold transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `translateY(${i === w ? 0 : i === (w - 1 + heroWords.length) % heroWords.length ? -110 : 110}%)`, opacity: i === w ? 1 : 0 }}
                  >
                    {hw}
                  </span>
                ))}
              </span>
            </p>
            <p className="mt-2 text-[1.15rem] font-medium leading-snug tracking-[-0.02em] md:text-[1.3rem]">Casas com alma primeiro. Depois os negócios: lojas, clínicas e escritórios que comunicam a marca.</p>
          </div>
          <div className="flex animate-[fadeUp_1s_1.25s_cubic-bezier(0.16,1,0.3,1)_both] items-end justify-between gap-8 md:flex-col md:items-end">
            <p className="label text-paper">Casa Ranch · Vitória da Conquista, BA</p>
            <a href="#apresentacao" className="label flex items-center gap-2 text-paper">
              Role para conhecer
              <span className="relative h-8 w-px overflow-hidden bg-paper/30">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[drop_1.8s_cubic-bezier(0.77,0,0.18,1)_infinite] bg-paper" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- apresentação: palavras acendem, com fotos no meio do texto ---------- */
type Token = string | { img: string; alt: string };
export function IntroWords({ tokens }: { tokens: Token[] }) {
  const [ref, p] = useScrollProgress<HTMLParagraphElement>();
  const words: Token[] = tokens.flatMap((t): Token[] => (typeof t === "string" ? t.split(" ").filter(Boolean) : [t]));
  const lit = Math.round(clamp((p - 0.15) / 0.42) * words.length);
  return (
    <p ref={ref} className="t-lead">
      {words.map((w, i) =>
        typeof w === "string" ? (
          <span key={i} className="transition-colors duration-300" style={{ color: i < lit ? "var(--color-ink)" : "#b9b8b2" }}>
            {w}{" "}
          </span>
        ) : (
          <Fragment key={i}>
            <span className="relative mx-0.5 inline-block h-[0.8em] w-[1.5em] translate-y-[0.08em] overflow-hidden rounded-[6px] align-baseline transition-all duration-500" style={{ opacity: i < lit ? 1 : 0.35, transform: `translateY(0.08em) scale(${i < lit ? 1 : 0.8})` }}>
              <Image src={asset(w.img)} alt={w.alt} fill quality={90} sizes="80px" className="object-cover" />
            </span>{" "}
          </Fragment>
        ),
      )}
    </p>
  );
}

/* ---------- projetos: cards alternados, cursor "Ver projeto" e galeria ---------- */
const layout = [
  "md:col-start-1 md:col-span-6",
  "md:col-start-8 md:col-span-5 md:mt-[22rem]",
  "md:col-start-2 md:col-span-4 md:-mt-24",
  "md:col-start-7 md:col-span-6 md:mt-40",
  "md:col-start-1 md:col-span-5 md:-mt-10",
  "md:col-start-8 md:col-span-5 md:mt-48",
  "md:col-start-2 md:col-span-5 md:-mt-6",
  "md:col-start-7 md:col-span-6 md:mt-56",
];
const aspects = ["aspect-[4/3]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[4/3]"];

export function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  const [secRef, p] = useScrollProgress<HTMLDivElement>();
  return (
    <div ref={secRef} className="relative">
      {/* palavra gigante ao fundo, desliza com a rolagem */}
      <div className="pointer-events-none sticky top-[22vh] z-0 h-0 overflow-visible" aria-hidden>
        <p className="t-serif whitespace-nowrap text-[clamp(6rem,19vw,17rem)] leading-none text-[#ecebe7]" style={{ transform: `translateX(${8 - p * 34}%)` }}>
          Projetos autorais
        </p>
      </div>

      <div className="relative z-10 grid gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-0">
        {projects.map((pr, i) => (
          <ProjectCard key={pr.slug} pr={pr} i={i} onOpen={() => setOpen(i)} />
        ))}
      </div>

      {open !== null && <ProjectModal index={open} setIndex={setOpen} />}
    </div>
  );
}

function ProjectCard({ pr, i, onOpen }: { pr: Project; i: number; onOpen: () => void }) {
  const [ref, p] = useScrollProgress<HTMLButtonElement>();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      data-cursor="Ver projeto"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={`group block text-left [perspective:1200px] ${layout[i % layout.length]}`}
      aria-label={`Ver projeto: ${pr.title}`}
    >
      <div className="transition-transform duration-500 ease-out" style={{ transform: `rotateY(${tilt.x * 4}deg) rotateX(${tilt.y * -4}deg)` }}>
        <RevealImage className={`relative overflow-hidden rounded-[6px] ${aspects[i % aspects.length]}`} delay={(i % 2) * 120}>
          <div className="absolute inset-x-0 -inset-y-[8%]" style={{ transform: `translateY(${(p - 0.5) * -40}px)` }}>
            <Image src={asset(pr.cover)} alt={`${pr.title}, ${pr.place}`} fill quality={90} sizes="(min-width: 768px) 620px, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
            {pr.gallery[1] && (
              <Image
                src={asset(pr.gallery[1])}
                alt=""
                fill
                quality={90}
                sizes="(min-width: 768px) 620px, 100vw"
                className="object-cover opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-md:hidden md:scale-110 md:group-hover:scale-100 md:group-hover:opacity-100"
              />
            )}
          </div>
          <span className="label absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 backdrop-blur">{pr.kind}</span>
          <span className="label absolute bottom-3 right-3 translate-y-2 rounded-full bg-ink/60 px-2.5 py-1 text-paper opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {pr.gallery.length} fotos
          </span>
        </RevealImage>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="relative text-[1.2rem] font-medium tracking-[-0.035em] md:text-[1.35rem]">
          {pr.title}
          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
        </p>
        <p className="text-[0.95rem] text-muted transition-colors group-hover:text-pitaya">{pr.year}</p>
      </div>
      <p className="text-[0.9rem] text-muted">{pr.place}</p>
    </button>
  );
}

function ProjectModal({ index, setIndex }: { index: number; setIndex: (v: number | null) => void }) {
  const pr = projects[index];
  const [img, setImg] = useState(0);
  const close = useCallback(() => setIndex(null), [setIndex]);
  const go = useCallback((d: number) => setImg((v) => (v + d + pr.gallery.length) % pr.gallery.length), [pr.gallery.length]);
  const keys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    },
    [go],
  );
  useEsc(true, close, keys);
  return (
    <div className="fixed inset-0 z-[70] grid bg-night text-paper md:grid-cols-[1fr_22rem]" role="dialog" aria-modal="true" aria-label={pr.title}>
      <div className="relative min-h-[55svh]">
        {pr.gallery.map((src, k) => (
          <Image key={src} src={asset(src)} alt={`${pr.title}: foto ${k + 1}`} fill unoptimized sizes="100vw" className={`object-contain p-3 transition-opacity duration-500 md:p-8 ${k === img ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
          <button type="button" onClick={() => go(-1)} className="flex h-11 w-11 rotate-180 items-center justify-center rounded-full bg-paper/10 hover:bg-paper hover:text-ink" aria-label="Foto anterior">
            <IconRight />
          </button>
          <span className="label w-16 text-center text-paper/80">
            {String(img + 1).padStart(2, "0")} / {String(pr.gallery.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 hover:bg-paper hover:text-ink" aria-label="Próxima foto">
            <IconRight />
          </button>
        </div>
      </div>
      <aside className="flex flex-col overflow-y-auto border-paper/10 p-6 md:border-l md:p-8">
        <button type="button" onClick={close} className="label self-end rounded-full bg-paper/10 px-3 py-1.5 hover:bg-paper hover:text-ink">
          Fechar ✕
        </button>
        <p className="label mt-6 text-paper/70">
          {pr.kind} · {pr.year}
        </p>
        <h3 className="t-h2 mt-2">{pr.title}</h3>
        <p className="mt-1 text-paper/75">{pr.place}</p>
        <p className="mt-6 leading-relaxed text-paper/85">{pr.text}</p>
        {pr.facts && (
          <ul className="mt-6 space-y-2 border-t border-paper/15 pt-5 text-[0.95rem]">
            {pr.facts.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-pitaya-soft">✦</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto grid grid-cols-4 gap-2 pt-8">
          {pr.gallery.map((src, k) => (
            <button key={src} type="button" onClick={() => setImg(k)} className={`relative aspect-square overflow-hidden rounded-[4px] transition-opacity ${k === img ? "opacity-100 ring-2 ring-paper" : "opacity-50 hover:opacity-90"}`} aria-label={`Ver foto ${k + 1}`}>
              <Image src={asset(src)} alt="" fill quality={75} sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => setIndex((index - 1 + projects.length) % projects.length)} className="label flex-1 rounded-full border border-paper/20 py-2.5 hover:bg-paper hover:text-ink">
            ← Anterior
          </button>
          <button type="button" onClick={() => setIndex((index + 1) % projects.length)} className="label flex-1 rounded-full border border-paper/20 py-2.5 hover:bg-paper hover:text-ink">
            Próximo →
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ---------- processo: seção presa, a obra "se constrói" em 4 etapas ---------- */
export function Process() {
  const [ref, p] = usePinProgress<HTMLDivElement>();
  const n = steps.length;
  const active = Math.min(n - 1, Math.floor(p * n));
  const s = steps[active];
  return (
    <div ref={ref} className="relative h-[360vh] md:h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className={`${wrap} grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-12`}>
          <div className="flex flex-col justify-center md:pr-6">
            <p className="label text-muted">Como trabalho</p>
            <h2 className="t-h1 mt-3">
              Do primeiro estudo <span className="t-serif">à entrega</span>
            </h2>
            <div className="relative mt-8 min-h-[11rem] md:mt-14">
              {steps.map((st, i) => (
                <div key={st.n} className={`absolute inset-0 transition-all duration-700 ${i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"}`} aria-hidden={i !== active}>
                  <p className="label text-muted">
                    {st.n} / {String(n).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-[1.7rem] font-medium tracking-[-0.04em]">{st.title}</p>
                  <p className="mt-2 max-w-[26rem] leading-relaxed text-muted">{st.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-mist max-md:aspect-[5/4]">
              {steps.map((st, i) => (
                <div key={st.n} className="absolute inset-0 transition-[clip-path] duration-[1.1s] ease-[cubic-bezier(0.77,0,0.18,1)]" style={{ clipPath: i <= active ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}>
                  <Image src={asset(st.image)} alt={st.caption} fill quality={90} sizes="(min-width: 768px) 640px, 100vw" className={`object-cover transition-transform duration-[1.6s] ${i === active ? "scale-100" : "scale-110"}`} />
                </div>
              ))}
              <span className="label absolute bottom-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 backdrop-blur">{s.caption}</span>
            </div>
            <p className="label mt-3 text-right text-muted">Role para avançar</p>
          </div>
        </div>
        <div className={`${wrap} mt-8 grid grid-cols-4 gap-3 md:mt-12 md:gap-5`}>
          {steps.map((st, i) => (
            <div key={st.n}>
              <div className="h-[2px] overflow-hidden bg-line">
                <div className="h-full origin-left bg-ink" style={{ transform: `scaleX(${clamp(p * n - i)})` }} />
              </div>
              <p className={`label mt-2 transition-colors ${i === active ? "text-ink" : "text-muted"}`}>
                {st.n} <span className="max-sm:hidden">{st.title}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- áreas: painéis que correm na horizontal (presos no computador) ---------- */
const tones: Record<string, string> = {
  cream: "bg-cream text-ink",
  pitaya: "bg-pitaya text-paper",
  green: "bg-green text-paper",
  night: "bg-[#1c1c1a] text-paper",
};

export function Sectors() {
  const [ref, p] = usePinProgress<HTMLDivElement>();
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  useEffect(() => {
    const m = () => {
      if (box.current && track.current) setShift(Math.max(0, track.current.scrollWidth - box.current.clientWidth));
    };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  const active = Math.min(sectors.length - 1, Math.floor(p * sectors.length * 0.999));
  return (
    <div ref={ref} className="relative md:h-[300vh]">
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center">
        <div ref={box} className={`${wrap} overflow-hidden max-md:no-scrollbar max-md:snap-x max-md:overflow-x-auto`}>
          <div ref={track} className="flex w-max gap-3 md:will-change-transform" style={{ transform: `translateX(${-shift * p}px)` }}>
            <div className="flex h-[30rem] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-[6px] bg-night p-6 text-paper md:h-[min(74vh,40rem)] md:w-[34rem] md:p-8">
              <div className="flex justify-between gap-4">
                <p className="label text-paper/80">Arquitetura + Interiores</p>
                <p className="label hidden items-center gap-2 text-paper/80 md:flex">
                  Role para explorar <span className="animate-[nudge_1.4s_ease-in-out_infinite]"><IconRight /></span>
                </p>
              </div>
              <div>
                <Split text="Onde eu *projeto*" className="t-h1" />
                <p className="mt-4 max-w-[22rem] text-paper/80">Casa, loja, clínica ou escritório: o mesmo olhar estratégico e o mesmo cuidado em cada metro quadrado.</p>
              </div>
            </div>
            {sectors.map((s, i) => (
              <article key={s.n} className={`group flex h-[30rem] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[6px] md:h-[min(74vh,40rem)] md:w-[24rem] ${tones[s.tone]}`}>
                <div className="relative h-[55%] overflow-hidden">
                  {/* a foto corre um pouco mais devagar que o painel (parallax horizontal) */}
                  <div className="absolute -inset-x-[18%] inset-y-0" style={{ transform: `translateX(${(p - (i + 1) / (sectors.length + 1)) * 140}px)` }}>
                    <Image src={asset(s.image)} alt={`${s.title}: ${s.tag}`} fill quality={90} sizes="(min-width: 768px) 560px, 95vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                  <div className="flex justify-between gap-4">
                    <p className="label opacity-80">
                      {s.n} / 04
                      <br />
                      {s.tag}
                    </p>
                    <ul className="space-y-1 text-[0.85rem]">
                      {s.items.map((it, k) => (
                        <li key={it} className="transition-transform duration-500 group-hover:-translate-x-1.5" style={{ transitionDelay: `${k * 60}ms` }}>
                          ✦ {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="overflow-hidden text-[clamp(2.6rem,4.4vw,3.6rem)] font-medium leading-none tracking-[-0.05em]">
                    <span className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:[font-family:var(--font-serif)] group-hover:italic">{s.title}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        {/* indicador de progresso dos painéis (computador) */}
        <div className={`${wrap} mt-6 hidden items-center gap-4 md:flex`}>
          <span className="label w-14 tabular-nums">{String(active + 1).padStart(2, "0")} / 04</span>
          <span className="relative h-[2px] flex-1 overflow-hidden bg-line">
            <span className="absolute inset-0 origin-left bg-ink" style={{ transform: `scaleX(${p})` }} />
          </span>
          <span className="label text-muted">{sectors[active].tag}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- vídeos: prévia no hover (no celular, toca sozinha ao aparecer), com som ao clicar ---------- */
function VideoCard({ x, i, onOpen }: { x: (typeof videos)[number]; i: number; onOpen: () => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = vid.current;
    if (!el || reduced() || window.matchMedia("(pointer: fine)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.7 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Assistir"
      onPointerEnter={(e) => e.pointerType === "mouse" && vid.current?.play().catch(() => {})}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
      }}
      onPointerLeave={() => {
        vid.current?.pause();
        setTilt({ x: 0, y: 0 });
      }}
      className={`group w-[62%] shrink-0 snap-start text-left [perspective:1000px] md:w-auto ${i % 2 ? "md:mt-16" : ""}`}
      aria-label={`Assistir: ${x.title}`}
    >
      <div className="transition-transform duration-500 ease-out" style={{ transform: `rotateY(${tilt.x * 6}deg) rotateX(${tilt.y * -6}deg)` }}>
        <RevealImage className="relative aspect-[9/16] overflow-hidden rounded-[6px]" delay={(i % 4) * 110}>
          <video ref={vid} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={asset(`/video/${x.slug}-preview.mp4`)} poster={asset(`/img/reel-${x.slug}.webp`)} muted loop playsInline preload="none" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/20 text-paper backdrop-blur transition-all duration-500 group-hover:scale-0 group-hover:opacity-0">▶</span>
          <span className="label absolute bottom-3 right-3 rounded-full bg-ink/50 px-2 py-0.5 text-paper backdrop-blur">{x.duration}</span>
        </RevealImage>
      </div>
      <p className="mt-3 text-[1.05rem] font-medium tracking-[-0.03em]">{x.title}</p>
      <p className="text-[0.9rem] text-muted transition-colors duration-700 group-data-[dark=true]/ink:text-paper/70">{x.text}</p>
    </button>
  );
}

export function VideoCards() {
  const [open, setOpen] = useState<string | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useEsc(open !== null, close);
  const v = videos.find((x) => x.slug === open);
  return (
    <>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
        {videos.map((x, i) => (
          <VideoCard key={x.slug} x={x} i={i} onOpen={() => setOpen(x.slug)} />
        ))}
      </div>
      {v && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-night/95 p-4" onClick={close} role="dialog" aria-modal="true" aria-label={v.title}>
          <video className="max-h-[88vh] w-auto max-w-full animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both] rounded-[6px]" src={asset(`/video/${v.slug}.mp4`)} poster={asset(`/img/reel-${v.slug}.webp`)} autoPlay controls playsInline onClick={(e) => e.stopPropagation()} />
          <button type="button" className="label absolute right-5 top-5 rounded-full bg-paper/10 px-3 py-1.5 text-paper" aria-label="Fechar">
            Fechar ✕
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- vídeo que toca sozinho quando aparece ---------- */
export function AutoVideo({ slug, className = "" }: { slug: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={asset(`/video/${slug}-preview.mp4`)} poster={asset(`/img/reel-${slug}.webp`)} muted loop playsInline preload="none" aria-hidden />;
}

/* ---------- trajetória: lista com o card do destaque que segue o mouse; clique amplia ---------- */
export function Timeline() {
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const box = useRef<HTMLDivElement>(null);
  const n = timeline.length;
  const close = useCallback(() => setOpen(null), []);
  const keys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % n));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + n) % n));
    },
    [n],
  );
  useEsc(open !== null, close, keys);
  const CARD_W = 208; // card 9:16 (208 x 370)
  return (
    <div
      ref={box}
      className="relative"
      onMouseMove={(e) => {
        const r = box.current!.getBoundingClientRect();
        const x = e.clientX - r.left;
        // fica à direita do mouse; perto da borda, passa para a esquerda (nunca sai do container)
        setPos({ x: x + 28 + CARD_W > r.width ? x - 28 - CARD_W : x + 28, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setHover(null)}
    >
      <ul className="border-t border-line">
        {timeline.map((t, i) => (
          <li key={t.title} onMouseEnter={() => setHover(i)} className="border-b border-line">
            <button type="button" onClick={() => setOpen(i)} className="group grid w-full grid-cols-[4.5rem_1fr] items-center gap-4 py-4 text-left md:cursor-zoom-in md:grid-cols-[7rem_1fr_auto] md:py-5" aria-label={`${t.year}: ${t.title}. Ver destaque`}>
              <span className="text-[1.05rem] font-medium tabular-nums text-muted transition-colors group-hover:text-pitaya md:text-[1.25rem]">{t.year}</span>
              <span className="flex items-center gap-3">
                <span className="relative aspect-[9/16] w-11 shrink-0 overflow-hidden rounded-[4px] bg-mist md:hidden">
                  <Image src={asset(t.image)} alt="" fill quality={90} sizes="96px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-[1.05rem] font-medium leading-snug tracking-[-0.025em] transition-transform duration-500 md:text-[1.35rem] md:group-hover:translate-x-2">{t.title}</span>
                  <span className="block text-[0.9rem] text-muted md:hidden">{t.place}</span>
                </span>
              </span>
              <span className="hidden text-[0.95rem] text-muted md:block">{t.place}</span>
            </button>
          </li>
        ))}
      </ul>
      <div
        className={`pointer-events-none absolute left-0 top-0 z-10 hidden aspect-[9/16] overflow-hidden rounded-[8px] bg-mist shadow-2xl transition-[opacity,scale] duration-300 md:block ${hover !== null && open === null ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
        style={{ width: CARD_W, translate: `${pos.x}px ${pos.y - 185}px` }}
        aria-hidden
      >
        {timeline.map((t, i) => (
          <Image key={t.title} src={asset(t.image)} alt="" fill quality={90} sizes="420px" className={`object-cover transition-opacity duration-300 ${hover === i ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center gap-3 bg-night/95 p-4 md:gap-8" onClick={close} role="dialog" aria-modal="true" aria-label={timeline[open].title}>
          <button type="button" onClick={(e) => (e.stopPropagation(), setOpen((open - 1 + n) % n))} className="flex h-11 w-11 shrink-0 rotate-180 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper hover:text-ink max-sm:absolute max-sm:bottom-5 max-sm:left-5" aria-label="Anterior">
            <IconRight />
          </button>
          <figure className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[9/16] h-[78svh] max-w-[88vw] overflow-hidden rounded-[8px]">
              <Image src={asset(timeline[open].image)} alt={`${timeline[open].year}: ${timeline[open].title}`} fill unoptimized sizes="50vh" className="object-contain" />
            </div>
            <figcaption className="mt-3 text-center text-paper">
              <span className="text-pitaya-soft">{timeline[open].year}</span> · {timeline[open].title}
            </figcaption>
          </figure>
          <button type="button" onClick={(e) => (e.stopPropagation(), setOpen((open + 1) % n))} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper hover:text-ink max-sm:absolute max-sm:bottom-5 max-sm:right-5" aria-label="Próximo">
            <IconRight />
          </button>
          <button type="button" className="label absolute right-5 top-5 rounded-full bg-paper/10 px-3 py-1.5 text-paper" aria-label="Fechar">
            Fechar ✕
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- depoimentos: foto + frase palavra a palavra, setas, arrastar e barra de tempo ---------- */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const start = useRef<number | null>(null);
  const n = testimonials.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  useEffect(() => {
    if (paused || reduced()) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [i, paused, go]);
  const t = testimonials[i];
  return (
    <div
      className="grid touch-pan-y items-center gap-8 md:grid-cols-[17rem_1fr] md:gap-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={(e) => (start.current = e.clientX)}
      onPointerUp={(e) => {
        if (start.current === null) return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-mist max-md:max-w-[15rem]" data-cursor="Arraste">
        {testimonials.map((x, k) => (
          <div key={x.name} className="absolute inset-0 transition-[clip-path] duration-[1.1s] ease-[cubic-bezier(0.77,0,0.18,1)]" style={{ clipPath: k === i ? "inset(0 0 0 0)" : "inset(0 0 0 100%)", zIndex: k === i ? 2 : 1 }}>
            <Image src={asset(x.image)} alt="" fill quality={90} sizes="280px" className={`object-cover transition-transform duration-[1.6s] ${k === i ? "scale-100" : "scale-125"}`} />
          </div>
        ))}
        <span className="label absolute bottom-3 left-3 z-10 rounded-full bg-paper/90 px-2.5 py-1 tabular-nums backdrop-blur">
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </div>
      <div className="select-none">
        <blockquote key={i} className="text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-[1.25] tracking-[-0.035em]">
          {`“${t.text}”`.split(" ").map((w, k) => (
            <span key={k} className="inline-block animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${k * 28}ms` }}>
              {w}&nbsp;
            </span>
          ))}
        </blockquote>
        <div className="mt-8 flex items-end justify-between gap-6 border-t border-line pt-5">
          <div key={`n${i}`} className="animate-[fadeUp_0.8s_0.2s_cubic-bezier(0.16,1,0.3,1)_both]">
            <p className="text-[1.2rem] font-medium tracking-[-0.03em]">{t.name}</p>
            <p className="text-[0.9rem] text-muted">{t.detail}</p>
          </div>
          <div className="flex gap-2">
            <Magnetic>
              <button type="button" onClick={() => go(-1)} className="flex h-11 w-11 rotate-180 items-center justify-center rounded-full bg-mist transition-colors hover:bg-line" aria-label="Depoimento anterior">
                <IconRight />
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-pitaya" aria-label="Próximo depoimento">
                <IconRight />
              </button>
            </Magnetic>
          </div>
        </div>
        <div className="mt-5 flex gap-1.5">
          {testimonials.map((x, k) => (
            <button key={x.name} type="button" onClick={() => setI(k)} className="relative h-[3px] flex-1 overflow-hidden bg-line" aria-label={`Depoimento ${k + 1}`}>
              {k === i && <span key={`${i}-${paused}`} className="absolute inset-0 origin-left bg-ink" style={paused ? undefined : { animation: "fill 7s linear forwards" }} />}
              {k < i && <span className="absolute inset-0 bg-ink" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- perguntas frequentes ---------- */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {faq.map((f, i) => (
        <div key={f.q} className="border-b border-line">
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left">
            <span className="text-[1.1rem] font-medium tracking-[-0.025em] md:text-[1.2rem]">{f.q}</span>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${open === i ? "rotate-45 bg-ink text-paper" : "bg-mist"}`}>
              <IconPlus />
            </span>
          </button>
          <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className="max-w-[44rem] pb-6 leading-relaxed text-muted">{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- rodapé: letras gigantes que sobem ao aparecer e viram serifa ao passar o mouse ---------- */
export function GiantName() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex justify-between overflow-hidden pt-6 select-none" onMouseLeave={() => setHover(null)} aria-hidden>
      {"LIDIA".split("").map((c, i) => {
        const d = hover === null ? 9 : Math.abs(hover - i);
        return (
          <span
            key={i}
            onMouseEnter={() => setHover(i)}
            className={`text-[clamp(5rem,21vw,18.5rem)] font-medium leading-[0.8] tracking-[-0.04em] transition-[transform,color] duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${d === 0 ? "t-serif text-pitaya-soft" : ""}`}
            style={{
              transform: !shown && !reduced() ? "translateY(100%)" : d === 0 ? "translateY(-8%)" : d === 1 ? "translateY(-3%)" : "none",
              transitionDelay: shown && hover === null ? "0ms" : `${i * 90}ms`,
            }}
          >
            {c}
          </span>
        );
      })}
    </div>
  );
}

export function ArrowLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const ext = href.startsWith("http");
  return (
    <Magnetic strength={0.25}>
      <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`btn group relative overflow-hidden ${dark ? "bg-paper text-ink" : "bg-pitaya text-paper"}`}>
        {/* preenchimento que sobe no hover */}
        <span className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 ${dark ? "bg-pitaya" : "bg-ink"}`} />
        <span className={`relative transition-colors duration-300 ${dark ? "group-hover:text-paper" : ""}`}>{children}</span>
        <span className={`relative transition-transform duration-300 group-hover:rotate-45 ${dark ? "group-hover:text-paper" : ""}`}>
          <IconArrow className="h-4 w-4" />
        </span>
      </a>
    </Magnetic>
  );
}

/* ---------- mais projetos: galeria que desliza sozinha, arrastável, com ampliação ---------- */
export function DragGallery({ items }: { items: { src: string; alt: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const moved = useRef(false);
  const holding = useRef(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const close = useCallback(() => setZoom(null), []);
  const keys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setZoom((v) => (v === null ? v : (v + 1) % items.length));
      if (e.key === "ArrowLeft") setZoom((v) => (v === null ? v : (v - 1 + items.length) % items.length));
    },
    [items.length],
  );
  useEsc(zoom !== null, close, keys);
  // desliza devagar sozinha (vai e volta) enquanto ninguém está mexendo
  useEffect(() => {
    if (reduced()) return;
    let raf = 0, dir = 1, pos = -1;
    const loop = () => {
      const el = track.current;
      if (el && !holding.current) {
        if (pos < 0 || Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
        const max = el.scrollWidth - el.clientWidth;
        if (pos >= max - 1) dir = -1;
        if (pos <= 0) dir = 1;
        pos += dir * 0.45;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <div
        ref={track}
        data-cursor="Arraste"
        className="no-scrollbar flex gap-3 overflow-x-auto"
        onPointerEnter={() => (holding.current = true)}
        onPointerLeave={() => {
          holding.current = false;
          drag.current = null;
        }}
        onTouchStart={() => (holding.current = true)}
        onTouchEnd={() => setTimeout(() => (holding.current = false), 2500)}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          moved.current = false;
          drag.current = { x: e.clientX, left: track.current.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !track.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) moved.current = true;
          track.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => (drag.current = null)}
      >
        {items.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => !moved.current && setZoom(i)}
            className={`group relative shrink-0 overflow-hidden rounded-[6px] ${i % 3 === 1 ? "mt-8 h-[17rem] w-[13rem] md:h-[20rem] md:w-[15rem]" : "h-[17rem] w-[15rem] md:h-[20rem] md:w-[18rem]"}`}
            aria-label={`Ampliar: ${g.alt}`}
          >
            <Image src={asset(g.src)} alt={g.alt} fill quality={90} draggable={false} sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <span className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-ink/75 to-transparent p-3 pt-10 text-left text-[0.85rem] text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{g.alt}</span>
          </button>
        ))}
      </div>
      {zoom !== null && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-night/95 p-4" onClick={close} role="dialog" aria-modal="true" aria-label={items[zoom].alt}>
          <div key={zoom} className="relative h-[80vh] w-full max-w-6xl animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
            <Image src={asset(items[zoom].src)} alt={items[zoom].alt} fill unoptimized sizes="100vw" className="object-contain" />
          </div>
          <p className="text-center text-paper/85">{items[zoom].alt}</p>
          <button type="button" className="label absolute right-5 top-5 rounded-full bg-paper/10 px-3 py-1.5 text-paper" aria-label="Fechar">
            Fechar ✕
          </button>
        </div>
      )}
    </>
  );
}
