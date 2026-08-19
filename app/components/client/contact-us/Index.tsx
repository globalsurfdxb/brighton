import { contactUsCtaData } from "./data";
import Cta from "../common/Cta";
import ContactSection from "./sections/ContactSection";
import Socials from "./sections/Socials";

const Index = () => {
  return (
    <>
      <ContactSection />
      <Socials />
      <Cta data={contactUsCtaData} />
    </>
  );
};

export default Index;
