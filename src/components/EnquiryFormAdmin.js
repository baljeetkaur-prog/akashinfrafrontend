import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminContactForm.css"; // ✅ Same CSS

const EnquiryFormAdmin = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 10; // Show 10 enquiries per page
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get(`${API}/api/query/all`);
        setEnquiries(res.data);
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
      }
    };
    fetchEnquiries();
  }, [API]);

  // Pagination logic
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = enquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(enquiries.length / enquiriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="contact-admin">
      <h1>Enquiry Submissions</h1>

      {enquiries.length === 0 ? (
        <p>No enquiries submitted yet.</p>
      ) : (
        <>
          <div className="contact-admin-table-wrapper">
            <table className="contact-admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Investment Type</th>
                  <th>Budget Range</th>
                  <th>Preferred Size</th>
                  <th>Location Preference</th>
                  <th>Message</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {currentEnquiries.map((e, idx) => (
                  <tr key={e._id || idx}>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.phone || "-"}</td>
                    <td>{e.investmentType}</td>
                    <td>{e.budgetRange}</td>
                    <td>{e.preferredSize || "-"}</td>
                    <td>{e.locationPreference || "-"}</td>
                    <td>{e.message || "-"}</td>
                    <td>{new Date(e.createdAt || e.submittedAt).toLocaleString()}</td>
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

export default EnquiryFormAdmin;
