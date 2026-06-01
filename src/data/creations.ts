export type CreationCategory =
  | "Cakes"
  | "Cupcakes"
  | "Treats"
  | "Cookies"
  | "Party Favors"
  | "Seasonal";

export type CreationItem = {
  id: string;
  title: string;
  category: CreationCategory;
  description: string;
  image: string;
  fallbackImage?: string;
  featured?: boolean;
};

export const creationCategories: CreationCategory[] = [
  "Cakes",
  "Cupcakes",
  "Treats",
  "Cookies",
  "Party Favors",
  "Seasonal",
];

export const creations: CreationItem[] = [
  {
    id: "dinosaur-birthday-cake",
    title: "Dinosaur Birthday Cake",
    category: "Cakes",
    description: "A bright dinosaur themed cake made for birthdays, parties, and photo-ready celebrations.",
    image: "/assets/creations/main_site_cake.png",
    fallbackImage: "/assets/creations/farm-birthday-cake.svg",
    featured: true,
  },
  {
    id: "birthday-cupcake",
    title: "Birthday Cupcake Set",
    category: "Cupcakes",
    description: "Soft, colorful cupcakes with custom colors, toppers, and celebratory details.",
    image: "/assets/creations/birthday-cupcake.svg",
    featured: true,
  },
  {
    id: "chocolate-strawberries",
    title: "Chocolate Covered Strawberries",
    category: "Treats",
    description: "Dipped strawberries dressed up for gifts, parties, date nights, and dessert tables.",
    image: "/assets/creations/chocolate-strawberries.svg",
    featured: true,
  },
  {
    id: "decorated-sugar-cookies",
    title: "Decorated Sugar Cookies",
    category: "Cookies",
    description: "Custom cookies with colors, names, dates, and themed designs for any occasion.",
    image: "/assets/creations/decorated-sugar-cookies.svg",
  },
  {
    id: "party-favor-boxes",
    title: "Party Favor Boxes",
    category: "Party Favors",
    description: "Sweet favor bundles that can match your party colors, theme, and guest count.",
    image: "/assets/creations/party-favor-boxes.svg",
  },
  {
    id: "holiday-treat-tray",
    title: "Holiday Treat Tray",
    category: "Seasonal",
    description: "Seasonal sweets arranged for holidays, school events, office treats, and family gatherings.",
    image: "/assets/creations/holiday-treat-tray.svg",
  },
];
