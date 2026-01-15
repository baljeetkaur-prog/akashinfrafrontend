import React, { useEffect, useState } from "react";
import "./About.css";
import { FaHandshake, FaHome, FaUserCheck } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { MdOutlineFlag, MdOutlineVisibility } from "react-icons/md";
import { GoLocation } from "react-icons/go";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import DynamicTag from "./DynamicTag";
import DefaultAbout from "./DefaultAbout"; // ✅ Import default data

const About = () => {
  const [data, setData] = useState(DefaultAbout); // start with default data
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

  // Fetch backend content, overwrite defaults if available
  useEffect(() => {
    axios
      .get(`${API}/api/admin-page`)
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(err => console.error("Backend not available, using default About content"));
  }, [API]);

  const {
    breadcrumb,
    heroSection,
    aboutSection,
    mission,
    vision,
    modiVision,
    strengths,
    seo
  } = data;

  return (
    <>
      <Helmet>
        <title>{seo?.title || "About Us"}</title>
        <meta name="description" content={seo?.description || ""} />
        <meta name="keywords" content={seo?.keywords || ""} />
      </Helmet>

      <div className="aboutmain-page">
        {/* Banner */}
        <section
          className="aboutmain-banner"
          style={{ backgroundImage: 'url("/images/bg-image.png")' }}
        >
          <div className="aboutmain-container">
            <DynamicTag
              tag={heroSection?.pageTitle?.tag}
              className="aboutmain-heading"
            >
              {heroSection?.pageTitle?.text}
            </DynamicTag>

            <div className="aboutmain-breadcrumb" data-aos="fade-up" data-aos-delay="100">
              <FaHome className="aboutmain-home-icon" />
              <Link to="/" className="aboutmain-breadcrumb-link">
                {breadcrumb?.parent}
              </Link>
              <span className="aboutmain-breadcrumb-text">
                &gt;&gt; {breadcrumb?.current}
              </span>
            </div>
          </div>
        </section>


        {/* Content */}
        <div
          className="aboutmain-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')"
          }}
        >
          <div className="aboutmain-content-wrapper">

            {/* Left image */}
          <div className="aboutmain-left-image">
  <img src={aboutSection?.image} alt="About Main" />
</div>

            {/* Right content */}
            <div className="aboutmain-right-content">
       <DynamicTag
  tag={aboutSection?.smallHeading?.tag}
  className="aboutmain-small-heading"
>
  {aboutSection?.smallHeading?.text}
</DynamicTag>

<DynamicTag
  tag={aboutSection?.bigHeading?.tag}
  className="aboutmain-big-heading"
>
  {aboutSection?.bigHeading?.text}
</DynamicTag>

{aboutSection?.paragraphs?.map((para, i) => (
  <DynamicTag
    key={i}
    tag={para.tag}
    className="aboutmain-para"
    html={para.text}
  />
))}


              <div className="aboutmain-contact-box">
                <div className="aboutmain-contact-icon">
                  <FiPhoneCall />
                </div>
                <div className="aboutmain-contact-text">
                  <p className="aboutmain-question">{aboutSection?.question}</p>
                  <p className="aboutmain-number">{aboutSection?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="aboutmain-mission-vision-wrapper">
            <div className="aboutmain-card">
              <div className="aboutmain-card-header">
                <div className="aboutmain-card-icon">
                  <MdOutlineFlag className="aboutmain-icon" />
                </div>
              <DynamicTag tag={mission?.heading?.tag} className="aboutmain-card-heading">
  {mission?.heading?.text}
</DynamicTag>

              </div>
<DynamicTag
  tag={mission?.text?.tag}
  className="aboutmain-card-para"
  html={mission?.text?.text}
/>
            </div>

            <div className="aboutmain-card">
              <div className="aboutmain-card-header">
                <div className="aboutmain-card-icon">
                  <MdOutlineVisibility className="aboutmain-icon" />
                </div>
                <DynamicTag
  tag={vision?.heading?.tag}
  className="aboutmain-card-heading"
>
  {vision?.heading?.text}
</DynamicTag>
              </div>
<DynamicTag
  tag={vision?.text?.tag}
  className="aboutmain-card-para"
  html={vision?.text?.text}
/>

            </div>
          </div>

          {/* Modi Vision */}
          <div className="aboutmain-modi-vision-section">
            <div className="aboutmain-container">
              <div className="aboutmain-modi-vision-wrapper">

                <div className="aboutmain-modi-left-content">
                <DynamicTag tag={modiVision?.smallHeading?.tag} className="aboutmain-small-heading">
  {modiVision?.smallHeading?.text}
</DynamicTag>
                 <DynamicTag tag={modiVision?.bigHeading?.tag} className="aboutmain-big-heading">
  {modiVision?.bigHeading?.text}
</DynamicTag>

{modiVision?.paragraphs?.map((para, i) => (
  <DynamicTag
    key={i}
    tag={para.tag}
    className="aboutmain-para"
    html={para.text}
  />
))}


                </div>

              <div className="aboutmain-modi-right-image">
  <img src={modiVision?.image} alt="Modi Vision" />
</div>


              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="aboutmain-strengths-section">
            <div className="aboutmain-container">
              <div className="aboutmain-strengths-wrapper">

                {strengths?.map((card, i) => (
                  <div key={i} className="aboutmain-strength-card">
                    <div className="aboutmain-strength-icon">
                      {i === 0 && <FaHandshake />}
                      {i === 1 && <FaUserCheck />}
                      {i === 2 && <GoLocation />}
                    </div>
                    <DynamicTag
  tag={card.title?.tag}
  className="aboutmain-strength-heading"
>
  {card.title?.text}
</DynamicTag>
<DynamicTag
  tag={card.description?.tag}
  className="aboutmain-strength-para"
  html={card.description?.text}
/>

                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default About;
