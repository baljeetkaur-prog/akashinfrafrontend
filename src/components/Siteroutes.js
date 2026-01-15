import { Routes, Route } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import AdminLayout from "./AdminLayout";

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import DholeraSir from "./DholeraSir";
import Planning from "./Planning";
import Pricing from "./Pricing";
import EnquiryForm from "./EnquiryForm";
import Opportunities from "./Opportunities";
import Airport from "./Airport";
import Expressway from "./Expressway";
import Metro from "./Metro";
import Freight from "./Freight";
import Infrastructure from "./Infrastructure";
import Seaport from "./Seaport";
import SolarPark from "./SolarPark";
import RiverFront from "./RiverFront";
import Gallery from "./Gallery";
import DiamondCircle from "./DiamondCircle";
import NotFoundPage from "./NotFoundPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Page from "./Page";
import PagesList from "./PageList";
import PageEditor from "./PageEditor";
import CarouselAdmin from "./CarouselAdmin";
import AboutAdmin from "./AboutAdmin";
import AdminDholeraSir from "./AdminDholeraSir";
import AdminInvestment from "./AdminInvestment";
import AdminPricing from "./AdminPricing";
import AdminGallery from "./AdminGallery";
import AdminContact from "./AdminContact";
import AdminPlanning from "./AdminPlanning";
import Adminabouthome from "./Adminabouthome";
import AdminFeatureSection from "./AdminFeatureSection";
import AdminFeaturedInvestment from "./AdminFeaturedInvestment";
import AdminProcessSection from "./AdminProcessSection";
import AdminConnectivities from "./AdminConnectivities";
import AdminTeamSection from "./AdminTeamSection";
import AdminReviewSection from "./AdminReviewSection";
import AdminContactSection from "./AdminContactSection";
import DynamicDetailPage from "./DynamicDetailPage";
import PageBuilder from "./PageBuilder";
import BlogsMain from "./BlogsMain";
import BlogDetailPage from "./BlogDetailPage";
import AdminSocialIcons from "./AdminSocialIcons";
import AdminHome from "./AdminHome";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminContactForm from "./AdminContactForm";
import EnquiryFormAdmin from "./EnquiryFormAdmin";
import InvestmentFormAdmin from "./InvestmentFormAdmin";
import BlogList from "./BlogList";

const SiteRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC WEBSITE */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/dholera-SIR" element={<DholeraSir />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/enquiry-form" element={<EnquiryForm />} />
        <Route path="/investment-opportunities" element={<Opportunities />} />
        {/* <Route path="/dholera-international-airport" element={<Airport />} /> */}
        <Route path="/ahmedabad-dholera-expressway" element={<Expressway />} />
        <Route path="/dholera-metro-rail-project" element={<Metro />} />
        <Route path="/dedicated-freight-corridor" element={<Freight />} />
        <Route path="/dholera-smart-infrastructure" element={<Infrastructure />} />
        <Route path="/dholera-sea-port" element={<Seaport />} />
        <Route path="/dholera-solar-park" element={<SolarPark />} />
        <Route path="/dholera-artificial-riverfront" element={<RiverFront />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/dholera-diamond-circle" element={<DiamondCircle />} />
               <Route path="/:slug" element={<DynamicDetailPage />} />
               <Route path="/blogs" element={<BlogsMain/>}/>
               <Route path="/blog/:slug" element={<BlogDetailPage />} />
               <Route path="/blogs/category/:category" element={<BlogsMain />} />
<Route path="/blogs/tag/:tag" element={<BlogsMain />} />
      </Route>

      {/* ADMIN */}
     {/* ADMIN */}


  {/* Public admin route */}
  <Route path="/admin-login" element={<AdminLogin />} />

  {/* Protected admin routes */}
  <Route element={<AdminProtectedRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/pages" element={<PagesList />} />
    <Route path="/admin/blogs" element={<BlogList />} />
    <Route path="/admin/pages/:slug/edit" element={<PageEditor />} />
    <Route path="/admin/pages/home-page-seo" element={<AdminHome />} />
    <Route path="/admin/pages/new" element={<PageEditor />} />
    <Route path="/admin/pages/carousel" element={<CarouselAdmin />} />
    <Route path="/admin/pages/feature-section" element={<AdminFeatureSection />} />
    <Route path="/admin/pages/about-home-page" element={<Adminabouthome />} />
    <Route path="/admin/pages/featured-investment-home-page" element={<AdminFeaturedInvestment />} />
    <Route path="/admin/pages/process-section-home-page" element={<AdminProcessSection />} />
    <Route path="/admin/pages/team-section-home-page" element={<AdminTeamSection />} />
    <Route path="/admin/pages/review-section-home-page" element={<AdminReviewSection />} />
    <Route path="/admin/pages/contact-section-home-page" element={<AdminContactSection />} />
    <Route path="/admin/pages/about" element={<AboutAdmin />} />

    <Route path="/admin/pages/dholera-sir" element={<AdminDholeraSir />} />
    <Route path="/admin/pages/investment-opportunities" element={<AdminInvestment />} />
    <Route path="/admin/pages/connectivities-home-page" element={<AdminConnectivities />} />
    <Route path="/admin/pages/pricing" element={<AdminPricing />} />
    <Route path="/admin/pages/gallery" element={<AdminGallery />} />
    <Route path="/admin/pages/contact" element={<AdminContact />} />
    <Route path="/admin/pages/dholera-planning" element={<AdminPlanning />} />
    <Route path="/admin/page-builder" element={<PageBuilder />} />
    <Route path="/admin/page-builder/:slug?" element={<PageBuilder />} />
    <Route path="/admin/pages/edit/:slug" element={<PageBuilder />} />
    <Route path="/admin/pages/side-social-icons" element={<AdminSocialIcons />} />
    <Route path="/admin/pages/contact-form-queries" element={<AdminContactForm/>}/>
    <Route path="/admin/pages/enquiry-form-queries" element={<EnquiryFormAdmin/>}/>
      <Route path="/admin/pages/investment-form-queries" element={<InvestmentFormAdmin/>}/>
  </Route>

</Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default SiteRoutes;
