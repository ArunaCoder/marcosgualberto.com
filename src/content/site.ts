/**
 * Conteúdo único do site. Os 10 estudos de homepage leem tudo daqui, para que a
 * comparação entre eles seja de design e não de texto.
 *
 * FONTE: todo o conteúdo abaixo foi conferido contra mestregualberto.com e suas
 * subpáginas (home, /satsang, /agenda, /satsang-online, /satsang-presencial,
 * /ramanashram, /infancia-e-juventude, /encontro-com-ramana, /ramana-maharshi,
 * /explosao-da-bomba, /depoimentos). Nada aqui é invenção.
 *
 * Tom: o registro do próprio trabalho — devocional e advaita, com o vocabulário
 * que o site usa (Verdade, Graça, Ser Realizado, Satguru, autoinvestigação,
 * Real Meditação). Marcos é tratado como Mestre, não como palestrante; Satsang
 * é o encontro com a Verdade, não "uma conversa". Ao mesmo tempo, o homem é
 * alegre e a linguagem é simples: nada de jargão empolado.
 *
 * CUIDADO com três erros fáceis:
 *  1. Os encontros NÃO são todos gratuitos. Só o "Satsang aberto" de alguns
 *     sábados é gratuito; o Satsang online completo custa R$ 300 e os eventos
 *     presenciais vão de R$ 700 a R$ 5.800.
 *  2. O presencial acontece no Ramanashram, em Gravatá (PE) — não em São Paulo
 *     e não num "sítio".
 *  3. A virada não foi aos 24 anos. Aos 24 (dez/1985) foi o encontro com Ramana;
 *     a "explosão da bomba" foi em junho de 2007, 21 anos depois.
 */

export interface Photo {
  /** chave usada em public/photos/<key>-<w>.webp */
  key: string;
  alt: string;
  /** foco do recorte, para object-position */
  focus?: string;
}

export interface EventItem {
  id: string;
  kind: "online" | "presencial" | "retiro";
  title: string;
  /** ISO, usado em <time datetime> e na ordenação */
  date: string;
  /** como aparece na tela */
  when: string;
  place: string;
  price: string;
  free: boolean;
  summary: string;
  highlights: string[];
  cta: { label: string; href: string };
}

