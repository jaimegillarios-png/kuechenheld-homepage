/**
 * All homepage copy and imagery. Static for now — production will pull the blog
 * posts, showrooms and reviews from the CMS, so each block is shaped like the
 * payload we would expect back.
 */

const WF = "https://cdn.prod.website-files.com/6391b8b8063c7487769d5e4c";
const WF2 = "https://cdn.prod.website-files.com/6391b8b8063c74b54a9d5e71";

/**
 * Destinations that do not exist yet. Everything here renders as inert text via
 * `MaybeLink` while the value is `null`; set a path and the same markup becomes
 * a real link. Per-item routes (a single post, a single showroom) live on the
 * item's optional `href`.
 *
 * In-page anchors (`#fragebogen`, `#standorte`, …) are real links already and
 * are not listed here.
 */
export const routes: Record<
  "login" | "blog" | "testimonials" | "showrooms",
  string | null
> = {
  login: null,
  blog: null,
  testimonials: null,
  showrooms: null,
};

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Küchendesign", href: "#kuechendesign" },
  { label: "Planung", href: "#planung" },
  { label: "Blog", href: "#blog" },
  { label: "Standorte", href: "#standorte" },
];

export type HeroSlide = {
  src: string;
  alt: string;
  model: string;
  city: string;
};

export const heroSlides: HeroSlide[] = [
  {
    src: `${WF}/6391b8b8063c746bf99d6365_bali_nussbaum.avif`,
    alt: "Bali Nussbaum Küche",
    model: "Modell Bali — Nussbaum",
    city: "Hamburg",
  },
  {
    src: "/images/hero-wohnkueche-salbei.webp",
    alt: "Wohnküche in Salbeigrün",
    model: "Modell Wohnküche — Salbei",
    city: "Berlin",
  },
  {
    src: "/images/hero-insel-kaschmir.jpg",
    alt: "Offene Küche mit Insel",
    model: "Modell Insel — Kaschmir",
    city: "München",
  },
  {
    src: "/images/hero-vegas-urban-brown.jpg",
    alt: "Küche Vegas Urban Brown Metallic",
    model: "Modell Vegas — Urban Brown",
    city: "Köln",
  },
];

export const trustStrip = [
  "1.500+ Küchen pro Jahr",
  "★ 4.7 Reviews.io",
  "8 Showrooms",
];

export type KitchenForm = { id: string; label: string; icon: string };

export const kitchenForms: KitchenForm[] = [
  { id: "zeile", label: "Küchenzeile", icon: "/shapes/shape-kitchenette.svg" },
  { id: "l", label: "L-Form", icon: "/shapes/shape-l-form.svg" },
  { id: "u", label: "U-Form", icon: "/shapes/shape-u.svg" },
  { id: "insel", label: "Kücheninsel", icon: "/shapes/shape-island.svg" },
];

export type Step = { num: string; title: string; body: string };

export const steps: Step[] = [
  {
    num: "01",
    title: "Küchenwünsche angeben",
    body: "Holz, Beton oder Stein? Mit oder ohne Kücheninsel? Füllen Sie unseren Fragebogen aus, wir rufen Sie an und vereinbaren ein erstes telefonisches Beratungsgespräch. Nach 45 Minuten erhalten Sie von unserem Planungsteam eine konkrete Preisindikation.",
  },
  {
    num: "02",
    title: "Wir planen Ihre neue Küche",
    body: "Wir planen Ihre Küche anhand Ihrer Angaben und beraten Sie zu jedem Schritt persönlich. Nach dem ersten Beratungsgespräch begrüßen wir Sie exklusiv in unserem Showroom, wo Sie Ihre zukünftige Küche via VR erleben können.",
  },
  {
    num: "03",
    title: "Ihre Traumküche ist fertig",
    body: "Schon nach ca. 8-9 Wochen (ab Aufmaß) liefern wir Ihre maßgeschneiderte Küche und montieren sie fachgerecht. Im Vorfeld wird unser Expertenteam bei Ihnen ein präzises Maß (Laseraufmaß) nehmen, um sicherzustellen, dass Ihre Küche perfekt passt.",
  },
];

