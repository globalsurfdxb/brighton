import { recentNews } from "../data";
import RecentContent from "../../common/RecentContent";

const RecentNews = () => {
  return (
    <RecentContent
      title={recentNews.title}
      items={recentNews.items}
      hrefPrefix="news"
    />
  );
};

export default RecentNews;
