import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [homeOpen, setHomeOpen] = useState(false);

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Admin Panel</h2>

      <nav>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>

        <span className="menu-title">Content</span>

        {/* HOME PAGE */}
        <div
          className="dropdown-title"
          onClick={() => setHomeOpen(!homeOpen)}
        >
          <span>Home Page</span>
          {homeOpen ? <FaChevronDown /> : <FaChevronRight />}
        </div>

        {homeOpen && (
          <div className="dropdown-menu">
            <NavLink to="/admin/pages/carousel">Carousel</NavLink>
            <NavLink to="/admin/pages/about-home-page">About Section</NavLink>
            <NavLink to="/admin/pages/feature-section">Feature Section</NavLink>
            <NavLink to="/admin/pages/featured-investment-home-page">
              Featured Investment
            </NavLink>
            <NavLink to="/admin/pages/process-section-home-page">
              Process Section
            </NavLink>
            <NavLink to="/admin/pages/connectivities-home-page">
              Connectivities
            </NavLink>
            <NavLink to="/admin/pages/team-section-home-page">
              Team Section
            </NavLink>
            <NavLink to="/admin/pages/review-section-home-page">
              Review Section
            </NavLink>
            <NavLink to="/admin/pages/contact-section-home-page">
              Contact Section
            </NavLink>
          </div>
        )}

        {/* OTHER PAGES */}
        <span className="menu-title">Other Pages</span>

        <NavLink to="/admin/pages/about">About</NavLink>
        <NavLink to="/admin/pages/dholera-sir">Dholera SIR</NavLink>
        <NavLink to="/admin/pages/investment-opportunities">
          Investment Opportunities
        </NavLink>
        <NavLink to="/admin/pages/dholera-planning">Planning</NavLink>
        <NavLink to="/admin/pages/pricing">Pricing</NavLink>
        <NavLink to="/admin/pages/gallery">Gallery</NavLink>
        <NavLink to="/admin/pages/contact">Contact</NavLink>

        {/* SIDE SOCIAL ICONS */}
        <NavLink to="/admin/pages/side-social-icons">
          Side Social Media Icons
        </NavLink>

        {/* BLOGS */}
        <span className="menu-title">Blogs</span>
        <NavLink to="/admin/blogs">Blogs</NavLink>

        {/* PAGE BUILDER */}
        <span className="menu-title">Page Builder</span>
        <NavLink to="/admin/page-builder">Add Blog/Detail Page</NavLink>
      

        {/* FORMS */}
        <span className="menu-title">Forms</span>
        <NavLink to="/admin/pages/enquiry-form-queries">Enquiry Form</NavLink>
        <NavLink to="/admin/pages/contact-form-queries">Contact Form</NavLink>
        <NavLink to="/admin/pages/investment-form-queries">Investment Form</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