export type Value = { stat: string; title: string; body: string };

export const values: Value[] = [
  {
    stat: "100 %",
    title: "Schnell & transparent",
    body: "Küchenzeilen, Küchenblöcke, Materialien, Farben – kein Grund zur Verzweiflung: Sie erhalten schnell ein Angebot, das Ihren Wünschen und Ihrem Budget entspricht – mit 100 % Transparenz und ohne versteckte Rabatte.",
  },
  {
    stat: "1.500+",
    title: "Höchste Qualität",
    body: "Wir liefern die hochwertigsten Küchen mit erstklassiger Handwerkskunst. Mit über 1.500 installierten Luxusküchen pro Jahr sorgen wir dafür, dass jedes Detail Ihren Raum in ein atemberaubendes und funktionales Meisterwerk verwandelt.",
  },
  {
    stat: "1 Team",
    title: "Alles aus einer Hand",
    body: "Wir leben für den besten Service! Von der Planung bis zur Montage lassen wir gemeinsam mit Ihrem ganz persönlichen, festen Planungsteam Ihren Küchentraum Wirklichkeit werden.",
  },
];

export type DiscoverCard = { title: string; body: string; src: string };

export const discoverCards: DiscoverCard[] = [
  {
    title: "Küchenfronten",
    body: "Finden Sie die perfekten Fronten für Ihre Küche. Ob matt, glänzend oder strukturiert – unsere Auswahl bietet für jeden Stil das Richtige.",
    src: `${WF}/6392140b779bba3ec4a6586a_AV_2040_Feiniche-schwarz_M1.avif`,
  },
  {
    title: "Arbeitsplatten",
    body: "Die Arbeitsfläche ist das Herz jeder Küche. Wählen Sie aus langlebigen Materialien und Oberflächen, die sowohl funktional als auch ästhetisch ansprechend sind.",
    src: `${WF}/65df79f468b3c45ab4615173_63c0080f92c610d426bbfb15_next125_nx510-L417M-L262M_GS-3_2022.avif`,
  },
  {
    title: "Küchengriffe",
    body: "Verleihen Sie Ihrer Küche den letzten Schliff: Mit einer großen Auswahl an Griffen in verschiedenen Designs und Materialien können Sie den Stil Ihrer Küche optimal abrunden.",
    src: `${WF}/6391b8b8063c746bf99d6365_bali_nussbaum.avif`,
  },
  {
    title: "Küchenformen",
    body: "Jede Küche ist einzigartig – und so auch ihre Form. Finden Sie die Küchenform, die sich optimal in Ihren Raum einfügt und Ihre Arbeitsabläufe unterstützt.",
    src: `${WF}/671931899f866ce54fccd2c0_63e23e35fddb58fa58db14c7_kueche_planen_kuechenheld_erfahrungsbericht_weissekueche02-p-1080.avif`,
  },
  {
    title: "Erfahrungsberichte",
    body: "Lesen Sie, wie andere KundInnen ihre Küche mit Küchenheld geplant haben – von der ersten Idee bis zur fertigen Montage.",
    src: `${WF}/6719318a8d24c510c2ae6e29_6492ef72324d1593d81352dc_kuechenheld-erfahrungen-fredericks-gruene-landhauskueche-01.avif`,
  },
  {
    title: "Küchenangebot vergleichen",
    body: "Mit Küchenheld können Sie Ihr vorhandenes Angebot vergleichen und die beste Wahl für Ihre maßgeschneiderte Küche treffen.",
    src: `${WF}/66913e8e61d76e134d138369_offer%20comparison.avif`,
  },
  {
    title: "Küchenideen",
    body: "Entdecken Sie unsere kreativen Küchenideen und finden Sie die perfekte Inspiration, um Ihre Küche nach Ihren individuellen Vorstellungen zu planen.",
    src: `${WF}/67619848a1d1494b74d61a52_673b5f99f9ff92f735ef301f_GS8A8222.jpg`,
  },
  {
    title: "Küchenstile",
    body: "Entdecken Sie eine Vielfalt an Küchenstilen – von modern bis klassisch – und lassen Sie sich inspirieren, um Ihre Küche nach Ihrem Geschmack zu gestalten.",
    src: `${WF}/6719318918827f73ac6c1645_640760c63763b9306a21153c_kueche-planen-kundenkueche-schwarze-landhausku%CC%88che-diana-01.avif`,
  },
];

