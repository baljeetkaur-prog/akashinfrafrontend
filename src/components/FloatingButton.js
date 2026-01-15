import React from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa"; // icon in front
import "./FloatingButton.css";

const FloatingButtons = () => {
  return (
    <div className="floating-buttons-wrapper">
      {/* Single floating button */}
      <Link to="/enquiry-form" className="floating-strategy-btn">
        <FaPaperPlane style={{ marginRight: "8px" }} />
        Get in Touch
      </Link>
    </div>
  );
};

export default FloatingButtons;
