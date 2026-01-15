import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminContactForm.css"; // Reusing the same CSS

const InvestmentFormAdmin = () => {
  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const queriesPerPage = 10; // Show 10 queries per page
  const API = process.env.REACT_APP_APIURL;

  // Fetch all investment queries
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get(`${API}/api/investment/all`);
        setQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch investment queries:", err);
      }
    };
    fetchQueries();
  }, [API]);

  // Pagination calculations
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = queries.slice(indexOfFirstQuery, indexOfLastQuery);
  const totalPages = Math.ceil(queries.length / queriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="contact-admin">
      <h1>Investment Queries</h1>

      {queries.length === 0 ? (
        <p>No investment queries submitted yet.</p>
      ) : (
        <>
          <div className="contact-admin-table-wrapper">
            <table className="contact-admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {currentQueries.map((q, idx) => (
                  <tr key={q._id || idx}>
                    <td>{q.name}</td>
                    <td>{q.email}</td>
                    <td>{q.phone || "-"}</td>
                    <td>{new Date(q.createdAt).toLocaleString()}</td>
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

export default InvestmentFormAdmin;
