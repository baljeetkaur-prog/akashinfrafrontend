import React, { useState, useEffect } from "react";
import "./Connectivities.css";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

// Default content (shown if backend is unavailable)
const defaultConnectivities = {
  leftCards: [
    {
      title: { tag: "h3", text: "Dholera International Airport" },
      image: { url: "/images/airport.jpg", alt: "Road connectivity" },
      button: { link: "/dholera-international-airport", text: { text: "View Details" } }
    },
    {
      title: { tag: "h3", text: "Ahmedabad-Dholera Expressway" },
      image: { url: "/images/expressway.jpg", alt: "Green city" },
      button: { link: "/ahmedabad-dholera-expressway", text: { text: "View Details" } }
    }
  ],
  rightContent: {
    subtitle: { tag: "p", text: "Leading Real Estate in Dholera" },
    mainHeading: { tag: "h2", text: "Why Dholera Leads the Future" },
    paragraph: {
      tag: "p",
      text: "Dholera SIR is rapidly emerging as India’s flagship smart city — driven by future-ready transport, large-scale industry, AI-enabled governance, and sustainable utilities. With plug-and-play infrastructure and major government backing, Dholera offers unmatched scale and investment potential."
    },
    statNumber: { tag: "h2", text: "₹30,000+ Crore" },
    statText: { tag: "p", text: "Government-backed Mega Projects Transforming Dholera" },
    button: { link: "/dholera-SIR", text: { text: "Explore Dholera SIR" } }
  },
 gallery: [
    { key: "metro", title: "Dholera Metro", src: "/images/metro.jpg", link: "/dholera-metro-rail-project" },
    { key: "seaport", title: "Dholera Sea Port", src: "/images/seaport.jpg", link: "/dholera-sea-port" },
    { key: "industrial", title: "Industrial & Trade", src: "/images/industrial_trade.jpg", link: "/dholera-smart-infrastructure" },
    { key: "diamond", title: "Diamond Circle", src: "/images/diamond.webp", link: "/dholera-diamond-circle" }
  ]
};

const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const DynamicTag = ({ tag, className, children, html }) => {
  const Tag = validTags.includes(tag) ? tag : "p";
  return html ? (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <Tag className={className}>{children}</Tag>
  );
};

const Connectivities = () => {
  const [data, setData] = useState(defaultConnectivities);
  const [hovered, setHovered] = useState(null);
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/connectivities`)
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.log("Backend not available, showing default content"));
  }, [API]);

  const scrollGallery = (direction) => {
    const galleryEl = document.querySelector(".gallery");
    if (!galleryEl) return;
    const scrollAmount = galleryEl.clientWidth * 0.82;
    let newScroll = galleryEl.scrollLeft + direction * scrollAmount;
    newScroll = Math.max(0, Math.min(newScroll, galleryEl.scrollWidth - galleryEl.clientWidth));
    galleryEl.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  const { leftCards = [], rightContent = {}, gallery = [] } = data;

  return (
    <section className="connectivities-section">
      <div className="left-bg" style={{ backgroundImage: "url('/images/bg-img2.png')", opacity: 0.2 }}></div>

      <div className="connectivities-container">
    <div className="left-row">
  {defaultConnectivities.leftCards.map((card, idx) => (
    <div key={idx} className={`tall-card card-${idx}`}>
      <div
        className="card-image"
        style={{ backgroundImage: `url('${card.image.url}')` }}
      >
        <div className="card-overlay">
         <h4 className="card-title" data-aos="fade-up">
  {card.title?.text || "Missing title"}
</h4>
          <Link
            to={card.button.link}
            className="outline-btn"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {card.button.text.text}
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>


        <div className="right-content">
          <DynamicTag tag={rightContent?.subtitle?.tag} className="subtitle" data-aos="fade-up" html={rightContent?.subtitle?.text} />

          <DynamicTag
            tag={rightContent?.mainHeading?.tag}
            className="connectivities-main-heading"
            data-aos="fade-up"
            data-aos-delay="100"
            html={rightContent?.mainHeading?.text}
          />

          <DynamicTag
            tag={rightContent?.paragraph?.tag}
            className="intro"
            data-aos="fade-up"
            data-aos-delay="200"
            html={rightContent?.paragraph?.text}
          />

          <div className="divider-thin" data-aos="fade-up" data-aos-delay="300"></div>

          <div className="big-stats">
            <DynamicTag
              tag={rightContent?.statNumber?.tag}
              className="stat-number"
              data-aos="fade-up"
              data-aos-delay="400"
              html={rightContent?.statNumber?.text}
            />
            <DynamicTag
              tag={rightContent?.statText?.tag}
              className="stat-text"
              data-aos="fade-up"
              data-aos-delay="500"
              html={rightContent?.statText?.text}
            />
          </div>

          <div className="divider-thin" data-aos="fade-up" data-aos-delay="600"></div>

          {rightContent?.button?.link && (
            <Link to={rightContent.button.link} data-aos="fade-up" data-aos-delay="700">
              <button className="white-cta">{rightContent.button.text?.text}</button>
            </Link>
          )}
        </div>
      </div>

      {/* GALLERY */}
      <div className="gallery-wrapper">
        <div className="gallery-nav mobile-nav" style={{ marginTop: "30px" }}>
          <button className="nav-btn" onClick={() => scrollGallery(-1)}>
            &lt;
          </button>
          <button className="nav-btn" onClick={() => scrollGallery(1)}>
            &gt;
          </button>
        </div>

<div className="gallery">
  {defaultConnectivities.gallery.map((item, idx) => (
    <div
      key={item.key}
      className="gallery-card"
      style={{ backgroundImage: `url('${item.src}')` }}  // ✅ FRONTEND IMAGE
      onMouseEnter={() => setHovered(idx)}
      onMouseLeave={() => setHovered(null)}
    >
      <div className={`card-overlay gallery-overlay ${hovered === idx ? "active" : ""}`}>
        <h4 className="card-title" data-aos="fade-up">
          {item.title || "Missing title"}   {/* ✅ FIXED */}
        </h4>

        <Link
          to={item.link}
          className="outline-btn"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          View Detail
        </Link>
      </div>
    </div>
  ))}
</div>



      </div>
    </section>
  );
};

export default Connectivities;
