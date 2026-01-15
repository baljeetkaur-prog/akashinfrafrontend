import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProcessSection.css";
import AOS from "aos";
import "aos/dist/aos.css";

const fallbackProcessSection = {
  heading: { tag: "h2", text: "Your Investment Journey" },
  subtext: { tag: "p", text: "From selecting the perfect plot to witnessing your investment grow, we guide you through every step with trust, clarity, and expertise." },
  cards: [
    { image: { url: "/images/consultation.jpg", alt: "Consultation" }, title: { tag: "h3", text: "Consultation & Site Selection" }, para: { text: "We help you choose the right plot in Dholera, matching your goals and growth plans." } },
    { image: { url: "/images/legal.jpeg", alt: "Legal Verification" }, title: { tag: "h3", text: "Legal Verification" }, para: { text: "Every plot is legally verified to ensure clear titles and a safe, smooth purchase." } },
    { image: { url: "/images/planning.jpeg", alt: "Investment Planning" }, title: { tag: "h3", text: "Investment Planning" }, para: { text: "We manage paperwork and guide you with smart, tailored investment planning." } },
    { image: { url: "/images/support.jpeg", alt: "Post Support" }, title: { tag: "h3", text: "Post-Investment Support" }, para: { text: "We keep you updated with project progress and insights to support your investment." } }
  ]
};

const ProcessSection = () => {
  const API = process.env.REACT_APP_APIURL;
  const [data, setData] = useState(fallbackProcessSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/process-section`)
      .then((res) => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch process section, using fallback:", err);
      })
      .finally(() => setLoading(false));
  }, [API]);

  if (loading) return <div>Loading...</div>;

  const { heading, subtext, cards } = data;

  return (
    <section
      className="processsec-wrapper"
      style={{
        backgroundImage: `url("/images/bg-image.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="processsec-overlay"></div>

      <div className="processsec-container" style={{ position: "relative", zIndex: 2 }}>
        <h2 className="processsec-heading" data-aos="fade-up">{heading.text}</h2>
        <p className="processsec-subtext" data-aos="fade-up" data-aos-delay="100">{subtext.text}</p>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            backgroundImage: `url("/images/processimg.png")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.9,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div className="processsec-grid" style={{ position: "relative", zIndex: 5 }}>
          {cards.map((card, i) => (
            <div key={i} className={`process-item item-${i + 1}`}>
              <div className="process-img-wrapper">
                <img src={card.image?.url} alt={card.image?.alt || `step-${i + 1}`} className="process-img" />
                <div className="process-img-overlay">{i + 1}</div>
              </div>

              <h3 className="process-title" data-aos="fade-up" data-aos-delay={i * 150 + 100}>
                {card.title?.text}
              </h3>

              <p className="process-para" data-aos="fade-up" data-aos-delay={i * 150 + 200}>
                {card.para?.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
