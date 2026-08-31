import { GrLinkedinOption } from "react-icons/gr";
import { VscTwitter } from "react-icons/vsc";
import { FaFacebookF } from "react-icons/fa";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { motion } from "framer-motion";

export const socialShareLinks = [
  {
    label: "LinkedIn",
    icon: GrLinkedinOption,
    getHref: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  },
  {
    label: "Facebook",
    icon: FaFacebookF,
    getHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    label: "X",
    icon: VscTwitter,
    getHref: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
  },
];

export const SharePill = ({ title }: { title: string }) => {
  const handleShare = (getHref: (url: string, text: string) => string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    window.open(getHref(url, text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="xl:mb-40 inline-flex w-fit items-center rounded-full border border-secondary pr-2.5 pl-5 3xl:pl-7.5 py-2 overflow-hidden">
      <AnimatedTitle
        className="text-subtitle-2 uppercase text-description-color text-trim"
        text="Share"
      />
      <div className="ml-8 3xl:ml-16.25 flex items-center gap-1.5">
        {socialShareLinks.map((link, Index) => {
          const Icon = link.icon;

          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                type="button"
                onClick={() => handleShare(link.getHref)}
                aria-label={`Share on ${link.label}`}
                style={
                  {
                    "--fill-color": "var(--color-primary, #0A0A0A)",
                  } as React.CSSProperties
                }
                className="cursor-pointer group flex w-10 h-10 3xl:w-12 3xl:h-12 items-center justify-center rounded-full border border-secondary btn-fill-center"
              >
                <Icon
                  aria-hidden
                  className="h-5.5 w-auto text-description-color transition-colors duration-500 group-hover:text-secondary"
                />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
