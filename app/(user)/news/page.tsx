import Index from "@/app/components/client/news";
import { Suspense } from "react";

const page = () => (
  <Suspense>
    <Index />
  </Suspense>
);

export default page;
