import type { BlogDetails } from "./sections/Main";

export const blogDetails: BlogDetails = {
  title: "How Layered Lighting Shapes More Comfortable Interiors",
  date: "2026-06-18",
  category: "Lighting Design",
  heroImage: "/assets/images/news/news-details/hero.jpg",
  intro:
    "Layered lighting gives a room depth, rhythm, and practical flexibility by combining ambient, task, and accent light in a controlled way.",
  content: [
    {
      type: "heading main",
      text: "A well-balanced lighting scheme does more than illuminate surfaces. It guides attention, supports the activity in the room, and helps architecture feel intentional after daylight fades.",
    },
    {
      type: "first two paragraph",
      introData: [
        "The strongest interiors rarely rely on one source of light. Ambient illumination sets the general brightness, task lighting supports specific work, and accent lighting gives shape to materials, artwork, joinery, and circulation paths.",
        "When these layers are planned together, the result is easier to tune. A workspace can shift from presentation mode to focused work, a hospitality area can move from day service to evening atmosphere, and a residence can feel calm without becoming visually flat.",
      ],
    },
    {
      type: "image",
      src: "/assets/images/news/news-details/main-1.jpg",
      alt: "Architectural lighting detail in a refined interior",
    },
    {
      type: "heading",
      text: "Start with the Purpose of Each Zone",
    },
    {
      type: "paragraph",
      text: "Before selecting fittings, define what each part of the room needs to do. Circulation areas may need soft guidance, desks need comfortable task levels, and display walls often benefit from focused accent light with controlled spill.",
    },
    {
      type: "list",
      items: [
        "Use ambient light to establish comfortable base illumination.",
        "Add task light only where activities require stronger focus.",
        "Use accent light to reveal texture, depth, and key architectural moments.",
        "Group circuits by use so scenes can change without over-lighting the space.",
      ],
    },
    {
      type: "paragraph",
      text: "The best layered schemes feel quiet because every fitting has a reason to be there. Output, beam angle, color temperature, glare control, and control strategy all work together to make the room adaptable without visual clutter.",
    },
    {
      type: "heading",
      text: "Dummy Text Content",
    },
    {
      type: "paragraph",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
    },
    {
      type: "paragraph",
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more- or - less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.Various versions have evolved over the years, sometimes by accident, sometimes on purpose(injected humour and the like).",
    },
  ],
};

export const recentBlogs = {
  title: "Recent Blogs",
  items: [
    {
      id: 2,
      title: "Choosing Beam Angles for Retail, Hospitality, and Workspaces",
      date: "2026-06-10",
      category: "Specification Tips",
      image: "/assets/images/news/news-2.jpg",
    },
    {
      id: 3,
      title: "Why Glare Control Matters in Everyday Visual Comfort",
      date: "2026-05-29",
      category: "Wellbeing",
      image: "/assets/images/news/news-3.jpg",
    },
    {
      id: 4,
      title: "Designing Lower-Energy Lighting Without Flattening the Space",
      date: "2026-05-21",
      category: "Sustainability",
      image: "/assets/images/news/news-4.jpg",
    },
  ],
};

export const socialShareLinks = [
  {
    label: "LinkedIn",
    icon: "/assets/icons/social-icons/linked-in.svg",
    className: "text-description-color",
    getHref: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  },
  {
    label: "Facebook",
    icon: "/assets/icons/social-icons/facebook.svg",
    className: "bg-primary text-white border-primary",
    getHref: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    label: "X",
    icon: "/assets/icons/social-icons/x.svg",
    className: "text-description-color",
    getHref: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
  },
];

export const ctaData = {
  title: "Plan Your Lighting Strategy",
  description:
    "Speak with our team about product selection, specification support, and project-ready lighting solutions.",
  button: {
    text: "Connect With Us",
    href: "#",
  },
};

export default blogDetails;
