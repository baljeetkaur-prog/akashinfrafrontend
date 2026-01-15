import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_APIURL}/api/blogs`
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Blogs</h1>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Category</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>/blog/{blog.slug}</td>
              <td>{blog.category || "Uncategorised"}</td>
              <td>
                {new Date(blog.createdAt).toLocaleDateString()}
              </td>
              <td>
                <Link to={`/admin/pages/edit/${blog.slug}`}>
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

export default BlogList;
