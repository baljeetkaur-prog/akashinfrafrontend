import React, { useEffect, useState } from "react";
import "./ReviewsSection.css";
import { FaStar } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

/* =====================
   DYNAMIC TAG
===================== */
const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "small"];
// ✅ Default content (shown if backend sleeps)
const defaultReviewsSection = {
  heading: { tag: "h2", text: "Hear From Our Clients" },
  description: {
    tag: "p",
    text: " Real feedback from investors who made smart decisions early in Dholera SIR. Their experience speaks for the growth, transparency, and trust we deliver."
  },
  reviews: [
    {
      rating: 5,
      reviewText: { text: "“One of the most professional teams I’ve worked with. The plot documentation, site visit, and transparency were top-notch Highly recommend!”" },
      author: "Amit Sharma"
    },
    {
      rating: 5,
      reviewText: { text: " “The investment process was smooth and transparent. Dholera is truly the future, and I’m glad I made the decision early.”" },
      author: "Neha Verma"
    }
  ],
  mainImage: {
    url: "/images/ABCD_building.png",
    alt: "Happy customers"
  },
  overlay: {
    ratingText: { tag: "h3", text: "4.9 / 5 Positive Ratings" },
    subText: { tag: "p", text: "Based on 12,500+ reviews" },
    userImages: [
      { url: "/images/test-new1.png" },
      { url: "/images/test-new2.png" },
      { url: "/images/test-new3.png" }
    ]
  },
  brands: [
    { url: "/images/brand1.webp" },
    { url: "/images/brand2.png" },
    { url: "/images/brand3.png" }, 
      { url: "/images/brand4.png" }, 
        { url: "/images/brand5.png" }, 
          { url: "/images/brand6.png" }, 
            { url: "/images/brand7.png" }, 
              { url: "/images/brand8.jpg" }, 
                { url: "/images/brand9.webp" }, 
                  { url: "/images/brand10.png" }, 
    
  ]
};


const DynamicTag = ({ tag, className, children, ...rest }) => {
  const Tag = validTags.includes(tag) ? tag : "p";
  return <Tag className={className} {...rest}>{children}</Tag>;
};

const ReviewsSection = () => {
 const [reviewsData, setReviewsData] = useState(defaultReviewsSection);
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);
useEffect(() => {
  axios
    .get(`${API}/api/reviews-section`)
    .then(res => {
      if (res.data) setReviewsData(res.data);
    })
    .catch(() =>
      console.log("Backend not available, showing default reviews content")
    );
}, [API]);

  const {
    heading,
    description,
    reviews = [],
    mainImage,              // expected: { url: string, alt?: string, publicId?: string }
    overlay = {},
    brands = []             // array of { url: string, alt?: string, ... }
  } = reviewsData;

  // Extract overlay user images (limit to 3 for layout)
  const userImages = overlay?.userImages?.slice(0, 3) || [];

  return (
    <section className="reviews-section">
      <div
        className="reviews-left-bg"
        style={{ backgroundImage: "url('/images/bg-img2.png')", opacity: 0.2 }}
      />

      <div className="reviews-container">
        <div className="reviews-top-row">
          {/* LEFT TEXT BLOCK */}
          <div className="reviews-text-block">
            <DynamicTag tag={heading?.tag} data-aos="fade-up">
              {heading?.text || "What Our Customers Say"}
            </DynamicTag>

            <DynamicTag
              tag={description?.tag}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {description?.text || ""}
            </DynamicTag>

            {/* REVIEW CARDS ROW */}
            <div className="review-cards-row">
              {/* REVIEW CARD 1 — NORMAL */}
              {reviews[0] && (
                <div className="review-card">
                  <div className="review-stars" data-aos="fade-up">
                    {[...Array(reviews[0].rating || 5)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                  <p className="review-text" data-aos="fade-up" data-aos-delay="100">
                    {reviews[0].reviewText?.text || ""}
                  </p>
                  <h4 className="review-author" data-aos="fade-up" data-aos-delay="200">
                    – {reviews[0].author || "Anonymous"}
                  </h4>
                </div>
              )}

              {/* REVIEW CARD 2 — OVERLAY STYLE */}
              {reviews[1] && (
                <div className="review-card review-card-overlay">
                  <div className="review-stars" data-aos="fade-up">
                    {[...Array(reviews[1].rating || 5)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                  <p className="review-text" data-aos="fade-up" data-aos-delay="100">
                    {reviews[1].reviewText?.text || ""}
                  </p>
                  <h4 className="review-author" data-aos="fade-up" data-aos-delay="200">
                    – {reviews[1].author || "Anonymous"}
                  </h4>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE + OVERLAY */}
          <div className="reviews-image-box">
            {mainImage?.url && (
              <img
                src={mainImage.url}
                className="reviews-main-img"
                alt={mainImage.alt || "Happy customers sharing their experience"}
              />
            )}

            {/* BLACK GLASS OVERLAY */}
            <div className="reviews-image-overlay">
              <div className="overlay-stars" data-aos="fade-up">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="overlay-star-icon" />
                ))}
              </div>

              <DynamicTag
                tag={overlay?.ratingText?.tag || "h3"}
                className="overlay-rating"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {overlay?.ratingText?.text || "4.9 / 5"}
              </DynamicTag>

              <DynamicTag
                tag={overlay?.subText?.tag || "p"}
                className="overlay-subtext"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {overlay?.subText?.text || "Based on 1000+ reviews"}
              </DynamicTag>

              {/* USER AVATAR STACK */}
              {userImages.length > 0 && (
                <div className="overlay-user-stack" data-aos="fade-up" data-aos-delay="300">
                  {userImages[0]?.url && (
                    <img
                      src={userImages[0].url}
                      className="overlay-user-img user-top"
                      alt={userImages[0].alt || "Satisfied customer avatar 1"}
                    />
                  )}
                  {userImages[1]?.url && (
                    <img
                      src={userImages[1].url}
                      className="overlay-user-img user-mid"
                      alt={userImages[1].alt || "Satisfied customer avatar 2"}
                    />
                  )}
                  {userImages[2]?.url && (
                    <img
                      src={userImages[2].url}
                      className="overlay-user-img user-bottom"
                      alt={userImages[2].alt || "Satisfied customer avatar 3"}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BRANDS MARQUEE */}
      {brands.length > 0 && (
        <div className="brands-marquee-wrapper">
          <div className="brands-marquee">
            <div className="brands-track">
              {[...brands, ...brands].map((brand, i) => (
                brand?.url && (
                  <img
                    key={i}
                    src={brand.url}
                    alt={brand.alt || `Trusted brand ${i + 1}`}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;