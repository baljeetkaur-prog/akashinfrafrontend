import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Helmet } from "react-helmet";
import "./DynamicDetailPage.css";

const DynamicDetailPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const API = process.env.REACT_APP_APIURL;

  const HtmlRender = ({ tag = "p", html = "", className }) => {
    const Tag = tag;
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  };

  useEffect(() => {
    axios
      .get(`${API}/api/detail-page/${slug}`)
      .then((res) => setPage(res.data))
      .catch((err) => console.error(err));
  }, [slug, API]);

  const toggleFAQ = (id) => setOpenFAQ(openFAQ === id ? null : id);

  const buildFaqSchema = (blocks) => {
    const faqItems = blocks
      ?.filter((b) => b.type === "faq")
      .flatMap((b) =>
        (b.faqs || []).map((faq) => ({
          "@type": "Question",
          name: faq.question?.trim(),
          acceptedAnswer: { "@type": "Answer", text: faq.answer?.trim() },
        }))
      )
      .filter((q) => q.name && q.acceptedAnswer.text);

    if (!faqItems.length) return null;
    return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems };
  };

  if (!page) return <div>Loading...</div>;

  return (
    <div className="ddp-page">
      <Helmet>
        {buildFaqSchema(page.blocks) && (
          <script type="application/ld+json">
            {JSON.stringify(buildFaqSchema(page.blocks))}
          </script>
        )}
      </Helmet>

      {/* Banner */}
      {page.blocks.map((block, i) =>
        block.type === "banner" ? (
          <section
            key={i}
            className="ddp-banner"
            style={{ backgroundImage: 'url("/images/bg-image.png")' }}
          >
            <div className="ddp-container">
              <h1 className="ddp-heading">{block.heading?.text || ""}</h1>
              <div className="ddp-breadcrumb">
                <FaHome className="ddp-home-icon" />
                <Link to="/" className="ddp-breadcrumb-link">
                  Home
                </Link>
                <span className="ddp-breadcrumb-text">
                  &gt;&gt; {block.subHeading || block.heading?.text}
                </span>
              </div>
            </div>
          </section>
        ) : null
      )}

      {/* Main Content */}
      <div
        className="ddp-content-container"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          backgroundSize: "cover",
        }}
      >
        {page.blocks.map((block, i) => {
          if (block.type === "section") {
            return (
              <section key={i} className="ddp-section-content">
                <div
                  className={`ddp-content-wrapper ${
                    block.imagePosition !== "none" && block.images?.length > 0 ? "side-by-side" : ""
                  } position-${block.imagePosition}`}
                >
                  <div className="ddp-left-content-text">
                    {block.content?.map((item, idx) => {
                      if (item.type === "heading")
                        return <HtmlRender key={idx} tag={item.tag || "h2"} html={item.text} />;
                      if (item.type === "paragraph")
                        return <HtmlRender key={idx} tag={item.tag || "p"} html={item.text} className="ddp-para-text" />;
                      if (item.type === "list") {
                        const Tag = item.tag || "ul";
                        return (
                          <Tag
                            key={idx}
                            dangerouslySetInnerHTML={{
                              __html: (item.items || []).map((li) => `<li>${li}</li>`).join(""),
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Images */}
                  {block.images?.length > 0 && block.imagePosition !== "none" && (
                    <div className={`ddp-right-image layout-${block.imageLayout}`}>
                      {block.images.map((img, imgIdx) => (
                        <img key={imgIdx} src={img.src} alt={img.alt || ""} />
                      ))}
                    </div>
                  )}
                  {block.images?.length > 0 && block.imagePosition === "none" && (
                    <div className={`ddp-images layout-${block.imageLayout}`}>
                      {block.images.map((img, imgIdx) => (
                        <img key={imgIdx} src={img.src} alt={img.alt || ""} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (block.type === "faq") {
            return (
              <div key={i} className="ddp-faq-section">
                <h2 className="ddp-big-heading">{block.heading?.text || "FAQs"}</h2>
                {block.faqs?.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`faq-item ${openFAQ === idx ? "open" : ""}`}
                    onClick={() => toggleFAQ(idx)}
                  >
                    <div className="faq-header">
                      <IoChevronDown className="faq-icon" />
                      <h3>{faq.question}</h3>
                    </div>
                    {openFAQ === idx && <p className="faq-answer">{faq.answer}</p>}
                  </div>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default DynamicDetailPage;
