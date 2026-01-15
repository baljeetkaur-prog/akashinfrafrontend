// Freight.jsx
import React, { useState, useEffect } from "react";
import "./Freight.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What is a Dedicated Freight Corridor (DFC)?",
    answer:
      "The DFC is a railway infrastructure project designed exclusively for freight movement, improving speed, capacity, and efficiency.",
  },
  {
    question: "How does the DFC benefit industries?",
    answer:
      "It cuts transportation time, reduces logistics costs, and provides seamless cargo movement across India.",
  },
  {
    question: "Which corridors are part of the DFC?",
    answer:
      "The major corridors include the Eastern Dedicated Freight Corridor and the Western Dedicated Freight Corridor connecting key industrial regions.",
  },
  {
    question: "How fast do freight trains run on the DFC?",
    answer:
      "Freight trains on the DFC can operate at speeds of up to 100 km/h, ensuring faster and more reliable cargo delivery.",
  },
  {
    question: "Is the DFC connected to ports and logistics hubs?",
    answer:
      "Yes, the DFC connects major ports, logistics parks, and industrial hubs for efficient end-to-end cargo movement.",
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


const Freight = () => {
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
  <title>
    Dedicated Freight Corridor Strengthening Logistics and Industrial Connectivity in India
  </title>

  <meta
    name="description"
    content="Explore the Dedicated Freight Corridor project designed to transform India’s logistics network with high-speed freight movement, reduced costs, and seamless connectivity between industrial hubs, ports, and economic corridors."
  />

  <meta
    name="keywords"
    content="Dedicated Freight Corridor, DFC India, freight corridor infrastructure, industrial logistics India"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/dedicated-freight-corridor"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="freight-page">
        {/* Banner */}
 <section
  className="freight-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="freight-container">
    <h1 className="freight-heading" data-aos="fade-up">
      Dedicated Freight Corridor (DFC)
    </h1>

    <div className="freight-breadcrumb" data-aos="fade-up">
      <FaHome className="freight-home-icon" />
      <Link to="/" className="freight-breadcrumb-link">
        Home
      </Link>
      <span className="freight-breadcrumb-text">
        &gt;&gt; Dedicated Freight Corridor
      </span>
    </div>
  </div>
</section>


        <div
          className="freight-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
          }}
        >
          {/* Section 1: Left Text, Right Image */}
          <div className="freight-wrapper">
            <div className="freight-left" data-aos="fade-up">
              <h2 className="freight-title">Transforming India’s Logistics Backbone</h2>

              <p className="freight-para">
                As one of the world’s largest dedicated freight rail networks, the DFC is
                engineered to drastically cut transit time, increase hauling capacity, and
                create a more predictable supply-chain ecosystem across India. Its dedicated
                high-speed, heavy-haul tracks eliminate traditional congestion, allowing goods
                to move seamlessly from industrial clusters to major ports with minimal
                delays. This efficiency not only reduces logistics costs for businesses but
                also enhances India’s competitiveness in global trade.
              </p>

              <p className="freight-para">
                Beyond transport speed and load capacity, the corridor drives long-term
                economic growth by unlocking new industrial zones, logistics parks, and
                warehousing hubs along its route. 
              </p>
            </div>

            <div className="freight-right" data-aos="fade-up">
              <img src="/images/freight.jpg" alt="Dedicated Freight Corridor" />
            </div>
          </div>

          {/* Section 2: Center Image */}
          <div className="freight-center-image" data-aos="fade-up">
            <img src="/images/freight_2.png" alt="Freight Corridor Progress Map" />
          </div>

          {/* Section 3: Heading + Paragraph */}
          <div className="freight-section-text" data-aos="fade-up">
            <h2 className="freight-title">Strengthening India’s Industrial Growth</h2>

            <p className="freight-para">
              The DFC enhances logistics efficiency, reduces transportation costs, and
              supports seamless connectivity for industrial clusters across the nation.
              By enabling faster freight movement, improving reliability, and easing the
              load on existing railway lines, it empowers industries to scale production,
              access distant markets, and optimize supply chains. The corridor also fuels
              the growth of new industrial zones, warehousing hubs, and port-linked
              facilities, creating a strong foundation for accelerated manufacturing and
              long-term economic development.
            </p>
          </div>

          {/* Section 4: Four Points */}
          <div className="freight-points-section">
            <div className="freight-point" data-aos="fade-up">
              <h3>1. Faster Cargo Movement</h3>
              <p>
                High-speed freight trains ensure quick and uninterrupted transportation of
                goods across major trade routes, significantly reducing transit time and
                enabling industries to meet tight delivery schedules with greater reliability.
              </p>
            </div>

            <div className="freight-point" data-aos="fade-up">
              <h3>2. Reduced Logistics Cost</h3>
              <p>
                Dedicated tracks lower fuel costs, turnaround time, and congestion-related
                delays, allowing businesses to optimize their supply chain operations and
                achieve substantial savings in long-distance cargo movement.
              </p>
            </div>

            <div className="freight-point" data-aos="fade-up">
              <h3>3. Boost to Industrial Zones</h3>
              <p>
                DFC supports manufacturing hubs, SEZs, and industrial corridors by providing
                efficient last-mile connectivity, encouraging new investments, expanding export
                capacity, and strengthening the overall industrial ecosystem.
              </p>
            </div>

            <div className="freight-point" data-aos="fade-up">
              <h3>4. Environment Friendly</h3>
              <p>
                Reduced road traffic congestion and fuel emissions contribute to a greener,
                more sustainable logistics ecosystem, while electrified freight operations help
                lower carbon footprints and promote environmentally responsible growth.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
       <div className="freight-faq-section">
  <h2 className="freight-title" data-aos="fade-up">
    FAQs
  </h2>

{faqs.map((faq, idx) => (
  <div
    key={idx}
    className={`faq-item ${openFAQ === idx ? "open" : ""}`}
    onClick={() => toggleFAQ(idx)}
  >
    <div className="faq-header">
      <IoChevronDown className="faq-icon" />
      <h3>{faq.question}</h3>
    </div>

    {openFAQ === idx && (
      <div className="faq-answer">{faq.answer}</div>
    )}
  </div>
))}

</div>


        </div>
      </div>
    </>
  );
};

export default Freight;
