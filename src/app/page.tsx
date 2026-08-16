import Blog from "@/components/Blog";
import CtaBand from "@/components/CtaBand";
import CustomerStories from "@/components/CustomerStories";
import Discover from "@/components/Discover";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Locations from "@/components/Locations";
import MotionRuntime from "@/components/MotionRuntime";
import OfferCompare from "@/components/OfferCompare";
import Questionnaire from "@/components/Questionnaire";
import Reviews from "@/components/Reviews";
import TrustStrip from "@/components/TrustStrip";
import Values from "@/components/Values";

export default function HomePage() {
  return (
    <>
      <a href="#fragebogen" className="skipLink">
        Zum Fragebogen springen
      </a>

      <Header />

      <main id="main">
        <Hero>
          <TrustStrip />
        </Hero>
        <Questionnaire />
        <HowItWorks />
        <Values />
        <Discover />
        <Reviews />
        <CustomerStories />
        <Locations />
        <OfferCompare />
        <Blog />
        <Faq />
        <CtaBand />
      </main>

      <Footer />
      <MotionRuntime />
    </>
  );
}
