import Main from "./sections/Main";
import { blogDetails, ctaData } from "./data";
import Cta from "../common/Cta";
import RecentBlogs from "./sections/RecentBlogs";

const Index = () => {
  return (
    <>
      <Main data={blogDetails} />
      <RecentBlogs />
      <Cta data={ctaData} />
    </>
  );
};

export default Index;
