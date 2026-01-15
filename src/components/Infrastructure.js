// Infrastructure.jsx
import React, { useState, useEffect } from "react";
import "./Infrastructure.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What makes Dholera’s infrastructure smart?",
    answer:
      "Integrated digital control systems, underground utilities, and ICT-enabled city management make Dholera a fully smart urban ecosystem.",
  },
  {
    question: "How is infrastructure planned for industries?",
    answer:
      "Industrial zones are developed with wide roads, high-capacity utilities, logistics access, and plug-and-play infrastructure.",
  },
  {
    question: "Is Dholera connected to major transport networks?",
    answer:
      "Yes, it connects to expressways, the upcoming international airport, and the Dedicated Freight Corridor.",
  },
  {
    question: "Is the city ready for residential development?",
    answer:
      "Yes, residential zones are fully serviced with utilities, roads, and smart systems already in place.",
  },
  {
    question: "How reliable are the utilities in Dholera?",
    answer:
      "Dholera offers 24×7 assured power, smart water management, underground utility corridors, and automated monitoring systems to ensure uninterrupted services.",
  },
];
const buildFaqSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};


const Infrastructure = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (id) => setOpenFAQ(openFAQ === id ? null : id);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
<Helmet>
  <title>Dholera Smart Infrastructure | Dholera Connectivity</title>

  <meta
    name="description"
    content="Discover Dholera Smart Infrastructure: advanced utilities, seamless connectivity, and future-ready industrial and residential zones in India’s first greenfield smart city."
  />

  <meta
    name="keywords"
    content="Dholera Smart Infrastructure, Dholera connectivity, smart city utilities, industrial zones"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="infra-page">

        {/* Banner */}
<section
  className="infra-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="infra-banner-container">
    <h1 className="infra-banner-heading" data-aos="fade-up">
      Dholera Smart Infrastructure
    </h1>

    <div className="infra-breadcrumb" data-aos="fade-up">
      <FaHome className="infra-breadcrumb-icon" />
      <Link to="/" className="infra-breadcrumb-link">
        Home
      </Link>
      <span className="infra-breadcrumb-text">
        &gt;&gt; Dholera Smart Infrastructure
      </span>
    </div>
  </div>
</section>


        {/* Main Content */}
        <div
          className="infra-main-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          }}
        >
          <div className="infra-content-wrapper">

            {/* Left Text */}
            <div className="infra-left" data-aos="fade-up">
              <h2 className="infra-heading">
                Future-Ready Infrastructure for India’s Next Growth Hub
              </h2>

              <p className="infra-para">
                Dholera Smart City is engineered with world-class trunk infrastructure,
                enabling seamless connectivity, efficient resource management, and
                unmatched industrial-readiness for global investors.
              </p>
              <p className="infra-para">
                Designed as India’s first greenfield smart city, Dholera integrates ICT-enabled
                services, intelligent utilities, and advanced mobility systems to create a highly 
                efficient urban ecosystem. Every layer of the city from power and water management 
                to traffic control and public services is digitally connected to enable faster, 
                cleaner, and more responsive operations. This technology-driven approach not only 
                enhances day-to-day convenience but also sets a new benchmark for sustainable, 
                future-ready urban development in India.
              </p>
            </div>

            {/* Right Image */}
            <div className="infra-right" data-aos="fade-up">
              <img src="/images/infrastructure_1.webp" alt="Infrastructure" />
            </div>
          </div>

          {/* Second Heading + Paragraphs */}
          <div className="infra-section-text" data-aos="fade-up">
            <h2 className="infra-sub-heading">Why Dholera’s Infrastructure Stands Apart</h2>

            <p className="infra-para">
              Built on global benchmarks, Dholera integrates smart planning, sustainable 
              utilities, and intelligent systems that collectively redefine how modern 
              cities function. From an advanced Integrated Command & Control Center that 
              monitors city operations in real time to a completely underground utility 
              network that ensures a clutter-free urban landscape, every element has been 
              engineered for maximum efficiency. Multi-modal transport connectivity, 
              automated traffic systems, and carefully structured zoning create a seamless 
              ecosystem that supports large-scale residential and industrial growth without 
              compromising safety, convenience, or sustainability.
            </p>

            <p className="infra-para">
              Dholera’s infrastructure has been meticulously planned to ensure 
              uninterrupted utilities, high operational efficiency, and a scalable urban 
              framework capable of supporting industries of every scale—from MSMEs to 
              global manufacturing giants. The city integrates world-class features such as 
              smart grids, 24×7 assured power supply, recycled water distribution, and 
              underground service corridors designed to minimize maintenance disruption. 
              With one of India’s largest planned renewable energy zones and a dedicated 
              solar park, Dholera sets a new benchmark for clean, intelligent, and 
              environmentally responsible industrial development.
            </p>

            <p className="infra-para">
              Its strategic location at the convergence of major expressways, the upcoming 
              Dholera International Airport, and the Dedicated Freight Corridor provides 
              unparalleled logistical advantages, reducing travel time and improving supply 
              chain efficiency. This powerful connectivity strengthens Dholera’s position as 
              a hub for manufacturing, warehousing, aerospace, defense, and export-driven 
              industries. Combined with smart governance, streamlined approval systems, and 
              long-term sustainability planning, Dholera offers an ecosystem where 
              businesses can scale rapidly, residents can enjoy modern urban comfort, and 
              investments can achieve exceptional long-term value.
            </p>
          </div>

          {/* Points with Checkmarks */}
          <div className="infra-points-section" data-aos="fade-up">
            <ul>
              <li>Smart water, power, and ICT networks with automated monitoring</li>
              <li>World-class internal roads with utility ducts and cycle tracks</li>
              <li>Robust stormwater, drainage, and environmental systems</li>
              <li>Seamless connectivity to expressways, airport, and DFC</li>
              <li>Fully serviced industrial and residential zones ready for development</li>
            </ul>
          </div>

          {/* FAQ Section */}
       <div className="infra-faq-section">
  <h2 className="infra-sub-heading" data-aos="fade-up">
    FAQs
  </h2>

{faqs.map((faq, idx) => (
  <div
    key={idx}
    className={`infra-faq-item ${openFAQ === idx ? "open" : ""}`}
    onClick={() => toggleFAQ(idx)}
  >
    <div className="infra-faq-header">
      <IoChevronDown className="infra-faq-icon" />
      <h3>{faq.question}</h3>
    </div>

    {openFAQ === idx && (
      <div className="infra-faq-answer">{faq.answer}</div>
    )}
  </div>
))}

</div>

        </div>
      </div>
    </>
  );
};

export default Infrastructure;
