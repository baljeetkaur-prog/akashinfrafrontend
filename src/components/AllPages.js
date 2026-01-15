// AllPages.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllPages = () => {
  const [pages, setPages] = useState([]);
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    // Fetch all pages from backend
    axios
      .get(`${API}/api/detail-pages`) // Make sure your backend has this endpoint
      .then((res) => setPages(res.data))
      .catch((err) => console.error(err));
  }, [API]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Pages</h1>

      {pages.length === 0 ? (
        <p>No pages found. Create a new page from Page Builder.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Title</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Slug</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {page.title || page.slug}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{page.slug}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {/* Link to PageBuilder with the page slug */}
                  <Link
                    to={`/admin/page-builder/${page.slug}`}
                    style={{
                      padding: "0.3rem 0.5rem",
                      background: "#007bff",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllPages;
