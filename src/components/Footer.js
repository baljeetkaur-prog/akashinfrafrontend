import { Link } from "react-router-dom";
import "./Footer.css";
import { 
  FaInstagram, 
  FaFacebookF, 
  FaSnapchatGhost, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope 
} from "react-icons/fa";

const Footer = () => {
  return (
<footer className="footer">

  <div className="footer-bg" style={{ backgroundImage: "url('/images/bg-image.png')" }}>
    <div className="footer-overlay">
      <div className="footer-container">

        {/* COLUMN 1 — LOGO */}
        <div className="footer-col footer-left">
          <img src="/images/footer.png" alt="Akash Infra Logo" className="footer-logo" />

          <p className="footer-desc">
            Akash Infra is committed to providing exceptional real estate services,
            transparency, and long-term value to our investors.
          </p>

    <Link to="/about-us" className="footer-about-btn">
  About Us
</Link>
        </div>

        {/* COLUMN 2 — QUICK LINKS */}
        <div className="footer-col footer-links">
          <h3>Quick Links</h3>
  <ul>
  <li><Link to="/">Home</Link></li>
  <li><Link to="/about-us">About</Link></li>
  <li><Link to="/dholera-SIR">Dholera SIR</Link></li>
  <li><Link to="/dholera-smart-infrastructure">Infrastructure</Link></li>
  <li><Link to="/planning">Planning</Link></li>
  <li><Link to="/investment-opportunities">Investments</Link></li>
  <li><Link to="/gallery">Gallery</Link></li>
  <li><Link to="/contact-us">Contact</Link></li>
</ul>

        </div>

        {/* COLUMN 3 — LOCATIONS */}
        <div className="footer-col footer-location-col">
          <h3>Locations</h3>

          <div className="footer-location">
            <FaMapMarkerAlt className="footer-icon" />
            <p>
              Office – Akash Infra,<br />
              Near Bollywood Gali,<br />
              Patiala-Chandigarh highway, Zirakpur
            </p>
          </div>

          <div className="footer-location">
            <FaMapMarkerAlt className="footer-icon" />
            <p>
              Property Bazaar – DSS-120,<br />
              Ground Floor<br />
              Office – Mohali City Centre, Aerocity, Mohali
            </p>
          </div>
        </div>

        {/* COLUMN 4 — CONTACT */}
        <div className="footer-col footer-contact">
          <h3>Contact</h3>

          <div className="footer-line">
            <FaEnvelope className="footer-icon" />
            <p>akashinfra74@gmail.com</p>
          </div>

          <div className="footer-line">
            <FaPhoneAlt className="footer-icon" />
            <p>+91-9915483066, +91-9010040001</p>
          </div>

          {/* SOCIAL ICONS MOVED HERE */}
      {/* SOCIAL ICONS MOVED HERE */}
<div className="footer-socials">
  <a 
    href="https://www.instagram.com/akash.infra/" 
    target="_blank" 
    rel="noopener noreferrer"

  >
    <FaInstagram />
  </a>
  <a 
    href="https://www.facebook.com/Akash.Infraa/" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <FaFacebookF />
  </a>
  <a 
    href="https://wa.me/919915483066" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <FaWhatsapp />
  </a>
</div>

        </div>

      </div>
    </div>
  </div>

  {/* FOOTER BOTTOM */}
  <div className="footer-bottom">
    <p>
      © 2025 Akash Infra. Developed by{" "}
      <a href="https://socialsimba.com/" target="_blank" rel="noopener noreferrer">
        Social Simba
      </a>
    </p>
  </div>

</footer>

  );
};

export default Footer;
