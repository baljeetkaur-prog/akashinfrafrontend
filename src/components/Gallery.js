import React, { useEffect, useState } from "react";
import "./Gallery.css";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import DynamicTag from "./DynamicTag";

// ✅ Default gallery data
const defaultGallery = {
  seo: {
    title: "Dholera Smart City Gallery",
    description:
      "Explore the gallery of Dholera Smart City showcasing urban planning, infrastructure, green spaces, residential and commercial zones.",
    keywords:
      "Dholera Smart City, Gallery, Urban Planning, Residential Zones, Commercial Zones, Green Spaces, Infrastructure, Smart City Images"
  },
  breadcrumb: { parent: "Home", current: "Gallery" },
  banner: { heading: { tag: "h1", text: "Gallery" }, image: "/images/bg-image.png" },
  mainTitle: { tag: "h2", text: "The Vision of Dholera Captured" },
images: [
  "gallery1.webp","gallery2.png","gallery3.jpeg","gallery4.png",
  "gallery5.webp","gallery6.webp","gallery7.webp","gallery8.webp",
  "gallery9.jpg","gallery10.webp","gallery11.png","gallery12.jpg",
  "gallery13.webp","gallery14.jpg","gallery15.webp","gallery16.jpeg",
  "gallery17.jpg","gallery18.webp","gallery19.jpg","gallery20.webp"
].map((file) => ({
  url: `/images/${file}`, // ✅ FIX HERE
  alt: ""
}))
};

const Gallery = () => {
  const [data, setData] = useState(defaultGallery); // start with default
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
    AOS.refresh();
  }, []);

  // Fetch backend content, overwrite defaults if available
  useEffect(() => {
    axios
      .get(`${API}/api/gallery`)
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) =>
        console.log("Backend not available, showing default gallery")
      );
  }, [API]);

  const { seo, breadcrumb, banner, mainTitle, images } = data;

  return (
    <>
      {/* Dynamic SEO */}
      <Helmet>
        <title>{seo?.title || "Gallery"}</title>
        <meta name="description" content={seo?.description || ""} />
        <meta name="keywords" content={seo?.keywords || ""} />
      </Helmet>

      <div className="gallerymain-page">
        {/* Banner Section */}
        <section
          className="gallerymain-banner"
          style={{ backgroundImage: `url("${banner?.image || "/images/bg-image.png"}")` }}
        >
          <div className="gallerymain-container">
            {/* Only render banner heading if admin provided text */}
            {banner?.heading?.text && (
              <DynamicTag
                tag={banner.heading.tag || "h1"}
                className="gallerymain-heading"
                data-aos="fade-up"
              >
                {banner.heading.text}
              </DynamicTag>
            )}

            <div className="gallerymain-breadcrumb" data-aos="fade-up" data-aos-delay={150}>
              <FaHome className="gallerymain-home-icon" />
              <Link to="/" className="gallerymain-breadcrumb-link">
                {breadcrumb?.parent || "Home"}
              </Link>
              <span className="gallerymain-breadcrumb-text">
                &gt;&gt; {breadcrumb?.current || "Gallery"}
              </span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div
          className="gallerymain-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          }}
        >
          <div className="gallerymain-wrapper">
            {/* Only render main title if admin provided text */}
            {mainTitle?.text && (
              <DynamicTag
                tag={mainTitle.tag || "h2"}
                className="gallerymain-title"
                data-aos="fade-up"
              >
                {mainTitle.text}
              </DynamicTag>
            )}

            {/* Gallery Grid */}
            <div className="gallerymain-grid">
              {images?.slice(0, 20).map((img, index) => (
                <div
                  className="gallerymain-item"
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Gallery ${index + 1}`} // use admin alt if provided
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
