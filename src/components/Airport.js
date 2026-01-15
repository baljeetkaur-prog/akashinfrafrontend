import React, { useEffect, useState } from "react";
import "./Airport.css";
import { FaHome, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";

const Airport = () => {
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
    Dholera International Airport Gateway to Global Connectivity and Investment
  </title>

  <meta
    name="description"
    content="Discover Dholera International Airport, a world class greenfield aviation hub supporting global connectivity, cargo logistics, industrial growth, and long term investment potential in Dholera Smart City."
  />

  <meta
    name="keywords"
    content="Dholera International Airport, Dholera airport project, Dholera Smart City airport, Dholera connectivity, Dholera cargo hub, Gujarat international airport, Dholera infrastructure"
  />

  <link
    rel="canonical"
    href="https://www.akashinfra.com/dholera-international-airport"
  />
</Helmet>

    
    <div className="airport-page">

      {/* Banner */}
<section
  className="airport-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="airport-container">
    <h1 className="airport-heading" data-aos="fade-up">
      Dholera International Airport
    </h1>

    <div className="airport-breadcrumb" data-aos="fade-up">
      <FaHome className="airport-home-icon" />
      <Link to="/" className="airport-breadcrumb-link">
        Home
      </Link>
      <span className="airport-breadcrumb-text">
        &gt;&gt; Dholera International Airport
      </span>
    </div>
  </div>
</section>


      {/* Main Content */}
      <div
        className="airport-content"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          backgroundSize: "cover",
        }}
      >

        {/* SECTION 1 */}
        <div className="airport-content-wrapper">

          {/* LEFT */}
 <div className="airport-left-content" data-aos="fade-up">
  <h2 className="airport-big-heading">
    A Modern Gateway for Western India
  </h2>

  <p className="airport-para">
    Dholera International Airport is a world-class greenfield aviation hub
    being developed to handle both domestic and international air traffic efficiently.
    With state-of-the-art terminals, advanced navigation systems, and modern cargo facilities,
    it is set to become a benchmark for airports in Western India.
  </p>

  <p className="airport-para">
    Located just 3 km from the main city area, the airport will ease congestion
    at Ahmedabad airport while enabling seamless connectivity for passengers, cargo, and businesses.
    Its strategic location near expressways and industrial corridors ensures quick access
    to commercial and investment hubs, enhancing trade and tourism across the region.
  </p>
