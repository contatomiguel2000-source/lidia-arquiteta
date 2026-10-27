// Conteúdo real: Instagram @lidiaarquiteta (bio, posts e destaques), Linktree, site da Pitaya e Google Maps.

const whatsappNumber = "5519993413372";

export const studio = {
  name: "Lidia Penteado",
  role: "Arquiteta",
  office: "Pitaya Arquitetura Estratégica",
  city: "Valinhos, SP",
  since: 2010,
  address: "Av. Joaquim Alves Corrêa, 3668, Jardim Planalto, Valinhos (SP)",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pitaya+Arquitetura+Estrat%C3%A9gica+Valinhos",
  phoneOffice: "(19) 99141-7710",
  phoneOfficeHref: "tel:+5519991417710",
  whatsappLabel: "(19) 99341-3372",
  whatsapp: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, Lidia! Vim pelo site e quero conversar sobre um projeto.")}`,
  waitlist: "https://forms.gle/kFU5Jq7p7QLXudzq6",
  instagram: "https://www.instagram.com/lidiaarquiteta/",
  tiktok: "https://www.tiktok.com/@lidiaarquiteta",
  linkedin: "https://www.linkedin.com/in/lidia-baratella-247755206/",
  pitaya: "https://www.pitaya.arq.br/",
  rating: "5,0",
  reviewCount: 9,
};

