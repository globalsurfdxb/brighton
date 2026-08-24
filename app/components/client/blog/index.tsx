import Cta from "../common/Cta";
import BlogList from "./section/BlogList";
import { blogSection, ctaData } from "./data";

const Index = () => {
  return (
    <>
      <BlogList data={blogSection} />
      <Cta data={ctaData} />
    </>
  );
};

export default Index;
