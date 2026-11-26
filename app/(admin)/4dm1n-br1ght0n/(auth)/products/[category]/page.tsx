import { Suspense } from "react";
import CategoryPage from "@/app/components/admin/AdminProducts/CategoryPage";

const page = () => {
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
};

export default page;
