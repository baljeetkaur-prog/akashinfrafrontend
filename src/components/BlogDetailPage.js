import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaHome, FaUser } from "react-icons/fa";
import axios from "axios";
import "./BlogsMain.css";
import "./BlogDetailPage.css"

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_APIURL}/api/detail-page/${slug}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err));

    axios.get(`${process.env.REACT_APP_APIURL}/api/blogs`)
      .then(res => setAllBlogs(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  // Update search results when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const filtered = allBlogs.filter(b => {
      const textContent = b.blocks
        ?.map(block => block.content?.map(c => c.text).join(" "))
        .join(" ")
        .toLowerCase() || "";
      return (
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        textContent.includes(searchTerm.toLowerCase())
      );
    });

    setSearchResults(filtered);
  }, [searchTerm, allBlogs]);

  if (!blog) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Blog not found</h2>;
  }

  const bannerBlock = blog.blocks?.find(b => b.type === "banner");
  const bannerHeading = bannerBlock?.heading?.text || blog.title;
  const bannerHeadingTag = bannerBlock?.heading?.tag || "h1";

  const getBlogImage = (b) => {
    if (!b.blocks) return null;
    for (let block of b.blocks) {
      if (block.images?.length > 0 && block.images[0].src) {
        return block.images[0].src;
      }
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Akash Infra</title>
        <meta name="description" content={blog.seo?.description || blog.title} />
        <link rel="canonical" href={`https://www.akashinfra.com/blog/${blog.slug}`} />
      </Helmet>

      {/* Banner */}
      <section
        className="blogsmain-banner"
        style={{ backgroundImage: 'url("/images/bg-image.png")' }}
      >
        <div className="blogsmain-container">
          {React.createElement(
            bannerHeadingTag,
            { className: "blogsmain-heading" },
            bannerHeading
          )}
          <div className="blogsmain-breadcrumb">
            <FaHome className="blogsmain-home-icon" />
            <Link to="/" className="blogsmain-breadcrumb-link">Home</Link>
            <span>&gt;&gt;</span>
            <Link to="/blogs" className="blogsmain-breadcrumb-link">Blogs</Link>
            <span>&gt;&gt;</span>
            <span>{bannerHeading}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div
        className="blogsmain-content"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')"
        }}
      >
        <div className="blogsmain-content-wrapper">
          {/* MAIN CONTENT */}
          <div className="blogdetail-main">

            {/* Blog Image */}
            {getBlogImage(blog) && (
              <img
                src={getBlogImage(blog)}
                alt={blog.title}
                className="blogdetail-image"
              />
            )}

            {/* META ROW */}
            <div className="blogdetail-meta">
              <div className="blogdetail-meta-left">
                <img src="/images/logo.png" alt="Akash Infra" />
                <span>Akash Infra</span>
              </div>
              <div className="blogdetail-meta-right">
                <FaUser />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <h1 className="blog-detail-title">{blog.title}</h1>

            {/* Blog Content */}
            <div className="bdp-content-container">
              {blog.blocks?.map((block, i) =>
                block.content?.map((c, idx) => {
                  if (c.type === "heading") {
                    return React.createElement(
                      c.tag || "h2",
                      { key: `${i}-${idx}`, className: "bdp-big-heading-text" },
                      c.text
                    );
                  }
                  if (c.type === "paragraph") {
                    return React.createElement(
                      c.tag || "p",
                      {
                        key: `${i}-${idx}`,
                        className: "bdp-para-text",
                        dangerouslySetInnerHTML: { __html: c.text }
                      }
                    );
                  }
                  if (c.type === "list") {
                    const isOrdered = c.tag === "ol";
                    return React.createElement(
                      c.tag || "ul",
                      {
                        key: `${i}-${idx}`,
                        className: `bdp-list-text ${isOrdered ? "ol" : ""}`,
                        dangerouslySetInnerHTML: {
                          __html: (c.items || []).map(li => `<li>${li}</li>`).join("")
                        }
                      }
                    );
                  }
                  return null;
                })
              )}
            </div>

          </div>

          {/* SIDEBAR */}
          <aside className="blogsmain-sidebar blogdetail-sidebar">

            {/* SEARCH */}
            <div className="blogsmain-sidebar-box">
              <h4>Search Blogs</h4>
              <input
                type="text"
                placeholder="Search blogs..."
                className="blogsmain-search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              {/* SEARCH RESULTS */}
            {/* SEARCH RESULTS */}
{searchTerm && (
  <div className="blogsmain-search-results">
    {searchResults.length > 0 ? (
      searchResults.map((b, i) => (
        <Link
          key={i}
          to={`/blog/${b.slug}`}
        >
          {getBlogImage(b) && (
            <img
              src={getBlogImage(b)}
              alt={b.title}
            />
          )}
          <span>{b.title}</span>
        </Link>
      ))
    ) : (
      <p>No results found</p>
    )}
  </div>
)}

            </div>

            {/* RECENT BLOGS (static) */}
            <div className="blogsmain-sidebar-box">
              <h4>Recent Blogs</h4>
              {[...allBlogs]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((b, i) => {
                  const img = getBlogImage(b);
                  return (
                    <Link
                      key={i}
                      to={`/blog/${b.slug}`}
                      className="blogsmain-recent-item"
                    >
                      {img && (
                        <img
                          src={img}
                          alt={b.title}
                          className="blogsmain-recent-img"
                        />
                      )}
                      <span>{b.title}</span>
                    </Link>
                  );
                })}
            </div>

            {/* TAGS */}
            <div className="blogsmain-sidebar-box">
              <h4>Tags</h4>
              <div className="blogdetail-tags-wrapper">
                {(blog.tags || [])
                  .flatMap(t => t.split(",").map(tag => tag.trim()))
                  .map((tag, i) => (
                    <Link
                      key={i}
                      to={`/blogs/tag/${tag}`}
                      className="blogdetail-tag-badge"
                    >
                      {tag}
                    </Link>
                  ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
