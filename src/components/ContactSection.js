import React, { useEffect, useState } from "react";
import "./ContactSection.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"; // ← add FaMapMarkerAlt if needed
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

/* =====================
   DYNAMIC TAG
===================== */
const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];
// ✅ Default Contact Content (fallback)
const defaultContact = {
  backgroundImage: "/images/bg_image_contact.png",

  heading: {
    tag: "h2",
    text: "Get In Touch With Us"
  },

  description: {
    tag: "p",
    text: " Have questions or want to discuss your project? Reach out to us and our team will get back to you promptly."
  },

  contactDetails: [
    {
      icon: "email",
      label: { tag: "h4", text: "Email" },
      value: { tag: "p", text: "akashinfra74@gmail.com" }
    },
    {
      icon: "phone",
      label: { tag: "h4", text: "Phone" },
      value: { tag: "p", text: "+91-9915483066, +91-9010040001" }
    },
  ]
};


const DynamicTag = ({ tag, className, children }) => {
  const Tag = validTags.includes(tag) ? tag : "p";
  return <Tag className={className}>{children}</Tag>;
};

/* =====================
   ICON MAPPER
===================== */
const iconMap = {
  email: <FaEnvelope />,
  phone: <FaPhone />,
  location: <FaMapMarkerAlt />, // optional – nice to have
};

const STATIC_MAP_EMBED = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3432.878236861869!2d76.757815!3d30.637388999999995!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feb71850befdd%3A0xc329ffb77258911b!2sProperty%20Bazaar!5e0!3m2!1sen!2sin!4v1768043466880!5m2!1sen!2sin`;

const ContactSection = () => {
const [contact, setContact] = useState(defaultContact);
  const API = process.env.REACT_APP_APIURL;

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    AOS.refresh();
  }, []);

useEffect(() => {
  axios
    .get(`${API}/api/contact-section`)
    .then((res) => {
      if (res.data) {
        setContact(res.data); // overwrite defaults
      }
    })
    .catch(() => {
      console.log("Backend sleeping, showing default contact content");
    });
}, [API]);

  const { backgroundImage, heading, description, contactDetails = [] } = contact;

  return (
    <section className="contactsec">
      {/* LEFT - GOOGLE MAP (now static) */}
      <div className="contact-left">
        <iframe
          src={STATIC_MAP_EMBED}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Bazaar Location"
        ></iframe>
      </div>

      {/* RIGHT - BACKGROUND IMAGE + OVERLAY */}
      <div className="contact-right">
        <div
          className="contact-bg"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          }}
        >
          <div className="contact-overlay">
            <div className="contact-content">
              <DynamicTag tag={heading?.tag} className="contact-heading" data-aos="fade-up">
                {heading?.text}
              </DynamicTag>

              <DynamicTag
                tag={description?.tag}
                className="contact-description"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {description?.text}
              </DynamicTag>

              <div className="contact-info">
                {contactDetails.map((item, i) => (
                  <div
                    key={i}
                    className="contact-box"
                    data-aos="fade-up"
                    data-aos-delay={200 + i * 100}
                  >
                    <div className="contact-icon">{iconMap[item.icon]}</div>

                    <div className="contact-text">
                      <DynamicTag tag={item.label?.tag} className="contact-label">
                        {item.label?.text}
                      </DynamicTag>

                      <DynamicTag tag={item.value?.tag} className="contact-detail">
                        {item.value?.text}
                      </DynamicTag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;