import Cta from "../common/Cta";
import ContactSection from "./sections/ContactSection";
import Socials from "./sections/Socials";
import type { ContactDoc } from "@/app/types/contact";

const Index = ({ data }: { data: ContactDoc }) => {
  const { firstSection: first, secondSection: second, ctaSection: cta } = data;

  return (
    <>
      {first && !first.isHidden && (
        <ContactSection
          data={{
            title: first.title ?? "",
            address: first.address ?? "",
            addressLink: first.addressLink ?? "",
            phone: first.phone ?? "",
            email: first.email ?? "",
            description: first.subTitle ?? "",
            mapLink: first.mapLink ?? "",
          }}
        />
      )}

      {second && !second.isHidden && (
        <Socials
          data={{
            image: second.image ?? "",
            imageAlt: second.imageAlt ?? "",
            socials: (second.items ?? []).map((item) => ({
              title: item.title ?? "",
              icon: item.icon ?? "",
              iconAlt: item.iconAlt ?? "",
              href: item.link || "#",
            })),
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
