export const seedUsers = [
  { name: "Admin", email: "admin@bikroy.com", password: "admin123", role: "admin" as const, customer: false },
  { name: "Rahim Uddin", email: "rahim@example.com", password: "user123", role: "user" as const, customer: true },
  { name: "Karim Ahmed", email: "karim@example.com", password: "user123", role: "user" as const, customer: true },
  { name: "Fatima Begum", email: "fatima@example.com", password: "user123", role: "user" as const, customer: true },
];

export const seedCategories = [
  { title: "Smartphones", imageUrl: "https://placehold.co/400x300/2563eb/ffffff?text=Smartphones" },
  { title: "Laptops", imageUrl: "https://placehold.co/400x300/7c3aed/ffffff?text=Laptops" },
  { title: "Tablets", imageUrl: "https://placehold.co/400x300/059669/ffffff?text=Tablets" },
  { title: "Headphones", imageUrl: "https://placehold.co/400x300/dc2626/ffffff?text=Headphones" },
  { title: "Smartwatches", imageUrl: "https://placehold.co/400x300/d97706/ffffff?text=Smartwatches" },
  { title: "Cameras", imageUrl: "https://placehold.co/400x300/0891b2/ffffff?text=Cameras" },
  { title: "Gaming", imageUrl: "https://placehold.co/400x300/be185d/ffffff?text=Gaming" },
  { title: "Accessories", imageUrl: "https://placehold.co/400x300/4f46e5/ffffff?text=Accessories" },
];

