import React, { useRef, useEffect, useState } from "react";
import "./Contact.css";
import { FaHome } from "react-icons/fa";
import { FiSend, FiPhoneCall } from "react-icons/fi";
import { MdLocationPin } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicTag from "./DynamicTag";
// ✅ Default Contact Page Content
const defaultContact = {
  seo: {
    title: "Contact Us | Akash Infra",
    description:
      "Get in touch with Akash Infra for Dholera Smart City investments, site visits, pricing, and expert consultation.",
  },

  breadcrumb: {
    parent: "Home",
    current: "Contact Us",
  },

  banner: {
    heading: { tag: "h1", text: "Contact Akash Infra" },
  },

  formSection: {
    button: {
      text: { tag: "p", text: "Submit" },
    },
  },

  infoSection: {
    heading: {
      tag: "h2",
      text: "Get in Touch",
    },
    paragraph: {
      tag: "p",
      text:
        "We are here to help you with any queries regarding our projects.",
    },
    phoneText: "+91 9915483066, +91 9010040001",
    emailText: "akashinfra74@gmail.com",
    address1: "Akash Infra, Near Bollywood Gali, Patiala–Chandigarh Highway, Zirakpur",
    address2: "Property Bazaar, DSS-120, Ground Floor, Mohali City Centre, Aerocity, Mohali",
  },

  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.878241310787!2d76.75524007541463!3d30.63738887463048",
  },
};


const Contact = () => {
  const recaptchaRef = useRef(null);
 const [data, setData] = useState(defaultContact);

  const API = process.env.REACT_APP_APIURL;
  const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

useEffect(() => {
  if (!API) return;

  axios
    .get(`${API}/api/contact`)
    .then(res => {
      if (res.data && Object.keys(res.data).length > 0) {
        setData(res.data);
      }
    })
    .catch(() => {
      console.log("Contact API not available, using default content");
    });
}, [API]);

const {
  seo = {},
  breadcrumb = {},
  banner = {},
  formSection = {},
  infoSection = {},
  map = {}
} = data || {};


const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔐 Check ReCAPTCHA
  if (!recaptchaRef.current.getValue()) {
    toast.error("Please verify that you are not a robot.");
    return;
  }

  const formData = new FormData(e.target);

  const backendData = {
    name: e.target.name.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    message: e.target.message.value,
  };

  // 1️⃣ Send to Formspree (email notification)
  try {
    const response = await fetch("https://formspree.io/f/xyzrayqz", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      toast.error("Error submitting form. Please try again.");
      return;
    }
  } catch (err) {
    console.error("Formspree error:", err);
    toast.error("Error submitting form.");
    return;
  }

  // 2️⃣ Save to your backend (Contact Queries)
  try {
    await axios.post(
      `${process.env.REACT_APP_APIURL}/api/contact-queries/submit`,
      backendData
    );

    toast.success("Form submitted successfully!");
    e.target.reset();
    recaptchaRef.current.reset();
  } catch (err) {
    console.error("Backend save failed:", err);
    toast.warning("Form submitted, but failed to save in admin panel.");
  }
};



  return (
    <>
      <Helmet>
        <title>{seo?.title}</title>
        <meta name="description" content={seo?.description} />
      </Helmet>

      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <div className="contactmain-page">
        {/* Banner */}
        <section
  className="contactmain-banner"
  style={{ backgroundImage: 'url("/images/bg-image.png")' }}
>
          <div className="contactmain-container">
            <DynamicTag tag={banner?.heading?.tag} className="contactmain-heading">
              {banner?.heading?.text}
            </DynamicTag>

            <div className="contactmain-breadcrumb">
              <FaHome className="contactmain-home-icon" />
              <Link to="/" className="contactmain-breadcrumb-link">
                {breadcrumb?.parent}
              </Link>
              <span className="contactmain-breadcrumb-text">
                &gt;&gt; {breadcrumb?.current}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
       <div
  className="contactmain-content"
  style={{
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
    padding: "80px 20px",
  }}
>
          <div className="contactmain-wrapper">

            {/* LEFT FORM — unchanged structure */}
          {/* LEFT FORM — STATIC */}
<div className="contactmain-left-form">
  <form className="contactmain-form" onSubmit={handleSubmit}>

    {/* Hidden subject for Formspree */}
    <input
      type="hidden"
      name="_subject"
      value="New Contact Enquiry – Akash Infra"
    />

    <input
      type="text"
      name="name"
      placeholder="Your Name"
      className="contactmain-input"
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Your Email"
      className="contactmain-input"
      required
    />

    <input
      type="text"
      name="phone"
      placeholder="Phone Number"
      className="contactmain-input"
    />

    <textarea
      name="message"
      placeholder="Your Message"
      className="contactmain-textarea"
      required
    />

    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={RECAPTCHA_KEY}
    />

    <button className="contactmain-btn" type="submit">
      <FiSend style={{ marginRight: 5, fontSize: 22 }} />
      {formSection?.button?.text?.text || "Submit"}
    </button>
  </form>
</div>


            {/* RIGHT INFO — unchanged */}
           {/* RIGHT INFO */}
<div className="contactmain-right-text">

  <DynamicTag
    tag={infoSection?.heading?.tag}
    className="contactmain-title"
  >
    {infoSection?.heading?.text}
  </DynamicTag>

  <DynamicTag
    tag={infoSection?.paragraph?.tag}
    className="contactmain-para"
  >
    {infoSection?.paragraph?.text}
  </DynamicTag>

  <div className="contactmain-info-box">
    <FiPhoneCall className="contactmain-info-icon" />
    <p className="contactmain-info-text">
      {infoSection?.phoneText}
    </p>
  </div>

  <div className="contactmain-info-box">
    <HiOutlineMail className="contactmain-info-icon" />
    <p className="contactmain-info-text">
      {infoSection?.emailText}
    </p>
  </div>

  <div className="contactmain-info-box">
    <MdLocationPin className="contactmain-info-icon" />
    <p className="contactmain-info-text">
      {infoSection?.address1}
    </p>
  </div>

  <div className="contactmain-info-box">
    <MdLocationPin className="contactmain-info-icon" />
    <p className="contactmain-info-text">
      {infoSection?.address2}
    </p>
  </div>

</div>


          </div>
        </div>

   {/* MAP */}
{/* FULL-WIDTH GOOGLE MAP */}
<div className="contact-map" style={{ width: "100%", height: "500px" }}>
  <iframe
    title="Property Bazaar Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.878241310787!2d76.75524007541463!3d30.63738887463048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feb71850befdd%3A0xc329ffb77258911b!2sProperty%20Bazaar!5e0!3m2!1sen!2sin!4v1764330323443!5m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>


      </div>
    </>
  );
};

export default Contact;
