import React, { useState, useEffect } from "react";
import "./RiverFront.css";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
const faqs = [
  {
    question: "What is the purpose of the Dholera Artificial Riverfront?",
    answer:
      "The project focuses on water management, public recreation, and urban beautification while supporting sustainable growth.",
  },
  {
    question: "How does the riverfront benefit investors?",
    answer:
      "It enhances lifestyle value, boosts property appreciation, and positions Dholera as a future-ready investment destination.",
  },
  {
    question: "Is the riverfront environmentally sustainable?",
    answer:
      "Yes, it incorporates eco-friendly design, water conservation, and green infrastructure throughout the development.",
  },
  {
    question: "How does the Artificial Riverfront support urban planning?",
    answer:
      "The riverfront is strategically integrated into Dholera’s master plan, supporting efficient land use, improved connectivity, and structured urban growth while serving as a central public and ecological corridor.",
  },
  {
    question: "Will the riverfront enhance tourism and public engagement?",
    answer:
      "Yes, the riverfront is designed as a major lifestyle and tourism destination with promenades, cultural spaces, leisure zones, and scenic viewpoints.",
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


const RiverFront = () => {
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
  <title>Dholera Artificial Riverfront Smart City Development</title>

  <meta
    name="description"
    content="Explore Dholera Artificial Riverfront, a landmark urban waterfront development designed for sustainability, tourism, recreation, and investment opportunities within Dholera SIR."
  />

  <meta
    name="keywords"
    content="Dholera Riverfront, Smart City, Urban Waterfront, Tourism, Investment, Sustainability, Dholera SIR, Public Recreation, Eco-Friendly Development"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/dholera-artificial-riverfront"
  />

  {buildFaqSchema(faqs) && (
    <script type="application/ld+json">
      {JSON.stringify(buildFaqSchema(faqs))}
    </script>
  )}
</Helmet>


      <div className="riverfront-page">
        {/* Banner */}
<section
  className="riverfront-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="riverfront-container" data-aos="fade-up">
    <h1 className="riverfront-heading">
      Dholera Artificial Riverfront
    </h1>

    <div className="riverfront-breadcrumb">
      <FaHome className="riverfront-home-icon" />
      <Link to="/" className="riverfront-breadcrumb-link">
        Home
      </Link>
      <span className="riverfront-breadcrumb-text">
        &gt;&gt; Dholera Artificial Riverfront
      </span>
    </div>
  </div>
</section>


        {/* Content Section */}
        <section
          className="riverfront-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Section 1 */}
          <div className="riverfront-content-wrapper" data-aos="fade-up">
            <div className="riverfront-text">
              <h2 className="riverfront-subheading">A Landmark Waterfront Development</h2>
              <p className="riverfront-para">
                The Dholera Artificial Riverfront is a visionary urban waterfront development conceived as a defining landmark within Dholera Special Investment Region (SIR). Designed to elevate the city’s urban character, the project enhances livability, tourism, and environmental balance while establishing a strong visual and cultural identity for the region.
              </p>
              <p className="riverfront-para" style={{ marginTop: "15px" }}>
                Beyond its aesthetic appeal, the riverfront plays a critical role in sustainable urban planning by improving water management, regulating seasonal flows, and strengthening ecological resilience. Landscaped promenades, open green spaces, and pedestrian-friendly zones encourage social interaction and recreational activity, making it a vibrant destination for residents, professionals, and visitors alike.
              </p>
            </div>
            <div className="riverfront-image">
              <img src="/images/riverfront_1.png" alt="Dholera Riverfront" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="riverfront-section-text" data-aos="fade-up">
            <h2 className="riverfront-subheading">Designed for Sustainability & Urban Life</h2>
            <p className="riverfront-para">
              Planned as an integrated urban ecosystem, the Dholera Artificial Riverfront carefully balances flood control, public accessibility, and ecological conservation while shaping a visually iconic cityscape. The project is engineered to work in harmony with natural water systems, ensuring efficient regulation of water flow and long-term environmental stability for the surrounding urban areas.
            </p>
            <p className="riverfront-para" style={{ marginTop: "15px" }}>
              Sustainability is embedded at every stage of the riverfront’s design, from climate-responsive planning to the use of eco-friendly materials and native landscaping. Green buffers, shaded walkways, and open recreational zones create a comfortable microclimate, encouraging outdoor activity while minimizing the urban heat island effect.
            </p>
            <p className="riverfront-para" style={{ marginTop: "15px" }}>
              At the same time, the riverfront enhances everyday urban life by offering inclusive public spaces for leisure, culture, and community interaction. Pedestrian promenades, cycling tracks, and scenic viewpoints transform the waterfront into a vibrant social hub, supporting a healthy lifestyle and reinforcing Dholera’s vision as a future-ready, people-centric smart city.
            </p>
          </div>

          {/* Key Points */}
          <div className="riverfront-points" data-aos="fade-up">
            <ul>
              <li>
                <strong>Flood & Water Management:</strong> Advanced engineering ensures controlled water flow and long-term resilience.
              </li>
              <li>
                <strong>Public Recreation Spaces:</strong> Promenades, cycling tracks, gardens, and open plazas promote active lifestyles.
              </li>
              <li>
                <strong>Tourism & Lifestyle Growth:</strong> Cultural zones, leisure areas, and scenic views attract visitors and investors.
              </li>
              <li>
                <strong>Eco-Conscious Planning:</strong> Native landscaping and sustainable materials reduce environmental impact.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="riverfront-content-wrapper reverse" data-aos="fade-up">
            <div className="riverfront-text">
              <h2 className="riverfront-subheading">Enhancing Dholera’s Global Identity</h2>
              <p className="riverfront-para">
                As one of Dholera SIR’s most iconic and future-oriented developments, the Artificial Riverfront plays a pivotal role in shaping the city’s global identity. It reinforces Dholera’s positioning as a world-class smart city by combining advanced urban infrastructure with high-quality public spaces that meet international standards of design, sustainability, and functionality.
              </p>
              <p className="riverfront-para" style={{ marginTop: "15px" }}>
                The presence of a landmark riverfront significantly elevates the perception and value of surrounding residential, commercial, and mixed-use developments. It acts as a catalyst for economic growth, attracting investors, businesses, and visitors while driving long-term appreciation of real estate across the region.
              </p>
            </div>
            <div className="riverfront-image">
              <img src="/images/riverfront_2.webp" alt="Riverfront View" />
            </div>
          </div>

          {/* FAQ Section */}
        <div className="riverfront-faq">
  <h2 className="riverfront-subheading" data-aos="fade-up">
    FAQs
  </h2>

  {faqs.map((faq, index) => (
  <div
    key={index}
    className={`riverfront-faq-item ${openFAQ === index ? "open" : ""}`}
    onClick={() => toggleFAQ(index)}
  >
    <div className="riverfront-faq-header">
      <IoChevronDown className="riverfront-faq-icon" />
      <h3>{faq.question}</h3>
    </div>

    {openFAQ === index && (
      <p className="riverfront-faq-answer">{faq.answer}</p>
    )}
  </div>
))}

</div>

        </section>
      </div>
    </>
  );
};

export default RiverFront;
