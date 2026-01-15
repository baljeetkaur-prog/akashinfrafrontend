const DefaultPlanning = {
  seo: {
    title: "Dholera Smart City Planning | Akash Infra",
    description:
      "Explore Dholera Smart City master planning, zoning, infrastructure and investment opportunities.",
    keywords:
      "Dholera Smart City Planning, Dholera SIR, Smart City Gujarat, Akash Infra",
  },

  breadcrumb: {
    parent: "Home",
    current: "Planning",
  },

  banner: {
    heading: { tag: "h1", text: "Dholera Smart City Planning" },
  },

  introSection: {
    image: {
      url: "/images/planning_main.png",
      alt: "Dholera Smart City Master Plan",
    },
    smallHeading: { tag: "h4", text: "Dholera SIR Planning" },
    bigHeading: { tag: "h2", text: "A Well-Structured Blueprint for a Futuristic City" },
    paragraphs: [
      {
        tag: "p",
        text:
          "Dholera SIR is planned with world-class urban design standards, covering every layer including master planning, activation zones, TP schemes, zoning layouts, infrastructure networks, smart city components, sustainability frameworks, and residential-population distribution planning. The entire structure ensures seamless growth, efficient mobility, and long-term liveability.",
      },
      {
        tag: "p",
        text:
          "The planning approach focuses on creating a well-balanced, efficient, and future-ready city structure.",
      },
    ],
    button: {
      text: { tag: "p", text: "Know More" },
      link: "/dholera-SIR",
    },
  },

activationArea: {
  title: {
    tag: "h2",
    text: "Activation Area (Phase-1)",
  },

  paragraph: {
    tag: "p",
    text: `
      The Activation Area is the first fully developed zone of Dholera SIR,
      spread across <strong>22.5 sq. km</strong> within <strong>TP1</strong>.
      It was created to jump-start early development and provide ready-to-use
      infrastructure for industries, residences, and commercial establishments.
      This zone showcases the core planning standards of Dholera, with complete
      utilities, smart systems, and high-quality urban design.
    `,
  },

  infoList: [
    { label: "Total Area", value: "22.5 sq. km" },
    { label: "Location", value: "Central belt of TP1" },
    { label: "Status", value: "100% infrastructure completed" },
    {
      label: "Includes",
      value: "ABCD Building, C&C Center, 6-lane roads",
    },
    {
      label: "Utilities",
      value: "24×7 power, water, ICT fiber, drainage",
    },
    {
      label: "Purpose",
      value: "Ready-to-move zone for early investors",
    },
    {
      label: "Connectivity",
      value: "Expressway, airport corridor, MRTS",
    },
  ],

  image: {
    url: "/images/planning_two.png",
    alt: "Activation Area Dholera",
  },
},
tpSchemes: {
  title: { tag: "h2", text: "TP Schemes & Sub-TPs" },

  tps: [
    {
      tpNumber: 1,
      subTPs: [
        "Activation Area (Sub-TP1A)",
        "Industrial Zone (Sub-TP1B)",
        "Residential Zone (Sub-TP1C)",
      ],
      villages: "Dholera, Bavaliyari, Kamiyala",
      population: "15,000 approx.",
    },
    {
      tpNumber: 2,
      subTPs: [
        "Logistics Hub (Sub-TP2A)",
        "Green Zone (Sub-TP2B)",
      ],
      villages: "Navagam, Lunsar",
      population: "10,000 approx.",
    },
    {
      tpNumber: 3,
      subTPs: [
        "Commercial Zone (Sub-TP3A)",
        "Residential Expansion (Sub-TP3B)",
      ],
      villages: "Saragwala, Velavadar",
      population: "12,000 approx.",
    },
    {
      tpNumber: 4,
      subTPs: [
        "Activation Area Extension (Sub-TP4A)",
        "Commercial Expansion (Sub-TP4B)",
      ],
      villages: "Bavaliyari, Kamiyala",
      population: "8,000 approx.",
    },
    {
      tpNumber: 5,
      subTPs: [
        "Residential Zone (Sub-TP5A)",
        "Industrial Zone (Sub-TP5B)",
      ],
      villages: "Lunsar, Dholera",
      population: "14,000 approx.",
    },
    {
      tpNumber: 6,
      subTPs: [
        "Logistics & Warehousing (Sub-TP6A)",
        "Green / Institutional Zones (Sub-TP6B)",
      ],
      villages: "Navagam, Velavadar",
      population: "9,000 approx.",
    },
    {
      tpNumber: 7,
      subTPs: [
        "Industrial Expansion (Sub-TP7A)",
        "Residential Planning (Sub-TP7B)",
      ],
      villages: "Bavaliyari, Saragwala",
      population: "11,000 approx.",
    },
    {
      tpNumber: 8,
      subTPs: [
        "Commercial Expansion (Sub-TP8A)",
        "Green Spaces & Parks (Sub-TP8B)",
      ],
      villages: "Lunsar, Velavadar",
      population: "7,500 approx.",
    },
    {
      tpNumber: 9,
      subTPs: [
        "Residential Expansion (Sub-TP9A)",
        "Institutional Zone (Sub-TP9B)",
      ],
      villages: "Dholera, Saragwala",
      population: "6,500 approx.",
    },
    {
      tpNumber: 10,
      subTPs: [
        "Commercial & Retail (Sub-TP10A)",
        "Industrial Expansion (Sub-TP10B)",
      ],
      villages: "Bavaliyari, Lunsar",
      population: "8,000 approx.",
    },
  ],
},


 zoning: {
  heading: {
    tag: "h2",
    text: "Zoning Structure of Dholera SIR",
  },

  description: {
    tag: "p",
    text: `
      Dholera SIR is divided into functional zones, each designed for a specific
      purpose to ensure balanced urban growth, smooth mobility, and sustainable
      development.
    `,
  },

  zones: [
    {
      title: "Industrial Zone",
      description:
        "Allocated for manufacturing, logistics, and large-scale industries.",
      image: {
        url: "/images/industrial.jpeg",
        alt: "Industrial Zone",
      },
      button: {
        text: "Enquire Now",
        link: "/enquiry-form",
      },
    },
    {
      title: "Residential Zone",
      description:
        "Low, mid & high-density housing with essential urban services.",
      image: {
        url: "/images/residential.jpg",
        alt: "Residential Zone",
      },
      button: {
        text: "Enquire Now",
        link: "/enquiry-form",
      },
    },
    {
      title: "Commercial Zone",
      description:
        "Markets, business centers, retail hubs, office spaces.",
      image: {
        url: "/images/commercial.jpg",
        alt: "Commercial Zone",
      },
      button: {
        text: "Enquire Now",
        link: "/enquiry-form",
      },
    },
    {
      title: "Institutional Zone",
      description:
        "Schools, colleges, research institutions & training centers.",
      image: {
        url: "/images/carousel2.jpeg",
        alt: "Institutional Zone",
      },
      button: {
        text: "Enquire Now",
        link: "/enquiry-form",
      },
    },
    {
      title: "Green & Recreational",
      description:
        "Parks, gardens, community areas, and ecological buffers.",
      image: {
        url: "/images/green.jpg",
        alt: "Green Zone",
      },
      button: {
        text: "Enquire Now",
        link: "/enquiry-form",
      },
    },
    {
      title: "Transport & Logistics",
      description:
        "MRTS corridors, airport influence zone, expressway links.",
      image: {
        url: "/images/transport.jpg",
        alt: "Transport Zone",
      },
      button: {
        text: "Enquire Now",
        link: "/enquiry-form",
      },
    },
  ],
},


infrastructure: {
  heading: {
    tag: "h2",
    text: "Infrastructure & Development in Dholera SIR",
  },

  paragraph: {
    tag: "p",
    text: `
      Dholera SIR is a world-class smart city designed with future-ready planning.
      From industrial zones to green spaces and seamless connectivity, it offers
      sustainable growth and high-quality urban living.
    `,
  },

  image: {
    url: "/images/dholera_infrastructure.webp",
    alt: "Dholera Infrastructure",
  },

  stats: [
    { iconText: "2M Planned Residents" },
    { iconText: "920 sq.km Smart City Area" },
    { iconText: "60% Green & Open Spaces" },
    { iconText: "8–10 Lakh Employment Opportunities" },
  ],
},


 smartCityFeatures: {
  heading: {
    tag: "h2",
    text: "Smart City Features of Dholera SIR",
  },

  introParagraph: {
    tag: "p",
    text: `
      Dholera SIR is designed as a next-generation smart city, leveraging advanced
      technology and sustainable infrastructure to provide a high-quality urban
      lifestyle. From intelligent traffic systems to eco-friendly utilities,
      every aspect of the city is optimized for efficiency, safety, and connectivity.
    `,
  },

  leftFeatures: [
    "AI-powered traffic management",
    "IoT-based utilities monitoring",
    "Smart waste management systems",
    "Renewable energy integration",
  ],

  rightFeatures: [
    "24×7 security & surveillance",
    "Smart street lighting",
    "High-speed connectivity",
    "Advanced healthcare & education facilities",
  ],

  carouselImages: [
    { url: "/images/smart-city1.png", alt: "Smart City View 1" },
    { url: "/images/smart-city2.webp", alt: "Smart City View 2" },
    { url: "/images/smart-city3.jpg", alt: "Smart City View 3" },
  ],
},


sustainability: {
  heading: {
    tag: "h2",
    text: "Planning & Sustainability Highlights",
  },

  paragraph: {
    tag: "p",
    text: `
      Dholera SIR is designed as a world-class smart city, blending eco-friendly
      infrastructure with innovative urban planning. It features expansive green
      spaces, renewable energy integration, and smart water management systems,
      ensuring sustainable living.
    `,
  },

  topCards: [
    {
      iconType: "leaf",
      title: "Green Spaces",
      description: "60% of the city is dedicated to parks and open areas.",
    },
    {
      iconType: "solar",
      title: "Renewable Energy",
      description: "Integration of solar & wind energy across the city.",
    },
    {
      iconType: "water",
      title: "Smart Water Systems",
      description: "Efficient water recycling and management infrastructure.",
    },
  ],

  bottomCards: [
    {
      iconType: "home",
      title: "Housing",
      description: "Low, mid & high-density residential planning for comfort.",
    },
    {
      iconType: "building",
      title: "Integrated Villages",
      description: "22 villages are strategically integrated into the city layout.",
    },
    {
      iconType: "road",
      title: "Connectivity",
      description: "Close to expressway, airport & MRTS for easy mobility.",
    },
  ],
},


investment: {
  heading: {
    tag: "h2",
    text: "Why Invest in Dholera SIR?",
  },

  introParagraph: {
    tag: "p",
    text: `
      As the first and largest smart city under the DMIC corridor,
      it offers unmatched opportunities for early investors looking
      for long-term appreciation, business expansion, and high future potential.
    `,
  },

  form: {
    heading: {
      tag: "h3",
      text: "Get Investment Details",
    },
    subject: "New Investment Enquiry – Akash Infra",
  },

  contentBox: {
    heading: {
      tag: "h3",
      text: "India’s First & Fastest Growing Smart City",
    },
    paragraph: {
      tag: "p",
      text: `
        Dholera SIR is one of India’s most ambitious smart city projects,
        strategically located on the DMIC corridor. With world-class
        infrastructure, industrial growth, strong government support,
        and early-stage opportunities, it promises excellent long-term
        returns for investors. Its rapid development and futuristic
        master planning make it a high-potential investment hub.
      `,
    },
  },

  image: {
    url: "/images/why_dholera.png",
    alt: "Invest in Dholera",
  },
},

};

export default DefaultPlanning;
