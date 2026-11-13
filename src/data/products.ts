export type Product = {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=480&h=360&fit=crop&auto=format`

const escapeXml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!)
export const placeholderImage = (name: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">` +
      `<rect width="480" height="360" fill="#e5e5e5"/>` +
      `<text x="240" y="180" text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="system-ui, sans-serif" font-size="22" fill="#525252">${escapeXml(name)}</text></svg>`,
  )}`

export const products: Product[] = [
  { id: "p1", name: "Over-Ear Headphones", category: "Audio", price: 3499, description: "Wireless headphones with 30h battery life", image: unsplash("1505740420928-5e560c06d30e") },
  { id: "p2", name: "Wireless Earbuds", category: "Audio", price: 1499, description: "Bluetooth 5.3 earbuds with charging case", image: unsplash("1590658268037-6bf12165a8df") },
  { id: "p3", name: "ANC Earbuds", category: "Audio", price: 2799, description: "Active noise cancelling with low-latency mode", image: unsplash("1606220945770-b5b6c2c55bf1") },
  { id: "p4", name: "Portable Speaker", category: "Audio", price: 2199, description: "Waterproof speaker with 12h battery", image: unsplash("1608043152269-423dbba4e7e1") },
  { id: "p5", name: "Bookshelf Speakers", category: "Audio", price: 4999, description: "Powered 2.0 speakers with Bluetooth input", image: unsplash("1545454675-3531b543be5d") },
  { id: "p6", name: "Mechanical Keyboard", category: "Peripherals", price: 2899, description: "Hot-swappable 75% keyboard", image: unsplash("1618384887929-16ec33fab9ef") },
  { id: "p7", name: "Wireless Mouse", category: "Peripherals", price: 899, description: "Silent clicks, 12-month battery", image: unsplash("1527864550417-7fd91fc51a46") },
  { id: "p8", name: '27" Monitor', category: "Peripherals", price: 12999, description: "QHD IPS display with slim bezels", image: unsplash("1527443224154-c4a3942d3acf") },
  { id: "p9", name: "Ultrabook Laptop", category: "Computers", price: 45999, description: '14" lightweight laptop, 16GB RAM, 512GB SSD', image: unsplash("1593642632559-0c6d3fc62b89") },
  { id: "p10", name: "Gaming Desktop Set", category: "Computers", price: 64999, description: "RTX-ready desktop with monitor, keyboard and mouse", image: unsplash("1625842268584-8f3296236761") },
  { id: "p11", name: "Smartwatch", category: "Wearables", price: 4999, description: "Health tracking, GPS and 7-day battery", image: unsplash("1546868871-7041f2a55e12") },
  { id: "p12", name: "Sport Watch", category: "Wearables", price: 2499, description: "Lightweight watch with step and sleep tracking", image: unsplash("1523275335684-37898b6baf30") },
  { id: "p13", name: "Game Controller", category: "Gaming", price: 2299, description: "Wireless controller for PC and mobile", image: unsplash("1592840496694-26d035b52b48") },
  { id: "p14", name: '50" Smart TV', category: "Smart Home", price: 21999, description: "4K HDR TV with built-in streaming apps", image: unsplash("1593359677879-a4bb92f829d1") },
  { id: "p15", name: "Smart Door Lock", category: "Smart Home", price: 6499, description: "Keyless entry with app and auto-lock", image: unsplash("1558002038-1055907df827") },

  { id: "p16", name: "Classic White Tee", category: "Apparel", price: 399, description: "100% cotton crew-neck t-shirt, regular fit", image: unsplash("1521572163474-6864f9cf17ab") },
  { id: "p17", name: "Essential Black Tee", category: "Apparel", price: 399, description: "Soft everyday tee with minimal chest print", image: unsplash("1583743814966-8936f5b7be1a") },
  { id: "p18", name: "Lucky Cat Graphic Tee", category: "Apparel", price: 549, description: "Retro graphic print on a sand-colored tee", image: unsplash("1576566588028-4147f3842f27") },
  { id: "p19", name: "Skeleton Peace Tee", category: "Apparel", price: 599, description: "Black tee with bold white hand print", image: unsplash("1503341504253-dff4815485f1") },
  { id: "p20", name: "Logo Patch Tee", category: "Apparel", price: 499, description: "Heavyweight white tee with woven label", image: unsplash("1529374255404-311a2a4f1fd9") },
  { id: "p21", name: "Basic Tee 3-Pack", category: "Apparel", price: 999, description: "Three plain tees in white, navy and maroon", image: unsplash("1562157873-818bc0726f68") },

  { id: "p22", name: "Graphics Card", category: "PC Parts", price: 28999, description: "8GB GDDR6 GPU for 1440p gaming", image: unsplash("1591488320449-011701bb6704") },
  { id: "p23", name: "Intel Desktop CPU", category: "PC Parts", price: 11999, description: "6-core desktop processor, LGA socket", image: unsplash("1555617981-dac3880eac6e") },
  { id: "p24", name: "AMD Ryzen CPU", category: "PC Parts", price: 10999, description: "8-core, 16-thread desktop processor, AM4", image: unsplash("1591799264318-7e6ef8ddb7ea") },
  { id: "p25", name: "16GB RAM Kit", category: "PC Parts", price: 2999, description: "2 x 8GB desktop memory modules", image: unsplash("1562976540-1502c2145186") },
  { id: "p26", name: "AIO Liquid Cooler", category: "PC Parts", price: 5499, description: "240mm RGB all-in-one CPU cooler", image: unsplash("1597872200969-2b65d56bd16b") },
  { id: "p27", name: "RGB PC Case", category: "PC Parts", price: 4299, description: "Mid-tower case with tempered glass and 6 fans", image: unsplash("1587202372775-e229f172b9d7") },

  { id: "p28", name: "Ceramic Mug", category: "Home & Living", price: 249, description: "350ml matte white mug, dishwasher safe", image: unsplash("1514228742587-6b1558fcca3d") },
  { id: "p29", name: "Stovetop Kettle", category: "Home & Living", price: 899, description: "2L stainless steel kettle", image: unsplash("1594213114663-d94db9b17125") },
  { id: "p30", name: "Bed Pillow", category: "Home & Living", price: 599, description: "Hypoallergenic fiber-filled pillow", image: unsplash("1584100936595-c0654b55a2e2") },
  { id: "p31", name: "Potted Succulent", category: "Home & Living", price: 349, description: "Low-maintenance plant in a ceramic pot", image: unsplash("1485955900006-10f4d324d411") },
  { id: "p32", name: "Floor Lamp", category: "Home & Living", price: 2499, description: "Adjustable metal floor lamp, E27 socket", image: unsplash("1507473885765-e6ed057f782c") },
  { id: "p33", name: "Ceramic Vase Set", category: "Home & Living", price: 799, description: "Set of three matte bottle vases", image: unsplash("1565193566173-7a0ee3dbe261") },
  { id: "p34", name: "Tufted Accent Chair", category: "Home & Living", price: 6999, description: "Button-tufted chair with white wooden legs", image: unsplash("1567538096630-e0c55bd6374c") },
  { id: "p35", name: "Mustard Armchair", category: "Home & Living", price: 8999, description: "Mid-century armchair with walnut legs", image: unsplash("1586023492125-27b2c045efd7") },
  { id: "p36", name: "Linen Bedding Set", category: "Home & Living", price: 3299, description: "Breathable linen duvet cover and two pillowcases", image: unsplash("1616627561839-074385245ff6") },
  { id: "p37", name: "Scented Soy Candle", category: "Home & Living", price: 449, description: "Hand-poured candle, 40-hour burn time", image: unsplash("1602874801007-bd458bb1b8b6") },
  { id: "p38", name: "Minimal Wall Clock", category: "Home & Living", price: 999, description: "Silent sweep 30cm wall clock", image: unsplash("1563861826100-9cb868fdbe1c") },
  { id: "p39", name: "Swivel Lounge Chair", category: "Home & Living", price: 7499, description: "Upholstered shell chair on a swivel base", image: unsplash("1580480055273-228ff5388ef8") },
  { id: "p40", name: "Velvet 3-Seater Sofa", category: "Home & Living", price: 24999, description: "Deep green velvet sofa with tapered legs", image: unsplash("1555041469-a586c61ea9bc") },
  { id: "p41", name: "Open Bookshelf", category: "Home & Living", price: 8499, description: "Tall pine shelving unit, 5 tiers", image: unsplash("1594620302200-9a762244a156") },
  { id: "p42", name: "Enameled Dutch Oven", category: "Home & Living", price: 3999, description: "Cast iron pot, 4.5L, oven safe", image: unsplash("1590794056226-79ef3a8147e1") },
  { id: "p43", name: "Chef Knife Set", category: "Home & Living", price: 2799, description: "Five forged knives with a canvas roll", image: unsplash("1593618998160-e34014e67546") },
  { id: "p44", name: "Insulated Water Bottle", category: "Home & Living", price: 699, description: "Stainless steel, keeps drinks cold 24h", image: unsplash("1602143407151-7111542de6e8") },

  { id: "p45", name: "Pullover Hoodie", category: "Apparel", price: 1299, description: "Brushed fleece hoodie with kangaroo pocket", image: unsplash("1556821840-3a63f95609a7") },
  { id: "p46", name: "Leather Biker Jacket", category: "Apparel", price: 6999, description: "Genuine leather jacket with asymmetric zip", image: unsplash("1551028719-00167b16eac5") },
  { id: "p47", name: "Utility Field Jacket", category: "Apparel", price: 2499, description: "Cotton twill jacket with four pockets", image: unsplash("1544022613-e87ca75a784a") },
  { id: "p48", name: "Classic Denim Jeans", category: "Apparel", price: 1799, description: "Straight-fit jeans in mid and dark wash", image: unsplash("1542272604-787c3835535d") },
  { id: "p49", name: "Red Maxi Dress", category: "Apparel", price: 2299, description: "Flowing maxi dress with a fitted waist", image: unsplash("1595777457583-95e059d581b8") },
  { id: "p50", name: "Crewneck Sweatshirt", category: "Apparel", price: 999, description: "Heavyweight cotton sweatshirt, relaxed fit", image: unsplash("1620799140408-edc6dcb6d633") },

  { id: "p51", name: "Knit Running Shoes", category: "Footwear", price: 4499, description: "Lightweight knit upper with responsive foam", image: unsplash("1542291026-7eec264c27ff") },
  { id: "p52", name: "Leather Court Sneakers", category: "Footwear", price: 3999, description: "Tan leather sneakers with a cushioned sole", image: unsplash("1549298916-b41d501d3772") },
  { id: "p53", name: "Canvas Skate Shoes", category: "Footwear", price: 2199, description: "Durable suede and canvas low-tops", image: unsplash("1525966222134-fcfa99b8ae77") },
  { id: "p54", name: "Air Cushion Runners", category: "Footwear", price: 5499, description: "Visible air unit for all-day comfort", image: unsplash("1600185365483-26d7a4cc7519") },

  { id: "p55", name: "Everyday Backpack", category: "Bags & Accessories", price: 1899, description: "Water-resistant backpack with laptop sleeve", image: unsplash("1553062407-98eeb64c6a62") },
  { id: "p56", name: "Quilted Crossbody Bag", category: "Bags & Accessories", price: 4999, description: "Chevron-quilted leather with chain strap", image: unsplash("1548036328-c9fa89d128fa") },
  { id: "p57", name: "Woven Top-Handle Bag", category: "Bags & Accessories", price: 3499, description: "Rattan and leather structured handbag", image: unsplash("1590874103328-eac38a683ce7") },
  { id: "p58", name: "Leather Rucksack", category: "Bags & Accessories", price: 3999, description: "Full-grain leather backpack, ages beautifully", image: unsplash("1622560480605-d83c853bc5c3") },
  { id: "p59", name: "Classic Sunglasses", category: "Bags & Accessories", price: 1499, description: "Polarized lenses with UV400 protection", image: unsplash("1572635196237-14b3f281503f") },
  { id: "p60", name: "Leather Bifold Wallet", category: "Bags & Accessories", price: 999, description: "Slim wallet with six card slots", image: unsplash("1627123424574-724758594e93") },
  { id: "p61", name: "Trucker Cap", category: "Bags & Accessories", price: 499, description: "Breathable mesh-back cap, adjustable", image: unsplash("1588850561407-ed78c282e89b") },
  { id: "p62", name: "Minimalist Wristwatch", category: "Bags & Accessories", price: 2999, description: "Leather strap watch with a clean dial", image: unsplash("1524592094714-0f0654e20314") },
  { id: "p63", name: "Tortoiseshell Eyeglasses", category: "Bags & Accessories", price: 1999, description: "Retro frames with blue-light lenses", image: unsplash("1574258495973-f010dfbb5371") },
  { id: "p64", name: "Hard-Shell Suitcase", category: "Bags & Accessories", price: 5999, description: "Carry-on spinner with TSA lock", image: unsplash("1565026057447-bc90a3dceb87") },

  { id: "p65", name: "Sapphire Drop Earrings", category: "Jewelry", price: 3499, description: "Crystal-framed statement earrings", image: unsplash("1535632066927-ab7c9ab60908") },
  { id: "p66", name: "Pearl Necklace", category: "Jewelry", price: 4999, description: "Freshwater pearls in a gift box", image: unsplash("1515562141207-7a88fb7ce338") },

  { id: "p67", name: "Floral Eau de Parfum", category: "Beauty", price: 5999, description: "Warm floral fragrance, 100ml", image: unsplash("1541643600914-78b084683601") },
  { id: "p68", name: "Gentle Face Cleanser", category: "Beauty", price: 599, description: "Low-foam cleanser for daily use", image: unsplash("1556228578-8c89e6adf883") },
  { id: "p69", name: "Body Lotion", category: "Beauty", price: 499, description: "Light, fast-absorbing body emulsion", image: unsplash("1620916566398-39f1143ab7be") },
  { id: "p70", name: "Skincare Starter Kit", category: "Beauty", price: 1999, description: "Cleanser, toner, cream and a mini mask", image: unsplash("1598440947619-2c35fc9aa908") },
  { id: "p71", name: "Lipstick & Gloss Duo", category: "Beauty", price: 899, description: "Matching satin lipstick and shine gloss", image: unsplash("1586495777744-4413f21062fa") },
  { id: "p72", name: "Makeup Brush Set", category: "Beauty", price: 1299, description: "Soft synthetic brushes for face and eyes", image: unsplash("1596462502278-27bfdc403348") },

  { id: "p73", name: "Poetry Collection", category: "Books & Stationery", price: 599, description: "Bestselling modern poetry paperback", image: unsplash("1544947950-fa07a98d237f") },
  { id: "p74", name: "Business Book Bundle", category: "Books & Stationery", price: 2499, description: "Seven essential startup and strategy reads", image: unsplash("1512820790803-83ca734da794") },
  { id: "p75", name: "Spiral Notebook & Pen", category: "Books & Stationery", price: 249, description: "A5 dotted notebook with gel pen", image: unsplash("1531346878377-a5be20888e57") },

  { id: "p76", name: "Whole Coffee Beans", category: "Food & Drinks", price: 649, description: "Medium roast, 500g, notes of cocoa", image: unsplash("1517668808822-9ebb02f2a0e6") },
  { id: "p77", name: "Loose Leaf Tea Set", category: "Food & Drinks", price: 899, description: "Ceramic teapot with two cups and green tea", image: unsplash("1564890369478-c89ca6d9cde9") },
  { id: "p78", name: "Dark Chocolate", category: "Food & Drinks", price: 299, description: "70% single-origin cacao, 200g", image: unsplash("1511381939415-e44015466834") },

  { id: "p79", name: "Yoga Mat", category: "Sports & Outdoors", price: 999, description: "6mm non-slip mat with carry strap", image: unsplash("1601925260368-ae2f83cf8b7f") },
  { id: "p80", name: "Hex Dumbbell Pair", category: "Sports & Outdoors", price: 1999, description: "Rubber-coated dumbbells, 2 x 5kg", image: unsplash("1638536532686-d610adfc8e5c") },
  { id: "p81", name: "Single-Speed Bike", category: "Sports & Outdoors", price: 15999, description: "Steel city bike with leather saddle", image: unsplash("1485965120184-e220f721d03e") },
  { id: "p82", name: "Camping Tent", category: "Sports & Outdoors", price: 4999, description: "Waterproof 2-person dome tent", image: unsplash("1504280390367-361c6d9f38f4") },
  { id: "p83", name: "Basketball", category: "Sports & Outdoors", price: 1299, description: "Official size 7 composite leather ball", image: unsplash("1519861531473-9200262188bf") },
  { id: "p84", name: "Soccer Ball", category: "Sports & Outdoors", price: 1099, description: "Match-grade size 5 ball", image: unsplash("1579952363873-27f3bade9f55") },

  { id: "p85", name: "Smartphone 128GB", category: "Phones & Cameras", price: 39999, description: '6.1" OLED display, dual camera', image: unsplash("1511707171634-5f897ff02aa9") },
  { id: "p86", name: "Tablet with Stylus", category: "Phones & Cameras", price: 29999, description: '11" display, pencil included', image: unsplash("1544244015-0df4b3ffc6b0") },
  { id: "p87", name: "DSLR Camera", category: "Phones & Cameras", price: 32999, description: "24MP sensor with 18-55mm kit lens", image: unsplash("1502920917128-1aa500764cbd") },
  { id: "p88", name: "Mirrorless Lens Kit", category: "Phones & Cameras", price: 54999, description: "Compact body with prime and zoom lenses", image: unsplash("1516035069371-29a1b244cc32") },
  { id: "p89", name: "Instant Camera", category: "Phones & Cameras", price: 5999, description: "Prints photos in seconds", image: unsplash("1526170375885-4d8ecf77b99f") },
  { id: "p90", name: "Camera Drone", category: "Phones & Cameras", price: 34999, description: "4K gimbal camera, 30-min flight time", image: unsplash("1473968512647-3e447244af8f") },

  { id: "p91", name: "Next-Gen Console", category: "Gaming", price: 29999, description: "4K gaming console with wireless controller", image: unsplash("1606144042614-b2417e99c4e3") },
  { id: "p92", name: "VR Headset", category: "Gaming", price: 21999, description: "Standalone VR with two motion controllers", image: unsplash("1622979135225-d2ba269cf1ac") },
  { id: "p93", name: "Smart Speaker", category: "Smart Home", price: 4999, description: "Voice assistant with room-filling sound", image: unsplash("1543512214-318c7553f230") },
  { id: "p94", name: "Studio Microphone", category: "Audio", price: 6499, description: "Broadcast dynamic mic with boom arm", image: unsplash("1590602847861-f357a9332bbc") },
  { id: "p95", name: "Vinyl Turntable", category: "Audio", price: 8999, description: "Belt-drive record player, built-in preamp", image: unsplash("1603048588665-791ca8aea617") },

  { id: "p96", name: "Building Bricks Set", category: "Toys & Hobbies", price: 1999, description: "1,000 colorful interlocking bricks", image: unsplash("1587654780291-39c9404d746b") },
  { id: "p97", name: "Wooden Train Set", category: "Toys & Hobbies", price: 1799, description: "Classic track set with station and cars", image: unsplash("1596461404969-9ae70f2830c1") },
  { id: "p98", name: "Strategy Board Game", category: "Toys & Hobbies", price: 2499, description: "Trade, build and settle. 3–4 players", image: unsplash("1610890716171-6b1bb98ffd09") },
  { id: "p99", name: "Acoustic Guitar", category: "Toys & Hobbies", price: 7999, description: "Spruce top dreadnought with gig bag", image: unsplash("1510915361894-db8b60106cb1") },

  { id: "p100", name: "Cozy Dog Hoodie", category: "Pets", price: 599, description: "Soft fleece hoodie for small breeds", image: unsplash("1583337130417-3346a1be7dee") },
  { id: "p101", name: "Suede Bomber Jacket", category: "Apparel", price: 3499, description: "Rust suede bomber with ribbed cuffs", image: unsplash("1591047139829-d91aecb6caea") },
  { id: "p102", name: "Electric Guitar", category: "Toys & Hobbies", price: 12999, description: "Solid-body guitar with dual humbuckers", image: unsplash("1550291652-6ea9114a47b1") },
]

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value)
