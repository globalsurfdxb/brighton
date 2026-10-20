import { Suspense } from "react";
import BlogListingPage from "@/app/components/admin/AdminBlogs/BlogListingPage";

const page = () => {
  // BlogListingPage reads the active tab from the URL (useSearchParams)
  return (
    <Suspense>
      <BlogListingPage />
    </Suspense>
  );
};

export default page;
