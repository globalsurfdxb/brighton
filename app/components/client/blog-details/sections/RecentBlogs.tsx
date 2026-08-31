import { recentBlogs } from "../data";
import RecentContent from "../../common/RecentContent";

const RecentBlogs = () => {
  return (
    <RecentContent
      title={recentBlogs.title}
      items={recentBlogs.items}
      hrefPrefix="blog"
    />
  );
};

export default RecentBlogs;
