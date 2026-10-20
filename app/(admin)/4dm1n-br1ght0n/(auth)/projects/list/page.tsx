import { Suspense } from "react";
import ProjectListingPage from "@/app/components/admin/AdminProjects/ProjectListingPage";

const page = () => {
  // ProjectListingPage reads the active tab from the URL (useSearchParams)
  return (
    <Suspense>
      <ProjectListingPage />
    </Suspense>
  );
};

export default page;