</div>

          {/* RIGHT IMAGE */}
                      <div className="airport-right-image" data-aos="fade-up">

            <img src="/images/airport1.webp" alt="Airport" />
          </div>
        </div>

        {/* SECTION 2 */}
          <div className="airport-section-text" data-aos="fade-up">
          <h2 className="airport-big-heading">
            Strategic Vision & Development Highlights
          </h2>

          <p className="airport-para">
         Spread across 1,426 hectares, Dholera International Airport is designed to handle both passenger and cargo operations with future-ready expansion possibilities. Equipped with modern aviation infrastructure, the airport will support wide-body aircraft, advanced cargo logistics, and smart terminal operations. The project is progressing rapidly as part of India’s aviation growth strategy, positioning Dholera as a key node in the nation’s next decade of economic and infrastructural development.
          </p>

          <p className="airport-para">
          In its initial phase, the airport will accommodate 1.5 million passengers annually, scaling up to an impressive 50 million passengers per year — making it one of the largest and most advanced airports in Western India. The phased development ensures seamless growth, with plans for additional terminals, expanded runways, and enhanced mobility connectivity. Once fully operational, the airport will play a pivotal role in boosting regional tourism, business travel, and global trade.
          </p>
        </div>

        {/* Two Image Highlights */}
        <div className="airport-two-images-section">
          <div className="airport-two-images-row">

              <div className="airport-image-card" data-aos="fade-up">
              <img src="/images/airport2.jpg" alt="Airport Master Plan" />
              <h3 className="airport-image-heading">World-Class Airport Planning</h3>
              <p className="airport-image-para">
                Designed with global aviation standards, the airport ensures seamless handling of domestic and international flights with scalable infrastructure for decades to come. Its master plan includes multi-tier terminals, advanced air-traffic management systems, and provisions for future runway expansion. The layout is optimized for smooth passenger flow, minimal transit time, and efficient aircraft movement, making it a next-generation hub for India’s western aviation network.
              </p>
            </div>

            <div className="airport-image-card" data-aos="fade-up">
              <img src="/images/airport3.jpg" alt="Airport Infrastructure" />
              <h3 className="airport-image-heading">Modern Infrastructure & Cargo Hub</h3>
              <p className="airport-image-para">
                The airport includes a dedicated cargo zone designed to accelerate industrial exports and global logistics, supporting trade and economic growth in the region. Equipped with temperature-controlled warehouses, high-capacity freight handling systems, and a specialized logistics corridor, it will serve as a major gateway for businesses. This integrated cargo ecosystem ensures faster processing, reduced transit costs, and direct connectivity to major industrial clusters across Gujarat.
              </p>
            </div>

          </div>

          <div className="airport-extra-content">
        <p>
    Supported by the Government of India, Dholera International Airport is expected
    to transform regional connectivity and emerge as one of the most strategically
    important aviation hubs in western India. With strong policy backing, long-term
    development planning, and robust infrastructure investment, the project is
    positioned to attract global airlines, investors, and logistic companies.
  </p>
          <p>
    The airport will serve passengers, industries, and businesses with state-of-the-art
    facilities and highly efficient operational planning. Its integrated transport links,
    modern cargo ecosystem, and seamless connectivity to industrial zones will make it a
    critical gateway for trade, tourism, and economic expansion across the Dholera region
    and beyond.
  </p>
          </div>
        </div>

        {/* HIGHLIGHTS */}
<div className="airport-points-section">
             <h2 className="airport-big-heading" data-aos="fade-up">
              Key Highlights
            </h2>


   <div className="airport-section-text" data-aos="fade-up">
    <h3 className="airport-image-heading">Massive Development Zone</h3>
    <p className="airport-image-para">
      Spread across a vast development area of 1,426 hectares, Dholera International Airport 
      is designed as a next-generation aviation hub that can support long-term expansion. 
      The masterplan includes passenger terminals, cargo facilities, commercial real estate, 
      aviation services, and large-scale operational zones. This makes it one of the largest 
      greenfield airport developments currently underway in India.
    </p>
  </div>

<div className="airport-section-text" data-aos="fade-up">

    <h3 className="airport-image-heading">Runway Built for Global Aircraft</h3>
    <p className="airport-image-para">
      The airport will feature a 3.5 km long runway capable of handling wide-body 
      aircraft such as Boeing 747, 777, and Airbus A350. This runway length ensures 
      safe long-haul international operations, large cargo aircraft movements, and 
      high-volume air traffic. Future plans include an additional parallel runway, 
      enabling dual operations as passenger capacity grows over the next decade.
    </p>
  </div>

   <div className="airport-section-text" data-aos="fade-up">
    <h3 className="airport-image-heading">Advanced Cargo & Logistics Hub</h3>
    <p className="airport-image-para">
      A dedicated international cargo complex is being developed to support export-oriented 
      industries in Dholera SIR. The facility will include cold storage, automated handling 
      systems, warehousing clusters, freight forwarding units, and express cargo terminals. 
      This will significantly reduce logistics time for manufacturing companies while 
      enhancing Gujarat’s competitiveness in global trade.
    </p>
  </div>

 <div className="airport-section-text" data-aos="fade-up">
    <h3 className="airport-image-heading">Strategic Location Just 3 km from City</h3>
    <p className="airport-image-para">
      Situated only 3 km from the main Dholera metropolitan zone, the airport offers 
      excellent proximity for both passengers and industries. The location ensures quick 
      access through 6-lane expressways, dedicated public transport routes, and future metro 
      connectivity. Its positioning enhances convenience, reduces travel time, and supports 
      seamless regional mobility across the Dholera Smart City.
    </p>
  </div>

 <div className="airport-section-text" data-aos="fade-up">
    <h3 className="airport-image-heading">Government-Approved Mega Investment</h3>
    <p className="airport-image-para">
      With a sanctioned budget of ₹5,083 crore in the initial phase, the project is backed 
      by strong financial and administrative support from the Government of India and the 
      Government of Gujarat. This ensures high-speed development, assured funding, and 
      adherence to world-class standards for infrastructure, security, and aviation 
      technologies. Additional phases will receive further investment as passenger demand grows.
    </p>
  </div>

   <div className="airport-section-text" data-aos="fade-up">
    <h3 className="airport-image-heading">Phase 1 Targeted for Completion by 2026</h3>
    <p className="airport-image-para">
      Construction of Phase 1 is progressing rapidly, with operations scheduled to begin 
      by December 2026. The initial phase will include the passenger terminal, runway, 
      ATC tower, cargo facilities, and essential systems for domestic and international 
      flights. Once operational, it will immediately boost connectivity, attract industries, 
      and act as a primary gateway to the Dholera Smart Industrial Region.
    </p>
  </div>
