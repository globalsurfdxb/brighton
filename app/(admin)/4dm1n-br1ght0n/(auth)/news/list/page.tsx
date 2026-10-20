import { Suspense } from "react";
import NewsListingPage from "@/app/components/admin/AdminNews/NewsListingPage";

const page = () => {
  // NewsListingPage reads the active tab from the URL (useSearchParams)
  return (
    <Suspense>
      <NewsListingPage />
    </Suspense>
  );
};

export default page;