export type Review = { date: string; quote: string; author: string };

export const reviews: Review[] = [
  {
    date: "14.11.2024",
    quote:
      "„Alles hat super geklappt! Der ganze Prozess war wirklich super. Unsere Küche sieht fantastisch aus, wir haben eine tolle Beratung von Reiner bekommen. Wir sind wirklich dankbar für das Endergebnis.“",
    author: "Ariadna · Verified customer",
  },
  {
    date: "09.10.2024",
    quote:
      "„Wie hier alle schon schreiben: Die Planung war mega! Aber auch zur Montage möchte ich mich äußern: Es hat wunderbar alles funktioniert, die Monteure waren super auf Zack und auch beanstanden musste ich nichts.“",
    author: "Sebastian · Verified customer",
  },
  {
    date: "20.09.2024",
    quote: "„Digital, einfach und Klasse!“",
    author: "Georg Hauer · Verified customer",
  },
  {
    date: "13.09.2024",
    quote:
      "„Ich bin begeistert! Der gesamte Prozess war perfekt, vom ersten online Beantworten bis zur Lieferung der Küche, das Münchner Team Herr Klewitz, Frau Tobias und Frau Rabus waren ebenfalls top! Es hat rundum – Kundenservice, Preis, Lieferung alles gepasst!“",
    author: "Barbara M · Verified customer",
  },
  {
    date: "12.09.2024",
    quote:
      "„Wir sind sehr glücklich mit unserer Küche und deswegen geben wir hier auch gerne eine positive Bewertung ab!“",
    author: "Karl Theodor · Verified customer",
  },
  {
    date: "11.09.2024",
    quote:
      "„Der gesamte Prozess wurde sehr gut betreut! Die Planung war schon super und Lieferung und Montage sind auch gut über die Bühne gegangen. Die Küche sieht top aus!“",
    author: "Susanne · Verified customer",
  },
];

export type StorySlide = { src: string; alt: string; caption: string };

export const storySlides: StorySlide[] = [
  {
    src: "/images/story-lichterfelde.jpg",
    alt: "Familie in ihrer neuen Küche in Lichterfelde",
    caption: "Küche Lichterfelde",
  },
  {
    src: "/images/story-anthrazit.jpg",
    alt: "Paar in seiner neuen dunkelblauen Küche",
    caption: "Küche in Anthrazit",
  },
  {
    src: `${WF}/6719318964b7901f8cf5d09d_6540c5f0adb7734a17bebaac_kuechenheld_schwarze_trendkueche-p-1080.avif`,
    alt: "Schwarze Trendküche",
    caption: "Schwarze Trendküche",
  },
  {
    src: `${WF}/671931899f866ce54fccd2c0_63e23e35fddb58fa58db14c7_kueche_planen_kuechenheld_erfahrungsbericht_weissekueche02-p-1080.avif`,
    alt: "Weiße Küche",
    caption: "Weiße Küche",
  },
];

export const showrooms = [
  "Berlin-Charlottenburg",
  "Berlin-Mitte",
  "Düsseldorf",
  "Frankfurt am Main",
  "Freiburg",
  "Hamburg",
  "Köln",
  "München",
];

