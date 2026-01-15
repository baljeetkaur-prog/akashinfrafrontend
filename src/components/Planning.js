import React, { useEffect, useState, useRef } from "react";
import "./Planning.css";
import {
  FaArrowRight,
  FaBuilding,
  FaHome,
  FaLeaf,
  FaPaperPlane,
  FaRoad,
  FaSolarPanel,
  FaWater,
} from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DynamicTag from "./DynamicTag";
import DefaultPlanning from "./DefaultPlanning";

const Planning = () => {
const [data, setData] = useState(DefaultPlanning);
  const API = process.env.REACT_APP_APIURL;
  const recaptchaRef = useRef(null);

useEffect(() => {
  axios
    .get(`${API}/api/planning`)
    .then((res) => {
      if (res.data) setData(res.data);
    })
    .catch(() =>
      console.warn("Backend not available, using default Planning content")
    );
}, [API]);
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  // Smart City Carousel
  useEffect(() => {
    if (!data?.smartCityFeatures?.carouselImages?.length) return;
    const images = document.querySelectorAll(".smartcity-carousel img");
    if (images.length === 0) return;
    let current = 0;
    images[current].classList.add("active");
    const interval = setInterval(() => {
      images[current].classList.remove("active");
      current = (current + 1) % images.length;
      images[current].classList.add("active");
    }, 4000);
    return () => clearInterval(interval);
  }, [data?.smartCityFeatures?.carouselImages]);

  // Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.error("Please verify that you are not a robot.");
    return;
  }

  const formData = new FormData(e.target);

  // Backend data object
  const backendData = {
    name: e.target.name.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
  };

  let formspreeSuccess = false;

  // 1️⃣ Send to Formspree
  try {
    const response = await fetch("https://formspree.io/f/xyzrayqz", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      formspreeSuccess = true;
      toast.success("Message sent successfully!");
      e.target.reset();
      recaptchaRef.current.reset();
    } else {
      toast.error("Formspree submission failed.");
    }
  } catch (err) {
    console.error("Formspree error:", err);
    toast.error("Formspree submission error.");
  }

  // 2️⃣ Send to your backend
  try {
    await axios.post(`${process.env.REACT_APP_APIURL}/api/investment/submit`, backendData);
    console.log("Saved to backend successfully!");
  } catch (err) {
    console.error("Backend save failed:", err);
    if (!formspreeSuccess) toast.error("Error submitting form. Please try again.");
  }
};


  const {
    seo,
    breadcrumb,
    banner,
    introSection,
    activationArea,
    tpSchemes,
    zoning,
    infrastructure,
    smartCityFeatures,
    sustainability,
    investment,
  } = data;

  const iconMap = {
    leaf: FaLeaf,
    solar: FaSolarPanel,
    water: FaWater,
    home: FaHome,
    building: FaBuilding,
    road: FaRoad,
  };

  const infraIcons = [
    <FiPhoneCall className="infra-icon" />,
    <FaArrowRight className="infra-icon" />,
    <FaHome className="infra-icon" />,
    <FiPhoneCall className="infra-icon" />,
  ];

  return (
    <>
      <Helmet>
        <title>{seo?.title || "Dholera Smart City Planning"}</title>
        <meta name="description" content={seo?.description || ""} />
        <meta name="keywords" content={seo?.keywords || ""} />
      </Helmet>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="planmain-page">
        {/* Banner */}
        <section
          className="planmain-banner"
          style={{ backgroundImage: 'url("/images/bg-image.png")' }}
        >
          <div className="planmain-container">
            <DynamicTag tag={banner?.heading?.tag || "h1"} className="planmain-heading" data-aos="fade-up">
              {banner?.heading?.text}
            </DynamicTag>
            <div className="planmain-breadcrumb" data-aos="fade-up" data-aos-delay="100">
              <FaHome className="planmain-home-icon" />
              <Link to="/" className="planmain-breadcrumb-link">
                {breadcrumb?.parent}
              </Link>
              <span className="planmain-breadcrumb-text">&gt;&gt; {breadcrumb?.current}</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div
          className="planmain-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "80px 20px",
          }}
        >
          <div className="planmain-content-wrapper">
            {/* Intro Section */}
            <div className="planmain-left-image" data-aos="fade-right">
              <img
                src={introSection?.image?.url}
                alt={introSection?.image?.alt || "Dholera SIR Master Planning Overview"}
              />
            </div>
            <div className="planmain-right-content" data-aos="fade-left">
              <DynamicTag tag={introSection?.smallHeading?.tag} className="planmain-small-heading" data-aos="fade-up">
                {introSection?.smallHeading?.text}
              </DynamicTag>
              <DynamicTag tag={introSection?.bigHeading?.tag} className="planmain-big-heading" data-aos="fade-up" data-aos-delay="100">
                {introSection?.bigHeading?.text}
              </DynamicTag>

              {/* Fixed: Paragraphs with rich text */}
              {introSection?.paragraphs?.map((para, i) => (
                <DynamicTag
                  key={i}
                  tag={para.tag || "div"}  // Use "div" to safely render rich HTML
                  className="planmain-para"
                  data-aos="fade-up"
                  data-aos-delay={200 + i * 100}
                  html={para.text}
                />
              ))}

              <Link to={introSection?.button?.link || "/dholera-SIR"}>
                <button className="planmain-contact-btn" data-aos="fade-up" data-aos-delay="400">
                  {introSection?.button?.text?.text || "Know More"}
                </button>
              </Link>
            </div>
          </div>

          {/* Activation Area */}
          <div className="activation-row">
            <div className="activation-col-left" data-aos="fade-right">
              <DynamicTag tag={activationArea?.title?.tag} className="activation-center-title" data-aos="fade-up" data-aos-delay="50">
                {activationArea?.title?.text}
              </DynamicTag>

              <DynamicTag
                tag={activationArea?.paragraph?.tag || "div"}
                className="activation-center-para"
                data-aos="fade-up"
                data-aos-delay="150"
                html={activationArea?.paragraph?.text}
              />

              <div className="activation-info-list">
                {activationArea?.infoList?.map((item, index) => (
                  <div
                    key={index}
                    className="activation-info-item"
                    data-aos="fade-up"
                    data-aos-delay={200 + index * 100}
                  >
                    <span className="arrow">➜</span> <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>
            </div>
            <div className="activation-col-right" data-aos="fade-left" data-aos-delay="300">
              <img
                src={activationArea?.image?.url}
                alt={activationArea?.image?.alt || "Dholera Activation Area Phase 1"}
              />
            </div>
          </div>

          {/* TP Schemes Timeline */}
          <div className="tp-timeline-section" data-aos="fade-up">
  <h2 className="tp-timeline-title" data-aos="fade-up" data-aos-delay="50">
    TP Schemes & Sub-TPs
  </h2>

  <div className="tp-timeline">
    {[1,2,3,4,5,6,7,8,9,10].map((tpNumber) => {
      const isLeft = tpNumber % 2 !== 0;
      const tpId = `TP${tpNumber}`;
      const subTps = {
        TP1: ["Activation Area (Sub-TP1A)", "Industrial Zone (Sub-TP1B)", "Residential Zone (Sub-TP1C)"],
        TP2: ["Logistics Hub (Sub-TP2A)", "Green Zone (Sub-TP2B)"],
        TP3: ["Commercial Zone (Sub-TP3A)", "Residential Expansion (Sub-TP3B)"],
        TP4: ["Activation Area Extension (Sub-TP4A)", "Commercial Expansion (Sub-TP4B)"],
        TP5: ["Residential Zone (Sub-TP5A)", "Industrial Zone (Sub-TP5B)"],
        TP6: ["Logistics & Warehousing (Sub-TP6A)", "Green/Institutional Zones (Sub-TP6B)"],
        TP7: ["Industrial Expansion (Sub-TP7A)", "Residential Planning (Sub-TP7B)"],
        TP8: ["Commercial Expansion (Sub-TP8A)", "Green Spaces & Parks (Sub-TP8B)"],
        TP9: ["Residential Expansion (Sub-TP9A)", "Institutional Zone (Sub-TP9B)"],
        TP10: ["Commercial & Retail (Sub-TP10A)", "Industrial Expansion (Sub-TP10B)"],
      };
      const villages = {
        TP1: "Dholera, Bavaliyari, Kamiyala",
        TP2: "Navagam, Lunsar",
        TP3: "Saragwala, Velavadar",
        TP4: "Bavaliyari, Kamiyala",
        TP5: "Lunsar, Dholera",
        TP6: "Navagam, Velavadar",
        TP7: "Bavaliyari, Saragwala",
        TP8: "Lunsar, Velavadar",
        TP9: "Dholera, Saragwala",
        TP10: "Bavaliyari, Lunsar",
      };
      const population = {
        TP1: "15,000 approx.",
        TP2: "10,000 approx.",
        TP3: "12,000 approx.",
        TP4: "8,000 approx.",
        TP5: "14,000 approx.",
        TP6: "9,000 approx.",
        TP7: "11,000 approx.",
        TP8: "7,500 approx.",
        TP9: "6,500 approx.",
        TP10: "8,000 approx.",
      };

      return (
        <div
          key={tpNumber}
          className={`tp-item ${isLeft ? "left" : "right"}`}
          data-aos={isLeft ? "fade-right" : "fade-left"}
          data-aos-delay="100"
        >
          <div className="tp-marker">{tpId}</div>
          <div className="tp-content">
            <h3 data-aos="fade-up">{`Sub-TPs: ${tpId}A, ${tpId}B${tpId === "TP1" ? ", TP1C" : ""}`}</h3>
            <ul className="tp-sub-list">
              {subTps[tpId].map((sub, index) => (
                <li
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 100}
                >
                  {isLeft ? sub + " " : ""}<span className={isLeft ? "arrow-left" : "arrow"}>➜</span> {isLeft ? "" : sub}
                </li>
              ))}
            </ul>
            <p data-aos="fade-up" data-aos-delay="200"><strong>Villages:</strong> {villages[tpId]}</p>
            <p data-aos="fade-up" data-aos-delay="250"><strong>Population:</strong> {population[tpId]}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>

          {/* Zoning Section */}
          <div className="zoning-section" data-aos="fade-up">
            <div className="zoning-inner">
              <DynamicTag tag={zoning?.heading?.tag} className="zoning-heading" data-aos="fade-up" data-aos-delay="50">
                {zoning?.heading?.text}
              </DynamicTag>

              <DynamicTag
                tag={zoning?.description?.tag || "div"}
                className="zoning-desc"
                data-aos="fade-up"
                data-aos-delay="100"
                html={zoning?.description?.text}
              />

              <div className="zoning-grid">
                {zoning?.zones?.map((zone, index) => (
                  <div className="zone-box" key={index} data-aos="fade-up" data-aos-delay={150 + index * 100}>
                    <img
                      className="zone-img"
                      src={zone.image?.url}
                      alt={zone.image?.alt || zone.title || "Dholera SIR Zone"}
                    />
                    <div className="zone-text">
                      <h3>{zone.title}</h3>
                      <p>{zone.description}</p>
                      <Link to={zone.button?.link || "/enquiry-form"} className="zone-enquire-btn">
                        <FaArrowRight className="btn-icon" /> {zone.button?.text || "Enquire Now"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Section */}
          <div className="infrastructure-section">
            <div className="infra-top">
              <div className="infra-text" data-aos="fade-left" data-aos-delay="50">
                <DynamicTag tag={infrastructure?.heading?.tag || "h2"}>
                  {infrastructure?.heading?.text}
                </DynamicTag>

                <DynamicTag
                  tag={infrastructure?.paragraph?.tag || "div"}
                  html={infrastructure?.paragraph?.text}
                />
              </div>
              <div className="infra-image" data-aos="fade-right" data-aos-delay="100">
                <img
                  src={infrastructure?.image?.url}
                  alt={infrastructure?.image?.alt || "Dholera SIR World-Class Infrastructure"}
                />
              </div>
            </div>
            <div className="infra-stats">
              {infrastructure?.stats?.map((stat, index) => (
                <div className="infra-item" key={index} data-aos="fade-up" data-aos-delay={150 + index * 100}>
                  {infraIcons[index] || <FiPhoneCall className="infra-icon" />}
                  <p>{stat.iconText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Smart City Features */}
          <div className="smartcity-section">
            <div className="smartcity-container">
              <DynamicTag tag={smartCityFeatures?.heading?.tag} className="smartcity-heading" data-aos="fade-down" data-aos-delay="50">
                {smartCityFeatures?.heading?.text}
              </DynamicTag>

              <DynamicTag
                tag={smartCityFeatures?.introParagraph?.tag || "div"}
                className="smartcity-intro"
                data-aos="fade-down"
                data-aos-delay="100"
                html={smartCityFeatures?.introParagraph?.text}
              />

              <div className="smartcity-wrapper">
                <div className="smartcity-features left" data-aos="fade-right" data-aos-delay="150">
                  <ul>
                    {smartCityFeatures?.leftFeatures?.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
                <div className="smartcity-carousel" data-aos="zoom-in" data-aos-delay="200">
                  {smartCityFeatures?.carouselImages?.map((img, i) => (
                    <img
                      key={i}
                      src={img?.url}
                      alt={img?.alt || `Dholera Smart City Feature ${i + 1}`}
                      className={i === 0 ? "active" : ""}
                    />
                  ))}
                </div>
                <div className="smartcity-features right" data-aos="fade-left" data-aos-delay="250">
                  <ul>
                    {smartCityFeatures?.rightFeatures?.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability */}
        <div className="sustain-section">
  <h2 data-aos="fade-down" data-aos-delay="50">Planning & Sustainability Highlights</h2>
  <p data-aos="fade-down" data-aos-delay="100">
    Dholera SIR is designed as a world-class smart city, blending eco-friendly infrastructure with innovative urban planning. It features expansive green spaces, renewable energy integration, and smart water management systems, ensuring sustainable living.
  </p>

  <div className="sustain-container">
    <div className="sustain-colored-box" data-aos="fade-right" data-aos-delay="150"></div>

    {/* Top Cards */}
    <div className="sustain-cards top-cards">
      <div className="sustain-card" data-aos="fade-up" data-aos-delay="200">
        <FaLeaf className="sustain-icon" />
        <h3>Green Spaces</h3>
        <p>60% of the city is dedicated to parks and open areas.</p>
      </div>
      <div className="sustain-card" data-aos="fade-up" data-aos-delay="250">
        <FaSolarPanel className="sustain-icon" />
        <h3>Renewable Energy</h3>
        <p>Integration of solar & wind energy across the city.</p>
      </div>
      <div className="sustain-card" data-aos="fade-up" data-aos-delay="300">
        <FaWater className="sustain-icon" />
        <h3>Smart Water Systems</h3>
        <p>Efficient water recycling and management infrastructure.</p>
      </div>
    </div>

    {/* Bottom Cards */}
    <div className="sustain-cards bottom-cards">
      <div className="sustain-card" data-aos="fade-up" data-aos-delay="350">
        <FaHome className="sustain-icon" />
        <h3>Housing</h3>
        <p>Low, mid & high-density residential planning for comfort.</p>
      </div>
      <div className="sustain-card" data-aos="fade-up" data-aos-delay="400">
        <FaBuilding className="sustain-icon" />
        <h3>Integrated Villages</h3>
        <p>22 villages are strategically integrated into the city layout.</p>
      </div>
      <div className="sustain-card" data-aos="fade-up" data-aos-delay="450">
        <FaRoad className="sustain-icon" />
        <h3>Connectivity</h3>
        <p>Close to expressway, airport & MRTS for easy mobility.</p>
      </div>
    </div>
  </div>
</div>


          {/* Investment */}
          <div className="invest-section">
            <div className="invest-wrapper">
              <DynamicTag tag={investment?.heading?.tag} className="invest-heading" data-aos="fade-down" data-aos-delay="50">
                {investment?.heading?.text}
              </DynamicTag>

              <DynamicTag
                tag={investment?.introParagraph?.tag || "div"}
                className="invest-intro"
                data-aos="fade-down"
                data-aos-delay="100"
                html={investment?.introParagraph?.text}
              />

              <DynamicTag
                tag={investment?.contentParagraph?.tag || "div"}
                html={investment?.contentParagraph?.text}
              />

              <div className="invest-container">
                <form
                  className="invest-form"
                  onSubmit={handleSubmit}
                  data-aos="fade-right"
                  data-aos-delay="150"
                >
                  <MdOutlineRealEstateAgent className="invest-form-icon" />
                  <h3>Get Investment Details</h3>

                  <input type="hidden" name="_subject" value="New Investment Enquiry – Akash Infra" />

                  <input type="text" name="name" placeholder="Your Name" required />
                  <input type="email" name="email" placeholder="Email Address" required />
                  <input type="tel" name="phone" placeholder="Phone Number" />

                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LcwaR0sAAAAAGbbnaWrCN20ARIj5DqPmEZg3Tw3"
                    theme="light"
                  />

                  <button type="submit">
                    <FaPaperPlane style={{ marginRight: "6px" }} />
                    Submit
                  </button>
                </form>

                    <div className="invest-right-box" data-aos="fade-left" data-aos-delay="200">

        {/* PARAGRAPH */}
        <div className="invest-content" data-aos="fade-left" data-aos-delay="250">
          <h3>India’s First & Fastest Growing Smart City</h3>
          <p>
            Dholera SIR is one of India’s most ambitious smart city projects, 
            strategically located on the DMIC corridor. With world-class 
            infrastructure, industrial growth, strong government support, and 
            early-stage opportunities, it promises excellent long-term returns 
            for investors. Its rapid development and futuristic master planning 
            make it a high-potential investment hub.
          </p>
        </div>

        {/* IMAGE */}
        <div className="invest-image" data-aos="zoom-in" data-aos-delay="300">
          <img src="/images/why_dholera.png" alt="Invest in Dholera" />
        </div>

      </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Planning;