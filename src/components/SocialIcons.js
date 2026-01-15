import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import "./SocialIcons.css";

const DEFAULT_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  whatsapp: "https://wa.me/1234567890",
};

const SocialIcons = () => {
  const [links, setLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_APIURL}/api/social-links`)
      .then(res => {
        // only update if API returns data
        if (res.data) setLinks(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch social links, using defaults", err);
        // links will remain default
      });
  }, []);

  return (
    <div className="social-icons-container">
      {links.facebook && (
        <a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FaFacebookF />
        </a>
      )}

      {links.instagram && (
        <a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FaInstagram />
        </a>
      )}

      {links.whatsapp && (
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FaWhatsapp />
        </a>
      )}
    </div>
  );
};

export default SocialIcons;
