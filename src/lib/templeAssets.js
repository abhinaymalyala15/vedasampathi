/**
 * Local heritage imagery — all paths served from /public for reliability.
 */

export const HERITAGE = {
  hero: {
    main: '/hero-temple.jpg',
    fallback: '/hero-temple.jpg',
  },
  cards: {
    scholar: '/cards/scholars.jpg',
    pathasala: '/cards/pathasala.jpg',
    events: '/cards/events.jpg',
  },
  about: {
    temple: '/knowledge/gallery.jpg',
    manuscript: '/knowledge/upanishads.jpg',
    guru: '/about/guru.jpg',
    sunrise: '/knowledge/gallery.jpg',
    detail: '/knowledge/rituals.jpg',
  },
  knowledge: {
    vedas: '/knowledge/vedas.jpg',
    upanishads: '/knowledge/upanishads.jpg',
    puranas: '/knowledge/puranas.jpg',
    mantras: '/knowledge/mantras.jpg',
    yagnas: '/knowledge/yagnas.jpg',
    rituals: '/knowledge/rituals.jpg',
    gallery: '/knowledge/gallery.jpg',
    news: '/knowledge/news.jpg',
    manuscript: '/knowledge/upanishads.jpg',
    palmLeaf: '/knowledge/vedas.jpg',
    library: '/knowledge/puranas.jpg',
  },
  temple: {
    gopuram: '/knowledge/gallery.jpg',
    corridor: '/knowledge/gallery.jpg',
    pillars: '/knowledge/gallery.jpg',
    sunrise: '/hero-temple.jpg',
  },
  ritual: {
    deepam: '/knowledge/yagnas.jpg',
    lamps: '/knowledge/rituals.jpg',
    flowers: '/knowledge/rituals.jpg',
  },
  community: {
    pathasala: '/cards/pathasala.jpg',
    scholars: '/cards/scholars.jpg',
    chanting: '/about/guru.jpg',
    homam: '/knowledge/yagnas.jpg',
  },
  donate: {
    general: '/knowledge/gallery.jpg',
    scholar: '/knowledge/vedas.jpg',
    pathasala: '/cards/pathasala.jpg',
    annadanam: '/knowledge/rituals.jpg',
    yagnam: '/knowledge/yagnas.jpg',
    temple: '/hero-temple.jpg',
  },
  gallery: [
    '/hero-temple.jpg',
    '/knowledge/gallery.jpg',
    '/knowledge/vedas.jpg',
    '/knowledge/yagnas.jpg',
    '/knowledge/rituals.jpg',
    '/cards/scholars.jpg',
    '/cards/pathasala.jpg',
    '/about/guru.jpg',
  ],
};

export const LOGO_URL = '/logo.png';

/** Static page hero banner images */
export const PAGE_HEROES = {
  vedas: HERITAGE.knowledge.vedas,
  upanishads: HERITAGE.knowledge.upanishads,
  puranas: HERITAGE.knowledge.puranas,
  mantras: HERITAGE.knowledge.mantras,
  yagas: HERITAGE.knowledge.yagnas,
  rituals: HERITAGE.knowledge.rituals,
  gallery: HERITAGE.knowledge.gallery,
  news: HERITAGE.knowledge.news,
};
