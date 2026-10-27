import Image from "next/image";
import { ArrowLink, DragGallery, Faq, GiantName, Header, Hero, IntroWords, Process, Projects, Sectors, Testimonials, Timeline, VideoCards } from "@/components/Motion";
import { Counter, Reveal } from "@/components/Reveal";
import { IconCheck, IconInstagram, IconLinkedin, IconPin, IconStar, IconTiktok, IconWhatsapp } from "@/components/Icons";
import { education, moreWork, nav, services, stats, studio } from "@/lib/data";
import { asset } from "@/lib/base-path";

const wrap = "mx-auto w-full max-w-[calc(1160px+2rem)] px-4 md:max-w-[calc(1160px+4rem)] md:px-8";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Apresentação */}
        <section id="apresentacao" className="py-24 md:py-36">
          <div className={`${wrap} grid gap-12 md:grid-cols-[1fr_2.2fr]`}>
            <p className="label text-muted">(01) Apresentação</p>
            <div>
              <IntroWords
                tokens={[
                  "Sou arquiteta desde 2010",
                  { img: "/img/lidia-tablet.webp", alt: "Lidia desenhando no tablet" },
                  "e desenho casas",
                  { img: "/img/ranch-fachada-1.webp", alt: "Casa Ranch" },
                  "com alma e espaços de negócio",
                  { img: "/img/agrobox-0.webp", alt: "Fachada Agrobox" },
                  "que comunicam a marca, sempre com o olhar da neuroarquitetura. Beleza importa. Resultado importa mais.",
                ]}
              />
              <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-20 md:grid-cols-4">
                {stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 90}>
                    <p className="text-[clamp(2.4rem,4.2vw,3.4rem)] font-medium leading-none tracking-[-0.05em]">
                      <Counter value={s.value} />
                      {s.suffix}
                    </p>
                    <p className="mt-2 text-[0.9rem] text-muted">{s.label}</p>
                  </Reveal>
                ))}
              </div>
              <div className="mt-12 flex flex-wrap gap-3">
                <ArrowLink href="#sobre">Conheça a Lidia</ArrowLink>
                <a href="#projetos" className="btn bg-mist hover:bg-line">
                  Ver projetos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="pb-24 md:pb-36">
          <div className={wrap}>
            <Projects />
            <Reveal className="relative z-10 mt-24 flex flex-col items-center gap-3 text-center md:mt-36">
              <p className="label text-muted">Projetos residenciais, comerciais e corporativos</p>
              <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="btn bg-mist hover:bg-line">
                <IconInstagram className="h-4 w-4" /> Todos os projetos no Instagram
              </a>
            </Reveal>
          </div>
        </section>

        {/* Mais projetos (arrastável) */}
        <section className="pb-24 md:pb-36">
          <div className={wrap}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="t-h2">
                Mais <span className="t-serif">ambientes</span>
              </h2>
              <p className="label text-muted">Arraste para o lado · clique para ampliar</p>
            </div>
            <DragGallery items={moreWork} />
          </div>
        </section>

        {/* O que eu faço: faixa corrida */}
        <section className="overflow-hidden border-y border-line py-10 md:py-14">
          <div className={`${wrap} mb-8 grid gap-4 md:grid-cols-[1fr_1fr]`}>
            <h2 className="t-h2">O que eu faço</h2>
            <p className="max-w-[26rem] text-muted md:justify-self-end">Cada projeto parte do lugar, do orçamento e de quem vai viver ou trabalhar ali.</p>
          </div>
          <div className="marquee" aria-hidden>
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {services.map((s) => (
                  <span key={s} className="t-serif flex items-center px-4 text-[clamp(2.6rem,6vw,5.2rem)] leading-tight text-[#c8c7c1]">
                    {s}
                    <span className="ml-8 text-[0.5em] text-pitaya">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p className="sr-only">{services.join(", ")}</p>
        </section>

        {/* Processo */}
        <section id="processo">
          <Process />
        </section>

        {/* Áreas */}
        <section id="areas" className="py-16 md:py-0">
          <Sectors />
        </section>

        {/* Vídeos */}
        <section id="videos" className="py-24 md:py-36">
          <div className={wrap}>
            <div className="mb-10 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
              <h2 className="t-h1">
                Projetos em <span className="t-serif">movimento</span>
              </h2>
              <p className="max-w-[26rem] text-muted md:justify-self-end">Passe o mouse para ver a prévia. Clique para assistir com som.</p>
            </div>
            <VideoCards />
          </div>
        </section>

        {/* Sobre */}
        <section id="sobre" className="bg-mist py-24 md:py-36">
          <div className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.15fr] md:gap-16`}>
            <Reveal className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[6px]">
                <Image src={asset("/img/lidia-retrato.webp")} alt="Lidia Penteado, arquiteta" fill unoptimized sizes="(min-width: 768px) 540px, 100vw" className="object-cover" />
              </div>
              <div className="absolute -bottom-8 right-4 aspect-[4/5] w-[38%] overflow-hidden rounded-[6px] border-4 border-mist shadow-xl md:-right-8">
                <Image src={asset("/img/lidia-pb.webp")} alt="" fill quality={90} sizes="220px" className="object-cover object-top" />
              </div>
            </Reveal>
            <div className="md:pt-6">
              <p className="label text-muted">(02) Sobre</p>
              <h2 className="t-h1 mt-4">
                Espaço, legado <span className="t-serif">e permanência</span>
              </h2>
              <div className="mt-8 space-y-4 text-[1.05rem] leading-relaxed text-muted">
                <p>
                  Sou Lidia Penteado, arquiteta formada pela UNIP Campinas em 2010 e diretora criativa da <strong className="font-medium text-ink">Pitaya Arquitetura Estratégica</strong>, em Valinhos. Somos sete profissionais e atuamos do conceito à entrega.
                </p>
                <p>Comecei projetando para o varejo, com mobiliário para redes de supermercados, lojas e espaços corporativos. Hoje desenho casas de alto padrão, interiores, clínicas, escolas e decorados para construtoras, sempre com o mesmo olhar estratégico e emocional.</p>
                <p className="text-ink">“Mais do que projetos, acredito em experiências que marcam vidas. Esse é o meu propósito. Esse é o meu legado.”</p>
              </div>
              <ul className="mt-8 grid gap-2.5 border-t border-line pt-6 text-[0.95rem]">
                {education.map((e) => (
                  <li key={e} className="flex gap-2.5">
                    <IconCheck className="mt-1 h-4 w-4 shrink-0 text-pitaya" />
                    {e}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ArrowLink href={studio.whatsapp}>Conversar com a Lidia</ArrowLink>
                <a href={studio.pitaya} target="_blank" rel="noopener noreferrer" className="btn bg-paper hover:bg-line">
                  Site da Pitaya
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trajetória */}
        <section id="trajetoria" className="py-24 md:py-36">
          <div className={wrap}>
            <div className="mb-12 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
              <h2 className="t-h1">
                Uma trajetória <span className="t-serif">de mostras e prêmios</span>
              </h2>
              <div className="flex items-center gap-4 md:justify-self-end">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-center text-[0.62rem] font-semibold uppercase leading-tight text-paper">
                  Top
                  <br />
                  30
                </span>
                <p className="max-w-[17rem] text-[0.95rem] text-muted">Entre os 30 mais votados do Prêmio iBest 2026 em arquitetura e decoração, e eleita a melhor arquiteta de Valinhos em 2026.</p>
              </div>
            </div>
            <Timeline />
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="pb-24 md:pb-36">
          <div className={wrap}>
            <div className="mb-12 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
              <h2 className="t-h1">
                Nas palavras <span className="t-serif">de quem contratou</span>
              </h2>
              <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 md:justify-self-end">
                <span className="flex text-pitaya">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <IconStar key={k} />
                  ))}
                </span>
                <span className="text-[0.95rem] text-muted underline-offset-4 hover:underline">
                  {studio.rating} no Google · {studio.reviewCount} avaliações
                </span>
              </a>
            </div>
            <Testimonials />
          </div>
        </section>

        {/* Perguntas */}
        <section id="perguntas" className="pb-24 md:pb-36">
          <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_1.6fr]`}>
            <div>
              <h2 className="t-h1">
                Antes de <span className="t-serif">você chamar</span>
              </h2>
              <p className="mt-4 max-w-[20rem] text-muted">As perguntas que eu mais recebo, respondidas.</p>
            </div>
            <Faq />
          </div>
        </section>
      </main>

      {/* Contato / rodapé */}
      <footer id="contato" className="overflow-hidden bg-night text-paper">
        <div className={`${wrap} pt-20 md:pt-28`}>
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_0.6fr]">
            <div>
              <h2 className="t-h1">
                Vamos começar <span className="t-serif">seu projeto?</span>
              </h2>
              <p className="mt-4 max-w-[24rem] text-paper/75">A agenda de novos projetos começa em fevereiro de 2027. Entre na lista de espera ou me chame no WhatsApp.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ArrowLink href={studio.waitlist} dark>
                  Entrar na lista de espera
                </ArrowLink>
                <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" className="btn bg-paper/10 hover:bg-paper/20">
                  <IconWhatsapp className="h-4 w-4" /> {studio.whatsappLabel}
                </a>
              </div>
              <div className="mt-8 flex gap-2">
                {[
                  { href: studio.instagram, label: "Instagram", icon: <IconInstagram className="h-4 w-4" /> },
                  { href: studio.tiktok, label: "TikTok", icon: <IconTiktok className="h-4 w-4" /> },
                  { href: studio.linkedin, label: "LinkedIn", icon: <IconLinkedin className="h-4 w-4" /> },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-pitaya">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="label text-paper/60">Escritório</p>
              <p className="mt-3 font-medium">{studio.office}</p>
              <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 flex gap-2 text-[0.95rem] text-paper/75 hover:text-paper">
                <IconPin className="mt-1 h-4 w-4 shrink-0" />
                {studio.address}
              </a>
              <p className="mt-5 text-[0.95rem]">
                <a href={studio.phoneOfficeHref} className="hover:underline">
                  Escritório {studio.phoneOffice}
                </a>
              </p>
              <p className="mt-1 text-[0.95rem]">
                <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp {studio.whatsappLabel}
                </a>
              </p>
            </div>
            <nav aria-label="Índice">
              <p className="label text-paper/60">Índice</p>
              <ul className="mt-3 space-y-1.5">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="transition-colors hover:text-pitaya-soft">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-16 flex flex-wrap justify-between gap-3 border-t border-paper/15 pt-5 text-[0.82rem] text-paper/60">
            <p>© 2026 Lidia Penteado Arquiteta</p>
            <p>Beleza que toca. Função que transforma.</p>
          </div>
          <GiantName />
        </div>
      </footer>
    </>
  );
}
