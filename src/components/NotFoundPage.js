import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./NotFoundPage.css";
import { FaHome } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found | Akash Infra</title>
        <meta
          name="description"
          content="The page you are looking for does not exist or has been moved. Return to the homepage or contact us for assistance."
        />
        <meta
          name="keywords"
          content="404, Page Not Found, Error 404, Website Not Found, Contact Us"
        />
      </Helmet>

      <section className="notfound-main-content">
        <div className="notfound-content-wrapper">
          {/* Left Content */}
          <div className="notfound-left-content">
            <h4 className="notfound-small-heading">ERROR CODE 404</h4>
            <h2 className="notfound-big-heading">OOOPS!!</h2>
            <p className="notfound-para">
              Sorry, the page you’re trying to access does not exist or has been moved. 
              You can return to the homepage or reach out to us if you need help.
            </p>
            <div className="notfound-buttons">
              <Link to="/" className="notfound-btn">
                <FaHome style={{ marginRight: "8px" }} />
                Home
              </Link>
              <Link to="/contact-us" className="notfound-btn secondary">
                <FiArrowLeft style={{ marginRight: "8px" }} />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="notfound-right-image">
            <img src="/images/notfound_img.png" alt="Not Found" />
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
