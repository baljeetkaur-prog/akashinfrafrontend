import React, { useEffect, useState } from "react";
import "./DholeraSir.css";
import { FaHome, FaIndustry, FaRocket, FaLeaf, FaBriefcase } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import DynamicTag from "./DynamicTag";
import DefaultDholeraSir from "./DefaultDholeraSir"; // ✅ Import default data

const DholeraSir = () => {
  const [data, setData] = useState(DefaultDholeraSir); // use default data
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

  // Fetch backend content if available
  useEffect(() => {
    axios
      .get(`${API}/api/dholera-sir`)
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.error("Backend not available, using default Dholera content"));
  }, [API]);

  const { breadcrumb, heroSection, importance, highlight, connectivity, seo } = data;
  const importanceIcons = [FaIndustry, FaRocket, FaLeaf, FaBriefcase];

  return (
    <>
      <Helmet>
        <title>{seo?.title || "Dholera SIR"}</title>
        <meta name="description" content={seo?.description || ""} />
        <meta name="keywords" content={seo?.keywords || ""} />
        <link rel="canonical" href="https://www.akashinfra.in/dholera-sir" />
      </Helmet>

      <div className="dholera-page">

        {/* Banner */}
       <section
  className="dholera-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
  <div className="dholera-banner-container">
    <DynamicTag
      tag={heroSection?.bannerHeading?.tag}
      className="dholera-banner-heading"
      data-aos="fade-up"
    >
      {heroSection?.bannerHeading?.text}
    </DynamicTag>

    <div className="dholera-breadcrumb" data-aos="fade-up" data-aos-delay="100">
      <FaHome className="dholera-home-icon" />
      <Link to="/" className="dholera-breadcrumb-link">
        {breadcrumb?.parent}
      </Link>
      <span className="dholera-breadcrumb-text">
        &gt;&gt; {breadcrumb?.current}
      </span>
    </div>
  </div>
</section>


        {/* Content */}
        <div
          className="dholera-content-section"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "80px 20px",
          }}
        >
          <div className="dholera-content-wrapper">

            {/* Intro */}
            <div className="dholera-flex">
              <div className="dholera-left">
                <DynamicTag tag={heroSection?.smallHeading?.tag} className="dholera-small-title" data-aos="fade-up">
                  {heroSection?.smallHeading?.text}
                </DynamicTag>
                <DynamicTag tag={heroSection?.bigHeading?.tag} className="dholera-heading-big" data-aos="fade-up" data-aos-delay="100">
                  {heroSection?.bigHeading?.text}
                </DynamicTag>

                {heroSection?.paragraphs?.map((para, i) => (
                  <DynamicTag key={i} tag={para.tag} className="dholera-para" data-aos="fade-up" data-aos-delay={200 + i * 100}>
                    {para.text}
                  </DynamicTag>
                ))}
              </div>

              <div className="dholera-right">
              <img src={heroSection?.image} alt={heroSection?.alt || "Dholera Smart City"} className="dholera-intro-img" />

              </div>
            </div>

            {/* Importance */}
            <div className="dholera-importance" style={{ marginTop: "60px" }}>
              <DynamicTag tag={importance?.heading?.tag} className="dholera-heading-big" data-aos="fade-up">
                {importance?.heading?.text}
              </DynamicTag>
              <DynamicTag tag={importance?.paragraph?.tag} className="dholera-para" data-aos="fade-up" data-aos-delay="100" style={{ marginTop: "10px", marginBottom: "20px" }}>
                {importance?.paragraph?.text}
              </DynamicTag>

 <div className="importance-cards">
  {importance?.cards?.map((card, i) => {
    const Icon = importanceIcons[i] || FaIndustry; // fallback safety

    return (
      <div
        key={i}
        className="importance-card"
        data-aos="fade-up"
        data-aos-delay={200 + i * 100}
      >
        <Icon className="importance-icon" />
        <DynamicTag tag={card.text?.tag}>
          {card.text?.text}
        </DynamicTag>
      </div>
    );
  })}
</div>

            </div>

            {/* Highlights */}
            <div className="dholera-highlight">
              <div className="highlight-left">
               <img src={highlight?.image} alt={highlight?.alt || "Dholera Highlights"} className="highlight-img" />

              </div>
              <div className="highlight-right">
                <ul className="tick-list">
                  {highlight?.tickList?.map((item, i) => (
                    <li key={i} data-aos="fade-up" data-aos-delay={100 + i * 50}>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connectivity */}
       {/* Connectivity & Infrastructure */}
<div className="dholera-connectivity">
 <DynamicTag
  tag={connectivity?.heading?.tag || "h2"}
  className="connectivity-heading"
  data-aos="fade-up"
  html={connectivity?.heading?.text || "Connectivity & Key Infrastructure"}
/>

<DynamicTag
  tag={connectivity?.paragraph?.tag || "p"}
  className="connectivity-para"
  data-aos="fade-up"
  data-aos-delay={100}
  html={connectivity?.paragraph?.text || ""}
/>

  <div className="connectivity-cards">
    {/* Regular cards */}
    {connectivity?.cards?.map((card, i) => (
      <Link
        key={i}
        to={card.link || "#"}
        className="connectivity-card with-icon"
      >
        <div className="icon-wrapper">
          <img
            src={card.image || "/images/default.png"}
            alt={card.alt || card.heading?.text || "Connectivity Image"}
          />
        </div>
<DynamicTag
  tag={card.heading?.tag || "h3"}
  data-aos="fade-up"
  html={card.heading?.text || ""}
/>

<DynamicTag
  tag={card.text?.tag || "p"}
  data-aos="fade-up"
  data-aos-delay={50}
  html={card.text?.text || ""}
/>
      </Link>
    ))}

    {/* Last card */}
       <div
                  className="connectivity-card connectivity-more-card"
                  style={{ backgroundColor: "#f15928", color: "#fff" }}
                >
                  <h4 data-aos="fade-up" className="small-heading">Get in Touch</h4>
                  <h2 data-aos="fade-up" className="big-heading">Enquire About Your Plot / Package</h2>
                  <Link to="/enquiry-form" className="connectivity-link more-link">
                    Enquire Now →
                  </Link>
                </div>

  </div>
</div>


          </div>
        </div>
      </div>
    </>
  );
};

export default DholeraSir;
