import type { NewsDetails } from "./sections/main";

export const newsDetails: NewsDetails = {
  title: "Designing for Longevity Through Precision, Performance, and Innovation",
  date: "2026-05-14",
  category: "Industry Insight",
  heroImage: "/assets/images/news/news-details/hero.jpg",
  intro:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",

  content: [
    {
      type: "heading main",
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    },
    {
      type: "first two paragraph",
      introData: [
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley. The librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to those sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      ]
    },

    {
      type: "image",
      src: "/assets/images/news/news-details/main-1.jpg",
      alt: "Engineering and product testing laboratory",
    },

    {
      type: "heading",
      text: "Contrary to Popular Belief",
    },

    {
      type: "paragraph",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.",
    },

    {
      type: "list",
      items: [
        "There are many variations of passages of Lorem Ipsum available.",
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
        "Many desktop publishing packages and web page editors now use Lorem Ipsum.",
        "The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet.\"",
      ],
    },

    {
      type: "paragraph",
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
  ],
};

export default newsDetails;


export const recentNews = {
  title: "Recent News",
  items: [
    {
      id: 8,
      title: "Designing for Longevity in Architectural Lighting",
      date: "2026-05-14",
      category: "Technology",
      image: "/assets/images/news/news8.jpg",
    },
    {
      id: 9,
      title: "Designing for Longevity in Architectural Lighting",
      date: "2026-05-14",
      category: "Technology",
      image: "/assets/images/news/news9.jpg",
    },
    {
      id: 6,
      title: "Designing for Longevity in Architectural Lighting",
      date: "2026-05-14",
      category: "Technology",
      image: "/assets/images/news/news-6.jpg",
    },
  ]
}

export const ctaData = {
  title: "Let's Talk Lighting",
  description: "Discuss your project, technical requirements, or product selection with our specialists.",
  button: {
    text: "Connect With Us",
    href: "#",
  },
};