export interface MediaItem {
  id: string;
  label: string;
  title: string;
  description: string;
  href: string;
  meta: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const photos = {
  riso: { key: "riso", alt: "Marcos Gualberto rindo durante um Satsang", focus: "50% 32%" },
  acolhida: { key: "acolhida", alt: "Marcos Gualberto sorrindo, de camisa laranja", focus: "50% 30%" },
  claro: { key: "claro", alt: "Marcos Gualberto sorrindo, de camisa branca", focus: "50% 30%" },
  sereno: { key: "sereno", alt: "Marcos Gualberto em silêncio, olhando para quem pergunta", focus: "50% 32%" },
  direto: { key: "direto", alt: "Marcos Gualberto olhando de frente, de camisa vermelha", focus: "50% 30%" },
  atento: { key: "atento", alt: "Marcos Gualberto atento a uma pergunta", focus: "50% 30%" },
  perfil: { key: "perfil", alt: "Marcos Gualberto de perfil, ouvindo", focus: "60% 38%" },
  maos: { key: "maos", alt: "Marcos Gualberto gesticulando enquanto fala", focus: "50% 38%" },
  explica: { key: "explica", alt: "Marcos Gualberto falando, com as mãos", focus: "50% 36%" },
  aponta: { key: "aponta", alt: "Marcos Gualberto apontando durante uma fala", focus: "50% 34%" },
  conversa: { key: "conversa", alt: "Marcos Gualberto diante dos participantes do Satsang", focus: "50% 36%" },
  saudacao: { key: "saudacao", alt: "Marcos Gualberto com as mãos justapostas, em Namastê", focus: "50% 32%" },
  saudacaoClara: { key: "saudacao-clara", alt: "Marcos Gualberto de mãos justapostas", focus: "50% 30%" },
  sala: { key: "sala", alt: "Salão de meditação preparado para o Satsang", focus: "50% 50%" },
  publico: { key: "publico", alt: "Participantes sentados durante um Satsang", focus: "50% 50%" },
  salaAmpla: { key: "sala-ampla", alt: "Vista ampla do salão durante um encontro", focus: "50% 50%" },
  frase: { key: "frase", alt: "Marcos Gualberto falando, com uma frase sua emoldurada na parede", focus: "50% 40%" },
  gesto: { key: "gesto", alt: "Marcos Gualberto com a mão erguida, falando", focus: "50% 34%" },
  cor: { key: "cor", alt: "Marcos Gualberto de camisa rosa, sorrindo", focus: "50% 30%" },
  dourado: { key: "dourado", alt: "Marcos Gualberto sentado, sorrindo", focus: "50% 34%" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** O site atual, de onde saíram os textos e para onde apontam os links reais. */
const ORIGIN = "https://mestregualberto.com";

/** Fala dele que a home de mestregualberto.com estampa em destaque. */
const BOLO = "Largue a receita, menino, menina, e vá comer o bolo!";

export const site = {
  name: "Marcos Gualberto",
  domain: "marcosgualberto.com",
  url: "https://marcosgualberto.com",
  locale: "pt-BR",

  seo: {
    title: "Marcos Gualberto — Satsang",
    description:
      "Satsang com Marcos Gualberto: o encontro com a Verdade. Satsang aberto e gratuito online no sábado de manhã, e Satsangs e retiros presenciais no Ramanashram, em Gravatá (PE).",
  },

  nav: [
    {
      label: "Marcos",
      href: `${ORIGIN}/infancia-e-juventude`,
      children: [
        { label: "Infância e juventude", href: `${ORIGIN}/infancia-e-juventude` },
        { label: "Encontro com Ramana", href: `${ORIGIN}/encontro-com-ramana` },
        { label: "Ramana Maharshi", href: `${ORIGIN}/ramana-maharshi` },
        { label: "“Explosão da bomba”", href: `${ORIGIN}/explosao-da-bomba` },
        { label: "Depoimentos", href: `${ORIGIN}/depoimentos` },
      ],
    },
    {
      label: "Satsang",
      href: `${ORIGIN}/satsang`,
      children: [
        { label: "O que é Satsang", href: `${ORIGIN}/satsang` },
        { label: "Alegria e sofrimento", href: `${ORIGIN}/alegria-e-sofrimento` },
        { label: "Papel do Guru", href: `${ORIGIN}/papel-do-guru` },
        { label: "Real Meditação", href: `${ORIGIN}/real-meditacao` },
        { label: "Realização do Ser", href: `${ORIGIN}/realizacao-do-ser` },
      ],
    },
    {
      label: "Eventos",
      href: `${ORIGIN}/agenda`,
      children: [
        { label: "Agenda", href: `${ORIGIN}/agenda` },
        { label: "Satsang online", href: `${ORIGIN}/satsang-online` },
        { label: "Satsang presencial", href: `${ORIGIN}/satsang-presencial` },
        { label: "Ramanashram", href: `${ORIGIN}/ramanashram` },
      ],
    },
    { label: "Blog", href: `${ORIGIN}/blog/` },
  ] satisfies NavItem[],

  hero: {
    kicker: "Satsang",
    title: "Satsang é o encontro com a Verdade.",
    lead:
      "Marcos Gualberto é considerado um Ser Realizado: aquele que despertou para sua própria Natureza Não Dual, além da mente, do corpo e do mundo. Desde 2011, compartilha essa visão de vida em encontros chamados Satsang.",
    note: "Satsang aberto, gratuito e online, no sábado de manhã, das 9h às 12h. Confira as datas na agenda.",
    primary: { label: "Ver a agenda", href: "#agenda" },
    secondary: { label: "O que é Satsang", href: "#satsang" },
    photo: "riso" as PhotoKey,
    caption: `“${BOLO}”`,
  },

  about: {
    eyebrow: "Quem é",
    title: "Marcos Gualberto",
    lead:
      "Carioca, nascido em 30 de setembro de 1962 na Vila Cruzeiro, no Rio de Janeiro. Criado numa família evangélica, estudou Teologia e chegou a pastor — até que, aos 24 anos, foi misteriosamente acolhido pela Graça de Ramana.",
    body: [
      "Aquela criança já trazia consigo o Silêncio: não chorou ao nascer e só abriu os olhos no quarto dia. Sentava-se em posição de lótus sob a máquina de costura da mãe e ali ficava, no silêncio de Paz, e não desejava brinquedo nem presente. Aos cinco anos, num culto pentecostal, teve a primeira imersão no Ser.",
      "A busca por Deus nasceu de uma tremenda insatisfação interna. Foram anos de oração, jejum e estudo da Bíblia, sem encontrar entre os religiosos de seu convívio ninguém com a mesma ânsia que tinha. Em dezembro de 1985, aos 24 anos, caiu em suas mãos o livro <em>Maha Yoga</em>. Nele havia a foto de Sri Bhagavan Ramana Maharshi. Ao olhar nos olhos de Ramana, a busca terminou.",
      "Seguiram-se 21 anos de meditação, autoinvestigação e entrega à Graça do Bhagavan, até uma noite de sábado de junho de 2007 — o que ele chama de “explosão da bomba”. O sentido de separatividade se extinguiu por completo. Desde 2011, compartilha isso em Satsang, online e no Ramanashram, em Gravatá (PE).",
    ],
    facts: [
      { value: "1985", label: "o encontro com Ramana" },
      { value: "21 anos", label: "de autoinvestigação e entrega" },
      { value: "2007", label: "a “explosão da bomba”" },
    ],
    photo: "sereno" as PhotoKey,
    cta: { label: "Ler a história completa", href: `${ORIGIN}/infancia-e-juventude` },
  },

  satsang: {
    eyebrow: "O que é",
    title: "Sat, verdade. Sang, encontro.",
    lead:
      "Satsang é uma palavra sânscrita. Nas tradições da Índia, designa estar próximo a um Satguru — um Ser Realizado — com o coração aberto à Verdade que Ele emana. O convite é à autoinvestigação e à Real Meditação, para se constatar a ilusão de um “eu” separado.",
    points: [
      {
        title: "Não se exige preparo",
        text: "Diferente de um encontro com um professor, aqui não há matéria, leitura prévia nem pré-requisito. Basta vir com o coração aberto.",
      },
      {
        title: "A fala é só a aproximação",
        text: "O que importa em Satsang não é o que se diz, mas a Presença — que não fala português, inglês ou qualquer idioma. Sua linguagem é a do Coração, a do Silêncio.",
      },
      {
        title: "Nada é preparado",
        text: "Não há discurso pronto nem assunto pré-escolhido. Depois que Marcos chega ao salão, o encontro segue um rumo desconhecido.",
      },
      {
        title: "Perguntar é bem-vindo",
        text: "Marcos costuma abrir espaço para perguntas e comentários. Nenhum assunto é particular demais; no online, as perguntas vão pelo chat.",
      },
    ],
    photo: "conversa" as PhotoKey,
    cta: { label: "Entender melhor", href: `${ORIGIN}/satsang` },
  },

  /**
   * Agenda real publicada em mestregualberto.com/agenda. A cadência do Satsang
   * aberto NÃO é toda semana: são sábados específicos ao longo do ano. O
   * "Encontro aberto" é a manhã de sábado gratuita; o "Satsang online" é o
   * intensivo completo (sábado e domingo, manhã e tarde), que é pago.
   */
  events: [
    {
      id: "aberto-set",
      kind: "online",
      title: "Encontro aberto",
      date: "2026-09-26",
      when: "Sábado, 26 de setembro, das 9h às 12h",
      place: "Online, pelo Zoom",
      price: "Gratuito",
      free: true,
      summary:
        "A manhã de sábado aberta a todos, sem custo. É a ocasião de conhecer Marcos e descobrir se Satsang é para você.",
      highlights: ["Sem custo", "Tradução para o inglês no chat", "Câmera ligada, nome verdadeiro"],
      cta: { label: "Fazer inscrição", href: `${ORIGIN}/agenda/inscricao-online/` },
    },
    {
      id: "online-set",
      kind: "online",
      title: "Satsang online",
      date: "2026-09-26",
      when: "26 e 27 de setembro — 9h às 12h e 15h às 18h",
      place: "Online, pelo Zoom",
      price: "R$ 300,00",
      free: false,
      summary:
        "O intensivo completo: sábado e domingo, manhã e tarde, ao vivo e interativo. Autoinvestigação, Advaita Vedanta e Real Meditação.",
      highlights: ["Dois dias, quatro sessões", "Perguntas pelo chat", "É proibido gravar"],
      cta: { label: "Fazer inscrição", href: `${ORIGIN}/agenda/inscricao-online/` },
    },
    {
      id: "retiro-out",
      kind: "retiro",
      title: "Retiro presencial",
      date: "2026-10-10",
      when: "10 a 12 de outubro — das 9h do dia 10 às 17h do dia 12",
      place: "Ramanashram, Gravatá (PE)",
      price: "R$ 1.400,00",
      free: false,
      summary:
        "Três dias no Ashram, com Satsang de manhã e de tarde. O valor inclui estadia e alimentação; o celular fica guardado durante o evento.",
      highlights: ["Estadia e alimentação inclusas", "Vagas limitadas", "Cerca de 100 km do aeroporto do Recife"],
      cta: { label: "Fazer inscrição", href: `${ORIGIN}/agenda/inscricao-presencial/` },
    },
    {
      id: "retiro-nov",
      kind: "retiro",
      title: "Retiro presencial",
      date: "2026-10-31",
      when: "31 de outubro a 2 de novembro — das 9h do dia 31 às 17h do dia 2",
      place: "Ramanashram, Gravatá (PE)",
      price: "R$ 1.400,00",
      free: false,
      summary:
        "Mais três dias de imersão no Ashram, em Gravatá, com estadia e refeições incluídas no valor.",
      highlights: ["Estadia e alimentação inclusas", "Vagas limitadas", "Alojamento em beliches"],
      cta: { label: "Fazer inscrição", href: `${ORIGIN}/agenda/inscricao-presencial/` },
    },
    {
      id: "retiro-virada",
      kind: "retiro",
      title: "Retiro de fim de ano",
      date: "2026-12-27",
      when: "27 de dezembro a 3 de janeiro — das 9h do dia 27 às 17h do dia 3",
      place: "Ramanashram, Gravatá (PE)",
      price: "R$ 5.800,00",
      free: false,
      summary:
        "Oito dias no Ashram, o retiro mais longo do ano, atravessando a virada. Satsang pela manhã e pela tarde, e silêncio entre uma sessão e outra.",
      highlights: ["Oito dias", "Estadia e alimentação inclusas", "Vagas limitadas"],
      cta: { label: "Fazer inscrição", href: `${ORIGIN}/agenda/inscricao-presencial/` },
    },
    {
      id: "presencial-abr",
      kind: "presencial",
      title: "Satsang presencial",
      date: "2027-04-17",
      when: "17 e 18 de abril — das 9h às 17h",
      place: "Ramanashram, Gravatá (PE)",
      price: "R$ 700,00",
      free: false,
      summary:
        "Dois dias de Satsang no Ashram, para quem quer o contato presencial sem a imersão longa de um retiro.",
      highlights: ["Dois dias", "Estadia e alimentação inclusas", "Vagas limitadas"],
      cta: { label: "Fazer inscrição", href: `${ORIGIN}/agenda/inscricao-presencial/` },
    },
  ] satisfies EventItem[],

  media: [
    {
      id: "youtube",
      label: "Vídeo",
      title: "Canal no YouTube",
      description: "Falas gravadas em Satsang, selecionadas e organizadas por tema.",
      href: "https://www.youtube.com/@Marcos-Gualberto",
      meta: "Selecionados e mais assistidos",
    },
    {
      id: "blog",
      label: "Texto",
      title: "Blog",
      description: "Centenas de falas transcritas na íntegra, para quem prefere ler a assistir.",
      href: `${ORIGIN}/blog/`,
      meta: "Arquivo completo",
    },
    {
      id: "podcast",
      label: "Áudio",
      title: "Podcasts",
      description: "As falas de Marcos Gualberto em formato podcast, para ouvir quando quiser.",
      href: "https://open.spotify.com/show/30pL27Itas1gV9AaUMQiPA",
      meta: "No Spotify",
    },
    {
      id: "melodias",
      label: "Áudio",
      title: "Melodias de Silêncio",
      description: "A Sabedoria e a voz doce de Marcos Gualberto com fundo musical.",
      href: "https://soundcloud.com/mestregualberto/sets/melodias-de-silencio",
      meta: "No SoundCloud",
    },
  ] satisfies MediaItem[],

  /** Falas do próprio Marcos, transcritas de mestregualberto.com. */
  quotes: [
    {
      text: "Não há nada que você possa ou precise realizar. Tudo que de fato você precisa é constatar a Verdade sobre si mesmo. Isso é o fim do sofrimento!",
      source: "Marcos Gualberto",
    },
    {
      text: "Estar em Satsang não representa mais um movimento de busca, mas a alegria de um encontro consigo mesmo.",
      source: "Marcos Gualberto",
    },
    {
      text: BOLO,
      source: "Marcos Gualberto",
    },
  ],

  contact: {
    person: "Leo Ortega",
    role: "organização dos encontros",
    whatsapp: "+55 12 98143-7755",
    whatsappHref: "https://wa.me/5512981437755",
    email: "contato@mestregualberto.com",
  },

  social: [
    { label: "YouTube", href: "https://www.youtube.com/@Marcos-Gualberto" },
    { label: "Instagram", href: "https://www.instagram.com/satsang_com_marcosgualberto/" },
    { label: "Facebook", href: "https://www.facebook.com/marcosgualberto.oficial" },
    { label: "Spotify", href: "https://open.spotify.com/show/30pL27Itas1gV9AaUMQiPA" },
    { label: "SoundCloud", href: "https://soundcloud.com/mestregualberto" },
  ],

  newsletter: {
    title: "Receba o aviso dos encontros",
    text: "Um e-mail curto quando houver Satsang aberto ou abrir inscrição de Satsang online e retiro. Nada além disso.",
    placeholder: "seu@email.com",
    button: "Quero receber",
  },

  footer: {
    tagline: "Satsang — o encontro com a Verdade.",
    credit: "marcosgualberto.com",
  },
} as const;

export type Site = typeof site;
