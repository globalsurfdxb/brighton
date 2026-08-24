import Cta from "../common/Cta";
import { projectsCtaData } from "./data";
import Main from "./sections/Main";
import { Suspense } from "react";

const Index = () => {
  return (
    <>
      <Suspense>
        <Main />
      </Suspense>
      <Cta data={projectsCtaData} />
    </>
  );
};

export default Index;
