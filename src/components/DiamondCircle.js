import React, { useState, useEffect } from "react";
import "./DiamondCircle.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What is Diamond Circle?",
    answer:
      "Diamond Circle is a modern, integrated hub in Dholera with advanced utilities, smart connectivity, and ready-to-develop zones.",
  },
  {
    question: "Is it ready for industrial development?",
    answer:
      "Yes, the area is fully serviced with roads, utilities, and plug-and-play infrastructure for industries.",
  },
  {
    question: "Are residential facilities available?",
    answer:
      "Yes, residential zones have all modern amenities, smart systems, and infrastructure in place.",
  },
  {
    question: "How reliable are utilities?",
    answer:
      "Diamond Circle offers 24×7 power, water management, and automated monitoring for uninterrupted services.",
  },
  {
    question: "How well is Diamond Circle connected?",
    answer:
      "The hub has seamless connectivity to major expressways, the upcoming Dholera International Airport, and the Dedicated Freight Corridor.",
  },
  {
    question: "What sustainability initiatives are in place?",
    answer:
      "Diamond Circle integrates renewable energy, energy-efficient lighting, waste recycling systems, and green spaces to create an eco-friendly urban environment.",
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


const DiamondCircle = () => {
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
  <title>Diamond Circle | Dholera Connectivity</title>

  <meta
    name="description"
    content="Explore Diamond Circle: world-class utilities, smart connectivity, and future-ready infrastructure in Dholera Smart City."
  />

  <meta
    name="keywords"
    content="Diamond Circle, Dholera smart city, smart infrastructure, industrial zones, connectivity"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/diamond-circle"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="diamond-page">
        {/* Banner */}
        <section
          className="diamond-banner"
          style={{ backgroundImage: 'url("/images/bg-image.png")' }}
        >
          <div className="diamond-banner-container">
            <h1 className="diamond-banner-heading" data-aos="fade-up">
              Diamond Circle
            </h1>

            <div className="diamond-breadcrumb" data-aos="fade-up">
              <FaHome className="diamond-breadcrumb-icon" />
              <Link to="/" className="diamond-breadcrumb-link">
                Home
              </Link>
              <span className="diamond-breadcrumb-text">
                &gt;&gt; Diamond Circle
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div
          className="diamond-main-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          }}
        >
          <div className="diamond-content-wrapper">
            {/* Left Text */}
      <div className="diamond-left" data-aos="fade-up">
    <h2 className="diamond-heading">
      Diamond Circle: Smart & Future-Ready Hub
    </h2>
    <p className="diamond-para">
      Diamond Circle offers state-of-the-art infrastructure, seamless connectivity, 
      and a fully integrated urban ecosystem for industries and residents alike. 
      Strategically designed, it combines modern urban planning with cutting-edge 
      technologies to create a city hub that is both functional and sustainable.
    </p>
    <p className="diamond-para">
      With advanced utilities, intelligent systems, and a sustainable design, 
      Diamond Circle is positioned to become a key growth hub in Dholera Smart City. 
      The infrastructure is designed to support industries of all scales—from emerging 
      startups to multinational corporations—while providing residents with 
      convenient, eco-friendly urban living.
    </p>
  </div>

            {/* Right Image */}
            <div className="diamond-right" data-aos="fade-up">
              <img src="/images/diamond_circle1.jpg" alt="Diamond Circle" />
            </div>
          </div>

          {/* Second Heading + Paragraphs */}
  <div className="diamond-section-text" data-aos="fade-up">
  <h2 className="diamond-sub-heading">Why Diamond Circle Stands Out</h2>
  <p className="diamond-para">
    Built with modern planning principles, Diamond Circle integrates smart utilities, 
    multi-modal connectivity, and sustainable design to create a holistic urban 
    ecosystem for residential and industrial excellence. Every aspect of the hub has 
    been meticulously designed to ensure efficiency, safety, and long-term growth potential.
  </p>
  <p className="diamond-para">
    Advanced power, water, ICT, and transport systems provide reliable, uninterrupted 
    services, enabling both businesses and residents to operate smoothly. Smart grids, 
    automated traffic management, and real-time utility monitoring ensure high operational 
    efficiency and optimal resource utilization.
  </p>
  <p className="diamond-para">
    Diamond Circle is designed as a future-ready hub. Its sustainable initiatives include 
    renewable energy integration, energy-efficient lighting, waste recycling, and 
    extensive green spaces that reduce the urban heat footprint and enhance the quality 
    of life for residents. The infrastructure is scalable to accommodate growing 
    industrial and residential demands without compromising on comfort or efficiency.
  </p>
  <p className="diamond-para">
    Connectivity is a key differentiator. With direct access to major expressways, 
    the upcoming Dholera International Airport, and the Dedicated Freight Corridor, 
    Diamond Circle ensures fast, seamless movement of goods and people. This logistical 
    advantage strengthens its position as a preferred hub for manufacturing, logistics, 
    warehousing, and export-driven industries.
  </p>
  <p className="diamond-para">
    The hub also prioritizes community living. Smart services, intelligent public spaces, 
    and integrated urban management systems enable residents to enjoy convenience, safety, 
    and a modern lifestyle. Businesses benefit from streamlined approvals, robust utilities, 
    and plug-and-play infrastructure designed for rapid operational scaling.
  </p>
  <p className="diamond-para">
    By combining advanced technology, sustainable design, and world-class infrastructure, 
    Diamond Circle creates a future-ready urban hub where innovation, investment, and 
    quality of life converge—making it a standout destination in Dholera Smart City.
  </p>
</div>


          {/* Points Section */}
          <div className="diamond-points-section" data-aos="fade-up">
            <ul>
              <li>Smart utility networks with automated monitoring</li>
              <li>High-quality internal roads and cycling paths</li>
              <li>Robust stormwater and drainage management</li>
              <li>Seamless connectivity to expressways and airport</li>
              <li>Fully serviced zones ready for development</li>
            </ul>
          </div>

          {/* FAQ Section */}
        <div className="diamond-faq-section">
  <h2 className="diamond-sub-heading" data-aos="fade-up">
    FAQs
  </h2>

{faqs.map((faq, idx) => (
  <div
    key={idx}
    className={`diamond-faq-item ${openFAQ === idx ? "open" : ""}`}
    onClick={() => toggleFAQ(idx)}
  >
    <div className="diamond-faq-header">
      <IoChevronDown className="diamond-faq-icon" />
      <h3>{faq.question}</h3>
    </div>

    {openFAQ === idx && (
      <div className="diamond-faq-answer">{faq.answer}</div>
    )}
  </div>
))}

</div>

        </div>
      </div>
    </>
  );
};

export default DiamondCircle;
