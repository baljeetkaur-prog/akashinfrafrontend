import React, { useEffect, useState } from "react";
import "./Aboutsection.css";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const DynamicTag = ({ tag, className, children }) => {
  const Tag = validTags.includes(tag) ? tag : "p";
  return <Tag className={className}>{children}</Tag>;
};

// New component for rendering raw HTML safely
const HtmlContent = ({ html, className }) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};
// ✅ Default About content (used when backend is not active)
const defaultAbout = {
  leftImages: [
    { url: "/images/about3.jpg", alt: "Dholera Smart City View" },
    { url: "/images/about1.jpg", alt: "Infrastructure Development" },
    { url: "/images/about2.jpg", alt: "Investment Opportunity" }
  ],

  rightContent: {
    subtitle: { tag: "p", text: "Leading Real Estate in Dholera" },
    heading: { tag: "h2", text: "About Akash Infra" },
    description: {
      tag: "p",
      text: `
        <p>
        With over 20 years of excellence in real estate and a strong two-year presence in Dholera, Akash Infra delivers secure, value-driven investments. We offer legally clear, meticulously planned plots in India’s flagship smart city, combining world-class infrastructure, sustainability, and strategic location. Our commitment goes beyond land. We build trust and shape tomorrow’s urban future.
        </p>
      `
    }
  },

  points: [
    "920 sq km — larger than Singapore",
    "5,000 MW Solar Park planned",
    "Phase 1 Activation Area ready",
    "Airport & Expressway operational soon", 
    "Plug-and-play smart city infrastructure"
  ],

  highlightBox: {
    heading: { tag: "h3", text: "20+" },
    description: {
      tag: "p",
      text: `
        <p>
         Years Experience
        </p>
      `
    }
  },

  bottomSection: {
    logoImage: {
      url: "/images/logo.png",
      alt: "Company Logo"
    },
    logoText: {
      tag: "p",
      text: "Akash Infra"
    },
    button: {
      link: "/about-us",
      text: { tag: "p", text: "More About Us" }
    }
  }
};


const Aboutsection = () => {
 const [about, setAbout] = useState(defaultAbout);
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

useEffect(() => {
  axios
    .get(`${API}/api/about-section`)
    .then(res => {
      if (res.data) setAbout(res.data); // overwrite defaults
    })
    .catch(() =>
      console.log("Backend not available, showing default About content")
    );
}, [API]);


  const {
    leftImages = [],
    rightContent,
    points = [],
    highlightBox,
    bottomSection
  } = about;

  return (
    <section className="about-section">
      {/* LEFT BG IMAGE */}
      <div
        className="left-bg"
        style={{
          backgroundImage: "url('/images/bg-img2.png')",
          opacity: 0.2
        }}
      ></div>

      <div className="about-container">
        {/* LEFT SIDE STACKED IMAGES */}
        <div className="about-left" data-aos="fade-right">
          <div className="stacked-images">
            {leftImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt || `About image ${i + 1}`}
                className={`img img${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="about-right" data-aos="fade-left" data-aos-delay="200">
          <DynamicTag tag={rightContent?.subtitle?.tag} className="subtitle">
            {rightContent?.subtitle?.text}
          </DynamicTag>

          <DynamicTag tag={rightContent?.heading?.tag} className="heading">
            {rightContent?.heading?.text}
          </DynamicTag>

          {/* RICH TEXT DESCRIPTION - RENDER AS HTML */}
          <HtmlContent
            html={rightContent?.description?.text || ""}
            className="description"
          />

          {/* WHITE BOX */}
          <div className="white-box">
            <div className="points-box">
              {points.map((point, i) => (
                <div
                  key={i}
                  className="point"
                  data-aos="fade-up"
                  data-aos-delay={100 * i}
                >
                  <span className="tick">✓</span>
                  <span className="point-text">{point}</span>
                </div>
              ))}
            </div>

            {/* HIGHLIGHT BOX */}
            <div className="highlight-box" data-aos="zoom-in" data-aos-delay="600">
              <DynamicTag tag={highlightBox?.heading?.tag} className="highlight-number">
                {highlightBox?.heading?.text}
              </DynamicTag>

              {/* RICH TEXT FOR HIGHLIGHT DESCRIPTION */}
              <HtmlContent
                html={highlightBox?.description?.text || ""}
                className="highlight-description"
              />
            </div>
          </div>

          {/* LOGO + DIVIDER + BUTTON */}
          <div className="bottom-section" data-aos="fade-up" data-aos-delay="700">
            <div className="logo-area">
              <div className="logo-circle">
                {bottomSection?.logoImage?.url && (
                  <img
                    src={bottomSection.logoImage.url}
                    alt={bottomSection.logoImage.alt || "Company Logo"}
                  />
                )}
              </div>

              <DynamicTag tag={bottomSection?.logoText?.tag} className="logo-text">
                {bottomSection?.logoText?.text}
              </DynamicTag>
            </div>

            <div className="divider"></div>

            {bottomSection?.button?.link && (
           <Link to={bottomSection.button.link} className="about-btn">
  {bottomSection.button.text?.text}
</Link>

            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutsection;