import { contactUsCtaData } from "./data";
import Cta from "../common/Cta";
import ContactSection from "./sections/ContactSection";

const Index = () => {
  return (
    <>
      <ContactSection />
      <Cta data={contactUsCtaData} />
    </>
  );
};

export default Index;
