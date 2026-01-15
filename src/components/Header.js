import "./Header.css";
import { FiPhoneCall, FiMenu, FiX } from "react-icons/fi"; // Added FiX
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Hamburger - visible only on mobile */}
        <div className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu className="hamburger-icon" />
        </div>

        {/* Left Logo */}
        <div className="header-logo">
          <img src="/images/logo.png" alt="Logo" />
        </div>

        {/* Center Navigation - desktop only */}
        <nav className="header-nav">
         <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? "active-link" : ""}>About</NavLink>
          <NavLink to="/dholera-SIR" className={({ isActive }) => isActive ? "active-link" : ""}>Dholera Sir</NavLink>
          <NavLink to="/investment-opportunities" className={({ isActive }) => isActive ? "active-link" : ""}>Investment Opportunities</NavLink>
          <NavLink to="/planning" className={({ isActive }) => isActive ? "active-link" : ""}>Planning</NavLink>
          <NavLink to="/pricing" className={({ isActive }) => isActive ? "active-link" : ""}>Pricing</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? "active-link" : ""}>Gallery</NavLink>
           <NavLink to="/contact-us" className={({ isActive }) => isActive ? "active-link" : ""}>Contact</NavLink>
              <NavLink to="/blogs" className={({ isActive }) => isActive ? "active-link" : ""}>Blogs</NavLink>
        </nav>

        {/* Right Call Section */}
        <div className="header-call">
          <FiPhoneCall className="call-icon" />
          <div className="call-text">
            <span className="call-label">Call Us Now:</span>
            <span className="call-number">+91-9915483066</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/images/footer.png" alt="Logo" />
          <div
            className={`sidebar-close ${isMobileMenuOpen ? "rotate" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX className="sidebar-close-icon" />
          </div>
        </div>

        <div className="sidebar-nav">
           <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
           <NavLink to="/about-us" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>About</NavLink>
          <NavLink to="/dholera-SIR" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Dholera Sir</NavLink>
          <NavLink to="/investment-opportunities" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Investment Opportunities</NavLink>
          <NavLink to="/planning" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Planning</NavLink>
          <NavLink to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Pricing</NavLink>
          <NavLink to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Gallery</NavLink>
            <NavLink to="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Contact</NavLink>
              <NavLink to="/blogs" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Blogs</NavLink>
             
        </div>
      </div>
    </header>
  );
};

export default Header;
