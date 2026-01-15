import React, { useEffect, useState } from "react";
import "./Opportunities.css";
import {
  FaArrowRight,
  FaCity,
  FaHome,
  FaUsers,
  FaRoute,
  FaPlaneDeparture,
  FaTruck,
  FaLeaf
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import DynamicTag from "./DynamicTag";
import DefaultOpportunities from "./DefaultOpportunities";

const Opportunities = () => {
const [data, setData] = useState(DefaultOpportunities);
  const API = process.env.REACT_APP_APIURL;

  /* Static icons for employment cards */
  const employmentIcons = [
    FaUsers,
    FaCity,
    FaRoute,
    FaPlaneDeparture,
    FaTruck,
    FaLeaf
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

useEffect(() => {
  axios
    .get(`${API}/api/investment-opportunities`)
    .then(res => {
      if (res.data) setData(res.data);
    })
    .catch(err =>
      console.error("Backend not available, using default Opportunities content")
    );
}, [API]);

  const {
    seo,
    breadcrumb,
    banner,
    opporLeft,
    opporRight,
    plottingSection,
    govtSection,
    employmentSection,
    sustainabilitySection,
    ctaSection
  } = data;

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{seo?.title || "Investment Opportunities"}</title>
        <meta name="description" content={seo?.description || ""} />
        <meta name="keywords" content={seo?.keywords || ""} />
      </Helmet>

      <div className="opportunities-page">
        {/* Banner */}
         <section
  className="dholera-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
          <div className="opportunities-container">
            <DynamicTag
              tag={banner?.heading?.tag}
              className="opportunities-heading"
              data-aos="fade-up"
              html={banner?.heading?.text} 
            />

            <div className="opportunities-breadcrumb" data-aos="fade-up" data-aos-delay="100">
              <FaHome className="opportunities-home-icon" />
              <Link to="/" className="opportunities-breadcrumb-link">
                {breadcrumb?.parent}
              </Link>
              <span className="opportunities-breadcrumb-text">
                &gt;&gt; {breadcrumb?.current}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <div
          className="opportunities-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "80px 20px"
          }}
        >
          {/* Opportunities Section */}
          <div className="oppor-wrapper">
            {/* LEFT */}
            <div className="oppor-left">
              <DynamicTag 
                tag={opporLeft?.title?.tag} 
                className="oppor-title" 
                data-aos="fade-up"
                html={opporLeft?.title?.text}
              />

              <div className="oppor-underline" data-aos="fade-up" data-aos-delay="100" />

              {opporLeft?.paragraphs?.map((p, i) => (
                <DynamicTag
                  key={i}
                  tag={p.tag}
                  className="oppor-desc"
                  data-aos="fade-up"
                  data-aos-delay={200 + i * 100}
                  html={p.text} 
                />
              ))}

              {opporLeft?.button?.link && (
                <Link to={opporLeft.button.link} className="oppor-link" data-aos="fade-up" data-aos-delay="400">
                  <button className="oppor-btn">
                    {opporLeft.button.text?.text}
                    <FaArrowRight className="oppor-arrow" />
                  </button>
                </Link>
              )}
            </div>

            {/* RIGHT – Opportunity Cards */}
            <div className="oppor-right">
              {opporRight?.map((card, i) => (
                <div key={i} className="oppor-card">
                  <div className="oppor-img-wrapper">
                    <img 
                      src={card.image?.url} 
                      alt={card.image?.alt || card.title?.text} 
                      className="oppor-img" 
                    />
                  </div>

                  <DynamicTag 
                    tag={card.title?.tag} 
                    className="oppor-card-title" 
                    data-aos="fade-up"
                    html={card.title?.text}
                  />

                  <div className="oppor-card-paras" data-aos="fade-up" data-aos-delay="50">
                    {card.paragraphs?.map((p, j) => (
                      <DynamicTag
                        key={j}
                        tag={p.tag || "p"}
                        html={p.text} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plotting Section */}
          <div className="plotting-wrapper">
            <div className="plotting-img-container">
              <img 
                src={plottingSection?.image?.url} 
                alt={plottingSection?.image?.alt || plottingSection?.bigHeading?.text || "Plotting"}
                className="plotting-img" 
              />
            </div>

            <div className="plotting-content">
              <div className="plotting-left">
                <DynamicTag 
                  tag={plottingSection?.smallHeading?.tag} 
                  className="plotting-small-heading" 
                  data-aos="fade-up"
                  html={plottingSection?.smallHeading?.text}
                />

                <DynamicTag 
                  tag={plottingSection?.bigHeading?.tag} 
                  className="plotting-big-heading" 
                  data-aos="fade-up" 
                  data-aos-delay="100"
                  html={plottingSection?.bigHeading?.text}
                />

                {plottingSection?.button?.link && (
                  <Link
  to={plottingSection.button.link}
  className="plotting-link"
  data-aos="fade-up"
  data-aos-delay="200"
>

                    <button className="plotting-btn">
                      {plottingSection.button.text?.text}
                      <FaArrowRight className="plotting-arrow" />
                    </button>
                  </Link>
                )}
              </div>

              <div className="plotting-right">
                <DynamicTag 
                  tag={plottingSection?.rightParagraph?.tag} 
                  className="plotting-text" 
                  data-aos="fade-up" 
                  data-aos-delay="300"
                  html={plottingSection?.rightParagraph?.text}
                />
              </div>
            </div>
          </div>

          {/* Government Section */}
          <div className="govt-wrapper">
            <div className="govt-left">
              <img 
                src={govtSection?.image?.url} 
                alt={govtSection?.image?.alt || govtSection?.bigHeading?.text || "Government Initiatives"}
                className="govt-img" 
              />
            </div>

            <div className="govt-right">
              <DynamicTag 
                tag={govtSection?.smallHeading?.tag} 
                className="govt-small-heading" 
                data-aos="fade-up"
                html={govtSection?.smallHeading?.text}
              />

              <DynamicTag 
                tag={govtSection?.bigHeading?.tag} 
                className="govt-big-heading" 
                data-aos="fade-up" 
                data-aos-delay="100"
                html={govtSection?.bigHeading?.text}
              />

              {govtSection?.paragraphs?.map((p, i) => (
                <DynamicTag 
                  key={i} 
                  tag={p.tag} 
                  className="oppor-desc" 
                  data-aos="fade-up" 
                  data-aos-delay={200 + i * 100}
                  html={p.text}
                />
              ))}
            </div>
          </div>

          {/* Employment Section */}
          <div className="employment-section">
            <DynamicTag 
              tag={employmentSection?.mainHeading?.tag} 
              className="employment-heading" 
              data-aos="fade-up"
              html={employmentSection?.mainHeading?.text}
            />

            <DynamicTag 
              tag={employmentSection?.subText?.tag} 
              className="employment-subtext" 
              data-aos="fade-up" 
              data-aos-delay="100"
              html={employmentSection?.subText?.text}
            />

            <div className="employment-cards-grid">
              {employmentSection?.cards?.map((card, i) => {
                const Icon = employmentIcons[i] || FaUsers;

                return (
                  <div
                    key={i}
                    className="employment-card"
                    data-aos="fade-up"
                    data-aos-delay={150 + i * 50}
                  >
                    {/* REQUIRED overlays – DO NOT REMOVE */}
                    <div className="emp-card-overlay top-left"></div>
                    <div className="emp-card-overlay bottom-right"></div>

                    {/* Icon */}
                    <div className="card-icon">
                      <Icon />
                    </div>

                    {/* Heading */}
                    <DynamicTag
                      tag={card.heading?.tag}
                      className="card-heading"
                      html={card.heading?.text}
                    />

                    {/* Text */}
                    <DynamicTag
                      tag={card.text?.tag}
                      className="card-text"
                      html={card.text?.text}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sustainability */}
          <div className="sustain-wrapper">
            <div className="sustain-left">
              <DynamicTag 
                tag={sustainabilitySection?.smallHeading?.tag} 
                className="sustain-small-heading" 
                data-aos="fade-up"
                html={sustainabilitySection?.smallHeading?.text}
              />

              <DynamicTag 
                tag={sustainabilitySection?.bigHeading?.tag} 
                className="sustain-big-heading" 
                data-aos="fade-up" 
                data-aos-delay="100"
                html={sustainabilitySection?.bigHeading?.text}
              />

              {sustainabilitySection?.paragraphs?.map((p, i) => (
                <DynamicTag 
                  key={i} 
                  tag={p.tag} 
                  className="sustain-desc" 
                  data-aos="fade-up" 
                  data-aos-delay={200 + i * 100}
                  html={p.text}
                />
              ))}
            </div>

            <div className="sustain-right">
              <img 
                src={sustainabilitySection?.image?.url} 
                alt={sustainabilitySection?.image?.alt || sustainabilitySection?.bigHeading?.text || "Sustainability"}
                className="sustain-img" 
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="invest-cta-section">
            <div className="invest-cta-container">
              {/* LEFT */}
              <div className="invest-cta-left">
                <DynamicTag
                  tag={ctaSection?.heading?.tag}
                  className="invest-cta-heading"
                  data-aos="fade-up"
                  html={ctaSection?.heading?.text}
                />

                {/* paragraph 1 → info */}
                {ctaSection?.paragraphs?.[0] && (
                  <DynamicTag
                    tag={ctaSection.paragraphs[0].tag}
                    className="invest-cta-info"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    html={ctaSection.paragraphs[0].text}
                  />
                )}

                <br />

                {/* paragraph 2 → desc */}
                {ctaSection?.paragraphs?.[1] && (
                  <DynamicTag
                    tag={ctaSection.paragraphs[1].tag}
                    className="invest-cta-desc"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    html={ctaSection.paragraphs[1].text}
                  />
                )}

                {/* paragraph 3 → note (optional) */}
                {ctaSection?.paragraphs?.[2] && (
                  <DynamicTag
                    tag={ctaSection.paragraphs[2].tag}
                    className="invest-cta-note"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    html={ctaSection.paragraphs[2].text}
                  />
                )}

                {ctaSection?.button?.link && (
                  <Link to={ctaSection.button.link} data-aos="fade-up" data-aos-delay="400">
                    <button className="invest-cta-btn">
                      {ctaSection.button.text?.text}
                      <FaArrowRight className="invest-cta-arrow" />
                    </button>
                  </Link>
                )}
              </div>

              {/* RIGHT (circles – REQUIRED for styling) */}
              <div className="invest-cta-right">
                <div className="invest-circle invest-circle-1"></div>
                <div className="invest-circle invest-circle-2"></div>
                <div className="invest-circle invest-circle-3"></div>
                <div className="invest-circle invest-circle-4"></div>
                <div className="invest-circle invest-circle-5"></div>
                <div className="invest-circle invest-circle-6"></div>
                <div className="invest-circle invest-circle-7"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Opportunities;