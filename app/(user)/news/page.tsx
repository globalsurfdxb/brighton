import Index from "@/app/components/client/news";
import { Suspense } from "react";

const page = () => (
  <Suspense fallback={null}>
    <Index />
  </Suspense>
);
 
export default page;
