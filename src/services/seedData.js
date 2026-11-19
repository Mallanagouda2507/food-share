// Sample demo data as required by the FoodShare specification:
// 1. Fresh Vegetable Meals – 20 servings
// 2. Fresh Fruits Basket – 10 servings
// 3. Bread and Bakery Items – 15 servings
// 4. Rice and Dal – 25 servings

export const SAMPLE_DONATIONS = [
  {
    foodName: "Fresh Vegetable Meals",
    category: "Cooked Food",
    quantity: "20 meal boxes",
    servings: 20,
    description: "Wholesome freshly cooked mixed vegetable curry, chapati, and steamed rice prepared in a certified commercial kitchen. Packed in hygiene-sealed boxes, ideal for immediate community distribution.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    location: "Green Leaf Community Kitchen, 42 Market St, Central District",
    contact: "+1 (555) 234-5678",
    donorName: "Green Leaf Kitchen (Demo Donor)",
    donorEmail: "donor@foodshare.org",
    preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    expiryAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),   // 6 hours from now
    status: "available",
    isDemo: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    foodName: "Fresh Fruits Basket",
    category: "Fruits",
    quantity: "4 large crates (Approx 10-12 kg)",
    servings: 10,
    description: "Assorted seasonal fresh fruits including organic apples, ripe bananas, sweet oranges, and seedless grapes from local farm market surplus.",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80",
    location: "Sunrise Organic Grocers, 108 Valley Way",
    contact: "+1 (555) 345-6789",
    donorName: "Sunrise Organics (Demo Donor)",
    donorEmail: "grocer@foodshare.org",
    preparedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours from now
    status: "available",
    isDemo: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    foodName: "Bread and Bakery Items",
    category: "Bakery",
    quantity: "15 artisanal loaves & assorted baguettes",
    servings: 15,
    description: "Freshly baked whole wheat sourdough, artisan baguettes, dinner rolls, and fruit muffins made this morning. Safe, delicious and packaged in paper bakery bags.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    location: "Golden Crust Bakery, 77 Baker Ave",
    contact: "+1 (555) 456-7890",
    donorName: "Golden Crust Bakery (Demo Donor)",
    donorEmail: "bakery@foodshare.org",
    preparedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours from now
    status: "available",
    isDemo: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    foodName: "Rice and Dal",
    category: "Cooked Food",
    quantity: "1 large insulated thermal container",
    servings: 25,
    description: "Hot, nutritious yellow lentil dal tadka paired with fluffy jeera basmati rice. Kept under strict temperature control in food-grade thermal containers.",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    location: "Heritage Banquet Hall, 500 Grand Pavilion",
    contact: "+1 (555) 567-8901",
    donorName: "Heritage Events (Demo Donor)",
    donorEmail: "events@foodshare.org",
    preparedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    status: "available",
    isDemo: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  }
];

export const FOOD_PRESETS = [
  {
    name: "Vegetable Meal Box",
    category: "Cooked Food",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Assorted Fresh Fruit",
    category: "Fruits",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Artisan Breads & Pastries",
    category: "Bakery",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Rice & Lentil Feast",
    category: "Cooked Food",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Farm Fresh Vegetables",
    category: "Vegetables",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Packaged Dry Goods & Canned Food",
    category: "Packaged Food",
    imageUrl: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=1200&q=80"
  }
];
