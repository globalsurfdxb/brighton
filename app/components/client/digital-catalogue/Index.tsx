import Cta from "../common/Cta";
import Main from "./sections/Main";
import type { DigitalCatalogueDoc } from "@/app/types/digitalCatalogue";

const Index = ({ data }: { data: DigitalCatalogueDoc }) => {
  const { firstSection: first, ctaSection: cta } = data;

  return (
    <>
      {first && !first.isHidden && (
        <Main
          data={{
            title: first.title ?? "",
            subTitle: first.subTitle ?? "",
            catalogueText: first.catalogueText ?? "",
            image: first.image ?? "",
            imageAlt: first.imageAlt ?? "",
          }}
        />
      )}

      {cta && !cta.isHidden && (
        <Cta
          data={{
            title: cta.title ?? "",
            description: cta.description ?? "",
            button: {
              text: cta.buttonText ?? "",
              href: cta.buttonLink || "#",
            },
          }}
        />
      )}
    </>
  );
};

export default Index;
