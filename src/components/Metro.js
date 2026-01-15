// Metro.jsx
import React, { useState, useEffect } from "react";
import "./Metro.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { BsCheck2 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What is the length of the metro line?",
    answer:
      "The Dholera Metro Rail Project spans multiple kilometers connecting key city hubs.",
  },
  {
    question: "When is the metro expected to be operational?",
    answer:
      "Construction is underway, with the project expected to be operational by 2028.",
  },
  {
    question: "How many stations will be there?",
    answer:
      "The metro will feature strategically planned stations ensuring maximum connectivity.",
  },
  {
    question: "Is the metro environmentally friendly?",
    answer:
      "Yes, the project uses energy-efficient technology and sustainable practices.",
  },
  {
    question: "Will it integrate with other transport modes?",
    answer:
      "Yes, it is designed to seamlessly integrate with buses and road networks.",
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


const Metro = () => {
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
    Dholera Metro Rail Project Enhancing Urban Mobility and Smart City Connectivity
  </title>

  <meta
    name="description"
    content="Discover the Dholera Metro Rail Project designed to transform urban mobility with fast, efficient, and sustainable public transport, connecting residential, commercial, and industrial hubs within Dholera Smart City."
  />

  <meta
    name="keywords"
    content="Dholera Metro Rail Project, Dholera metro connectivity, Dholera Smart City transport"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/dholera-metro-rail-project"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="metro-page">
        {/* Banner */}
<section
  className="metro-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="metro-container">
    <h1 className="metro-heading" data-aos="fade-up">
      Dholera Metro Rail Project
    </h1>

    <div className="metro-breadcrumb" data-aos="fade-up">
      <FaHome className="metro-home-icon" />
      <Link to="/" className="metro-breadcrumb-link">
        Home
      </Link>
      <span className="metro-breadcrumb-text">
        &gt;&gt; Dholera Metro Rail Project
      </span>
    </div>
  </div>
</section>


        {/* Main Content */}
        <div
          className="metro-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "80px 20px",
          }}
        >
          <div className="metro-content-inner">

            {/* First Section */}
            <div className="metro-content-wrapper">
              <div className="metro-left-content" data-aos="fade-up">
                <h2 className="metro-big-heading">Modern Metro Infrastructure</h2>

                <p className="metro-para">
                  The Dholera Metro Rail Project is designed to provide fast, safe, and
                  efficient urban transport connecting key hubs across the city, while
                  promoting sustainable infrastructure and economic growth.
                </p>

                <p className="metro-para">
                  With advanced technology and strategic planning, this metro project ensures
                  reduced travel time, convenience for daily commuters, and integrated city mobility.
                  The system is designed with modern safety standards, real-time monitoring, and
                  passenger-friendly amenities, making urban travel more efficient and reliable.
                </p>

                <ul className="metro-points-list">
                  <li>State-of-the-art metro rail design</li>
                  <li>Seamless city connectivity</li>
                  <li>Eco-friendly and energy-efficient</li>
                </ul>
              </div>

              <div className="metro-right-image" data-aos="fade-up">
                <img src="/images/metro_1.jpg" alt="Metro 1" />
              </div>
            </div>

            {/* Second Section */}
            <div className="metro-section-text" data-aos="fade-up">
              <h2 className="metro-big-heading">Expanding Urban Connectivity</h2>
            </div>

            <div className="metro-two-images-row">
              <div className="metro-image-card" data-aos="fade-up">
                <img src="/images/metro_2.jpg" alt="Metro 2" />
              </div>

              <div className="metro-image-card" data-aos="fade-up">
                <p className="metro-para">
                  This metro line will connect residential areas with commercial hubs,
                  ensuring smooth commutes and reducing traffic congestion. It will provide
                  a reliable and predictable travel option, helping residents save time and
                  plan their daily routines efficiently.
                </p>

                <p className="metro-para">
                  Strategically planned stations provide accessibility and promote urban growth,
                  enabling residents to move faster and businesses to flourish. Each station
                  will include modern amenities, waiting areas, and safety features for
                  passenger convenience.
                </p>

                <p className="metro-para">
                  The metro also integrates with other transport networks to create a
                  connected, smart city mobility solution. This integration allows seamless
                  transfers to buses, taxis, and pedestrian pathways, making commuting
                  effortless for all age groups.
                </p>
              </div>
            </div>

            {/* Project Highlights */}
            <div className="metro-points-section">
              <h2 className="metro-big-heading" data-aos="fade-up">
                Project Highlights
              </h2>

              <ul className="metro-points-list" data-aos="fade-up">
                <li>Reduces travel time across the city, providing a fast and reliable alternative to road transport for daily commuters.</li>
                <li>Modern stations with smart facilities, including automated ticketing, comfortable waiting areas, and advanced safety features.</li>
                <li>Environmentally sustainable design, incorporating energy-efficient systems, green spaces, and low-emission technologies.</li>
                <li>Seamless connectivity with other modes of public transport, ensuring easy transfers and improved urban mobility.</li>
                <li>Advanced technology integration, including real-time passenger information systems and smart traffic management.</li>
                <li>Promotes economic growth by connecting residential, commercial, and industrial hubs across the city.</li>
                <li>Accessibility-focused design with ramps, elevators, and tactile guidance for differently-abled passengers.</li>
              </ul>
            </div>

            {/* FAQs */}
       <div className="metro-faq-section">
  <h2 className="metro-big-heading" data-aos="fade-up">
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
      </div>
    </>
  );
};

export default Metro;
