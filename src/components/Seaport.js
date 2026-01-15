// Seaport.jsx
import React, { useState, useEffect } from "react";
import "./Seaport.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What is the purpose of the Dholera Sea Port?",
    answer:
      "It will act as a major global trade gateway, boosting exports and industrial logistics.",
  },
  {
    question: "How far is the port from Dholera SIR?",
    answer:
      "It is located very close to Dholera SIR, ensuring seamless cargo transport.",
  },
  {
    question: "Will the port support international shipping?",
    answer:
      "Yes, it is designed as a deep-draft international cargo handling port.",
  },
  {
    question: "Is the port connected to expressways and highways?",
    answer:
      "Yes, it connects to DMIC, highways, rail lines, and industrial corridors.",
  },
  {
    question: "What industries benefit from the port?",
    answer:
      "Manufacturing, warehousing, logistics, exports, and heavy industries benefit massively.",
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


const Seaport = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

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
  <title>Dholera Sea Port | Global Maritime Gateway & Industrial Growth Hub</title>

  <meta
    name="description"
    content="Dholera Sea Port is a world-class deep-draft port near Dholera SIR, enabling global trade, faster exports, logistics efficiency, and large-scale industrial growth in Gujarat."
  />

  <meta
    name="keywords"
    content="Dholera Sea Port, Dholera port project, Gujarat deep sea port, Dholera maritime infrastructure, Dholera export hub"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/dholera-sea-port"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="seaport-page">

        {/* Banner */}
<section
  className="seaport-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="seaport-container">
    <h1 className="seaport-heading" data-aos="fade-up">
      Dholera Sea Port
    </h1>

    <div className="seaport-breadcrumb" data-aos="fade-up">
      <FaHome className="seaport-home-icon" />
      <Link to="/" className="seaport-breadcrumb-link">
        Home
      </Link>
      <span className="seaport-breadcrumb-text">
        &gt;&gt; Dholera Sea Port
      </span>
    </div>
  </div>
</section>


        {/* Main Content */}
        <div
          className="seaport-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* Section 1 (Image Left, Text Right) */}
          <div className="seaport-section-wrapper">
            <div className="seaport-left-image" data-aos="fade-up">
              <img src="/images/seaport_1.jpg" alt="Seaport" />
            </div>

            <div className="seaport-right-content" data-aos="fade-up">
              <h2 className="seaport-title">World-Class Dholera Sea Port</h2>
              <p className="seaport-para">
                The Dholera Sea Port is set to become one of India’s major international trade gateways with deep-draft port facilities, capable of accommodating large container vessels and bulk carriers. It is designed to handle high cargo throughput efficiently, making it a key hub for import and export operations in western India.
              </p>
              <p className="seaport-para">
                Designed to handle large cargo volumes, the port connects industries in Dholera SIR to global trade routes, fostering seamless international trade. Its modern cargo handling systems, advanced warehousing facilities, and dedicated logistics zones ensure smooth operations and minimal turnaround times for shipping companies and industrial stakeholders.
              </p>
              <p className="seaport-para">
                With multimodal connectivity including road, rail, and proximity to industrial corridors, the port accelerates industrial growth and strengthens India's maritime ecosystem. By facilitating trade, attracting foreign investment, and supporting downstream industries, the Dholera Sea Port is poised to be a transformative infrastructure project driving regional economic development and positioning India as a competitive player in global maritime trade.
              </p>
              <p className="seaport-para">
                The port is being developed with world-class standards, sustainable practices, and future scalability in mind, ensuring it remains a modern maritime gateway for decades to come.
              </p>
            </div>
          </div>

          {/* Section 2 (Reverse Zigzag) */}
          <div className="seaport-section-wrapper reverse">
            <div className="seaport-left-image" data-aos="fade-up">
              <img src="/images/seaport_2.jpg" alt="Dholera Port" />
            </div>

            <div className="seaport-right-content" data-aos="fade-up">
              <h2 className="seaport-title">Strategic Location Advantage</h2>
              <p className="seaport-para">
                The port is located near the Gulf of Khambhat, giving it a competitive advantage in maritime logistics, export operations, and global connectivity. Its proximity to international shipping lanes allows faster and more cost-effective access to global markets.
              </p>
              <p className="seaport-para">
                Being adjacent to the Dholera Special Investment Region (SIR) enhances its value as a hub for industrial and commercial activities. Industries in the region benefit from reduced transportation costs, faster import-export cycles, and seamless integration with manufacturing and logistics operations.
              </p>
            </div>
          </div>

          {/* Below Text Blocks */}
          <div className="seaport-section-text" data-aos="fade-up">
            <h2 className="seaport-title">A Growth Engine for Industries</h2>
            <p className="seaport-para">
              Dholera Port supports manufacturing, logistics, warehousing, and exports, making it a central hub for economic development. By providing state-of-the-art port facilities and efficient cargo handling, it enables industries to streamline supply chains, reduce transit times, and lower operational costs. The port’s strategic integration with industrial zones, highways, and proposed rail networks ensures seamless movement of raw materials and finished goods, attracting investments and fostering new business opportunities across sectors such as manufacturing, pharmaceuticals, textiles, and automotive components. This makes Dholera Sea Port a powerful engine driving regional industrial growth and employment generation.
            </p>

            <h2 className="seaport-title">Connected to Global Markets</h2>
            <p className="seaport-para">
              Seamless integration with highways, rail, and international sea routes ensures faster cargo movement and reduced transportation cost.
            </p>
          </div>

          {/* Key Checkpoints */}
          <div className="seaport-points-section" data-aos="fade-up">
            <ul>
              <li>Deep Draft Port Facility (up to 20m)</li>
              <li>Dedicated Logistics & Cargo Handling Zone</li>
              <li>Direct Connectivity to DMIC Highway</li>
              <li>Massive Industrial & Export Support</li>
              <li>Global Maritime Trade Advantage</li>
            </ul>
          </div>

          {/* FAQs */}
         <div className="seaport-faq-section">
  <h2 className="seaport-title" data-aos="fade-up">
    FAQs
  </h2>

{faqs.map((faq, index) => (
  <div
    key={index}
    className={`faq-item ${openFAQ === index ? "open" : ""}`}
    onClick={() => toggleFAQ(index)}
  >
    <div className="faq-header">
      <IoChevronDown className="faq-icon" />
      <h3>{faq.question}</h3>
    </div>

    {openFAQ === index && (
      <p className="faq-answer">{faq.answer}</p>
    )}
  </div>
))}

</div>

        </div>
      </div>
    </>
  );
};

export default Seaport;
