export const recentProducts = [
  {
    id: 1,
    title: "Royal Stallion Rice",
    excerpt: "Premium long-grain parboiled rice, stone-free and high swell.",
    price: 85000,
    unit: "50kg Bag",
    moq: "5 Bags",
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Honey Beans (Oloyin)",
    excerpt:
      "Sweet, fast-cooking premium beans sourced from North-Central Nigeria.",
    price: 45000,
    unit: "50kg Bag",
    moq: "2 Bags",
    rating: 4.9,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Onitsha White Yam",
    excerpt: "Large, dry, and sweet yams perfect for pounding or boiling.",
    price: 12000,
    unit: "Set of 5 Tubers",
    moq: "3 Sets",
    rating: 4.7,
    reviews: 56,
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Kings Vegetable Oil",
    excerpt: "Cholesterol-free, high-quality cooking oil for healthy frying.",
    price: 52000,
    unit: "25L Jerrycan",
    moq: "2 Jerrycans",
    rating: 4.6,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Golden Penny Garri",
    excerpt: "Fine-grained, crispy yellow garri. Well-processed and sand-free.",
    price: 32000,
    unit: "50kg Bag",
    moq: "4 Bags",
    rating: 4.5,
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1626132646535-3c06152a4687?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Derica Tomato Paste",
    excerpt:
      "Rich, concentrated tomato puree for authentic stew color and taste.",
    price: 28500,
    unit: "Carton (50 Sachets)",
    moq: "1 Carton",
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1590779033100-9f60705a013d?q=80&w=600&auto=format&fit=crop",
  },
];

export const mockReviews = [
  {
    id: 1,
    name: "Alhaji Musa Bello",
    role: "Wholesale Distributor",
    location: "Kano",
    content:
      "The consistency of the Royal Stallion Rice is unmatched. Clean Foods has become our primary source for northern distribution because of their stone-free guarantee.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mrs. Ngozi Okoro",
    role: "Catering CEO",
    location: "Lagos",
    content:
      "When catering for 500+ guests, you can't afford bad beans. Their Honey Beans cook evenly and the taste is exceptional. Delivery is always on time.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Omoefe",
    role: "Retail Store Owner",
    location: "Warri",
    content:
      "Finding a reliable supplier in Delta was tough until I found Clean Foods. Their pricing is transparent, and the bulk discounts actually make sense for small retailers.",
    rating: 4,
  },
];

export const categories = [
  {
    id: "grains",
    name: "Rice & Grains",
    products: [
      {
        id: 1,
        title: "Royal Stallion Rice",
        price: 85000,
        unit: "50kg Bag",
        moq: "5 Bags",
        rating: 4.8,
        reviews: 124,
        image:
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600",
        excerpt: "Premium long-grain parboiled rice.",
      },
      {
        id: 4,
        title: "Mama Gold Rice",
        price: 82000,
        unit: "50kg Bag",
        moq: "5 Bags",
        rating: 4.6,
        reviews: 95,
        image:
          "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=600",
        excerpt: "High-quality Nigerian grown rice.",
      },
      {
        id: 5,
        title: "White Maize",
        price: 35000,
        unit: "100kg Bag",
        moq: "2 Bags",
        rating: 4.5,
        reviews: 42,
        image:
          "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600",
        excerpt: "Dry white maize for processing.",
      },
      {
        id: 6,
        title: "Local Brown Rice",
        price: 70000,
        unit: "50kg Bag",
        moq: "10 Bags",
        rating: 4.9,
        reviews: 31,
        image:
          "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=600",
        excerpt: "Unpolished, nutrient-dense local rice.",
      },
    ],
  },
  {
    id: "tubers",
    name: "Yam & Tubers",
    products: [
      {
        id: 3,
        title: "Onitsha White Yam",
        price: 12000,
        unit: "Set of 5",
        moq: "3 Sets",
        rating: 4.7,
        reviews: 56,
        image:
          "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=600",
        excerpt: "Large, dry, and sweet yams.",
      },
    ],
  },
];
