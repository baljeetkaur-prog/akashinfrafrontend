import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_APIURL}/api/detail-pages`
        );
        setPages(res.data);
      } catch (err) {
        console.error("Failed to load pages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) return <p>Loading pages...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Pages</h1>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td>{page.title}</td>
              <td>/{page.slug}</td>
              <td>{new Date(page.createdAt).toLocaleDateString()}</td>
              <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/admin/pages/edit/${page.slug}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PagesList;
