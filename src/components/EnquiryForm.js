import React, { useRef, useEffect, useState } from "react";
import "./EnquiryForm.css";
import { FaHome, FaPaperPlane } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default Enquiry Page Content
const defaultEnquiry = {
  seo: {
    title: "Dholera Enquiry Form | Akash Infra",
    description:
      "Fill the enquiry form to connect with Akash Infra for investment opportunities in Dholera Smart City.",
  },
  breadcrumb: { parent: "Home", current: "Enquiry" },
  banner: { heading: { tag: "h1", text: "Enquiry Form" } },
  leftSection: {
    smallHeading: "Akash Infra",
    title: "Secure Your Investment in Dholera Smart City",
    paragraph:
      "Fill in your details and our investment experts will get in touch with you for pricing, legal documentation, project details, and future growth insights.",
    image: "/images/enquiry_form.png",
  },
  formSection: { button: { text: { tag: "p", text: "Submit Enquiry" } } },
  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.878241310787!2d76.75524007541463!3d30.63738887463048",
  },
};

const EnquiryForm = () => {
  const recaptchaRef = useRef(null);
  const [data, setData] = useState(defaultEnquiry);

  const API = process.env.REACT_APP_APIURL;
  const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  // Fetch dynamic content
  useEffect(() => {
    if (!API) return;

    axios
      .get(`${API}/api/enquiry-page-content`)
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) setData(res.data);
      })
      .catch(() => {
        console.log("Enquiry API not available, using default content");
      });
  }, [API]);

  const { seo, breadcrumb, banner, leftSection, formSection, map } = data;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaRef.current.getValue()) {
      toast.error("Please verify that you are not a robot.");
      return;
    }

    const formData = new FormData(e.target);
    const backendData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      investmentType: e.target.investmentType.value,
      budgetRange: e.target.budgetRange.value,
      preferredSize: e.target.preferredSize.value,
      locationPreference: e.target.locationPreference.value,
      message: e.target.message.value,
    };

    let formspreeSuccess = false;

    // 1️⃣ Send to Formspree
    try {
      const response = await fetch("https://formspree.io/f/xyzrayqz", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        formspreeSuccess = true;
        toast.success("Enquiry submitted successfully!");
        e.target.reset();
        recaptchaRef.current.reset();
      } else toast.error("Failed to submit enquiry. Please try again.");
    } catch (err) {
      console.error("Formspree error:", err);
      toast.error("Error while submitting. Please try again.");
    }

    // 2️⃣ Save to backend
    try {
      await axios.post(`${API}/api/query/submit`, backendData);
      console.log("Backend saved successfully");
    } catch (err) {
      console.error("Backend submission failed:", err);
      toast.warning(
        "Error saving enquiry to backend. Formspree submission may still succeed."
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{seo?.title}</title>
        <meta name="description" content={seo?.description} />
      </Helmet>

      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <div className="enquiry-page">
        {/* Banner */}
        <section
          className="enquiry-banner"
          style={{ backgroundImage: 'url("/images/bg-image.png")' }}
        >
          <div className="enquiry-container">
            <h1 className="enquiry-heading" data-aos="fade-up">
              {banner?.heading?.text}
            </h1>
            <div
              className="enquiry-breadcrumb"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <FaHome className="enquiry-home-icon" />
              <Link to="/" className="enquiry-breadcrumb-link">
                {breadcrumb?.parent}
              </Link>
              <span className="enquiry-breadcrumb-text">
                &gt;&gt; {breadcrumb?.current}
              </span>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <div
          className="enquiry-content"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/images/bg-img2.png')",
            padding: "80px 20px",
          }}
        >
          <div className="enquiry-wrapper">
            {/* LEFT Section */}
            <div className="enquiry-left" data-aos="fade-up">
              <p className="enquiry-small-heading" data-aos="fade-up" data-aos-delay="100">
                {leftSection?.smallHeading}
              </p>
              <h2 className="enquiry-title" data-aos="fade-up" data-aos-delay="200">
                {leftSection?.title}
              </h2>
              <p className="enquiry-para" data-aos="fade-up" data-aos-delay="300">
                {leftSection?.paragraph}
              </p>
              {leftSection?.image && (
                <img
                  src={leftSection.image}
                  alt="Enquiry Illustration"
                  className="enquiry-image"
                  data-aos="fade-up"
                  data-aos-delay="400"
                />
              )}
            </div>

            {/* RIGHT Section — Form */}
            <div className="enquiry-form-box" data-aos="fade-up" data-aos-delay="150">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="_subject" value="New Enquiry – Dholera Smart City" />

                <div className="form-group">
                  <label>
                    Name <span className="required-star">*</span>
                  </label>
                  <input type="text" name="name" placeholder="Enter your full name" required />
                </div>

                <div className="form-group">
                  <label>
                    Phone Number <span className="required-star">*</span>
                  </label>
                  <input type="text" name="phone" placeholder="Enter your mobile number" required />
                </div>

                <div className="form-group">
                  <label>
                    Email <span className="required-star">*</span>
                  </label>
                  <input type="email" name="email" placeholder="Enter your email" required />
                </div>

                <div className="form-group select-wrapper">
                  <label>
                    Investment Type <span className="required-star">*</span>
                  </label>
                  <select name="investmentType" required>
                    <option value="">Select Investment Type</option>
                    <option value="residential">Residential Plot</option>
                    <option value="commercial">Commercial Plot</option>
                    <option value="industrial">Industrial Plot</option>
                  </select>
                </div>

                <div className="form-group select-wrapper">
                  <label>
                    Budget Range <span className="required-star">*</span>
                  </label>
                  <select name="budgetRange" required>
                    <option value="">Select Budget Range</option>
                    <option value="5-10">₹5L – ₹10L</option>
                    <option value="10-25">₹10L – ₹25L</option>
                    <option value="25-50">₹25L – ₹50L</option>
                    <option value="50+">₹50L+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Plot Size</label>
                  <input type="text" name="preferredSize" placeholder="e.g., 1000 sq.ft, 2000 sq.ft" />
                </div>

                <div className="form-group">
                  <label>Location Preference</label>
                  <input type="text" name="locationPreference" placeholder="Enter preferred location" />
                </div>

                <div className="form-group">
                  <label>Message / Special Requirements</label>
                  <textarea name="message" placeholder="Tell us your requirements"></textarea>
                </div>

                <div className="form-group">
                  <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={recaptchaRef} />
                </div>

                <button type="submit" className="enquiry-btn">
                  <FaPaperPlane style={{ marginRight: "8px" }} />
                  {formSection?.button?.text?.text || "Submit Enquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Map */}
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

export default EnquiryForm;