export type BlogPost = {
  title: string;
  excerpt: string;
  meta: string;
  src: string;
  alt: string;
  /** Set once posts have real URLs; falls back to `routes.blog`. */
  href?: string;
};

export const featuredPost: BlogPost = {
  title: "Küchentrends 2026: Farben, Materialien & Design der modernen Küche",
  excerpt:
    "Die Küchentrends 2026 setzen auf warme Farben, natürliche Materialien, organische Formen und wohnliche Küchenlayouts.",
  meta: "Nathalie · 01.01.2026 · 8 Min. Lesedauer",
  src: `${WF2}/6960daf608d5b257a807fd1d_BL5255011_SGM-A127_LAR-K653_HA.webp`,
  alt: "Küchentrends 2026",
};

export const blogPosts: BlogPost[] = [
  {
    title: "Offene Küche: Mit diesen 10 Tipps gelingt die Planung",
    excerpt:
      "Planen Sie Ihre offene Küche erfolgreich mit diesen 10 Tipps. So vereinen Sie Design und Funktionalität perfekt in einem Raum.",
    meta: "Reiner · 23.08.2024 · 6 Min.",
    src: `${WF2}/66c845713882a7d2ee0672b5_Theresa%20Casey%20Organic%20Loft_Silestone_1.webp`,
    alt: "Offene Küche",
  },
  {
    title: "Wohnküche: Inspiration & Einrichtungsideen für Ihre Traumküche",
    excerpt:
      "Entdecken Sie alles über Wohnküchen, von nützlichen Tipps zur Planung bis hin zu inspirierenden Einrichtungsideen.",
    meta: "Yannick · 05.08.2024 · 5 Min.",
    src: `${WF2}/66b0f879be992e1ad5d58a91_Wohnku%CC%88che_Ku%CC%88chenheld.jpg`,
    alt: "Wohnküche",
  },
  {
    title: "Küche mit Holz: Zeitloses Design trifft auf Nachhaltigkeit",
    excerpt:
      "Entdecken Sie, wie Holz in der Küche zeitlose Eleganz mit Nachhaltigkeit vereint.",
    meta: "Yannick · 22.01.2025 · 4 Min.",
    src: `${WF2}/6790f001e0bcfa2794538e0a_AV_%206023GL_Nussbaum_elegant_M1.jpg`,
    alt: "Küche mit Holz",
  },
  {
    title: "Lieferzeit Küche: So lange dauert es bis zur fertigen Küche",
    excerpt:
      "Erfahren Sie, wie Sie Verzögerungen vermeiden und den Prozess optimieren können.",
    meta: "Yannick · 23.08.2024 · 5 Min.",
    src: `${WF2}/66c88fe8d055005cfa9d2a8d_Design%20ohne%20Titel%20(1).png`,
    alt: "Lieferzeit Küche",
  },
  {
    title: "Grifflose Küchen: Der Küchentrend ohne Griffe",
    excerpt:
      "Erfahren Sie, ob eine grifflose Küche Ihren Anforderungen entspricht.",
    meta: "Anna · 22.05.2024 · 5 Min.",
    src: `${WF2}/664748fd7049432c0697f8b2_next125_nx510-L097M_GS-2_2022.webp`,
    alt: "Grifflose Küchen",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Welche Vorteile habe ich, wenn ich WhatsApp für die Beratung nutze?",
    a: "Die Vorteile liegen vor allem in der Schnelligkeit und Flexibilität. Sie erhalten Terminbestätigungen und Erinnerungen, können unkompliziert Fragen stellen, Dokumente oder Fotos schicken und bleiben jederzeit über den aktuellen Stand Ihrer Küchenplanung informiert – ohne lange Wartezeiten.",
  },
  {
    q: "Kann ich mit Küchenheld auch meinen Hauswirtschaftsraum planen?",
    a: "Ja, bei Küchenheld können Sie nicht nur Ihre Küche, sondern auch Ihren Hauswirtschaftsraum planen lassen. Wir bieten Ihnen eine maßgeschneiderte Planung, die perfekt auf Ihre individuellen Bedürfnisse abgestimmt ist. Sprechen Sie uns einfach darauf an, wir integrieren den Hauswirtschaftsraum gerne in die Planung Ihrer Traumküche!",
  },
  {
    q: "Wo liefert und montiert Küchenheld meine Küche?",
    a: "Küchenheld liefert und montiert Küchen auf dem deutschen Festland. Für Montagen an Adressen mehr als 100km von unseren Smartrooms entfernt, können Zusatzkosten für die Lieferung und Montage erhoben werden.",
  },
  {
    q: "Welche Küchenarbeitsplatte ist unempfindlich?",
    a: "Arbeitsplatten aus Granit, Stein, Neolith oder Dekton gelten als besonders unempfindlich. So bietet beispielsweise vor allem Dekton viele Vorteile, da die Oberfläche jegliches Eindringen von Flüssigkeit vermeidet sowie äußerst bruchfest und robust ist. Zudem ist Stein unempfindlich gegen Hitze und Flecken.",
  },
  {
    q: "Wie lange dauert die Lieferung?",
    a: "Die Lieferzeit der verschiedenen Küchenkomponenten beträgt ca. 6-12 Wochen, abhängig von Ihrer Bestellung. Eine Lieferung innerhalb weniger Werktage ist nicht zu bewerkstelligen.",
  },
  {
    q: "Warum muss ich einen Fragebogen ausfüllen?",
    a: "Der Online-Fragebogen stellt den ersten Schritt auf dem Weg zu Ihrer neuen Traumküche dar. Anhand des Fragebogens ist es möglich, uns Ihre ersten Vorstellungen und Präferenzen für die Küchenform, die gewünschten Küchenmaterialien und dem gewünschten Planungszeitraum mitzuteilen. Die im Fragebogen angegebenen Präferenzen können während der Planung jederzeit kostenlos und unverbindlich verändert werden.",
  },
  {
    q: "Wie läuft die Planung bei Küchenheld ab?",
    a: "Der Planungsprozess bei Küchenheld verläuft einfach, transparent und unkompliziert: ein kurzer Fragebogen, ein telefonisches Beratungsgespräch mit konkreter Preisindikation, detaillierte Planung mit Ihrem festen Team, ein VR-Erlebnis im Showroom, dann Laseraufmaß, Lieferung und Montage.",
  },
];

