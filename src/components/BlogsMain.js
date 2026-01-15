import React, { useEffect, useState } from "react";
import "./BlogsMain.css";
import { FaHome, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const BLOGS_PER_PAGE = 9;

const BlogsMain = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const allCategories = [
    ...new Set(
      blogs
        .map(blog => blog.category || "Uncategorised")
        .filter(Boolean)
    )
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_APIURL}/api/blogs`)
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter blogs by category first
  const categoryFilteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter(blog => (blog.category || "Uncategorised") === selectedCategory);

  // Then filter by search term
  const filteredBlogs = categoryFilteredBlogs.filter(blog => {
    if (!searchTerm) return true;
    const snippet = blog.blocks
      ?.map(b => b.content?.map(c => c.text).join(" "))
      .join(" ")
      .toLowerCase() || "";
    return (
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

  // Get first 2-3 lines of text from section blocks
  const getBlogSnippet = (blog, maxChars = 90) => {
    if (!blog.blocks) return "";
    const sectionBlock = blog.blocks.find(b => b.type === "section" && b.content?.length > 0);
    if (!sectionBlock) return "";
    const combinedText = sectionBlock.content.map(c => c.text || "").join(" ");
    return combinedText.length > maxChars ? combinedText.substring(0, maxChars) : combinedText;
  };

  // Get first image from any block
  const getBlogImage = blog => {
    if (!blog.blocks) return null;
    for (let block of blog.blocks) {
      if (block.images?.length > 0 && block.images[0].src) {
        return block.images[0].src;
      }
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>Blogs | Akash Infra</title>
        <meta
          name="description"
          content="Latest blogs, insights and updates from Akash Infra"
        />
        <link rel="canonical" href="https://www.akashinfra.com/blogs" />
      </Helmet>

      <div className="blogsmain-page">
        {/* Banner */}
        <section
          className="blogsmain-banner"
          style={{ backgroundImage: 'url("/images/bg-image.png")' }}
        >
          <div className="blogsmain-container">
            <h1 className="blogsmain-heading">Our Blogs</h1>
            <div className="blogsmain-breadcrumb">
              <FaHome className="blogsmain-home-icon" />
              <Link to="/" className="blogsmain-breadcrumb-link">Home</Link>
              <span>&gt;&gt; Blogs</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <div
          className="blogsmain-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
          }}
        >
          <div className="blogsmain-content-wrapper">
            {/* Blogs Grid */}
            <div className="blogsmain-blogs-area">
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog, i) => (
                  <div key={i} className="blogsmain-blog-card">
                    {getBlogImage(blog) && (
                      <div className="blogsmain-blog-image-wrapper">
                        <img
                          src={getBlogImage(blog)}
                          alt={blog.title}
                          className="blogsmain-blog-image"
                        />
                      </div>
                    )}

                    <div
                      className="blogsmain-blog-body"
                      style={{ paddingTop: getBlogImage(blog) ? "20px" : "10px" }}
                    >
                      {/* Meta Row */}
                      <div className="blogsmain-meta-row">
                        <div className="blogsmain-meta-left">
                          <img
                            src="/images/logo.png"
                            alt="Akash Infra"
                            className="blogsmain-author-logo"
                          />
                          <span>Akash Infra</span>
                        </div>

                        <div className="blogsmain-meta-right">
                          <span className="blogsmain-date-icon"><FaRegCalendarAlt /></span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="blogsmain-blog-title">{blog.title}</h3>

                      {/* Short Description */}
                      <p className="blogsmain-blog-snippet">
                        {getBlogSnippet(blog, 90)}
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="blogsmain-readmore-inline"
                        >
                          ...Read More
                        </Link>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="blogsmain-no-blogs">
                  {searchTerm ? "No blogs found matching your search" : "No Blogs Added Yet"}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && currentBlogs.length > 0 && (
                <div className="blogsmain-pagination">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`blogsmain-page-btn ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="blogsmain-sidebar">
              {/* Search Input */}
              <div className="blogsmain-sidebar-box">
                <h4>Search</h4>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="blogsmain-search-input"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Recent Blogs (static) */}
              <div className="blogsmain-sidebar-box">
                <h4>Recent Blogs</h4>
                {blogs.length > 0 ? (
                  [...blogs]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((b, i) => (
                      <Link key={i} to={`/blog/${b.slug}`} className="blogsmain-recent-item">
                        {getBlogImage(b) && (
                          <img
                            src={getBlogImage(b)}
                            alt={b.title}
                            className="blogsmain-recent-img"
                          />
                        )}
                        <span>{b.title}</span>
                      </Link>
                    ))
                ) : (
                  <p>No Blogs Yet</p>
                )}
              </div>

              {/* Categories */}
              <div className="blogsmain-sidebar-box">
                <h4>Blog Categories</h4>
                <ul>
                  <li
                    className={selectedCategory === "All" ? "active" : ""}
                    onClick={() => { setSelectedCategory("All"); setCurrentPage(1); }}
                  >
                    All
                  </li>
                  {allCategories.map((cat, i) => (
                    <li
                      key={i}
                      className={selectedCategory === cat ? "active" : ""}
                      onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsMain;
