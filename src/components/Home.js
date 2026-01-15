import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

import Aboutsection from "./Aboutsection";
import Carousel from "./Carousel";
import Connectivities from "./Connectivities";
import ContactSection from "./ContactSection";
import FeaturedInvestment from "./FeaturedInvestment";
import FeatureSection from "./FeatureSection";
import ProcessSection from "./ProcessSection";
import ReviewsSection from "./ReviewsSection";
import TeamSection from "./TeamSection";
import FloatingButton from "./FloatingButton";

const Home = () => {
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: "",
    canonical: "https://www.akashinfra.in/",
  });

  useEffect(() => {
    axios
      .get("/api/home-page/seo")
      .then((res) => {
        if (res.data && res.data.seo) {
          setSeo({
            ...res.data.seo,
            canonical: "https://www.akashinfra.in/",
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch SEO:", err);
      });
  }, []);

  return (
    <>
      <Helmet>
        {/* Dynamic SEO */}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={seo.canonical} />

        {/* Local Business / RealEstateAgent Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "@id": "https://www.akashinfra.in/#realestateagent",
            "name": "Akash Infra",
            "image": "https://www.akashinfra.in/images/carousel7.jpg",
            "url": "https://www.akashinfra.in/",
            "telephone": "+91-9915483066",
            "priceRange": "₹₹₹",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Near Bollywood Gali Patiala",
              "addressLocality": "Zirakpur",
              "postalCode": "140306",
              "addressCountry": "IN",
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 30.6375,
              "longitude": 76.75784,
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                "opens": "08:00",
                "closes": "20:00",
              },
            ],
          })}
        </script>
      </Helmet>

      <Carousel />
      <Aboutsection />
      <FeatureSection />
      <FeaturedInvestment />
      <ProcessSection />
      <Connectivities />
      <TeamSection />
      <ReviewsSection />
      <ContactSection />
      <FloatingButton />
    </>
  );
};

export default Home;
