"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { faq, nav, projects, sectors, steps, studio, testimonials, timeline, videos, type Project } from "@/lib/data";
import { asset } from "@/lib/base-path";
import { IconArrow, IconPlus, IconRight } from "./Icons";

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
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
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

/* ---------- topo: Casa Ranch em tela cheia, nome gigante ---------- */
export function Hero() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const k = reduced() ? 0 : clamp(y / 900);
  return (
    <section id="inicio" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#3d74c4] text-paper">
      <div className="absolute inset-0" style={{ transform: `translateY(${k * 180}px) scale(${1 + k * 0.08})` }}>
        <div className="absolute inset-0 animate-[kenburns_2.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Image src={asset("/img/hero-ranch.webp")} alt="Casa Ranch, projeto de Lidia Penteado em Vitória da Conquista (BA)" fill priority unoptimized sizes="100vw" className="object-cover object-[50%_40%] max-md:hidden" />
          <Image src={asset("/img/ranch-fachada-4.webp")} alt="" fill priority unoptimized sizes="100vw" className="object-cover object-[62%_50%] md:hidden" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/55" />

      <div className={`${wrap} relative flex h-full flex-col justify-between pb-8 pt-24 md:pt-28`} style={{ opacity: 1 - k * 1.4 }}>
        <h1 className="flex items-start gap-3" aria-label="Lidia Penteado, arquiteta">
          <span className="t-hero rise overflow-hidden pb-[0.06em]" aria-hidden>
            {"Lidia".split("").map((c, i) => (
              <span key={i} style={{ animationDelay: `${0.25 + i * 0.07}s` }}>
                {c}
              </span>
            ))}
          </span>
          <span className="mt-[0.4em] overflow-hidden pb-[0.15em]" aria-hidden>
            <span className="t-serif block animate-[riseIn_1.2s_0.7s_cubic-bezier(0.16,1,0.3,1)_both] text-[clamp(1.5rem,3vw,2.8rem)] leading-none">Penteado</span>
          </span>
        </h1>
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div className="max-w-[26rem]">
            <p className="label text-paper">Arquitetura e interiores de alto padrão</p>
            <p className="mt-2 text-[1.15rem] font-medium leading-snug tracking-[-0.02em] md:text-[1.3rem]">Casas com alma primeiro. Depois os negócios: lojas, clínicas e escritórios que comunicam a marca.</p>
          </div>
          <div className="flex items-end justify-between gap-8 md:flex-col md:items-end">
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
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false });
  const [secRef, p] = useScrollProgress<HTMLDivElement>();
  return (
    <div ref={secRef} className="relative" onMouseMove={(e) => setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY }))}>
      {/* palavra gigante ao fundo, desliza com a rolagem */}
      <div className="pointer-events-none sticky top-[22vh] z-0 h-0 overflow-visible" aria-hidden>
        <p className="t-serif whitespace-nowrap text-[clamp(6rem,19vw,17rem)] leading-none text-[#ecebe7]" style={{ transform: `translateX(${8 - p * 34}%)` }}>
          Projetos autorais
        </p>
      </div>

      <div className="relative z-10 grid gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-0">
        {projects.map((pr, i) => (
          <ProjectCard key={pr.slug} pr={pr} i={i} onOpen={() => setOpen(i)} onHover={(on) => setCursor((c) => ({ ...c, on }))} />
        ))}
      </div>

      <span
        className={`pointer-events-none fixed left-0 top-0 z-30 hidden h-24 w-24 items-center justify-center rounded-full bg-pitaya text-center text-[0.8rem] font-medium leading-tight text-paper transition-[opacity,scale] duration-300 md:flex ${cursor.on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        style={{ translate: `${cursor.x - 48}px ${cursor.y - 48}px` }}
        aria-hidden
      >
        Ver
        <br />
        projeto
      </span>

      {open !== null && <ProjectModal index={open} setIndex={setOpen} />}
    </div>
  );
}

function ProjectCard({ pr, i, onOpen, onHover }: { pr: Project; i: number; onOpen: () => void; onHover: (on: boolean) => void }) {
  const [ref, p] = useScrollProgress<HTMLButtonElement>();
  return (
    <button ref={ref} type="button" onClick={onOpen} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} className={`group block text-left md:cursor-none ${layout[i % layout.length]}`} aria-label={`Ver projeto: ${pr.title}`}>
      <div className={`relative overflow-hidden rounded-[6px] bg-mist ${aspects[i % aspects.length]}`}>
        <div className="absolute inset-x-0 -inset-y-[8%]" style={{ transform: `translateY(${(p - 0.5) * -40}px)` }}>
          <Image src={asset(pr.cover)} alt={`${pr.title}, ${pr.place}`} fill quality={90} sizes="(min-width: 768px) 620px, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
        </div>
        <span className="label absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 backdrop-blur">{pr.kind}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="text-[1.2rem] font-medium tracking-[-0.035em] md:text-[1.35rem]">{pr.title}</p>
        <p className="text-[0.95rem] text-muted">{pr.year}</p>
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
  return (
    <div ref={ref} className="relative md:h-[300vh]">
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
        <div ref={box} className={`${wrap} overflow-hidden max-md:overflow-x-auto max-md:snap-x max-md:no-scrollbar`}>
          <div ref={track} className="flex w-max gap-3 md:will-change-transform" style={{ transform: `translateX(${-shift * p}px)` }}>
            <div className="flex h-[30rem] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-[6px] bg-night p-6 text-paper md:h-[min(78vh,40rem)] md:w-[34rem] md:p-8">
              <div className="flex justify-between gap-4">
                <p className="label text-paper/80">Arquitetura + Interiores</p>
                <p className="label hidden items-center gap-2 text-paper/80 md:flex">
                  Role para explorar <IconRight />
                </p>
              </div>
              <div>
                <h2 className="t-h1">
                  Onde eu <span className="t-serif">projeto</span>
                </h2>
                <p className="mt-4 max-w-[22rem] text-paper/80">Casa, loja, clínica ou escritório: o mesmo olhar estratégico e o mesmo cuidado em cada metro quadrado.</p>
              </div>
            </div>
            {sectors.map((s) => (
              <article key={s.n} className={`flex h-[30rem] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[6px] md:h-[min(78vh,40rem)] md:w-[24rem] ${tones[s.tone]}`}>
                <div className="relative h-[55%] overflow-hidden">
                  <Image src={asset(s.image)} alt={`${s.title}: ${s.tag}`} fill quality={90} sizes="(min-width: 768px) 400px, 80vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                  <div className="flex justify-between gap-4">
                    <p className="label opacity-80">
                      {s.n} / 04
                      <br />
                      {s.tag}
                    </p>
                    <ul className="space-y-1 text-[0.85rem]">
                      {s.items.map((it) => (
                        <li key={it}>✦ {it}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[clamp(2.6rem,4.4vw,3.6rem)] font-medium leading-none tracking-[-0.05em]">{s.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- vídeos: prévia no hover, com som ao clicar ---------- */
export function VideoCards() {
  const [open, setOpen] = useState<string | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useEsc(open !== null, close);
  const v = videos.find((x) => x.slug === open);
  return (
    <>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:px-0">
        {videos.map((x) => (
          <button
            key={x.slug}
            type="button"
            onClick={() => setOpen(x.slug)}
            onMouseEnter={(e) => e.currentTarget.querySelector("video")?.play().catch(() => {})}
            onMouseLeave={(e) => e.currentTarget.querySelector("video")?.pause()}
            className="group w-[62%] shrink-0 snap-start text-left md:w-auto"
            aria-label={`Assistir: ${x.title}`}
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-mist">
              <video className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={asset(`/video/${x.slug}-preview.mp4`)} poster={asset(`/img/reel-${x.slug}.webp`)} muted loop playsInline preload="none" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/20 text-paper backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:bg-pitaya">▶</span>
              <span className="label absolute bottom-3 right-3 rounded-full bg-ink/50 px-2 py-0.5 text-paper backdrop-blur">{x.duration}</span>
            </div>
            <p className="mt-3 text-[1.05rem] font-medium tracking-[-0.03em]">{x.title}</p>
            <p className="text-[0.9rem] text-muted">{x.text}</p>
          </button>
        ))}
      </div>
      {v && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-night/95 p-4" onClick={close} role="dialog" aria-modal="true" aria-label={v.title}>
          <video className="max-h-[88vh] w-auto max-w-full rounded-[6px]" src={asset(`/video/${v.slug}.mp4`)} poster={asset(`/img/reel-${v.slug}.webp`)} autoPlay controls playsInline onClick={(e) => e.stopPropagation()} />
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

/* ---------- trajetória: lista com foto que segue o mouse ---------- */
export function Timeline() {
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const box = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={box}
      className="relative"
      onMouseMove={(e) => {
        const r = box.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setHover(null)}
    >
      <ul className="border-t border-line">
        {timeline.map((t, i) => (
          <li key={t.title} onMouseEnter={() => setHover(i)} className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 border-b border-line py-4 md:grid-cols-[7rem_1fr_auto] md:py-5">
            <span className="text-[1.05rem] font-medium tabular-nums text-muted transition-colors group-hover:text-pitaya md:text-[1.25rem]">{t.year}</span>
            <span className="flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[4px] md:hidden">
                <Image src={asset(t.image)} alt="" fill quality={80} sizes="48px" className="object-cover" />
              </span>
              <span>
                <span className="block text-[1.05rem] font-medium leading-snug tracking-[-0.025em] transition-transform duration-500 md:text-[1.35rem] md:group-hover:translate-x-2">{t.title}</span>
                <span className="block text-[0.9rem] text-muted md:hidden">{t.place}</span>
              </span>
            </span>
            <span className="hidden text-[0.95rem] text-muted md:block">{t.place}</span>
          </li>
        ))}
      </ul>
      <div
        className={`pointer-events-none absolute left-0 top-0 z-10 hidden h-56 w-44 overflow-hidden rounded-[6px] shadow-2xl transition-[opacity,scale] duration-300 md:block ${hover !== null ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
        style={{ translate: `${pos.x + 24}px ${pos.y - 112}px` }}
        aria-hidden
      >
        {timeline.map((t, i) => (
          <Image key={t.title} src={asset(t.image)} alt="" fill quality={85} sizes="180px" className={`object-cover transition-opacity duration-300 ${hover === i ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------- depoimentos: foto + frase, setas e barra de tempo ---------- */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  useEffect(() => {
    if (paused || reduced()) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [i, paused, go]);
  const t = testimonials[i];
  return (
    <div className="grid items-center gap-8 md:grid-cols-[17rem_1fr] md:gap-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-mist max-md:max-w-[15rem]">
        {testimonials.map((x, k) => (
          <Image key={x.name} src={asset(x.image)} alt="" fill quality={90} sizes="280px" className={`object-cover transition-all duration-1000 ${k === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`} />
        ))}
      </div>
      <div>
        <blockquote key={i} className="reveal is-visible text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-[1.25] tracking-[-0.035em]">
          “{t.text}”
        </blockquote>
        <div className="mt-8 flex items-end justify-between gap-6 border-t border-line pt-5">
          <div>
            <p className="text-[1.2rem] font-medium tracking-[-0.03em]">{t.name}</p>
            <p className="text-[0.9rem] text-muted">{t.detail}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} className="flex h-10 w-10 rotate-180 items-center justify-center rounded-full bg-mist transition-colors hover:bg-line" aria-label="Depoimento anterior">
              <IconRight />
            </button>
            <button type="button" onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-pitaya" aria-label="Próximo depoimento">
              <IconRight />
            </button>
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

/* ---------- rodapé: letras gigantes que sobem ao aparecer ---------- */
export function GiantName() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex justify-between overflow-hidden pt-6 select-none" aria-hidden>
      {"LIDIA".split("").map((c, i) => (
        <span
          key={i}
          className="text-[clamp(5rem,21vw,18.5rem)] font-medium leading-[0.8] tracking-[-0.04em] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: shown || reduced() ? "none" : "translateY(100%)", transitionDelay: `${i * 90}ms` }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function ArrowLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const ext = href.startsWith("http");
  return (
    <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`btn group ${dark ? "bg-paper text-ink hover:bg-pitaya hover:text-paper" : "bg-pitaya text-paper hover:bg-ink"}`}>
      {children}
      <span className="transition-transform duration-300 group-hover:rotate-45">
        <IconArrow className="h-4 w-4" />
      </span>
    </a>
  );
}

/* ---------- mais projetos: galeria arrastável com ampliação ---------- */
export function DragGallery({ items }: { items: { src: string; alt: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const moved = useRef(false);
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
  return (
    <>
      <div
        ref={track}
        className="no-scrollbar flex cursor-grab snap-x gap-3 overflow-x-auto active:cursor-grabbing md:snap-none"
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
        onPointerLeave={() => (drag.current = null)}
      >
        {items.map((g, i) => (
          <button key={g.src} type="button" onClick={() => !moved.current && setZoom(i)} className={`group relative shrink-0 snap-start overflow-hidden rounded-[6px] ${i % 3 === 1 ? "h-[17rem] w-[13rem] md:h-[20rem] md:w-[15rem]" : "h-[17rem] w-[15rem] md:h-[20rem] md:w-[18rem]"}`} aria-label={`Ampliar: ${g.alt}`}>
            <Image src={asset(g.src)} alt={g.alt} fill quality={90} draggable={false} sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-10 text-left text-[0.85rem] text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">{g.alt}</span>
          </button>
        ))}
      </div>
      {zoom !== null && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-night/95 p-4" onClick={close} role="dialog" aria-modal="true" aria-label={items[zoom].alt}>
          <div className="relative h-[80vh] w-full max-w-6xl">
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
