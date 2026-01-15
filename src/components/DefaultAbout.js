// DefaultAbout.js
const DefaultAbout = {
  seo: {
    title: "About Us | Akash Infra",
    description: "Learn more about Akash Infra, our mission, vision and strengths.",
    keywords: "Akash Infra, About, Mission, Vision",
  },
  breadcrumb: {
    parent: "Home",
    current: "About Us"
  },
  heroSection: {
    pageTitle: { tag: "h1", text: "About Akash Infra" }
  },
  aboutSection: {
    image: "/images/about_new.png",
    smallHeading: { tag: "h4", text: "About Akash Infra" },
    bigHeading: { tag: "h2", text: "Building Secure Investments for Tomorrow" },
    paragraphs: [
      { tag: "p", text: "With over twenty years of excellence in real estate development across the Tricity region and a strong two-year presence in Dholera, Akash Infra stands as a symbol of trust, quality, and innovation. Our commitment goes beyond just land and infrastructure, we build secure, value-driven investments that shape the future. Guided by integrity and a customer-first approach, we deliver legally clear, meticulously planned, and strategically located plotting projects that promise sustainable growth." },
      { tag: "p", text: "As Dholera emerges as Gujarat’s Smart City of the future, Akash Infra proudly leads the way in this transformative journey. Our developments align with the city’s world-class planning, advanced infrastructure, and rapidly growing investment potential, offering you not just a plot but a long-term partnership in progress." }
    ],
    question: "Have any questions?",
    phone: "+91 9915483066"
  },
  mission: {
    heading: { tag: "h3", text: "Our Mission" },
    text: { tag: "p", text: "To create secure, value-driven, and future-ready real estate developments through transparent processes, strategic planning, and a commitment to customer satisfaction." }
  },
  vision: {
    heading: { tag: "h3", text: "Our Vision" },
    text: { tag: "p", text: "To lead the transformation of Dholera Smart City by delivering world-class infrastructure, sustainable development, and long-term investment opportunities that shape a progressive future." }
  },
  modiVision: {
    smallHeading: { tag: "h4", text: "Prime Minister Narendra Modi's Vision for Dholera" },
    bigHeading: { tag: "h2", text: "Transforming Dholera into a Smart City" },
    paragraphs: [
      { tag: "p", text: "Prime Minister Narendra Modi envisions Dholera as a world-class Smart City, integrating advanced infrastructure, sustainable urban planning, and cutting-edge technology to create a hub of economic growth and innovation." },
            { tag: "p", text: "Under his vision, Dholera will become a model city with seamless connectivity, investment-friendly policies, and a thriving ecosystem that benefits both residents and investors. The city is set to be a benchmark for future smart urban development in India." }
    ],
    image: "/images/modi_vision.png"
  },
  strengths: [
    {
      title: { tag: "h4", text: "Trusted Experience" },
      description: { tag: "p", text: "Over 20 years in real estate and 2 years in Dholera ensuring reliable, legally clear projects." }
    },
    {
      title: { tag: "h4", text: "Strategic Locations" },
      description: { tag: "p", text: "Projects are meticulously planned in prime Dholera locations with excellent connectivity." }
    },
    {
      title: { tag: "h4", text: "Customer-Focused" },
      description: { tag: "p", text: "Transparent processes, seamless approvals, and a customer-first approach for peace of mind." }
    }
  ]
};

export default DefaultAbout;
