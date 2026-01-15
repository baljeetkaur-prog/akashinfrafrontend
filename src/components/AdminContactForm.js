import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminContactForm.css"; // ✅ New CSS file

const AdminContactForm = () => {
  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const queriesPerPage = 10; // Show 10 queries per page
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get(`${API}/api/contact-queries/all`);
        setQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch contact queries:", err);
      }
    };
    fetchQueries();
  }, [API]);

  // Calculate pagination
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = queries.slice(indexOfFirstQuery, indexOfLastQuery);
  const totalPages = Math.ceil(queries.length / queriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="contact-admin">
      <h1>Contact Queries</h1>

      {queries.length === 0 ? (
        <p>No queries submitted yet.</p>
      ) : (
        <>
          <div className="contact-admin-table-wrapper">
            <table className="contact-admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {currentQueries.map((q, idx) => (
                  <tr key={q._id || idx}>
                    <td>{q.name}</td>
                    <td>{q.email}</td>
                    <td>{q.phone || "-"}</td>
                    <td>{q.message}</td>
                    <td>{new Date(q.createdAt || q.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="contact-admin-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminContactForm;
