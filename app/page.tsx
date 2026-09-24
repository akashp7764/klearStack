import Header from "@/components/header/Header";
import LeadSection from "@/components/lead/LeadSection";
import RoiCalculator from "@/components/roi/RoiCalculator";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <LeadSection />
        <RoiCalculator />
      </main>
      <Footer />
    </>
  );
}