</div>



        {/* FAQs */}
<div className="airport-faq-section">
       <h2 className="airport-big-heading" data-aos="fade-up">
              FAQs
            </h2>

  {/* FAQ 1 */}
  <div className={`faq-item ${openFAQ === 1 ? "open" : ""}`} onClick={() => toggleFAQ(1)}>
    <div className="faq-header">
      <IoChevronDown className="faq-icon" />
      <h3>When will the airport be operational?</h3>
    </div>
    {openFAQ === 1 && (
      <p className="faq-answer">
        First cargo operations are expected by December 2026, with phased
        commercial operations planned right after.
      </p>
    )}
  </div>

  {/* FAQ 2 */}
  <div className={`faq-item ${openFAQ === 2 ? "open" : ""}`} onClick={() => toggleFAQ(2)}>
    <div className="faq-header">
      <IoChevronDown className="faq-icon" />
      <h3>How far is it from the city?</h3>
    </div>
    {openFAQ === 2 && (
      <p className="faq-answer">
        The airport is located only 3 km from the main Dholera metropolitan zone.
      </p>
    )}
  </div>

  {/* FAQ 3 */}
  <div className={`faq-item ${openFAQ === 3 ? "open" : ""}`} onClick={() => toggleFAQ(3)}>
    <div className="faq-header">
      <IoChevronDown className="faq-icon" />
      <h3>Will it support international flights?</h3>
    </div>
    {openFAQ === 3 && (
      <p className="faq-answer">
        Yes, it is being developed as a full-scale international airport with global connectivity.
      </p>
    )}
  </div>

  {/* FAQ 4 */}
  <div className={`faq-item ${openFAQ === 4 ? "open" : ""}`} onClick={() => toggleFAQ(4)}>
    <div className="faq-header">
      <IoChevronDown className="faq-icon" />
      <h3>What is the runway length?</h3>
    </div>
    {openFAQ === 4 && (
      <p className="faq-answer">
        The runway is 3.5 km long, capable of handling heavy wide-body aircraft.
      </p>
    )}
  </div>
   <div 
    className={`faq-item ${openFAQ === 5 ? "open" : ""}`} onClick={() => toggleFAQ(5)}>
    <div className="faq-header">
      <IoChevronDown className="faq-icon"/>
      <h3>Is the airport part of Dholera SIR development?</h3>
    </div>
    {openFAQ === 5 && (
      <p className="faq-answer">
        Yes, it is a key component of the Dholera Special Investment Region’s long-term growth plan.
      </p>
    )}
  </div>
  
</div>






      </div>
    </div>
    </>
  );
};

export default Airport;
