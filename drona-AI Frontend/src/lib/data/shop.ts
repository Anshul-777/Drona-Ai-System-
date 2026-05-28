export type ProductTier = "Legendary" | "Epic" | "Rare" | "Standard";

export interface ShopProduct {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  tier: ProductTier;
  image: string;
  category: string;
  locked?: boolean;
  unlockLevel?: number;
  rating: number;
  reviews: number;
  features: string[];
}

export const shopProducts: ShopProduct[] = [
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14"',
    shortDescription: "M3 Pro chip. The ultimate machine for compiling code, running simulations, and crushing your academic quests.",
    fullDescription: "The MacBook Pro 14-inch blasts forward with M3 Pro, an incredibly advanced chip that brings massive performance and capabilities for extreme workflows. With best-in-class battery life—up to 18 hours—and a beautiful Liquid Retina XDR display, it's the ultimate pro laptop for any serious scholar.",
    price: 150000,
    tier: "Legendary",
    image: "/shop/macbook.png",
    category: "Technology",
    rating: 5.0,
    reviews: 124,
    features: ["M3 Pro Chip with 11-core CPU", "14.2-inch Liquid Retina XDR display", "18 hours battery life", "18GB Unified Memory"]
  },
  {
    id: "ipad-air-pencil",
    name: "iPad Air + Pencil",
    shortDescription: "The perfect companion for digital note-taking, sketching diagrams, and studying on the go.",
    fullDescription: "Supercharged by the M2 chip. iPad Air features a stunning Liquid Retina display, landscape 12MP Ultra Wide front camera, and superfast Wi-Fi 6E. Paired with the Apple Pencil Pro, it becomes the ultimate digital canvas and notebook.",
    price: 85000,
    tier: "Epic",
    image: "/shop/ipad.png",
    category: "Technology",
    locked: true,
    unlockLevel: 100,
    rating: 4.8,
    reviews: 89,
    features: ["M2 Chip", "10.9-inch Liquid Retina display", "Apple Pencil Pro included", "Landscape 12MP Ultra Wide front camera"]
  },
  {
    id: "ultrawide-monitor",
    name: "Elite Curved Ultrawide Monitor",
    shortDescription: "34-inch curved immersive display for ultimate multitasking and focus.",
    fullDescription: "Maximize your workspace with this 34-inch curved ultrawide monitor. Featuring a 144Hz refresh rate, HDR1000, and picture-in-picture mode, it allows you to view lectures, write code, and take notes simultaneously without breaking your flow.",
    price: 110000,
    tier: "Legendary",
    image: "/shop/monitor.png",
    category: "Technology",
    rating: 4.9,
    reviews: 56,
    features: ["34-inch Curved WQHD (3440 x 1440)", "144Hz Refresh Rate", "HDR1000", "USB-C Power Delivery"]
  },
  {
    id: "noise-canceling-headphones",
    name: "Quantum Noise-Canceling Headphones",
    shortDescription: "Achieve deep focus with industry-leading active noise cancellation.",
    fullDescription: "Block out distractions and enter the flow state. These premium over-ear headphones feature adaptive active noise cancellation, spatial audio, and up to 40 hours of battery life on a single charge. Perfect for loud environments.",
    price: 45000,
    tier: "Epic",
    image: "/shop/headphones.png",
    category: "Essential Gear",
    rating: 4.7,
    reviews: 210,
    features: ["Adaptive Active Noise Cancellation", "Spatial Audio", "40 hours battery life", "Premium metallic finish"]
  },
  {
    id: "tactical-pen-set",
    name: "Tactical Precision Pen Set",
    shortDescription: "Machined aluminum body with micro-textured grip.",
    fullDescription: "Write with absolute precision. This set of three tactical pens features a machined aerospace-grade aluminum body, a micro-textured grip for extended writing sessions, and pressurized ink cartridges that write at any angle.",
    price: 4500,
    tier: "Rare",
    image: "/shop/pen.png",
    category: "Essential Gear",
    rating: 4.5,
    reviews: 32,
    features: ["Aerospace-grade aluminum", "Pressurized ink", "Micro-textured grip"]
  },
  {
    id: "tech-backpack",
    name: "Scholar Pro Tech Backpack",
    shortDescription: "Waterproof, minimal, and engineered for organization.",
    fullDescription: "Carry your gear in style. This minimalist backpack is constructed from ultra-durable waterproof materials. It features a suspended laptop sleeve, RFID-blocking pockets, and an ergonomic back panel for all-day comfort.",
    price: 12000,
    tier: "Rare",
    image: "/shop/backpack.png",
    category: "Essential Gear",
    rating: 4.8,
    reviews: 145,
    features: ["Waterproof construction", "Suspended 16-inch laptop sleeve", "RFID-blocking pockets", "Ergonomic back panel"]
  },
  {
    id: "physics-lamp",
    name: "Legendary Physics Lamp",
    shortDescription: "Articulated multi-axis design with adjustable temperature.",
    fullDescription: "Illuminate your workspace perfectly. This articulated multi-axis desk lamp allows for infinite positioning. Features smart temperature control to reduce eye strain during late-night study sessions.",
    price: 8000,
    tier: "Rare",
    image: "/shop/lamp.png",
    category: "Essential Gear",
    rating: 4.6,
    reviews: 78,
    features: ["Multi-axis articulation", "Adjustable color temperature", "Touch controls", "Flicker-free LED"]
  },
  {
    id: "master-notebooks",
    name: "Master Scholar Notebooks",
    shortDescription: "Set of 5. Heavyweight dotted grid paper.",
    fullDescription: "The quintessential canvas for your thoughts. A set of five premium notebooks featuring 120gsm heavyweight dotted grid paper that prevents ink bleeding. Wrapped in a durable, minimalist cover.",
    price: 3200,
    tier: "Standard",
    image: "/shop/notebook.png",
    category: "Essential Gear",
    rating: 4.9,
    reviews: 412,
    features: ["120gsm bleed-proof paper", "Dotted grid format", "Set of 5", "Lay-flat binding"]
  },
  {
    id: "xp-booster-24h",
    name: "2x XP Booster (24h)",
    shortDescription: "Double your experience points gained from all activities.",
    fullDescription: "Accelerate your progression! Consuming this booster will grant you a 100% bonus to all XP earned from completing lessons, winning arena battles, and finishing quests for the next 24 real-world hours.",
    price: 1500,
    tier: "Standard",
    image: "icon:local_cafe", // Using special syntax for icon
    category: "Boosters",
    rating: 4.4,
    reviews: 890,
    features: ["+100% XP Gain", "Lasts 24 hours", "Stacks with weekend events"]
  }
];
