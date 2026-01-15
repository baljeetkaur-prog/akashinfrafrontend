const DefaultPricing = {
  seo: {
    title: "Pricing | Akash Infra",
    description: "Explore transparent and flexible pricing plans at Akash Infra.",
    keywords: "Akash Infra Pricing, Dholera Plot Prices, Investment Plans"
  },

  breadcrumb: {
    parent: "Home",
    current: "Pricing"
  },

  banner: {
    heading: { tag: "h1", text: "Our Pricing Plans" }
  },

  introSection: {
    smallHeading: { tag: "p", text: "Akash Infra Investment" },
    bigHeading: { tag: "h2", text: "Secure & Transparent Investment Plans" },
    paragraphs: [
      { tag: "p", text: "Akash Infra offers flexible investment plans for Residential, Commercial, and Industrial plots in Dholera Special Investment Region (DSIR). Our goal is to provide investors with a safe, transparent, and high-value investment experience." },
      { tag: "p", text: "With over twenty years of excellence in real estate development across the Tricity region and a strong two-year presence in Dholera, Akash Infra has consistently delivered legally clear, meticulously planned, and strategically located plotting projects." },
      { tag: "p", text: "As Dholera rapidly emerges as Gujarat’s premier Smart City under the DMIC corridor, our thoughtfully curated investment plans are designed to deliver strong long-term appreciation along with complete peace of mind for investors. Backed by government-led infrastructure development, world-class connectivity, and futuristic urban planning, Dholera offers a rare opportunity to invest early in a city built for the next generation." }
    ],
    image: {
      url: "/images/pricing_intro.png",
      publicId: "",
      alt: "Akash Infra Pricing Overview"
    }
  },

  pricingCards: [
    {
      title: { tag: "h3", text: "Residential Plot" },
      price: { label: "Starts from", value: "₹6,00,000" },
      planName: { tag: "h4", text: "Residential Investment Plan" },
      points: [
        { tag: "p", text: "10% Booking Amount" },
        { tag: "p", text: "15% within 15 Days" },
        { tag: "p", text: "25% within 45 Days" },
        { tag: "p", text: "50% at Sale Deed Execution" },
        { tag: "p", text: "Located near upcoming residential zones" },
        { tag: "p", text: "Ideal for long-term home planning" },
        { tag: "p", text: "High appreciation due to surrounding development" },
        { tag: "p", text: "Peaceful community surroundings" }
      ],
      button: { text: { tag: "p", text: "Request Details" }, link: "/enquiry-form" }
    },
    {
      title: { tag: "h3", text: "Commercial Plot" },
      price: { label: "Starts from", value: "₹6,00,000" },
      planName: { tag: "h4", text: "Commercial Investment Plan" },
      points: [
        { tag: "p", text: "10% Booking Amount" },
        { tag: "p", text: "15% within 15 Days" },
        { tag: "p", text: "25% within 45 Days" },
        { tag: "p", text: "50% at Sale Deed Execution" },
        { tag: "p", text: "Positioned near high-footfall commercial corridors" },
        { tag: "p", text: "Excellent for retail, offices & showrooms" },
        { tag: "p", text: "Strong rental income potential" },
        { tag: "p", text: "Close to major 4-lane/6-lane roads" }
      ],
      button: { text: { tag: "p", text: "Request Details" }, link: "/enquiry-form" }
    },
    {
      title: { tag: "h3", text: "Industrial Plot" },
      price: { label: "Starts from", value: "₹6,00,000" },
      planName: { tag: "h4", text: "Industrial Investment Plan" },
      points: [
        { tag: "p", text: "10% Booking Amount" },
        { tag: "p", text: "15% within 15 Days" },
        { tag: "p", text: "25% within 45 Days" },
        { tag: "p", text: "50% at Sale Deed Execution" },
        { tag: "p", text: "Strategically located in designated industrial belt" },
        { tag: "p", text: "Suitable for MSME factories & warehouses" },
        { tag: "p", text: "Easy access to freight corridors & logistics hubs" },
        { tag: "p", text: "High growth due to industrial policy incentives" }
      ],
      button: { text: { tag: "p", text: "Request Details" }, link: "/enquiry-form" }
    }
  ],

  ctaSection: {
    heading: { tag: "h2", text: "Ready to Invest in Dholera?" },
    paragraph: {
      tag: "p",
      text: "Connect with our investment experts to understand project details, pricing, legal documentation and future growth plans. You can also download our brochure for complete information."
    },
    buttons: [
      {
        text: { tag: "p", text: "Contact Us" },
        link: "/contact-us",
        type: "white"
      },
      {
        text: { tag: "p", text: "Download Brochure" },
        link: "/images/Dholera Brochure.pdf",
        type: "outline",
        target: "_blank"
      }
    ]
  }
};

export default DefaultPricing;
