import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Habib",
  lastName: "Hussaini",
  name: "Habib Hussaini",
  role: "Graphic Designer",
  avatar: "/images/avatar.jpg",
  email: "24.hussaini@gmail.com",
  location: "Kabul, Afghanistan" as Person["location"],
  languages: ["Dari", "English", "Pashto"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and Graphic Design</>,
};

const social: Social = [
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "WhatsApp",
    icon: "whatsapp",
    link: "https://wa.me/93788415299",
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "Habib Hussaini — Graphic Designer",
  description: "Senior Graphic Designer specializing in branding, print, and real-world visual systems.",
  headline: <>Senior Graphic Designer</>,
  featured: {
    display: false,
    title: <></>,
    href: "/work",
  },
  subline: <>Graphic Designer specializing in branding, print, and real-world visual systems.</>,
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Kabul, Afghanistan`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I’m a Senior Graphic Designer based in Kabul with 5+ years of experience in branding,
        advertising, and print production. I lead real-world branding projects from concept to
        execution, including design, production supervision, and on-site installation. My work
        focuses on building clear, functional, and consistent brand experiences, especially in
        large-scale environments like retail spaces and community projects.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Ahmadi Printing Press",
        timeframe: "2020 – Present",
        role: "Senior Graphic Designer",
        achievements: [
          <>
            Lead branding and print execution projects from concept development through production
            supervision and on-site implementation.
          </>,
        ],
        images: [],
      },
      {
        company: "Jawid Printing Press",
        timeframe: "2018 – 2020",
        role: "Graphic Designer",
        achievements: [
          <>
            Designed print and signage materials for commercial clients while maintaining quality,
            consistency, and production readiness.
          </>,
        ],
        images: [],
      },
      {
        company: "Freelancig",
        timeframe: "2023 – Present",
        role: "Founder",
        achievements: [
          <>
            Founded and lead a branding-focused studio delivering identity systems, signage,
            and retail branding execution.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Services",
    institutions: [
      {
        name: "Branding & Visual Identity",
        description: <></>,
      },
      {
        name: "Print & Signage Design",
        description: <></>,
      },
      {
        name: "Retail & Environmental Branding",
        description: <></>,
      },
      {
        name: "Project Management & Execution",
        description: <></>,
      },
      {
        name: "Creative Direction",
        description: <></>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Skills",
    skills: [
      {
        title: "Professional Skills",
        tags: [
          { name: "Photoshop", icon: "photoshop" },
          { name: "Illustrator", icon: "illustrator" },
          { name: "CorelDraw", icon: "coreldraw" },
          { name: "Premiere Pro", icon: "premiere" },
          { name: "Figma", icon: "figma" },
          // Closest semantic matches from the available icon set.
          { name: "Branding", icon: "gallery" },
          { name: "Print Production", icon: "document" },
          { name: "Signage", icon: "globe" },
          { name: "Project Management", icon: "calendar" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog",
  description: `Updates from ${person.name}`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Branding and design projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
