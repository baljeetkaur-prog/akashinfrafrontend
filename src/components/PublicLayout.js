import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import BackToTop from "./BackToTop";
import SocialIcons from "./SocialIcons";
import { Outlet } from "react-router-dom";
import FloatingButton from "./FloatingButton";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <ScrollToTop />

      <main style={{ minHeight: "calc(100vh - 160px)" }}>
        <Outlet />
      </main>

      <Footer />
      <BackToTop />
      <SocialIcons />
        <FloatingButton />
    </>
  );
};

export default PublicLayout;