export const seedProducts = [
  // Smartphones
  { title: "Samsung Galaxy S24 Ultra", description: "6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3, 200MP camera, 5000mAh battery with S Pen support.", price: 159999, discountedPrice: 149999, category: "Smartphones", imageUrl: ["https://placehold.co/600x400/1e40af/ffffff?text=Galaxy+S24+Ultra"], sellCount: 45 },
  { title: "iPhone 15 Pro Max", description: "6.7-inch Super Retina XDR display, A17 Pro chip, 48MP camera system, titanium design with USB-C.", price: 189999, discountedPrice: null, category: "Smartphones", imageUrl: ["https://placehold.co/600x400/1f2937/ffffff?text=iPhone+15+Pro+Max"], sellCount: 62 },
  { title: "OnePlus 12", description: "6.82-inch LTPO AMOLED display, Snapdragon 8 Gen 3, 50MP Hasselblad camera, 5400mAh battery.", price: 89999, discountedPrice: 84999, category: "Smartphones", imageUrl: ["https://placehold.co/600x400/dc2626/ffffff?text=OnePlus+12"], sellCount: 28 },
  { title: "Xiaomi 14", description: "6.36-inch LTPO AMOLED display, Snapdragon 8 Gen 3, Leica optics 50MP camera, 4610mAh battery.", price: 69999, discountedPrice: 64999, category: "Smartphones", imageUrl: ["https://placehold.co/600x400/f97316/ffffff?text=Xiaomi+14"], sellCount: 35 },
  // Laptops
  { title: "MacBook Air M3", description: "13.6-inch Liquid Retina display, Apple M3 chip, 8GB RAM, 256GB SSD, up to 18 hours battery life.", price: 144999, discountedPrice: 139999, category: "Laptops", imageUrl: ["https://placehold.co/600x400/6b7280/ffffff?text=MacBook+Air+M3"], sellCount: 38 },
  { title: "Dell XPS 15", description: "15.6-inch OLED 3.5K display, Intel Core i7-13700H, 16GB RAM, 512GB SSD, NVIDIA RTX 4050.", price: 179999, discountedPrice: 169999, category: "Laptops", imageUrl: ["https://placehold.co/600x400/0ea5e9/ffffff?text=Dell+XPS+15"], sellCount: 22 },
  { title: "ASUS ROG Zephyrus G14", description: "14-inch QHD+ 165Hz display, AMD Ryzen 9 7940HS, 16GB RAM, 1TB SSD, RTX 4060.", price: 199999, discountedPrice: null, category: "Laptops", imageUrl: ["https://placehold.co/600x400/7c3aed/ffffff?text=ROG+Zephyrus+G14"], sellCount: 15 },
  { title: "Lenovo ThinkPad X1 Carbon", description: "14-inch WUXGA IPS display, Intel Core i7-1365U, 16GB RAM, 512GB SSD, MIL-STD-810H certified.", price: 159999, discountedPrice: 149999, category: "Laptops", imageUrl: ["https://placehold.co/600x400/1f2937/ffffff?text=ThinkPad+X1+Carbon"], sellCount: 18 },
  // Tablets
  { title: "iPad Pro M4", description: "11-inch Ultra Retina XDR Tandem OLED display, Apple M4 chip, 256GB storage, Face ID.", price: 129999, discountedPrice: null, category: "Tablets", imageUrl: ["https://placehold.co/600x400/3b82f6/ffffff?text=iPad+Pro+M4"], sellCount: 30 },
  { title: "Samsung Galaxy Tab S9 Ultra", description: "14.6-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, 12GB RAM, 256GB storage.", price: 109999, discountedPrice: 99999, category: "Tablets", imageUrl: ["https://placehold.co/600x400/2563eb/ffffff?text=Galaxy+Tab+S9+Ultra"], sellCount: 20 },
  // Headphones
  { title: "Sony WH-1000XM5", description: "Industry-leading noise cancelling, 30-hour battery life, multipoint connection.", price: 39999, discountedPrice: 34999, category: "Headphones", imageUrl: ["https://placehold.co/600x400/1f2937/ffffff?text=Sony+WH-1000XM5"], sellCount: 85 },
  { title: "Apple AirPods Pro 2", description: "Active Noise Cancellation, Adaptive Transparency, Spatial Audio, USB-C MagSafe case.", price: 32999, discountedPrice: null, category: "Headphones", imageUrl: ["https://placehold.co/600x400/d1d5db/1f2937?text=AirPods+Pro+2"], sellCount: 120 },
  { title: "JBL Tune 770NC", description: "Adaptive noise cancelling, 44-hour battery life, foldable design, JBL Pure Bass sound.", price: 12999, discountedPrice: 9999, category: "Headphones", imageUrl: ["https://placehold.co/600x400/eab308/ffffff?text=JBL+Tune+770NC"], sellCount: 95 },
  // Smartwatches
  { title: "Apple Watch Ultra 2", description: "49mm titanium case, 2000-nit display, dual-frequency GPS, 36-hour battery life.", price: 89999, discountedPrice: null, category: "Smartwatches", imageUrl: ["https://placehold.co/600x400/f97316/ffffff?text=Apple+Watch+Ultra+2"], sellCount: 25 },
  { title: "Samsung Galaxy Watch 6 Classic", description: "47mm rotating bezel, Super AMOLED display, BioActive Sensor, Wear OS.", price: 44999, discountedPrice: 39999, category: "Smartwatches", imageUrl: ["https://placehold.co/600x400/2563eb/ffffff?text=Galaxy+Watch+6+Classic"], sellCount: 40 },
  { title: "Amazfit T-Rex Ultra", description: "1.39-inch AMOLED display, dual-band GPS, 100m water resistance, 20-day battery.", price: 34999, discountedPrice: 29999, category: "Smartwatches", imageUrl: ["https://placehold.co/600x400/16a34a/ffffff?text=Amazfit+T-Rex+Ultra"], sellCount: 18 },
  // Cameras
  { title: "Sony Alpha a7 IV", description: "33MP full-frame CMOS sensor, 4K 60fps video, 10fps burst, 5-axis stabilization.", price: 249999, discountedPrice: 239999, category: "Cameras", imageUrl: ["https://placehold.co/600x400/1f2937/ffffff?text=Sony+a7+IV"], sellCount: 12 },
  { title: "Canon EOS R50", description: "24.2MP APS-C sensor, 4K 30fps video, 15fps electronic shutter, eye detection AF.", price: 84999, discountedPrice: 79999, category: "Cameras", imageUrl: ["https://placehold.co/600x400/be123c/ffffff?text=Canon+EOS+R50"], sellCount: 22 },
  // Gaming
  { title: "PlayStation 5 Slim", description: "Custom AMD CPU & GPU, 1TB SSD, 4K 120fps gaming, DualSense controller.", price: 69999, discountedPrice: null, category: "Gaming", imageUrl: ["https://placehold.co/600x400/0ea5e9/ffffff?text=PS5+Slim"], sellCount: 75 },
  { title: "Xbox Series X", description: "Custom AMD Zen 2 CPU, 12 TFLOPS GPU, 1TB SSD, 4K 120fps.", price: 64999, discountedPrice: 59999, category: "Gaming", imageUrl: ["https://placehold.co/600x400/16a34a/ffffff?text=Xbox+Series+X"], sellCount: 55 },
  { title: "Nintendo Switch OLED", description: "7-inch OLED screen, adjustable stand, enhanced audio, 64GB storage.", price: 44999, discountedPrice: 39999, category: "Gaming", imageUrl: ["https://placehold.co/600x400/dc2626/ffffff?text=Switch+OLED"], sellCount: 60 },
  // Accessories
  { title: "Logitech MX Master 3S", description: "8000 DPI sensor, quiet clicks, MagSpeed scroll wheel, USB-C quick charging.", price: 12999, discountedPrice: null, category: "Accessories", imageUrl: ["https://placehold.co/600x400/6366f1/ffffff?text=MX+Master+3S"], sellCount: 110 },
  { title: "Samsung T7 Portable SSD 1TB", description: "USB 3.2 Gen 2, up to 1050MB/s read, AES 256-bit encryption.", price: 14999, discountedPrice: 12999, category: "Accessories", imageUrl: ["https://placehold.co/600x400/0284c7/ffffff?text=Samsung+T7+SSD"], sellCount: 88 },
  { title: "Anker 737 Power Bank 24000mAh", description: "140W max output, smart digital display, dual USB-C + USB-A ports.", price: 9999, discountedPrice: 8499, category: "Accessories", imageUrl: ["https://placehold.co/600x400/059669/ffffff?text=Anker+737+PowerBank"], sellCount: 72 },
];
