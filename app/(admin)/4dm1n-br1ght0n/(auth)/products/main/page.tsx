import { Suspense } from "react";
import MainPage from "@/app/components/admin/AdminProducts/MainPage";

const page = () => {
  // MainPage reads the active tab from the URL (useSearchParams)
  return (
    <Suspense>
      <MainPage />
    </Suspense>
  );
};

export default page;