export const nav = [
  { label: "Projetos", href: "#projetos" },
  { label: "Como trabalho", href: "#processo" },
  { label: "Áreas", href: "#areas" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export const stats = [
  { value: 20, suffix: "+", label: "anos de experiência em projeto" },
  { value: 4, suffix: "", label: "pós-graduações e MBAs" },
  { value: 7, suffix: "", label: "profissionais na equipe Pitaya" },
  { value: 400, suffix: " mil", label: "seguidores no TikTok" },
];

export type Project = {
  slug: string;
  title: string;
  place: string;
  year: string;
  kind: string;
  cover: string;
  text: string;
  facts?: string[];
  gallery: string[];
};

export const projects: Project[] = [
  {
    slug: "casa-ranch",
    title: "Casa Ranch",
    place: "Vitória da Conquista, BA",
    year: "2026",
    kind: "Residencial",
    cover: "/img/ranch-fachada-1.webp",
    text: "Uma releitura contemporânea da arquitetura Texas Ranch: horizontalidade, grandes planos de cobertura e conexão com a paisagem. No living, a força da pedra, o calor da madeira e a leveza dos panos de vidro.",
    facts: ["Arquitetura e interiores", "Pedra natural, madeira e vidro", "Living com pé-direito duplo"],
    gallery: ["/img/ranch-fachada-1.webp", "/img/ranch-fachada-0.webp", "/img/ranch-fachada-4.webp", "/img/ranch-fachada-2.webp", "/img/ranch-living-big.webp", "/img/ranch-living-1.webp", "/img/ranch-living-0.webp", "/img/ranch-living-2.webp"],
  },
  {
    slug: "cozinha-miami",
    title: "Cozinha em pedra natural",
    place: "Miami Beach, EUA",
    year: "2026",
    kind: "Interiores",
    cover: "/img/miami-1.webp",
    text: "Uma cozinha que vai além da função e faz parte da experiência da casa. A pedra natural percorre piso, bancadas e volumes, criando continuidade do começo ao fim do ambiente.",
    facts: ["Projeto internacional", "Pedra natural contínua", "Ilha central"],
    gallery: ["/img/miami-1.webp", "/img/miami-0.webp", "/img/miami-2.webp"],
  },
  {
    slug: "living-valinhos",
    title: "Living de pé-direito duplo",
    place: "Valinhos, SP",
    year: "2026",
    kind: "Residencial",
    cover: "/img/valinhos-living-0.webp",
    text: "O pé-direito generoso potencializa a sensação de escala, e os grandes planos de vidro dissolvem os limites entre dentro e fora, trazendo o jardim para dentro da casa.",
    gallery: ["/img/valinhos-living-0.webp", "/img/valinhos-living-1.webp", "/img/valinhos-living-2.webp"],
  },
  {
    slug: "residencia-u",
    title: "Residência em U",
    place: "Térrea, 600 m²",
    year: "2026",
    kind: "Residencial",
    cover: "/img/residencia-u-1.webp",
    text: "Residência térrea de alto padrão em estilo clássico contemporâneo, num terreno de 1.200 m². O pátio interno com piscina organiza os espaços e dá conforto ambiental à casa inteira.",
    facts: ["600 m² construídos", "Terreno de 1.200 m²", "Planta em U com pátio"],
    gallery: ["/img/residencia-u-1.webp", "/img/residencia-u-0.webp", "/img/residencia-u-patio-0.webp", "/img/residencia-u-patio-1.webp"],
  },
  {
    slug: "suite-boutique",
    title: "Suíte Boutique",
    place: "Jardins, São Paulo",
    year: "2026",
    kind: "Interiores",
    cover: "/img/suite-1.webp",
    text: "Inspirada nos melhores hotéis boutique do mundo: madeira natural, iluminação cênica e marcenaria sob medida. No mesmo apartamento, um living em que a sofisticação está na precisão dos detalhes.",
    facts: ["Atmosfera de hotel boutique", "Iluminação indireta", "Paleta neutra"],
    gallery: ["/img/suite-1.webp", "/img/suite-0.webp", "/img/suite-2.webp", "/img/suite-3.webp", "/img/jardins-living-0.webp", "/img/jardins-living-1.webp", "/img/jardins-living-2.webp"],
  },
  {
    slug: "sala-de-banho",
    title: "Sala de banho",
    place: "Conforto ambiental",
    year: "2026",
    kind: "Interiores",
    cover: "/img/banho-0.webp",
    text: "Uma setorização funcional clara: bancada de cuba dupla, sanitário, box e área de banheira, cada um no seu lugar, com luz natural e metais dourados.",
    gallery: ["/img/banho-0.webp", "/img/banho-1.webp", "/img/banho-2.webp", "/img/banho-3.webp"],
  },
  {
    slug: "quinta-da-baroneza",
    title: "Casa Quinta da Baroneza",
    place: "Quinta da Baroneza, SP",
    year: "2026",
    kind: "Residencial",
    cover: "/img/baroneza-0.webp",
    text: "Clássico na essência, contemporâneo na forma. Uma releitura do neoclássico em que proporção, simetria e colunas dialogam com linhas limpas e grandes panos de vidro.",
    gallery: ["/img/baroneza-0.webp", "/img/baroneza-1.webp"],
  },
  {
    slug: "agrobox",
    title: "Retrofit Agrobox",
    place: "Goiânia, GO",
    year: "2024",
    kind: "Comercial",
    cover: "/img/agrobox-0.webp",
    text: "Retrofit de fachada para uma marca de drones e tecnologia agrícola. Antes era só um galpão na avenida; hoje a fachada é posicionamento. Para a mesma marca, desenhei o estande da Agrishow.",
    facts: ["Retrofit de fachada", "Identidade da marca no edifício", "Estande Agrishow"],
    gallery: ["/img/agrobox-0.webp", "/img/agrobox-3.webp", "/img/agrobox-1.webp", "/img/agrobox-stand.webp", "/img/agrobox-planta.webp"],
  },
];

export const moreWork = [
  { src: "/img/arezzo-0.webp", alt: "Decorado Arezzo em Valinhos: sala integrada" },
  { src: "/img/entre-gestos-0.webp", alt: "Apartamento Entre Gestos, Campinas: sala integrada" },
  { src: "/img/hw-0.webp", alt: "Recepção da H&W Company, Alphaville" },
  { src: "/img/escritorio-0.webp", alt: "Escritório no Centro Comercial Alphaville" },
  { src: "/img/haras-0.webp", alt: "Quarto infantil inspirado nos haras, Fazenda Boa Vista" },
  { src: "/img/beauty-0.webp", alt: "Beauty Clinic em Valinhos" },
  { src: "/img/compacto-1.webp", alt: "Apartamento compacto em Valinhos" },
  { src: "/img/odonto-0.webp", alt: "Clínica odontológica em Hortolândia" },
  { src: "/img/fachada-goiania-1.webp", alt: "Fachada neoclássica em Goiânia" },
  { src: "/img/escritorio-claro-0.webp", alt: "Escritório claro com marcenaria sob medida" },
  { src: "/img/entre-gestos-cozinha.webp", alt: "Cozinha do apartamento Entre Gestos" },
  { src: "/img/corporativo-1.webp", alt: "Escritório corporativo integrado, Alphaville Conde II" },
  { src: "/img/fachada-moderna.webp", alt: "Fachada contemporânea com pedra e madeira" },
  { src: "/img/burle-marx.webp", alt: "Living integrado no Condomínio Burle Marx, Alphaville" },
  { src: "/img/arezzo-3.webp", alt: "Decorado Arezzo: suíte" },
  { src: "/img/varanda-gourmet.webp", alt: "Varanda gourmet integrada em Valinhos" },
];

export const services = ["Arquitetura", "Interiores", "Retrofit de fachada", "Neuroarquitetura", "Marcenaria", "Decorados", "Arquitetura comercial", "Paisagismo", "Iluminação"];

export const steps = [
  {
    n: "01",
    title: "Imersão",
    text: "Começo entendendo a essência do negócio ou da família: quem usa o espaço, como vive, o que precisa comunicar. Visito o lugar e fotografo o ponto de partida.",
    image: "/img/agrobox-2.webp",
    caption: "Agrobox, Goiânia: a fachada antes do projeto",
  },
  {
    n: "02",
    title: "Conceito",
    text: "Defino layout, fluxos, materiais e luz com base em neuroarquitetura. Cada ponto de permanência é pensado para gerar pertencimento e conforto.",
    image: "/img/agrobox-planta.webp",
    caption: "Implantação do estande Agrobox na Agrishow",
  },
  {
    n: "03",
    title: "Projeto",
    text: "Detalho cada ambiente, a marcenaria e os acabamentos, e apresento tudo em 3D para você enxergar o resultado antes da obra.",
    image: "/img/agrobox-3.webp",
    caption: "Agrobox: a fachada em 3D",
  },
  {
    n: "04",
    title: "Entrega",
    text: "Acompanho as fases do projeto até a entrega, para que o que foi desenhado vire espaço construído, do jeito que foi combinado.",
    image: "/img/agrobox-0.webp",
    caption: "Agrobox: a fachada construída",
  },
];

export const sectors = [
  {
    n: "01",
    title: "Casas",
    tag: "Residencial",
    items: ["Casas de alto padrão", "Apartamentos", "Interiores e marcenaria"],
    image: "/img/ranch-living-big.webp",
    tone: "cream",
  },
  {
    n: "02",
    title: "Negócios",
    tag: "Comercial e varejo",
    items: ["Retrofit de fachadas", "Lojas e estandes", "Decorados para construtoras"],
    image: "/img/agrobox-3.webp",
    tone: "pitaya",
  },
  {
    n: "03",
    title: "Saúde",
    tag: "Clínicas e bem-estar",
    items: ["Clínicas odontológicas", "Estética facial", "Neuroarquitetura aplicada"],
    image: "/img/beauty-3.webp",
    tone: "green",
  },
  {
    n: "04",
    title: "Escritórios",
    tag: "Corporativo e educação",
    items: ["Escritórios e recepções", "Salas de reunião", "Escolas"],
    image: "/img/escritorio-0.webp",
    tone: "night",
  },
];

export const timeline = [
  { year: "2010", title: "Formada em Arquitetura e Urbanismo", place: "UNIP Campinas", image: "/img/lidia-tablet.webp" },
  { year: "2016", title: "Campinas Decor: ambiente Lavanderia da Casa", place: "Mostra de decoração", image: "/img/t-2016.webp" },
  { year: "2019", title: "Mostra + Sustentável: quarto Baía do Sancho", place: "Com Bruna Ferraresi e JP Studio", image: "/img/t-2019.webp" },
  { year: "2020", title: "Padrão exclusivo de laminado para a Berneck", place: "Expo Revestir, São Paulo", image: "/img/t-2020.webp" },
  { year: "2021", title: "Convidada VIP do Congresso Mundial UIA", place: "Rio de Janeiro", image: "/img/t-2021.webp" },
  { year: "2023", title: "Embaixadora do Network Constru e convidada na TV", place: "Programa Mulher.com", image: "/img/t-2023.webp" },
  { year: "2025", title: "Pitaya Arquitetura Estratégica", place: "Valinhos, SP", image: "/img/lidia-pb.webp" },
  { year: "2026", title: "Top 30 do Prêmio iBest em arquitetura e decoração", place: "Votação popular nacional", image: "/img/lidia-blazer.webp" },
  { year: "2026", title: "Palestra para mais de 300 alunos", place: "UNIP Campinas, onde me formei", image: "/img/lidia-unip.webp" },
];

export const education = [
  "MBA em Design de Interiores, Iluminação e Paisagismo",
  "MBA em Arquitetura Comercial e Visual Merchandising",
  "MBA em Arquitetura Aplicada à Saúde, Bem-Estar e Neurociências",
  "Pós-graduação em Administração de Empresas (FGV)",
  "Especialização em Design de Móveis",
  "Construção limpa em Steel Frame",
];

export const videos = [
  { slug: "casa-ranch", title: "Casa Ranch", text: "Vitória da Conquista, BA", duration: "1:41" },
  { slug: "beauty-clinic", title: "Beauty Clinic", text: "Estética facial em Valinhos", duration: "0:26" },
  { slug: "banho-spa", title: "Banheiro spa", text: "Atmosfera de relaxamento", duration: "0:32" },
  { slug: "apto-ninho", title: "Apartamento Ninho", text: "Santa Bárbara d'Oeste, SP", duration: "0:40" },
  { slug: "quarto-compacto", title: "Quarto compacto", text: "Pequeno e cheio de personalidade", duration: "0:45" },
  { slug: "colegio-destino", title: "Colégio Destino", text: "Neuroarquitetura na escola", duration: "0:27" },
  { slug: "hadassa", title: "Hadassa", text: "Flats de 38 m² em Goiânia", duration: "0:05" },
  { slug: "campinas-decor", title: "Campinas Decor 2026", text: "Visita à mostra de 30 anos", duration: "0:20" },
];

export const testimonials = [
  {
    text: "Nossa arquiteta maravilhosa! Obrigada por entregar um projeto com tanta excelência.",
    name: "Alcor Alumínios",
    detail: "Cliente comercial, comentário no Instagram",
    image: "/img/hw-0.webp",
  },
  {
    text: "Excelente atendimento! Lidia é muito atenciosa, uma profissional muito competente e de muito bom gosto. Super recomendo!",
    name: "Gabriela Chamma",
    detail: "Avaliação 5 estrelas no Google",
    image: "/img/suite-1.webp",
  },
  {
    text: "Uma excelente profissional, deixou nosso espaço mais funcional, harmônico e lindo! Amei!",
    name: "Walquiria Vieira",
    detail: "Avaliação 5 estrelas no Google",
    image: "/img/entre-gestos-0.webp",
  },
  {
    text: "Atendimento excelente, muito atenciosa e superou minhas expectativas! Parabéns pelo trabalho!",
    name: "Bruna Carvalho",
    detail: "Avaliação 5 estrelas no Google",
    image: "/img/beauty-0.webp",
  },
  {
    text: "Trabalho sério e competente! Super indico!",
    name: "Camila Santos",
    detail: "Avaliação 5 estrelas no Google",
    image: "/img/arezzo-0.webp",
  },
];

export const faq = [
  {
    q: "Que tipo de projeto você faz?",
    a: "Casas e apartamentos de alto padrão, projetos de interiores e marcenaria, e espaços de negócio: retrofit de fachadas, lojas, estandes, clínicas, escritórios, escolas e decorados para construtoras.",
  },
  {
    q: "Onde você atende?",
    a: "O escritório fica em Valinhos (SP) e atendo Campinas, Alphaville e região. Já desenvolvi projetos em Goiás, na Bahia e até nos Estados Unidos, com reuniões online.",
  },
  {
    q: "O que é neuroarquitetura na prática?",
    a: "É usar o que a neurociência sabe sobre comportamento para decidir luz, cores, fluxos e materiais. Numa clínica, isso reduz a ansiedade do paciente; numa loja, ajuda na decisão de compra; num quarto infantil, respeita o desenvolvimento da criança.",
  },
  {
    q: "Faz projeto só de interiores?",
    a: "Faço. Boa parte dos projetos é de interiores e marcenaria sob medida, para quem já tem o imóvel pronto ou vai reformar.",
  },
  {
    q: "Como funciona a lista de espera?",
    a: "A agenda de novos projetos está em lista de espera, com início em fevereiro de 2027. Preencha o formulário que eu retorno com os próximos passos. Para dúvidas rápidas, o WhatsApp está aberto.",
  },
];
