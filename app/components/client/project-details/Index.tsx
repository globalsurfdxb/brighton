import Cta from "../common/Cta";
import FeaturedProjects from "../home/sections/FeaturedProjects";
import { featuredProjectsData, projectDetailsCtaData, projectDetailsData } from "./data";
import ProjectBanner from "./sections/ProjectBanner";

const Index = () => {
  return (
    <>
      <ProjectBanner {...projectDetailsData} />
      <FeaturedProjects data={featuredProjectsData} className="bg-cream-background" />
      <Cta data={projectDetailsCtaData} />
    </>
  );
};

export default Index;
