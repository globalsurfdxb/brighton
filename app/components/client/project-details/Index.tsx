import Cta from "../common/Cta";
import FeaturedProjects from "../home/sections/FeaturedProjects";
import {
  featuredProjectsData,
  projectDetailsCtaData,
  projectDetailsBannerData,
} from "./data";
import Main from "./sections/Main";
import ProjectBanner from "./sections/ProjectBanner";

const Index = () => {
  return (
    <>
      <ProjectBanner {...projectDetailsBannerData} />
      <Main />
      <FeaturedProjects
        data={featuredProjectsData}
        className="bg-cream-background"
      />
      <Cta data={projectDetailsCtaData} />
    </>
  );
};

export default Index;