export const ctaBandImage = {
  src: `${WF}/6392140b779bba3ec4a6586a_AV_2040_Feiniche-schwarz_M1.avif`,
  alt: "Dunkle Designküche",
};

export type FooterColumn = { heading: string; links: string[] };

export const footerColumns: FooterColumn[] = [
  {
    heading: "Über Küchenheld",
    links: [
      "Über uns",
      "Unsere Küchen",
      "Karriere",
      "Kontakt",
      "Presse",
      "Banigo – Badmöbel",
    ],
  },
  {
    heading: "Service",
    links: [
      "Küche kaufen",
      "Küche nach Maß",
      "Küchenplaner",
      "Küchen Ideen",
      "Ausstellungsküchen Abverkauf",
      "FAQ",
      "Montage",
    ],
  },
  {
    heading: "Ratgeber",
    links: [
      "Unser Planungsservice",
      "Videoberatung",
      "Virtual Reality",
      "Küchentrends 2026",
    ],
  },
  {
    heading: "Showrooms",
    links: showrooms.map((s) => (s === "Frankfurt am Main" ? "Frankfurt" : s)),
  },
];

export const legalLinks = [
  "Impressum",
  "Datenschutzerklärung",
  "AGB",
  "Barrierefreiheit",
];

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/kuechenheld.de" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kuechenheld_official/",
  },
  { label: "Pinterest", href: "https://www.pinterest.de/kuechenheld/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/kuechenheld/" },
] as const;
