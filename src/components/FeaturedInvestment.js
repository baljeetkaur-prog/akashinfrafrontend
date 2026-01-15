import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaRoad,
  FaBolt,
  FaLink,
  FaMapMarkerAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./FeaturedInvestment.css";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

/* ---------------- ICON MAP ---------------- */
const iconMap = {
  FaMapMarkerAlt: <FaMapMarkerAlt />,
  FaRoad: <FaRoad />,
  FaBolt: <FaBolt />,
  FaLink: <FaLink />
};

/* ---------------- DYNAMIC TAG ---------------- */
const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const DynamicTag = ({ tag, className, children }) => {
  const Tag = validTags.includes(tag) ? tag : "p";
  return <Tag className={className}>{children}</Tag>;
};
// ✅ DEFAULT CONTENT (fallback if backend is sleeping)
const defaultFeaturedInvestment = {
  heading: { tag: "h2", text: "Featured Investment Opportunities" },
  paragraph: {
    tag: "p",
    text: "Prime plots and ready-to-develop zones in Dholera Smart City. Invest in the future today with world-class infrastructure, excellent connectivity, and sustainable energy."
  },
  viewButton: {
    text: "Discover Investment Potential",
    link: "/investment-opportunities"
  },
  cards: [
    {
      image: { url: "/images/residential.jpg", alt: "Residential Plots" },
      badge: "Ready to Invest",
      price: { tag: "h3", text: "₹6,00,000/-" },
      title: { tag: "h3", text: "Residential Plots" },
      location: "Dholera SIR, Gujarat",
      arrowLink: "/pricing",
      features: [
        { icon: "FaMapMarkerAlt", text: "Location" },
        { icon: "FaRoad", text: "Connectivity" },
        { icon: "FaBolt", text: "Utilities" }
      ]
    },
    {
      image: { url: "/images/industrial.jpg", alt: "Industrial Plots" },
      badge: "Premium Location",
      price: { tag: "h3", text: "₹6,00,000/-" },
      title: { tag: "h3", text: "Industrial Plots" },
      location: "Dholera SIR, Gujarat",
      arrowLink: "/pricing",
      features: [
        { icon: "FaBolt", text: "Power" },
        { icon: "FaLink", text: "Transport" },
        { icon: "FaMapMarkerAlt", text: "Zone" }
      ]
    },
    {
      image: { url: "/images/commercial.jpeg", alt: "Commercial Plots" },
      badge: "Prime Zone",
      price: { tag: "h3", text: "₹6,00,000/-" },
      title: { tag: "h3", text: "Commercial Plots" },
      location: "Dholera SIR, Gujarat",
      arrowLink: "/pricing",
      features: [
        { icon: "FaMapMarkerAlt", text: "Footfall" },
        { icon: "FaRoad", text: "Access" },
        { icon: "FaBolt", text: "Utilities" }
      ]
    }
  ]
};



const FeaturedInvestment = () => {
const [data, setData] = useState(defaultFeaturedInvestment);
  const API = process.env.REACT_APP_APIURL;

  /* ---------------- AOS ---------------- */
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

  /* ---------------- FETCH DATA ---------------- */
useEffect(() => {
  axios
    .get(`${API}/api/featured-investment`)
    .then(res => {
      if (res.data) {
        setData(res.data); // overwrite defaults
      }
    })
    .catch(() => {
      console.log("Backend sleeping, showing default Featured Investment");
      // do nothing → default stays
    });
}, [API]);

  const { heading, paragraph, viewButton, cards = [] } = data;

  return (
    <section className="featinvest-section">
      <div
        className="featinvest-left-bg"
        style={{
          backgroundImage: "url('/images/bg-img2.png')",
          opacity: 0.2
        }}
      ></div>

      <div className="featinvest-container">
        {/* ---------------- HEADER ---------------- */}
        <div className="featinvest-header" data-aos="fade-up">
      <div className="featinvest-header-text">
  <DynamicTag tag={heading?.tag} className="featinvest-heading">
    {heading?.text}
  </DynamicTag>

{paragraph?.text && (
<DynamicTag tag={paragraph.tag || "p"} className="featinvest-paragraph">
  {paragraph.text}
</DynamicTag>
)}
</div>

          {viewButton?.link && (
            <Link to={viewButton.link}>
              <button className="featinvest-view-btn">
                {viewButton.text}
              </button>
            </Link>
          )}
        </div>

        {/* ---------------- CARDS ---------------- */}
        <div className="featinvest-cards-wrapper">
          {cards.map((card, i) => (
            <div
              key={i}
              className="featinvest-property-card"
              data-aos="fade-up"
              data-aos-delay={i * 150}
            >
              <div
                className="featinvest-card-image"
                data-aos="zoom-in"
                data-aos-delay={i * 150 + 100}
              >
                <img src={card.image?.url || "/placeholder.jpg"} alt={card.image?.alt || card.title?.text || "Property"} />

                {card.badge && (
                  <div className="featinvest-badge">
                    {card.badge}
                  </div>
                )}

                <div className="featinvest-card-overlay">
   <div className="featinvest-price-section">
  <span className="featinvest-starting-text">
    Starting from
  </span>

  <DynamicTag tag={card.price?.tag || "h3"}>
    {card.price?.text}
  </DynamicTag>

  <div className="featinvest-divider"></div>
                    <div className="featinvest-features">
                      {card.features?.map((f, idx) => (
                        <div key={idx} className="featinvest-feature">
                          <span className="featinvest-icon">
                            {iconMap[f.icon]}
                          </span>
                          <span className="featinvest-text">
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {card.arrowLink && (
                    <Link
                      to={card.arrowLink}
                      className="featinvest-arrow-icon"
                    >
                      <FaArrowRight />
                    </Link>
                  )}
                </div>
              </div>

              {/* TITLE */}
              <DynamicTag
                tag={card.title?.tag}
                className="featinvest-card-title"
              >
                {card.title?.text}
              </DynamicTag>

              {/* LOCATION */}
              {card.location && (
                <p className="featinvest-card-location">
                  <FaMapMarkerAlt
                    style={{ marginRight: "6px", color: "#f15928" }}
                  />
                  {card.location}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInvestment;
