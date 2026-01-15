import React, { useEffect, useState } from "react";
import "./FeatureSection.css";
import {
  FaIndustry,
  FaRoad,
  FaLeaf,
  FaStar,
  FaBuilding,
  FaPlane,
  FaSolarPanel,
  FaProjectDiagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

/* ---------------- ICON MAP ---------------- */
const iconMap = {
  FaIndustry: <FaIndustry />,
  FaRoad: <FaRoad />,
  FaLeaf: <FaLeaf />,
  FaStar: <FaStar />,
  FaBuilding: <FaBuilding />,
  FaPlane: <FaPlane />,
  FaSolarPanel: <FaSolarPanel />,
  FaProjectDiagram: <FaProjectDiagram />,
};

/* ---------------- DYNAMIC TAG WITH HTML SUPPORT ---------------- */
const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];

const DynamicTag = ({ tag, className, children, html }) => {
  const Tag = validTags.includes(tag) ? tag : "p";

  if (html) {
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <Tag className={className}>{children}</Tag>;
};
// ✅ Default Feature content (used when backend is sleeping)
const defaultFeature = {
  heading: {
    tag: "h2",
    text: "Why Invest in Dholera SIR"
  },

  subtext: {
    tag: "p",
    text: `
      <p>
        Dholera Smart City offers world-class infrastructure, strong government
        backing, and exceptional long-term growth potential for investors.
      </p>
    `
  },

  grid: [
    {
      icon: "FaIndustry",
      number: "01",
      title: { tag: "h3", text: "Industrial Growth Zone" },
      description: {
        tag: "p",
        text:
          "Dholera’s activation zone is built for industries to scale with world-class infrastructure."
      },
      learnMore: {
        link: "/dholera-smart-infrastructure",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaRoad",
      number: "02",
      title: { tag: "h3", text: "Expressway Connectivity" },
      description: {
        tag: "p",
        text:
          "Seamless access through Ahmedabad–Dholera Expressway and DMIC corridor."
      },
      learnMore: {
        link: "/ahmedabad-dholera-expressway",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaLeaf",
      number: "03",
      title: { tag: "h3", text: "Dholera Artificial Riverfront" },
      description: {
        tag: "p",
        text:
          "Eco-friendly urban riverfront designed for recreation, flood management, and smart city integration enhancing lifestyle."
      },
      learnMore: {
        link: "/dholera-artificial-riverfront",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaPlane",
      number: "04",
      title: { tag: "h3", text: "Dholera International Airport" },
      description: {
        tag: "p",
        text:
          "Upcoming global airport boosting business, tourism, and rapid logistics."
      },
      learnMore: {
        link: "/dholera-international-airport",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaStar",
      number: "05",
      title: { tag: "h3", text: "High Investment Potential" },
      description: {
        tag: "p",
        text:
          "Fastest-growing smart city with massive residential and commercial appreciation."
      },
      learnMore: {
        link: "/investment-opportunities",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaBuilding",
      number: "06",
      title: { tag: "h3", text: "Smart City Infrastructure" },
      description: {
        tag: "p",
        text:
          "24×7 utilities, ICT network, and fully planned plug-and-play infrastructure."
      },
      learnMore: {
        link: "/dholera-smart-infrastructure",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaSolarPanel",
      number: "07",
      title: { tag: "h3", text: "5000 MW Solar Park" },
      description: {
        tag: "p",
        text:
          "India’s largest renewable energy zone powering industries and future development."
      },
      learnMore: {
        link: "/dholera-solar-park",
        text: { text: "Learn More" }
      }
    },
    {
      icon: "FaProjectDiagram",
      number: "08",
      title: { tag: "h3", text: "Dholera Sea Port" },
      description: {
        tag: "p",
        text:
          "Strategically located along the Gulf of Khambhat, the Dholera Sea Port will enhance trade, reduce logistics costs, and attract export-oriented industries."
      },
      learnMore: {
        link: "/dholera-sea-port",
        text: { text: "Learn More" }
      }
    }
  ]
};

const FeatureSection = () => {
  const [feature, setFeature] = useState(defaultFeature);
  const API = process.env.REACT_APP_APIURL;

  /* ---------------- AOS INIT ---------------- */
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

  /* ---------------- FETCH DATA ---------------- */
useEffect(() => {
  axios
    .get(`${API}/api/feature-section`)
    .then(res => {
      if (res.data) setFeature(res.data); // overwrite defaults
    })
    .catch(() =>
      console.log("Backend sleeping, showing default Feature content")
    );
}, [API]);


  const { heading, subtext, grid = [] } = feature;

  return (
    <section
      className="featuresec-wrapper"
      style={{ backgroundImage: `url("/images/bg-image.png")` }}
    >
      <div className="featuresec-overlay"></div>

      <div className="featuresec-container">
        {/* HEADING */}
        <DynamicTag
          tag={heading?.tag}
          className="featuresec-heading"
          html={heading?.text}
        />

        {/* SUBTEXT */}
        <DynamicTag
          tag={subtext?.tag}
          className="featuresec-subtext"
          html={subtext?.text}
        />

        {/* GRID */}
        <div className="featuresec-grid">
          {grid.map((item, i) => (
            <div
              key={i}
              className={`featuresec-item ${
                (i + 1) % 4 !== 0 ? "with-divider" : ""
              }`}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="featuresec-top">
                <div className="featuresec-icon">
                  {iconMap[item.icon] || <FaIndustry />}
                </div>

                <div
                  className="featuresec-number"
                  data-num={item.number}
                >
                  {item.number}
                </div>
              </div>

              {/* TITLE */}
              <DynamicTag
                tag={item.title?.tag || "h3"}
                className="featuresec-title"
                html={item.title?.text}
              />

              {/* DESCRIPTION */}
              <DynamicTag
                tag={item.description?.tag || "p"}
                className="featuresec-para"
                html={item.description?.text}
              />

              {/* LEARN MORE LINK */}
              {item.learnMore?.link && (
                <Link
                  to={item.learnMore.link}
                  className="featuresec-link"
                >
                  <DynamicTag html={item.learnMore.text?.text}>
                    {item.learnMore.text?.text ? null : "Learn More"}
                  </DynamicTag>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;