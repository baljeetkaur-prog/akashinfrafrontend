import React, { useEffect, useState } from "react";
import "./Pricing.css";
import { FaHome, FaIndustry, FaRegBuilding, FaStore } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import DynamicTag from "./DynamicTag";
import DefaultPricing from "./DefaultPricing";

const Pricing = () => {
 const [data, setData] = useState(DefaultPricing);
  const API = process.env.REACT_APP_APIURL;


  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

useEffect(() => {
  axios
    .get(`${API}/api/pricing`)
    .then(res => {
      if (res.data && Object.keys(res.data).length > 0) {
        setData(res.data); // overwrite defaults
      }
    })
    .catch(err =>
      console.error("Backend not available, using default Pricing content")
    );
}, [API]);

  const { seo, breadcrumb, banner, introSection, pricingCards, ctaSection } =
    data;

  // STATIC ICONS (order-based)
  const cardIcons = [FaRegBuilding, FaStore, FaIndustry];

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{seo?.title}</title>
        <meta name="description" content={seo?.description} />
        <meta name="keywords" content={seo?.keywords} />
      </Helmet>

      <div className="pricing-page">
        {/* Banner */}
             <section
  className="pricing-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
          <div className="pricing-container" data-aos="fade-up">
            <DynamicTag
              tag={banner?.heading?.tag}
              className="pricing-heading"
            >
              {banner?.heading?.text}
            </DynamicTag>

            <div className="pricing-breadcrumb">
              <FaHome className="pricing-home-icon" />
              <Link to="/" className="pricing-breadcrumb-link">
                {breadcrumb?.parent}
              </Link>
              <span className="pricing-breadcrumb-text">
                &gt;&gt; {breadcrumb?.current}
              </span>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <div
          className="pricing-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          }}
        >
          <div className="pricing-content-wrapper">
            <div className="pricing-left">
              <DynamicTag
                tag={introSection?.smallHeading?.tag}
                className="pricing-small-heading"
                data-aos="fade-up"
              >
                {introSection?.smallHeading?.text}
              </DynamicTag>

              <DynamicTag
                tag={introSection?.bigHeading?.tag}
                className="pricing-main-heading"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {introSection?.bigHeading?.text}
              </DynamicTag>

              {introSection?.paragraphs?.map((p, i) => (
                <DynamicTag
                  key={i}
                  tag={p.tag}
                  className="pricing-intro-para"
                  data-aos="fade-up"
                  data-aos-delay={200 + i * 100}
                    dangerouslySetInnerHTML={{ __html: p.text }}
                >
                  {p.text}
                </DynamicTag>
              ))}
            </div>

            <div className="pricing-right" data-aos="fade-up" data-aos-delay="150">
              <img
    src={introSection.image.url}
    alt={introSection.image.alt || "Pricing Intro"}
  />
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-cards-section">
            <div className="pricing-cards-wrapper">
              {pricingCards?.map((card, i) => {
                const Icon = cardIcons[i] || FaRegBuilding;

                return (
                  <div
                    key={i}
                    className={`pricing-card ${
                      i === 1 ? "center-card" : ""
                    }`}
                    data-aos="fade-up"
                    data-aos-delay={i * 150}
                  >
                    <div
                      className={`pricing-card-top ${
                        i === 1 ? "orange-bg" : "black-bg"
                      }`}
                    >
                      <div
                        className={`pricing-card-icon ${
                          i === 1 ? "black-circle" : "white-circle"
                        }`}
                      >
                        <Icon />
                      </div>

                      <DynamicTag
                        tag={card?.title?.tag}
                        className="pricing-card-title"
                      >
                        {card?.title?.text}
                      </DynamicTag>

                      <div className="pricing-card-price">
                        <span className="price-label">
                          {card?.price?.label}
                        </span>
                        <span className="price-value">
                          {card?.price?.value}
                        </span>
                      </div>
                    </div>

                    <div className="pricing-card-body">
                      <DynamicTag
                        tag={card?.planName?.tag}
                        className="pricing-card-plan-name"
                      >
                        {card?.planName?.text}
                      </DynamicTag>

                      <ul className="pricing-card-points">
                        {card?.points?.map((pt, idx) => (
                  <li key={idx}>
  <FiCheck />
  <span
    dangerouslySetInnerHTML={{ __html: pt.text }}
  />
</li>

                        ))}
                      </ul>

                      <Link to={card?.button?.link} className="btn-link">
                        <button className="pricing-card-btn">
                          {card?.button?.text?.text}
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <section className="pricing-cta-section" data-aos="fade-up">
            <div className="pricing-cta-container">
              <div className="pricing-cta-left">
                <DynamicTag tag={ctaSection?.heading?.tag}>
                  {ctaSection?.heading?.text}
                </DynamicTag>

 <DynamicTag
  tag={ctaSection?.paragraph?.tag}
  html={ctaSection?.paragraph?.text}
/>


              </div>

              <div className="pricing-cta-right" data-aos-delay="150">
                {ctaSection?.buttons?.map((btn, i) =>
                  btn.link?.includes(".pdf") ? (
                    <a
                      key={i}
                      href={btn.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        className={`cta-btn ${
                          i === 0 ? "white-btn" : "outline-btn"
                        }`}
                      >
                        {btn.text?.text}
                      </button>
                    </a>
                  ) : (
                    <Link key={i} to={btn.link}>
                      <button
                        className={`cta-btn ${
                          i === 0 ? "white-btn" : "outline-btn"
                        }`}
                      >
                        {btn.text?.text}
                      </button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Pricing;
