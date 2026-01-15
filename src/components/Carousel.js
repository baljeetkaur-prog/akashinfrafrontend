import "./Carousel.css";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { AiOutlineProject, AiOutlineEnvironment, AiOutlineShop } from "react-icons/ai";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import Aos from "aos";
import axios from "axios";

const iconMap = {
  AiOutlineProject: <AiOutlineProject className="feature-icon" />,
  AiOutlineEnvironment: <AiOutlineEnvironment className="feature-icon" />,
  AiOutlineShop: <AiOutlineShop className="feature-icon" />
};

// ✅ Default content
const defaultCarousel = {
  topSection: {
    heading: { tag: "h1", text: "Dholera: India’s Future City" },
    paragraph: { tag: "p", text: "Dholera SIR is India’s first greenfield smart city with international airport, expressway, metro, and a 5,000 MW solar park, making it one of the strongest investment destinations for long-term growth." },
    brochureLink: "/images/Dholera Brochure.pdf",
    learnMoreLink: "/enquiry-form",
    profileImages: [
      { url: "/images/test-new1.png" },
      { url: "/images/test-new2.png" },
      { url: "/images/test-new3.png" }
    ],
    rating: 4.9,
    reviewCount: "12,500+"
  },
  middleSection: {
    images: [
      { url: "/images/carousel1.jpg" },
      { url: "/images/carousel5.jpg" },
      { url: "/images/carousel6.jpg" },
      { url: "/images/carousel7.jpg" }
    ],
featureCards: [
  { icon: "AiOutlineProject", title: "World-Class Connectivity", tag: "h3" },
  { icon: "AiOutlineProject", title: "Smart & Green City", tag: "h3" },
  { icon: "AiOutlineProject", title: "High Growth Investment Hub", tag: "h3" }
]
  },
 bottomStats: [
  { value: "100km+", valueTag: "h2", label: "Metro", labelTag: "p" },
  { value: "5,000MW+", valueTag: "h2", label: "Solar Park", labelTag: "p" },
  { value: "8 Lakh+", valueTag: "h2", label: "Projected Jobs", labelTag: "p" },
  { value: "920 sq.km", valueTag: "h2", label: "City Development", labelTag: "p" }
]
};

const Carousel = () => {
  const [carousel, setCarousel] = useState(defaultCarousel); // start with default
  const [index, setIndex] = useState(0);
  const API = process.env.REACT_APP_APIURL;

  const images = carousel?.middleSection?.images || [];

  useEffect(() => {
    Aos.init({ duration: 1000, easing: "ease-in-out", once: true });
    Aos.refresh();
  }, []);

  // Fetch backend content, overwrite defaults if available
  useEffect(() => {
    axios
      .get(`${API}/api/carousel`)
      .then(res => {
        if (res.data) setCarousel(res.data);
      })
      .catch(err => console.log("Backend not available, showing default content"));
  }, [API]);

  // Auto-slide
  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];
const DynamicTag = ({ tag, children, className, html }) => {
  const Tag = validTags.includes(tag) ? tag : "p";
  return html ? (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <Tag className={className}>{children}</Tag>
  );
};
  const { topSection, middleSection, bottomStats } = carousel;

  return (
    <section
      className="carousel-section"
      style={{
        backgroundImage: `url("/images/bg-image.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="overlay"></div>
      <div className="carousel-container">

        {/* TOP SECTION */}
        <div className="top-section">
          <div className="left-content" data-aos="fade-right">
            <DynamicTag tag={topSection.heading?.tag} className="main-heading">
              {topSection.heading?.text}
            </DynamicTag>
<DynamicTag 
  tag={topSection.paragraph?.tag} 
  className="main-para"
  html={topSection.paragraph?.text}
/>

          </div>

          <div className="right-top-content" data-aos="fade-left" data-aos-delay="200">
            <div className="review-row">
              <div className="circle-stack">
                {topSection.profileImages?.map((img, i) => (
                <img key={i} src={img.url} className="circle-img" alt={img.alt || `profile-${i}`} />
                ))}
                <div className="circle-img plus-box">
                  <FiPlus className="plus-icon" />
                </div>
              </div>
              <div className="rating-box">
                <div className="rating-line">
                  <span className="rating-number">{topSection.rating}</span>
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="carousel-star-icon" />)}
                </div>
                <span className="rating-sub">{topSection.reviewCount}</span>
              </div>
            </div>

            <div className="carousel-buttons">
              <a
                href={topSection.brochureLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white"
              >
                Download Brochure
              </a>
              <Link to={topSection.learnMoreLink} className="btn-transparent">
              Enquire Now
              </Link>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="middle-section">
          <div className="slider-box" data-aos="zoom-in">
            {images.map((img, i) => (
         <img
  key={i}
  src={img.url}
  className={`fade-image ${i === index ? "active" : ""}`}
  alt={img.alt || `carousel-${i}`}
/>
            ))}
            <div className="slider-dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === index ? "active-dot" : ""}`}
                  onClick={() => setIndex(i)}
                ></span>
              ))}
            </div>
          </div>

          <div className="feature-box" data-aos="fade-up" data-aos-delay="300">
            {middleSection.featureCards?.map((card, i) => (
              <div key={i} className="feature-card" data-aos="flip-left" data-aos-delay={(i + 1) * 100}>
                <div className="feature-circle">{iconMap[card.icon]}</div>
               <DynamicTag tag={card.tag || "h3"}>{card.title}</DynamicTag>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className="bottom-stats" data-aos="fade-up" data-aos-delay="100">
          {bottomStats?.map((stat, i) => (
            <React.Fragment key={i}>
              <div className="stat-card" data-aos="fade-up" data-aos-delay={(i + 1) * 100}>
              <DynamicTag tag={stat.valueTag || "h2"}>{stat.value}</DynamicTag>
<DynamicTag tag={stat.labelTag || "p"}>{stat.label}</DynamicTag>

              </div>
              {i < bottomStats.length - 1 && <div className="carousel-divider"></div>}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Carousel;
