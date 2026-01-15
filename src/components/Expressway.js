import React, { useState, useEffect } from "react";
import "./Expressway.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What is the total length of the expressway?",
    answer:
      "The Ahmedabad Dholera Expressway spans over 100 km connecting key regions in Gujarat.",
  },
  {
    question: "When will it be completed?",
    answer:
      "Construction is progressing in phases, with completion expected by 2027.",
  },
  {
    question: "Does it connect to Dholera Smart City?",
    answer:
      "Yes, it directly connects Ahmedabad to Dholera Smart City, supporting residential, commercial, and industrial growth.",
  },
  {
    question: "Is it a toll road?",
    answer:
      "Yes, the expressway will have designated toll plazas to maintain and operate the highway efficiently.",
  },
  {
    question: "Will there be facilities along the expressway?",
    answer:
      "The expressway will include service areas, rest stops, and emergency support facilities for commuters.",
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


const sections = [
{
  heading: "A Modern Corridor for Gujarat",
  paragraphs: [
    "The Ahmedabad Dholera Expressway is a 6-lane state-of-the-art highway connecting Ahmedabad to Dholera Smart City, enhancing trade, logistics, and regional connectivity.",
    "Developed to complement Dholera’s emergence as India’s next smart city, the expressway ensures fast, safe, and efficient transport for residents, businesses, and industries. It is strategically aligned with industrial corridors, freight networks, and Dholera International Airport.",
    "This corridor incorporates advanced engineering standards, including durable asphalt pavements, modern bridges, and service roads to support heavy traffic and commercial vehicles.",
  ],
  image: "/images/expressway_1.jpg"
},
{
  heading: "Strategic Vision & Development Highlights",
  paragraphs: [
    "Spanning over 100 km, the Ahmedabad Dholera Expressway is designed with modern infrastructure, intelligent traffic management, and sustainable construction practices. This corridor will support industrial growth, tourism, and logistics for Gujarat’s evolving economy.",
    "Its alignment with smart city principles and planned urban ecosystems ensures seamless connectivity to industrial zones, residential hubs, and commercial clusters, establishing Dholera as a global-ready city.",
    "The expressway incorporates advanced monitoring systems for traffic flow, real-time updates, and automated safety features, ensuring a smooth and secure travel experience for commuters. Dedicated service roads and rest areas have been integrated to improve convenience and accessibility for travelers and freight operators.",
  ],
  image: "/images/expressway_2.jpg"
}, 
{
  heading: "World-Class Highway Design",
  paragraphs: [
    "Designed with international standards for highways, the expressway supports high-speed traffic, safety features, smart monitoring systems, and future scalability for industrial transport and logistics.",
    "The road is built with high-quality asphalt and concrete layers to ensure durability under heavy commercial and passenger vehicle traffic. State-of-the-art bridges, flyovers, and interchanges have been incorporated to minimize congestion and provide smooth transitions between key junctions.",
    "Advanced traffic management systems, including intelligent signaling, CCTV surveillance, and real-time monitoring, ensure safety and optimize travel times. Emergency response lanes and dedicated service areas have been strategically placed along the corridor to enhance commuter safety and convenience.",
  ],
  image: "/images/expressway_3.jpg"
}, 
{
  heading: "Boosting Regional Economy",
  paragraphs: [
    "By connecting Ahmedabad to Dholera and other industrial hubs, the expressway accelerates trade, attracts investments, and provides smooth freight operations, promoting economic growth across Western India.",
    "The corridor significantly reduces transit times for goods and raw materials, supporting industries such as manufacturing, logistics, and warehousing. It enhances the efficiency of supply chains, enabling businesses to operate competitively in domestic and international markets.",
    "In addition to industrial growth, the expressway facilitates tourism and service sector development by improving access to cultural, recreational, and commercial hubs along the route. Local businesses, including retail, hospitality, and SMEs, benefit from increased connectivity and customer footfall.",
  ],
  image: "/images/expressway_4.jpg"
}
];

const Expressway = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
    <Helmet>
  <title>
    Ahmedabad Dholera Expressway Driving Faster Connectivity and Economic Growth
  </title>

  <meta
    name="description"
    content="Explore the Ahmedabad Dholera Expressway..."
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/ahmedabad-dholera-expressway"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="expressway-page">

        {/* Banner */}
<section
  className="expressway-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="expressway-container">
    <h1 className="expressway-heading" data-aos="fade-up">
      Ahmedabad Dholera Expressway
    </h1>

    <div className="expressway-breadcrumb" data-aos="fade-up">
      <FaHome className="expressway-home-icon" />
      <Link to="/" className="expressway-breadcrumb-link">
        Home
      </Link>
      <span className="expressway-breadcrumb-text">
        &gt;&gt; Ahmedabad Dholera Expressway
      </span>
    </div>
  </div>
</section>


        {/* Main Content */}
        <div
          className="expressway-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover"
          }}
        >

          {/* First Section */}
          <div className="expressway-content-wrapper">
            <div className="expressway-left-content" data-aos="fade-up">
              <h2 className="expressway-big-heading">{sections[0].heading}</h2>
              {sections[0].paragraphs.map((para, i) => (
                <p className="expressway-para" key={i}>{para}</p>
              ))}
            </div>

            <div className="expressway-right-image" data-aos="fade-up">
              <img src={sections[0].image} alt={sections[0].heading} />
            </div>
          </div>

          {/* Remaining Sections */}
          {sections.slice(1).map((section, index) => (
            <div
              className={`expressway-content-wrapper ${index % 2 === 0 ? "reverse" : ""}`}
              key={index + 1}
            >
              <div className="expressway-left-content" data-aos="fade-up">
                <h2 className="expressway-big-heading">{section.heading}</h2>
                {section.paragraphs.map((para, i) => (
                  <p className="expressway-para" key={i}>{para}</p>
                ))}
              </div>

              <div className="expressway-right-image" data-aos="fade-up">
                <img src={section.image} alt={section.heading} />
              </div>
            </div>
          ))}

          {/* Key Highlights */}
          <div className="expressway-points-section">
            <h2 className="expressway-big-heading" data-aos="fade-up">Key Highlights</h2>
            <ul data-aos="fade-up">
              <li>Massive Development Corridor: Spanning 100+ km, designed to handle high-speed traffic and industrial logistics.</li>
              <li>Integration with Smart City: Seamless connection to Dholera Smart City and industrial hubs.</li>
              <li>State-of-the-Art Infrastructure: Equipped with intelligent traffic systems and scalable highway design.</li>
              <li>Government-Approved Mega Project: Fully backed by Government of Gujarat and India.</li>
            </ul>
          </div>

          {/* FAQs */}
       <div className="expressway-faq-section">
  <h2 className="expressway-big-heading" data-aos="fade-up">
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

export default Expressway;
