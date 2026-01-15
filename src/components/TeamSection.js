import React, { useEffect, useState } from "react";
import "./TeamSection.css";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";

/* ================= DEFAULT TEAM DATA ================= */
const defaultTeam = {
  heading: { tag: "h2", text: "Meet Our Dedicated Team" },
  description: {
    tag: "p",
    text:
      "Our leadership team brings years of expertise in real estate, planning, and development ensuring your investment journey is guided professionally."
  },
  members: [
    {
      _id: "default-1",
      name: { tag: "h3", text: "L.R GOYAL (BITTU JAKHAL)" },
      role: { tag: "p", text: "Director" },
      image: { url: "/images/team_memb1.jpeg", alt: "member1" },
      button: { text: { tag: "span", text: "Contact Now" }, link: "/contact-us" }
    },
    {
      _id: "default-2",
      name: { tag: "h3", text: "PUSHPKARAN BANSAL" },
      role: { tag: "p", text: "Director" },
      image: { url: "/images/team_memb2.jpeg", alt: "member2" },
      button: { text: { tag: "span", text: "Contact Now" }, link: "/contact-us" }
    },
    {
      _id: "default-3",
      name: { tag: "h3", text: "VIJAY BANSAL" },
      role: { tag: "p", text: "Director" },
      image: { url: "/images/team_memb3.jpeg", alt: "member3" },
      button: { text: { tag: "span", text: "Contact Now" }, link: "/contact-us" }
    }, 
        {
      _id: "default-4",
      name: { tag: "h3", text: "BHAVNA" },
      role: { tag: "p", text: "Staff Employee" },
      image: { url: "/images/team_memb4.jpeg", alt: "member4" },
      button: { text: { tag: "span", text: "Contact Now" }, link: "/contact-us" }
    }
  ]
};

/* ================= SAFE DYNAMIC TAG ================= */
const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div"];
const DynamicTag = ({ tag = "p", children, className = "", html, ...props }) => {
  const safeTag = validTags.includes(tag) ? tag : "p";
  const Tag = safeTag;

  if (html) {
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    );
  }

  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

/* ================= SAFE TEXT EXTRACTION ================= */
const getText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.text && typeof value.text === "string") return value.text;
  return "";
};

const TeamSection = () => {
  const API = process.env.REACT_APP_APIURL || "http://localhost:5000";
  const [team, setTeam] = useState(defaultTeam);

  useEffect(() => {
    Aos.init({ duration: 1000, easing: "ease-in-out", once: true });
    Aos.refresh();
  }, []);

  // Fetch backend content, fallback to defaultTeam
  useEffect(() => {
    axios
      .get(`${API}/api/team-section`)
      .then(res => {
        if (res.data) setTeam(res.data);
        else setTeam(defaultTeam);
      })
      .catch(err => {
        console.log("Backend not available, showing default team");
        setTeam(defaultTeam);
      });
  }, [API]);

 const {
  heading = defaultTeam.heading,
  description = defaultTeam.description,
  members = []
} = team || {};

  return (
    <section
      className="teamsec-wrapper"
      style={{ backgroundImage: `url("/images/bg-image.png")` }}
    >
      <div className="teamsec-overlay" />

      <div className="teamsec-container">
        {/* HEADER */}
        <div className="teamsec-header" data-aos="fade-up">
          <DynamicTag tag={heading?.tag} className="team-heading">
            {getText(heading)}
          </DynamicTag>

          <DynamicTag
            tag={description?.tag}
            className="team-description"
            html={getText(description)}
          />
        </div>

        {/* MEMBERS GRID */}
        <div className="teamsec-cards-wrapper">
          {members?.length === 0 ? (
            <p className="no-members">No team members added yet.</p>
          ) : (
            members.map((member, index) => (
              <div
                key={member._id || `member-${index}`}
                className="teamsec-card"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                <div className="teamsec-image-wrapper">
                  {member.image?.url ? (
                    <img
                      src={member.image.url}
                      alt={member.image.alt || getText(member.name) || "Team member"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="placeholder-image" />
                  )}

                  <div className="teamsec-hover-mask" />

                  {/* Contact Button */}
                  {member.button?.link && getText(member.button?.text) && (
                    <div className="teamsec-overlay-icons">
                      <Link
                        to={member.button.link}
                        className="teamsec-contact-btn"
                        target={member.button.link.startsWith("http") ? "_blank" : undefined}
                        rel={member.button.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        <FaPaperPlane className="btn-icon" />
                        {getText(member.button.text)}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="teamsec-info-box">
                  <DynamicTag
                    tag={member.name?.tag || "h3"}
                    className="member-name"
                  >
                    {getText(member.name)}
                  </DynamicTag>

                  <DynamicTag
                    tag={member.role?.tag || "p"}
                    className="member-role"
                  >
                    {getText(member.role)}
                  </DynamicTag>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
