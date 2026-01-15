import React, { useState, useEffect } from "react";
import "./SolarPark.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";

const faqsData = [
  { 
    question: "What is Dholera Solar Park?", 
    answer: "Dholera Solar Park is a large-scale renewable energy project generating clean solar power in the Dholera region." 
  },
  { 
    question: "How much power does it generate?", 
    answer: "The park generates hundreds of MW of electricity, contributing significantly to the state grid." 
  },
  { 
    question: "Can investors participate?", 
    answer: "Yes, there are opportunities for investment in solar energy projects and related infrastructure." 
  },
  { 
    question: "What technology is used in the solar park?", 
    answer: "The park uses high-efficiency photovoltaic panels with solar tracking systems to maximize energy generation throughout the day." 
  },
  { 
    question: "Is the project environmentally friendly?", 
    answer: "Yes, it is designed with sustainability in mind, minimizing ecological impact and significantly reducing greenhouse gas emissions." 
  },
  { 
    question: "Who manages the operations of the solar park?", 
    answer: "The park is managed by a team of experienced engineers and renewable energy experts to ensure optimal performance and safety standards." 
  }
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


const SolarPark = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

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
  <title>Dholera Solar Park | India’s Largest Renewable Energy Zone</title>

  <meta
    name="description"
    content="Dholera Solar Park is a large-scale renewable energy project delivering clean, sustainable power while supporting industrial growth, green investment, and long-term energy security."
  />

  <meta
    name="keywords"
    content="Dholera Solar Park, Dholera renewable energy, solar power in Dholera, green energy Gujarat, Dholera Smart City solar project, solar investment India"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/dholera-solar-park"
  />

  {buildFaqSchema(faqsData) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqsData))}
    </script>
  )}
</Helmet>


      <div className="solarpark-page">
        {/* Banner */}
<section
  className="solarpark-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="solarpark-container">
    <h1 className="solarpark-heading" data-aos="fade-up">
      Dholera Solar Park
    </h1>

    <div className="solarpark-breadcrumb" data-aos="fade-up">
      <FaHome className="solarpark-home-icon" />
      <Link to="/" className="solarpark-breadcrumb-link">
        Home
      </Link>
      <span className="solarpark-breadcrumb-text">
        &gt;&gt; Dholera Solar Park
      </span>
    </div>
  </div>
</section>


        {/* Content */}
        <div
          className="solarpark-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "80px 20px",
          }}
        >
          {/* Heading and paragraphs */}
          <div className="solarpark-section-text" data-aos="fade-up">
            <h2 className="solarpark-big-heading">Harnessing Solar Energy for a Sustainable Future</h2>
            <p className="solarpark-para">
              Dholera Solar Park is a flagship renewable energy initiative, aimed at providing clean and sustainable electricity to meet the growing energy demands of the region. By utilizing advanced photovoltaic technology, the park ensures maximum efficiency while minimizing environmental impact. This project reflects India's commitment to a greener and more resilient energy future.
            </p>
            <p className="solarpark-para">
              Strategically located in Dholera, the park benefits from abundant sunlight throughout the year, making it one of the most efficient solar energy zones in the country. The integration of cutting-edge solar panels, energy storage solutions, and smart grid connectivity ensures uninterrupted energy supply for industrial, commercial, and residential needs.
            </p>
            <p className="solarpark-para">
              Beyond energy generation, the park contributes to local employment, sustainable development, and regional economic growth. By reducing reliance on conventional fossil fuels, it helps cut greenhouse gas emissions, supporting India’s climate action goals. With ongoing expansion plans, Dholera Solar Park stands as a symbol of innovation, environmental stewardship, and a sustainable energy future for generations to come.
            </p>
          </div>

          {/* 3 images in one row */}
          <div className="solarpark-three-images-row" data-aos="fade-up">
            <div className="solarpark-image-card">
              <img src="/images/solar_1.jpg" alt="Solar 1" />
            </div>
            <div className="solarpark-image-card">
              <img src="/images/solar_2.jpg" alt="Solar 2" />
            </div>
            <div className="solarpark-image-card">
              <img src="/images/solar_3.jpg" alt="Solar 3" />
            </div>
          </div>

          {/* Project Overview */}
          <div className="solarpark-section-text" style={{marginTop:"20px"}} data-aos="fade-up">
            <h2 className="solarpark-big-heading">Project Overview</h2>
            <p className="solarpark-para">
              The Dholera Solar Park is a large-scale renewable energy project, strategically developed to harness solar power efficiently across the region. It comprises multiple interconnected solar farms that feed electricity into a central grid, ensuring stable and reliable energy supply for both industrial and residential consumption.
            </p>
            <p className="solarpark-para">
              Each solar farm is equipped with high-efficiency photovoltaic panels and advanced tracking systems that maximize sunlight absorption throughout the day. The park also incorporates energy storage solutions, allowing excess electricity to be stored and used during peak demand hours, enhancing grid stability and reducing power shortages.
            </p>
            <p className="solarpark-para">
              Beyond energy generation, the project focuses on sustainability and environmental responsibility. The land use has been carefully planned to minimize ecological impact, with initiatives to preserve local flora and fauna. Additionally, the park contributes to regional economic growth by creating employment opportunities and supporting the development of clean energy infrastructure.
            </p>
            <p className="solarpark-para">
              With a capacity to generate hundreds of megawatts of clean electricity, Dholera Solar Park not only reduces dependence on fossil fuels but also significantly lowers greenhouse gas emissions. It serves as a model for large-scale solar development in India, aligning with the national renewable energy targets and the global push for a sustainable, low-carbon future.
            </p>
            <p className="solarpark-para">
              The project is also designed with future expansion in mind, allowing additional solar farms and energy storage units to be integrated seamlessly. This ensures that as energy demand grows, Dholera Solar Park will continue to provide a reliable, eco-friendly, and technologically advanced solution for the region's energy needs.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="solarpark-points-section" style={{marginTop:"20px"}} data-aos="fade-up">
            <h2 className="solarpark-big-heading">Key Benefits</h2>
            <ul>
              <li>Environmentally sustainable clean energy</li>
              <li>Large-scale power generation</li>
              <li>Supports industrial and residential electricity demand</li>
              <li>Encourages investment in green infrastructure</li>
            </ul>
          </div>

          {/* FAQs */}
        {/* FAQs */}
<div className="expressway-faq-section">
  <h2
    className="expressway-big-heading"
    style={{ marginBottom: "20px" }}
    data-aos="fade-up"
  >
    FAQs
  </h2>

{faqsData.map((faq, idx) => (
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

export default SolarPark;
