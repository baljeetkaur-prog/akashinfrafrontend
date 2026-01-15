import {
  FaFileAlt,
  FaBlog,
  FaPlusSquare,
  FaHome,
  FaEnvelope,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="dashboard-widgets">
        <div className="widget">
          <FaFileAlt className="widget-icon" />
          <Link to="/admin/pages">Detail Pages</Link>
        </div>

        <div className="widget">
          <FaBlog className="widget-icon" />
        <Link to="/admin/blogs">Blogs Posts</Link>
        </div>

        <div className="widget">
          <FaPlusSquare className="widget-icon" />
           <Link to="/admin/page-builder">Add Blog</Link>
        </div>

        <div className="widget">
          <FaHome className="widget-icon" />
          <Link to="/admin/pages/home-page-seo">Home Page</Link>
        </div>

        <div className="widget">
          <FaEnvelope className="widget-icon" />
        <Link to="/admin/pages/contact-form-queries">Contact Form</Link>
        </div>

        <div className="widget">
          <FaClipboardList className="widget-icon" />
        <Link to="/admin/pages/enquiry-form-queries">Enquiry Form</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
