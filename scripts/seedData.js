/**
 * Seed script — wipes and re-seeds categories + packages from PACKAGE_CONTENT.md
 * Run: node scripts/seedData.js
 */
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI);
console.log('✓ Connected to MongoDB');

/* ---- Models ---- */
const Category = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
}));

const daySchema = new mongoose.Schema({ day: Number, title: String, activities: String }, { _id: false });
const Package = mongoose.model('Package', new mongoose.Schema({
  name: String, category: mongoose.Schema.Types.ObjectId,
  duration: String, itinerary: [daySchema],
  transport: String, accommodation: String, description: String,
  image: String, images: [String],
  highlights: [String], includes: [String], excludes: [String],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true }));

/* ---- Wipe ---- */
await Category.deleteMany({});
await Package.deleteMany({});
console.log('✓ Cleared existing data');

/* ---- Categories ---- */
const categoryDefs = [
  { name: 'Cultural Heritage',    description: 'Explore ancient kingdoms, sacred temples, and UNESCO World Heritage Sites across Sri Lanka' },
  { name: 'Beach & Coastal',      description: 'Pristine beaches, whale watching, surfing, and coastal lagoons along Sri Lanka\'s stunning coastline' },
  { name: 'Wildlife & Safari',    description: 'Leopards, elephants, blue whales and exotic birds in Sri Lanka\'s world-class national parks' },
  { name: 'Hill Country & Tea',   description: 'Misty mountains, scenic train rides, tea estate walks and breathtaking highland landscapes' },
  { name: 'Adventure & Trekking', description: 'Hiking, rock climbing, white-water rafting and adrenaline-fuelled experiences island-wide' },
  { name: 'City & Culture',       description: 'Colombo\'s vibrant city life, colonial architecture, street food, and modern urban experiences' },
  { name: 'Family Holidays',      description: 'Kid-friendly adventures across Sri Lanka — elephants, beaches, trains and ancient wonders for the whole family' },
];

const categories = await Category.insertMany(categoryDefs);
const catMap = {};
categories.forEach(c => { catMap[c.name] = c._id; });
console.log('✓ Created', categories.length, 'categories');

/* ---- Common arrays ---- */
const stdExcludes = [
  'International flights',
  'Sri Lanka visa fees',
  'Lunch and dinner (unless specified)',
  'Personal expenses & shopping',
  'Travel insurance',
  'Tips for guide and driver',
];

/* ---- Package data ---- */
const packageDefs = [
  {
    name: 'Classic Sri Lanka — 8 Days Cultural Triangle & South Coast',
    category: 'Cultural Heritage',
    duration: '8 Days / 7 Nights',
    isFeatured: true,
    description: 'The ultimate introduction to Sri Lanka. This 8-day journey takes you through the legendary Cultural Triangle — Sigiriya, Dambulla, Polonnaruwa, Anuradhapura — before sweeping south to the colonial charm of Galle Fort and the golden beaches of Unawatuna. Perfectly paced for first-time visitors who want to experience the very best of the island.',
    highlights: [
      'Climb the iconic Sigiriya Rock Fortress (UNESCO World Heritage)',
      'Explore ancient Dambulla Cave Temple frescoes',
      'Discover the ruined kingdoms of Polonnaruwa',
      'Walk the ramparts of 17th-century Galle Fort (UNESCO)',
      'Relax on the golden sands of Unawatuna Beach',
      'Sunset at Mirissa Beach',
    ],
    transport: 'Private AC Vehicle with English-speaking driver-guide',
    accommodation: 'Flexible — 3-star to 5-star options confirmed after consultation',
    includes: [
      'Private AC transport throughout',
      'English-speaking driver-guide',
      'Daily breakfast',
      'Entrance fees to all sites mentioned',
      'Airport transfers (arrival + departure)',
      '24/7 local support',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Sigiriya', activities: 'Pick up from Bandaranaike International Airport (CMB). Transfer to Sigiriya (approx. 4 hours). Afternoon at leisure. Check in to hotel. Welcome dinner on own.' },
      { day: 2, title: 'Sigiriya Rock & Pidurangala', activities: 'Morning: Climb the iconic Sigiriya Rock Fortress — ancient palace ruins, frescoes, and panoramic views from the summit. Afternoon: Optional hike up Pidurangala Rock for dramatic views of Sigiriya. Evening: Village cycle tour or bullock cart ride through paddy fields.' },
      { day: 3, title: 'Dambulla Cave Temple & Polonnaruwa', activities: 'Morning: Visit the Dambulla Cave Temple — 5 caves with over 150 Buddha statues and ancient frescoes. Transfer to Polonnaruwa. Afternoon: Explore the ruined medieval capital — Gal Vihara rock temples, Royal Palace, Lotus Pond. Overnight in Polonnaruwa/Habarana area.' },
      { day: 4, title: 'Anuradhapura → Kandy', activities: 'Full morning at Anuradhapura — the sacred city, Sri Maha Bodhi (the world\'s oldest recorded tree), Ruwanwelisaya stupa. Afternoon: Drive to Kandy (approx. 3 hours). Evening: Cultural Kandyan dance show. Visit the sacred Temple of the Tooth Relic.' },
      { day: 5, title: 'Kandy → Scenic Train → Nuwara Eliya', activities: 'Morning: Kandy city tour — Kandy Lake, gem museum, local markets. Scenic train from Kandy to Nanu Oya (one of Asia\'s most scenic rail journeys). Transfer to Nuwara Eliya. Afternoon: Visit a tea factory and estate. Walk through manicured tea gardens. Evening: Explore "Little England" — colonial post office, racecourse, Victoria Park.' },
      { day: 6, title: 'Nuwara Eliya → Ella', activities: 'Morning at leisure in cool highland air. Scenic drive to Ella (approx. 2 hours). Afternoon: Hike to Little Adam\'s Peak (easy, stunning views). Visit Nine Arch Bridge — the iconic colonial stone viaduct. Ella village walk — cafes, art galleries, local shops.' },
      { day: 7, title: 'Ella → Galle Fort', activities: 'Morning: Optional sunrise hike. Drive to the South Coast — Galle (approx. 3.5 hours). Afternoon: Explore Galle Fort — Dutch colonial architecture, ramparts, lighthouse, boutique shops. Sunset walk on the fort walls. Evening: Galle town dinner on own.' },
      { day: 8, title: 'Unawatuna Beach → Departure', activities: 'Morning: Relax at Unawatuna Beach — golden sands, calm turquoise water. Optional: Sea turtle hatchery visit, snorkeling. Afternoon: Transfer to Colombo Airport for departure flight. (Approx. 2 hours from Galle)' },
    ],
  },

  {
    name: 'Wild Sri Lanka — 7 Days Wildlife & Safari',
    category: 'Wildlife & Safari',
    duration: '7 Days / 6 Nights',
    isFeatured: true,
    description: 'Sri Lanka is one of the world\'s great wildlife destinations — home to the highest density of leopards on Earth, wild elephants, blue whales, and over 400 bird species. This 7-day safari journey covers the island\'s premier wildlife parks: Yala, Udawalawe, and Minneriya, with an unforgettable whale-watching excursion off Mirissa.',
    highlights: [
      'Yala National Park — highest leopard density in the world',
      'Udawalawe — herds of wild elephants at close range',
      'Minneriya — "The Gathering" (hundreds of elephants at one water source)',
      'Blue whale watching off Mirissa coast (world\'s best location)',
      'Elephant Transit Home — orphaned elephant feeding visit',
      'Birdwatching in Sinharaja Rainforest (optional add-on)',
    ],
    transport: 'Private AC 4WD Safari Jeep + AC vehicle for transfers',
    accommodation: 'Flexible — safari lodges, boutique eco-resorts, 3-star to 5-star options after consultation',
    includes: [
      'Private AC vehicle and 4WD jeep for all transfers and safaris',
      'English-speaking naturalist guide for all safaris',
      'All national park jeep fees and entrance fees',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
      '24/7 local support',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Minneriya / Habarana', activities: 'Arrive CMB. Transfer to Minneriya area (approx. 4 hours). Late afternoon jeep safari at Minneriya National Park — famous for "The Gathering" where hundreds of elephants congregate around the ancient reservoir. Overnight in Habarana/Sigiriya area.' },
      { day: 2, title: 'Kaudulla Morning Safari → Travel South', activities: 'Early morning optional safari at Kaudulla or Hurulu for more elephant encounters. After breakfast, drive south toward Udawalawe (approx. 4.5 hours). En route: lunch stop in Kandy or Kurunegala area. Check in to Udawalawe area hotel.' },
      { day: 3, title: 'Udawalawe National Park — Full Day', activities: 'Full day at Udawalawe — two jeep safaris (morning and late afternoon/evening). Sri Lanka\'s best park for large herds of wild elephants. Also: water buffalo, crocodiles, numerous raptors and waterbirds. Midday: Visit the Elephant Transit Home — orphaned baby elephants fed milk bottles (public feeding at fixed times).' },
      { day: 4, title: 'Udawalawe → Mirissa (Whale Watching prep)', activities: 'Early morning safari at Udawalawe. After breakfast, drive to Mirissa (south coast, approx. 2 hours). Afternoon: Relax at Mirissa Beach. Overnight in Mirissa. Early night — whale watching boat departs at 6:00 AM.' },
      { day: 5, title: 'Whale Watching → Yala National Park', activities: 'Early morning: 4-5 hour whale watching excursion from Mirissa harbour — Sri Lanka\'s waters host the largest blue whales on Earth. Spinner dolphins, sperm whales and Bryde\'s whales also commonly sighted. After returning, drive to Yala area (approx. 1.5 hours). Late afternoon: First jeep safari in Yala National Park — world\'s best location to spot leopards.' },
      { day: 6, title: 'Yala Full Day Safaris', activities: 'Two jeep safaris (sunrise and late afternoon). Yala is home to: leopards, sloth bears, mugger crocodiles, wild boar, spotted deer, painted storks, peacocks, and sea eagles. Afternoon at leisure — pool, birdwatching around hotel, sunset views.' },
      { day: 7, title: 'Yala → Colombo → Departure', activities: 'Morning safari if time permits. Drive to Colombo Airport for departure (approx. 4.5 hours). En route: optional stop at Galle Fort.' },
    ],
  },

  {
    name: 'Hill Country Express — 5 Days Tea & Trains',
    category: 'Hill Country & Tea',
    duration: '5 Days / 4 Nights',
    isFeatured: true,
    description: 'Sri Lanka\'s hill country is one of the most beautiful landscapes in Asia — mist-draped mountains, emerald tea estates, silver waterfalls, and the world-famous scenic railway. This 5-day journey is ideal for nature lovers and photographers. Starting in Kandy and ending in the dramatic hills around Ella, every moment is postcard-perfect.',
    highlights: [
      'World-famous Kandy to Ella scenic train ride through tea country',
      'Nine Arch Bridge — iconic colonial stone viaduct in the jungle',
      'Horton Plains National Park — World\'s End cliff drop & Baker\'s Falls',
      'Tea factory visit and estate walk in Nuwara Eliya',
      'Lipton\'s Seat — panoramic viewpoint over Haputale hills',
      'Little Adam\'s Peak hike (beginner-friendly, stunning views)',
    ],
    transport: 'Scenic train (Kandy–Nanu Oya) + Private AC vehicle',
    accommodation: 'Flexible — tea estate bungalows, boutique hill country lodges (confirmed after consultation)',
    includes: [
      'Train tickets (Kandy to Nanu Oya — scenic class)',
      'Private AC vehicle for all road transfers',
      'English-speaking guide throughout',
      'Horton Plains National Park entrance fee',
      'Tea factory tour and tasting',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Kandy', activities: 'Arrive CMB. Transfer to Kandy (approx. 3 hours). Afternoon: Kandy city tour — Kandy Lake, gem workshop, local markets, spice garden. Evening: Kandyan traditional dance and fire-walking show. Visit the Temple of the Tooth Relic (Sri Dalada Maligawa) — Sri Lanka\'s most sacred Buddhist shrine.' },
      { day: 2, title: 'Scenic Train → Nuwara Eliya', activities: 'Morning: Board the famous hill country train from Kandy station. 3 hours of breathtaking mountain scenery — tunnels, bridges, waterfalls, and tea-draped hillsides. Arrive Nanu Oya, transfer to Nuwara Eliya ("Little England" at 1,868m). Afternoon: Tea factory visit — see withering, rolling, fermenting and drying of Ceylon Tea. Explore colonial town: racecourse, Victoria Park, old post office.' },
      { day: 3, title: 'Horton Plains → Haputale → Ella', activities: 'Very early start (5:30 AM) for Horton Plains National Park — walk to World\'s End (sheer 870m cliff with valley views) and Baker\'s Falls (waterfall in cloud forest). Return before 10 AM when mist rolls in. Drive through Haputale: stop at Lipton\'s Seat. Continue to Ella. Afternoon: Explore Ella village — cafes, local art shops, relaxed hill town atmosphere.' },
      { day: 4, title: 'Ella: Nine Arch Bridge & Little Adam\'s Peak', activities: 'Morning hike to Little Adam\'s Peak — 45-minute easy walk with panoramic valley views. Visit Nine Arch Bridge — the stunning double-curved stone railway viaduct. Best visited at 10:15 AM and 2:45 PM when trains cross. Afternoon: Ravana Falls, local ayurvedic massage, or Ella village at leisure.' },
      { day: 5, title: 'Ella → Colombo Airport → Departure', activities: 'Early breakfast. Drive to Colombo Airport via the Southern Expressway (approx. 4 hours). En route: optional stop at Buduruvagala rock carvings or Ratnapura gem market. Departure.' },
    ],
  },

  {
    name: 'South Coast Escape — 6 Days Beaches, Whales & Galle Fort',
    category: 'Beach & Coastal',
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    description: 'Sri Lanka\'s south coast is a world-class beach destination — from the surf breaks of Weligama and the whale waters of Mirissa to the UNESCO-listed ramparts of Galle Fort. This relaxed 6-day coastal journey pairs culture with coastline, perfect for couples, honeymooners, and beach lovers.',
    highlights: [
      'Blue whale watching at Mirissa — world\'s best location (Dec–Apr)',
      'Galle Fort — UNESCO-listed 17th-century Dutch fortification',
      'Unawatuna Beach — calm, golden, coral-fringed',
      'Weligama surf lessons (perfect for beginners)',
      'Stilt fishermen of Koggala at sunset',
      'Rekawa Beach — sea turtle nesting site',
    ],
    transport: 'Private AC vehicle with driver-guide',
    accommodation: 'Flexible — boutique beach hotels and colonial-style Galle Fort guesthouses (confirmed after consultation)',
    includes: [
      'Private AC vehicle for all transfers',
      'English-speaking guide for cultural sites',
      'Whale watching boat tour from Mirissa harbour',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
    ],
    excludes: [
      'International flights',
      'Sri Lanka visa fees',
      'Surf lessons (available at extra cost)',
      'Lunch and dinner (unless specified)',
      'Personal expenses & shopping',
      'Travel insurance',
      'Tips for guide and driver',
    ],
    itinerary: [
      { day: 1, title: 'Arrival → Mirissa Beach', activities: 'Arrive CMB. Drive directly to Mirissa, south coast (approx. 3.5 hours on the Southern Expressway). Afternoon: Check in, relax on Mirissa Beach. Sunset swim. Early dinner and early to bed — whale watching departs 6 AM tomorrow.' },
      { day: 2, title: 'Blue Whale Watching → Unawatuna', activities: '6:00 AM: Depart Mirissa harbour on whale watching catamaran. 4-5 hour excursion on the open ocean — blue whales (the largest animals on Earth) regularly sighted December through April. Spinner dolphins almost guaranteed. After returning: drive to Unawatuna Beach (20 minutes). Afternoon: swim, snorkel over the coral reef, or relax on one of Sri Lanka\'s most beautiful beaches.' },
      { day: 3, title: 'Galle Fort & Koggala Lagoon', activities: 'Morning: Explore Galle Fort — walk the 17th-century Dutch ramparts, browse boutique shops, visit the Dutch Reformed Church, National Maritime Museum, and charming fort cafes. Afternoon: Koggala Lagoon boat safari — cinnamon island, mangroves, and the famous stilt fishermen. Evening: Sunset on the Galle Fort ramparts.' },
      { day: 4, title: 'Weligama Surf & Talpe Beaches', activities: 'Morning: Surf lesson at Weligama Bay — the gentlest beginner break in Sri Lanka, warm water, long rolling waves. Afternoon: Talpe — Jungle Beach and Dalawella Beach (less crowded, stunning). Swing on the famous rope swing over the ocean. Optional visit to the Japanese Peace Pagoda on Rumassala hill.' },
      { day: 5, title: 'Tangalle & Rekawa Turtles', activities: 'Drive east along the coast to Tangalle — a quieter, wilder coastline with sweeping bays. Afternoon: Rekawa Turtle Conservation Project — five species of sea turtle nest on this beach. Evening guided turtle watch (seasonal, April–September). Return to Unawatuna/Galle area.' },
      { day: 6, title: 'Galle → Colombo → Departure', activities: 'Morning at leisure — last swim or fort walk. Drive to Colombo Airport (approx. 2.5 hours). Departure.' },
    ],
  },

  {
    name: 'Adventure Sri Lanka — 7 Days Trekking, Rafting & Climbing',
    category: 'Adventure & Trekking',
    duration: '7 Days / 6 Nights',
    isFeatured: false,
    description: 'For the active traveller who wants more than beaches and temples. This 7-day adventure takes you white-water rafting on the Kelani River, hiking to Adam\'s Peak for a sacred sunrise, ziplining in Kitulgala jungle, and trekking through cloud forest at Horton Plains. Sri Lanka packs more adventures per square kilometre than almost anywhere on Earth.',
    highlights: [
      'Adam\'s Peak (Sri Pada) — sacred 2,243m summit, iconic sunrise pilgrimage',
      'White-water rafting on Kelani River (Grade 3-4 rapids)',
      'Ziplining and jungle adventure at Kitulgala',
      'Horton Plains — World\'s End 870m cliff and Baker\'s Falls',
      'Ella Rock hike — 360° views over the hill country',
      'Ravana Falls swimming and cave exploration',
    ],
    transport: 'Private AC vehicle with driver + adventure equipment included',
    accommodation: 'Flexible — adventure lodges, jungle eco-camps, hill country retreats (confirmed after consultation)',
    includes: [
      'Private AC vehicle throughout',
      'All adventure activity equipment and professional guides',
      'Horton Plains National Park entrance fee',
      'White-water rafting with qualified guide (8km Kelani River)',
      'Adam\'s Peak night hike guide',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
    ],
    excludes: [
      'International flights',
      'Sri Lanka visa fees',
      'Ziplining and optional adventure extras',
      'Lunch and dinner (unless specified)',
      'Personal expenses & shopping',
      'Travel insurance',
      'Tips for guide and driver',
    ],
    itinerary: [
      { day: 1, title: 'Arrival → Kitulgala', activities: 'Arrive CMB. Drive directly to Kitulgala (approx. 2 hours through mountain roads). This jungle riverside town is Sri Lanka\'s adventure capital. Evening briefing for tomorrow\'s rafting. Overnight at riverside lodge.' },
      { day: 2, title: 'White-Water Rafting + Ziplining', activities: 'Morning: White-water rafting on the Kelani River — 8km of Grade 3-4 rapids through pristine jungle gorge. Spectacular, safe, exhilarating. Lunch at camp. Afternoon: Kitulgala jungle trekking and optional ziplining/waterfall abseiling. The Kitulgala Forest Reserve was the filming location for The Bridge on the River Kwai (1957). Overnight Kitulgala.' },
      { day: 3, title: 'Kitulgala → Nuwara Eliya → Adam\'s Peak (Night Hike)', activities: 'Drive to Nuwara Eliya (approx. 2 hours). Afternoon at leisure — rest important for tonight\'s hike. 11:00 PM: Depart for Adam\'s Peak / Dalhousie. Midnight: Begin the climb — 5,500+ steps, trail illuminated with fairy lights during pilgrimage season (Dec–Apr). Summit at sunrise (around 5:30 AM). Watch the sacred sunrise and the famous triangular shadow cast across the misty plains.' },
      { day: 4, title: 'Rest Day → Ella', activities: 'Return to guesthouse for rest, shower, and breakfast. Late morning: drive to Ella (approx. 2 hours through tea country). Afternoon: Ella village at leisure, cafes, views. Early night after the Adam\'s Peak climb.' },
      { day: 5, title: 'Ella Rock Hike + Nine Arch Bridge + Ravana Falls', activities: 'Early morning: Ella Rock — 3-4 hour strenuous circular trail through jungle and tea estates to rocky summit (1,041m) with 360° views of the hill country. Mid-morning: Nine Arch Bridge — time for a train crossing. Afternoon: Ravana Falls — swim in natural pools below the 25m waterfall. Optional: Ravana Cave exploration.' },
      { day: 6, title: 'Horton Plains & World\'s End', activities: 'Very early start (5:30 AM) for Horton Plains National Park. 9km circular walk: World\'s End (870m vertical cliff edge — one of the most dramatic viewpoints in Asia) and Baker\'s Falls (waterfall in montane cloud forest). Must complete before 10 AM when mist rolls in. Afternoon at leisure.' },
      { day: 7, title: 'Ella → Colombo Airport → Departure', activities: 'Drive to Colombo Airport (approx. 4-5 hours). Departure.' },
    ],
  },

  {
    name: 'Ancient Kingdoms — 5 Days Cultural Triangle Deep Dive',
    category: 'Cultural Heritage',
    duration: '5 Days / 4 Nights',
    isFeatured: false,
    description: 'A deep dive into Sri Lanka\'s ancient civilisations — the great hydraulic kingdoms of Anuradhapura and Polonnaruwa, the fortress-palace of Sigiriya, and the sacred cave temples of Dambulla. This itinerary is for history lovers, photographers and anyone who wants to understand one of Asia\'s oldest and most remarkable civilisations. All four sites are UNESCO World Heritage Listed.',
    highlights: [
      'Sigiriya Rock Fortress — ancient palace on a 200m granite monolith (UNESCO)',
      'Polonnaruwa — medieval ruined capital with stunning Gal Vihara statues',
      'Anuradhapura — Sri Lanka\'s sacred first capital (300 BC)',
      'Dambulla Cave Temple — 2,000-year-old frescoes and 150 Buddha statues',
      'Sri Maha Bodhi — world\'s oldest historically recorded tree (288 BC)',
      'Village life experience — bullock cart, cooking class, paddy fields',
    ],
    transport: 'Private AC vehicle with expert cultural heritage guide',
    accommodation: 'Flexible — boutique heritage hotels and eco-lodges (confirmed after consultation)',
    includes: [
      'Private AC vehicle with cultural heritage expert guide',
      'All four UNESCO World Heritage Site entrance fees',
      'Village experience tour (bullock cart, cooking class)',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Sigiriya', activities: 'Arrive CMB. Transfer to Sigiriya (approx. 4 hours). En route: optional stop at Pinnawala Elephant Orphanage. Afternoon: settle in. Sunset views from the hotel terrace overlooking paddy fields. Overnight in Sigiriya/Habarana.' },
      { day: 2, title: 'Sigiriya Rock + Dambulla Cave Temple', activities: 'Dawn: Climb Sigiriya Rock Fortress before the heat (best light for photos). The ancient palace sits atop a 200m granite monolith — explore the frescoes, mirror wall, royal gardens, and panoramic summit. Afternoon: Dambulla Golden Cave Temple — 5 interconnected caves with 2,000-year-old frescoes. Over 150 Buddha statues. Evening: Traditional village experience — bullock cart ride, cooking class with a local family, paddy field walk.' },
      { day: 3, title: 'Polonnaruwa — Medieval Capital', activities: 'Full day at Polonnaruwa — Sri Lanka\'s medieval capital (11th-13th century AD). Visit: Royal Palace complex, Audience Hall, the Vatadage (circular relic house), Rankoth Vehera stupa, and the unmissable Gal Vihara — four colossal Buddha figures carved into a single granite face. Optional: cycle through the archaeological park.' },
      { day: 4, title: 'Anuradhapura — Sacred Ancient City', activities: 'Sri Lanka\'s sacred first capital. Visit: Sri Maha Bodhi (the sacred Bodhi tree, planted 288 BC — world\'s oldest historically recorded tree), Ruwanwelisaya (great white stupa, 91m tall), Thuparama (Sri Lanka\'s oldest stupa), Jetavanaramaya (once one of the tallest structures in the ancient world), and Isurumuniya rock temple with the famous carved lovers.' },
      { day: 5, title: 'Anuradhapura → Colombo → Departure', activities: 'Morning at leisure (optional early morning photography at Anuradhapura — magical golden light). Drive to Colombo Airport (approx. 4 hours). En route: optional stop at Pinnawala Elephant Orphanage or Kandy city. Departure.' },
    ],
  },

  {
    name: 'Colombo & West Coast — 4 Days City & Beach',
    category: 'City & Culture',
    duration: '4 Days / 3 Nights',
    isFeatured: false,
    description: 'Perfect as a standalone short break or add-on to a longer tour, this 4-day itinerary combines the buzz of Colombo with the laid-back beach towns of the west coast — Negombo and Bentota. Great for city lovers, foodies, and those who want beaches with easy airport access.',
    highlights: [
      'Colombo city tour — Pettah bazaar, colonial Fort district, Gangaramaya Temple',
      'Colombo\'s world-class food scene and Galle Face Green oceanfront',
      'Negombo beach and traditional fishing village atmosphere',
      'Bentota Beach — one of Sri Lanka\'s finest west coast beaches',
      'Madu River boat safari — mangroves, cinnamon islands, fish therapy',
      'Brief Garden — Geoffrey Bawa\'s extraordinary private jungle estate',
    ],
    transport: 'Private AC vehicle with driver-guide',
    accommodation: 'Flexible — city hotels and boutique beach resorts (confirmed after consultation)',
    includes: [
      'Private AC vehicle for all transfers',
      'English-speaking city guide',
      'Madu River boat safari (2 hours)',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Negombo', activities: 'Arrive CMB. Short transfer to Negombo (30 minutes — ideal for first-night jet lag recovery near the airport). Afternoon: Negombo fish market and beach. Negombo Lagoon boat ride past Dutch canal system and traditional fishing community. Evening: fresh seafood dinner on the beach.' },
      { day: 2, title: 'Colombo City Tour', activities: 'Morning: Drive to Colombo (45 mins). Full city tour: Pettah Bazaar (chaotic, colourful street market), Gangaramaya Buddhist Temple, Kelaniya Raja Maha Vihara, Independence Memorial Hall, Viharamahadevi Park, Colombo National Museum. Afternoon: Colonial Fort district, Old Parliament, Lighthouse, Galle Face Green (Colombo\'s famous oceanfront promenade). Evening: Colombo 7 restaurant and bar scene.' },
      { day: 3, title: 'Bentota & Madu River Safari', activities: 'Drive south to Bentota (approx. 1.5 hours). Morning: Madu River boat safari — 2-hour journey through 64 islands, mangrove tunnels, cinnamon islands, and fish therapy pools. Afternoon: Bentota Beach — one of Sri Lanka\'s finest west coast beaches. Optional: Brief Garden — Geoffrey Bawa\'s extraordinary private jungle estate. Overnight in Bentota.' },
      { day: 4, title: 'Bentota → Colombo Airport → Departure', activities: 'Morning at leisure — last beach swim or resort pool time. Drive to Colombo Airport (approx. 1.5 hours). Departure.' },
    ],
  },

  {
    name: 'Complete Sri Lanka — 14 Days Island-Wide Grand Tour',
    category: 'Cultural Heritage',
    duration: '14 Days / 13 Nights',
    isFeatured: true,
    description: 'The definitive Sri Lanka experience. This 14-day grand tour covers the entire island — ancient ruins, misty mountains, wildlife safaris, whale watching, colonial forts, and golden beaches. Ideal for travellers who want to see everything Sri Lanka has to offer in a single, perfectly paced journey.',
    highlights: [
      'Complete Cultural Triangle: Sigiriya, Dambulla, Polonnaruwa, Anuradhapura',
      'Temple of the Tooth Relic — Kandy (Sri Lanka\'s most sacred shrine)',
      'World\'s most scenic train — Kandy to Nanu Oya through tea country',
      'Horton Plains National Park — World\'s End cliff drop',
      'Ella Rock hike + Nine Arch Bridge',
      'Yala National Park — leopard safari (world\'s highest density)',
      'Udawalawe — wild elephant herds in open scrubland',
      'Blue whale watching — Mirissa (world\'s best location)',
      'Galle Fort (UNESCO World Heritage)',
      'Unawatuna & Mirissa beaches',
    ],
    transport: 'Private AC vehicle with expert driver-guide throughout + scenic train (Kandy–Nanu Oya)',
    accommodation: 'Flexible — tailored mix of 3 to 5-star properties confirmed with client',
    includes: [
      'Private AC vehicle and expert driver-guide throughout',
      'Scenic train tickets (Kandy to Nanu Oya)',
      'All national park 4WD jeep safaris',
      'Blue whale watching excursion (Mirissa)',
      'All UNESCO and national park entrance fees',
      'Airport transfers (arrival + departure)',
      'Daily breakfast',
      '24/7 local support',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Negombo / Colombo', activities: 'Arrive CMB. Overnight near airport in Negombo or Colombo to recover from long-haul flight.' },
      { day: 2, title: 'Colombo City Tour → Sigiriya', activities: 'Morning: Quick Colombo highlights — Galle Face Green, Gangaramaya Temple, Pettah Bazaar. Drive to Sigiriya (approx. 4 hours). Overnight Sigiriya.' },
      { day: 3, title: 'Sigiriya Rock & Village Life', activities: 'Climb Sigiriya Rock Fortress. Afternoon: Pidurangala Rock optional hike. Evening: village experience — bullock cart ride, cooking class with local family, paddy field walk.' },
      { day: 4, title: 'Dambulla Cave Temple → Polonnaruwa', activities: 'Dambulla Golden Cave Temple in the morning (2,000-year-old frescoes). Drive to Polonnaruwa. Afternoon: archaeological park — Gal Vihara, Royal Palace, Rankoth Vehera.' },
      { day: 5, title: 'Anuradhapura — Ancient Sacred City', activities: 'Full day: Sri Maha Bodhi, Ruwanwelisaya, Jetavanaramaya, Isurumuniya. Drive toward Kandy overnight en route.' },
      { day: 6, title: 'Kandy — Sacred City', activities: 'Temple of the Tooth Relic. Kandy Lake walk. Gem museum. Botanical Gardens (Peradeniya — 147 acres). Kandyan dance and fire-walking show. Overnight Kandy.' },
      { day: 7, title: 'Scenic Train → Nuwara Eliya', activities: 'Board the iconic hill country train from Kandy. 3 hours of mountain scenery. Nuwara Eliya: tea factory tour, Victoria Park, colonial town walk.' },
      { day: 8, title: 'Horton Plains → Haputale → Ella', activities: 'Dawn: Horton Plains — World\'s End and Baker\'s Falls (must complete before 10 AM). Drive through Haputale: Lipton\'s Seat viewpoint. Arrive Ella. Nine Arch Bridge. Ella village evening.' },
      { day: 9, title: 'Ella: Rock Hike & Waterfalls', activities: 'Ella Rock hike (full morning, 360° views). Ravana Falls swimming. Little Adam\'s Peak optional. Evening at leisure in Ella.' },
      { day: 10, title: 'Ella → Udawalawe National Park', activities: 'Drive south. Afternoon jeep safari at Udawalawe National Park. Evening: Elephant Transit Home milk feeding session. Overnight near Udawalawe.' },
      { day: 11, title: 'Udawalawe Full Day Safaris', activities: 'Morning and afternoon jeep safaris. Wild elephant herds, crocodiles, waterbirds, raptors. Overnight Udawalawe / Tissamaharama area.' },
      { day: 12, title: 'Yala National Park', activities: 'Transfer to Yala (1 hour). Full day: two jeep safaris (sunrise and sunset). Leopards, sloth bears, peacocks, crocodiles, sea eagles. World\'s best location to spot leopards. Overnight near Yala.' },
      { day: 13, title: 'Mirissa Whale Watching + Galle Fort', activities: '6:00 AM: Whale watching catamaran from Mirissa harbour. Return by 11 AM. Drive to Galle Fort (30 mins). Afternoon: explore the 17th-century Dutch fort — ramparts, boutique shops, Dutch architecture, sunset. Overnight Galle/Unawatuna.' },
      { day: 14, title: 'Unawatuna Beach → Departure', activities: 'Morning: Unawatuna Beach final swim. Optional snorkeling on the coral reef. Drive to Colombo Airport (approx. 2.5 hours). Departure.' },
    ],
  },

  // ── FAMILY PACKAGES ──────────────────────────────────────────────────────
  {
    name: 'Family Sri Lanka — 7 Days Family Adventure',
    category: 'Family Holidays',
    duration: '7 Days / 6 Nights',
    isFeatured: true,
    description: 'Designed especially for families with children of all ages. This perfectly-paced 7-day adventure combines gentle cultural experiences, exciting wildlife encounters, and gorgeous beaches — all at a relaxed family-friendly rhythm. Kid-approved activities at every stop, with zero wasted time on long transfers.',
    highlights: [
      'Climb Sigiriya Rock Fortress with family — kids love the adventure',
      'Elephant encounter at Pinnawala Elephant Orphanage',
      'Scenic hill country train ride — kids\' favourite in Sri Lanka',
      'Udawalawe wild elephant safari (jeep)',
      'Unawatuna Beach — calm, shallow, safe for all ages',
      'Turtle hatchery visit on the south coast',
    ],
    transport: 'Family private AC vehicle with child-friendly driver-guide',
    accommodation: 'Family rooms / villas confirmed after consultation',
    includes: [
      'Private AC family vehicle throughout',
      'English-speaking family-friendly guide',
      'Daily breakfast',
      'Entrance fees to all listed sites',
      'Airport transfers (arrival + departure)',
      '24/7 local support',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Pinnawala', activities: 'Pick up from Bandaranaike International Airport. Transfer to Pinnawala (approx. 2 hours). Afternoon: Pinnawala Elephant Orphanage — watch elephants bathe in the river (kids absolutely love this). Overnight Pinnawala / Kegalle area.' },
      { day: 2, title: 'Pinnawala → Sigiriya', activities: 'Morning: Last elephant feeding session. Drive to Sigiriya (approx. 2 hours). Afternoon: Climb Sigiriya Rock Fortress — a real adventure for the whole family with lion\'s paw entrance, ancient frescoes, and 360° views from the summit. Evening: Village cycle tour or bullock cart ride.' },
      { day: 3, title: 'Dambulla → Kandy', activities: 'Morning: Dambulla Cave Temple — colourful Buddha statues, fascinating frescoes. Drive to Kandy (approx. 2 hours). Afternoon: Kandy botanical gardens (Peradeniya) — giant trees, orchid house, bamboo avenue. Evening: Temple of the Tooth Relic. Optional: Kandyan cultural show with fire-walking.' },
      { day: 4, title: 'Kandy → Scenic Train → Nuwara Eliya', activities: 'Board the iconic hill country train from Kandy Station. 3 hours of the world\'s most scenic rail journey through tea estates and misty mountains. Kids love leaning out of the open doors! Nuwara Eliya: tea factory tour, Victoria Park, strawberry farm visit. Overnight Nuwara Eliya.' },
      { day: 5, title: 'Nuwara Eliya → Udawalawe Safari', activities: 'Morning: Cool highland walks and optional horse rides for kids. Drive south to Udawalawe (approx. 2.5 hours). Afternoon jeep safari at Udawalawe National Park — guaranteed wild elephant herds! Evening: Elephant Transit Home baby elephant milk feeding session at 6 PM.' },
      { day: 6, title: 'Galle Fort & South Coast Beaches', activities: 'Morning: Drive to Galle (approx. 2 hours). Galle Fort walk — ice cream on the ramparts, gift shops, lighthouse. Afternoon: Unawatuna Beach — shallow, calm, safe for children. Optional: turtle hatchery visit. Beach time until sunset. Overnight Unawatuna / Galle.' },
      { day: 7, title: 'Beach Morning → Departure', activities: 'Final morning at the beach or hotel pool. Optional snorkeling on Unawatuna reef. Transfer to Colombo Airport (approx. 2 hours). Depart with memories for a lifetime.' },
    ],
  },

  {
    name: 'Family Sri Lanka — 14 Days Complete Family Journey',
    category: 'Family Holidays',
    duration: '14 Days / 13 Nights',
    isFeatured: false,
    description: 'Two full weeks to truly immerse your family in everything Sri Lanka has to offer. From the ancient Cultural Triangle and misty tea highlands to whale watching on the south coast and stunning east coast beaches — this comprehensive family journey leaves no highlight behind. Perfectly paced with rest days and flexible activities for all ages.',
    highlights: [
      'Sigiriya Rock Fortress — epic family adventure',
      'Pinnawala Elephant Orphanage river bath',
      'Scenic Kandy–Ella hill country train journey',
      'Yala National Park — leopards and elephants',
      'Mirissa whale watching (blue whales, spinner dolphins)',
      'East coast: Trincomalee or Arugam Bay turquoise beaches',
      'Turtle watching on the south coast',
      'Dambulla Cave Temples and Anuradhapura sacred city',
    ],
    transport: 'Family private AC vehicle with experienced English-speaking driver-guide',
    accommodation: 'Family rooms and eco-lodges, selected by tier after consultation',
    includes: [
      'Private AC vehicle throughout',
      'English-speaking family driver-guide',
      'Daily breakfast',
      'Entrance fees to all listed sites',
      'Whale watching boat trip (Mirissa)',
      'Two jeep safaris at Yala National Park',
      'Airport transfers',
      '24/7 local support',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Colombo / Negombo', activities: 'Pick up from Bandaranaike International Airport. Transfer to Negombo (20 mins) or Colombo. Settle in, beach walk at sunset. Overnight Negombo.' },
      { day: 2, title: 'Colombo City → Pinnawala', activities: 'Morning Colombo highlights — Gangaramaya Temple, Galle Face Green, Pettah Market. Drive to Pinnawala (2 hours). Afternoon: Pinnawala Elephant Orphanage river bathing time. Overnight near Pinnawala.' },
      { day: 3, title: 'Kandy — Cultural Capital', activities: 'Drive to Kandy (1.5 hours). Temple of the Tooth Relic. Kandy Lake walk. Peradeniya Botanical Gardens. Gem museum. Kandyan dance show in the evening. Overnight Kandy.' },
      { day: 4, title: 'Kandy → Dambulla Cave Temple → Sigiriya', activities: 'Dambulla Cave Temple in the morning. Drive to Sigiriya. Afternoon: Climb Sigiriya Rock Fortress. Evening: village experience. Overnight Sigiriya area.' },
      { day: 5, title: 'Polonnaruwa — Ancient Ruined City', activities: 'Full morning at Polonnaruwa Archaeological Park — Gal Vihara, Lotus Pond, Royal Palace, Rankoth Vehera. Afternoon: Minneriya National Park safari (famous elephant gathering, seasonal Jun–Oct). Overnight Habarana.' },
      { day: 6, title: 'Anuradhapura — Sacred City', activities: 'Full day Anuradhapura: Sri Maha Bodhi (world\'s oldest tree), Ruwanwelisaya, Jetavanaramaya, Isurumuniya. Drive south toward Kandy area. Overnight en route.' },
      { day: 7, title: 'Scenic Train → Nuwara Eliya', activities: 'Board the iconic Kandy–Ella hill country train. 6-hour scenic journey through tea estates (book first class observation car). Nuwara Eliya: tea factory tour, strawberry farm, Victoria Park. Overnight Nuwara Eliya.' },
      { day: 8, title: 'Horton Plains & Ella', activities: 'Dawn hike at Horton Plains — World\'s End cliff and Baker\'s Falls. Drive to Ella (2 hours via Haputale). Nine Arch Bridge and Ella village afternoon. Overnight Ella.' },
      { day: 9, title: 'Ella Rest Day & Waterfalls', activities: 'Little Adam\'s Peak hike (easy, great views). Ravana Falls swimming. Ella village cafes and shops. Easy relaxed day for the family. Overnight Ella.' },
      { day: 10, title: 'Yala National Park', activities: 'Drive to Yala (2.5 hours). Check in. Full day: morning and afternoon jeep safaris. Leopards, sloth bears, elephants, peacocks, crocodiles. Best leopard density in the world. Overnight near Yala.' },
      { day: 11, title: 'Mirissa Whale Watching + Galle Fort', activities: '5:30 AM depart for whale watching catamaran from Mirissa — blue whales, sperm whales, spinner dolphins. Return by noon. Galle Fort afternoon walk. Overnight Galle / Unawatuna.' },
      { day: 12, title: 'South Coast Beach Day', activities: 'Full beach day at Unawatuna or Mirissa. Snorkeling on the coral reef. Turtle hatchery visit. Surf lessons for older kids. Seafood dinner by the beach. Overnight south coast.' },
      { day: 13, title: 'East Coast: Trincomalee or Batticaloa', activities: 'Drive to east coast (4–5 hours). Trincomalee: Fort Frederick, Koneswaram Temple, Marble Bay. OR Batticaloa lagoon boat ride. Crystal-clear east coast beach afternoon. Overnight east coast.' },
      { day: 14, title: 'East Coast Beach → Departure', activities: 'Morning: last swim in the Indian Ocean. Transfer to Colombo Airport (4–5 hours). Departure.' },
    ],
  },

  {
    name: 'Family Sri Lanka — 21 Days Grand Family Expedition',
    category: 'Family Holidays',
    duration: '21 Days / 20 Nights',
    isFeatured: false,
    description: 'The ultimate three-week family expedition — Sri Lanka in full. Spend enough time at every destination to truly settle in and experience local life. Kids get exposed to ancient kingdoms, misty mountains, wildlife safaris, and three separate beaches. Includes the east coast, which most tourists never reach. Ample rest days built in throughout.',
    highlights: [
      'Full Cultural Triangle deep dive (Sigiriya, Polonnaruwa, Anuradhapura, Dambulla)',
      'Pinnawala elephant river bath',
      'Scenic train from Kandy to Ella',
      'Horton Plains World\'s End at sunrise',
      'Yala leopard safaris (2 full days)',
      'Mirissa blue whale watching',
      'East coast: Trincomalee turquoise beaches and Koneswaram Temple',
      'Nilaveli beach — arguably Sri Lanka\'s most beautiful',
      'Arugam Bay surf town (east coast)',
      'Colombo full city tour',
    ],
    transport: 'Premium family private AC vehicle with expert bilingual driver-guide throughout',
    accommodation: 'Premium family rooms and boutique lodges, flexible by tier',
    includes: [
      'Premium private AC vehicle throughout',
      'Expert English-speaking driver-guide',
      'Daily breakfast + select lunches',
      'All site entrance fees',
      'Whale watching catamaran (Mirissa)',
      'Two full days jeep safaris at Yala',
      'Minneriya elephant gathering safari',
      'Snorkeling at Pigeon Island (Trincomalee)',
      'Airport transfers (arrival + departure)',
      '24/7 local support',
    ],
    excludes: stdExcludes,
    itinerary: [
      { day: 1, title: 'Arrival → Negombo', activities: 'Airport arrival. Transfer to Negombo beach (20 mins). Settle in, beach sunset, seafood dinner. Overnight Negombo.' },
      { day: 2, title: 'Negombo Leisure & Local Life', activities: 'Negombo fish market at dawn (optional early risers). Dutch canal boat ride. Lagoon kayaking. St. Mary\'s Church. Afternoon at beach. Rest day for jet lag.' },
      { day: 3, title: 'Colombo City Tour', activities: 'Full Colombo day — Lotus Tower, Gangaramaya Temple, Pettah Market, Viharamahadevi Park, Galle Face Green. Dinner in Colombo. Drive to Pinnawala overnight.' },
      { day: 4, title: 'Pinnawala Elephant Orphanage', activities: 'Full morning at Pinnawala — elephant river bathing at 10 AM and 2 PM. Kids can feed baby elephants. Afternoon: drive toward Kandy. Botanical gardens en route. Overnight Kandy.' },
      { day: 5, title: 'Kandy City & Culture', activities: 'Temple of the Tooth Relic (morning puja ceremony). Kandy Lake. Gem museum. Udawattakele Sanctuary forest walk. Evening: Kandyan dance and fire-walking show.' },
      { day: 6, title: 'Peradeniya Gardens & Drive to Sigiriya', activities: 'Peradeniya Botanical Gardens (orchids, giant fig trees, bamboo avenue). Drive to Sigiriya (3 hours). Evening: village cycle tour, firefly watching.' },
      { day: 7, title: 'Sigiriya Rock Fortress', activities: 'Full morning: Climb Sigiriya — water gardens, frescoes, lion\'s paw platform, summit palace. Afternoon: Pidurangala Rock viewpoint. Village cooking experience. Overnight Sigiriya.' },
      { day: 8, title: 'Dambulla Cave Temple', activities: 'Dambulla Golden Temple — 5 cave temples, 153 Buddha statues, 2,000-year-old artwork. Afternoon at leisure or local market visit. Overnight Dambulla/Habarana.' },
      { day: 9, title: 'Polonnaruwa & Minneriya', activities: 'Polonnaruwa Archaeological Park full morning. Afternoon: Minneriya National Park jeep safari — famous "gathering" of wild elephants (hundreds in one place, seasonal).' },
      { day: 10, title: 'Anuradhapura — Ancient Sacred City', activities: 'Full day Anuradhapura — Sri Maha Bodhi, Ruwanwelisaya, Thuparamaya, Isurumuniya. Drive toward hill country. Overnight Matale / Kandy area.' },
      { day: 11, title: 'Scenic Train → Nuwara Eliya', activities: 'Board the iconic train. 3-hour journey through cloud forests and tea estates. Nuwara Eliya: Gregory Lake, tea factory, strawberry farm, "Little England" colonial town walk. Overnight Nuwara Eliya.' },
      { day: 12, title: 'Nuwara Eliya Rest & Tea Walks', activities: 'Morning: Horse riding for the kids. Tea estate walk. Lakeside café morning. Afternoon: optional cooking class. Relaxed mountain day.' },
      { day: 13, title: 'Horton Plains → Ella', activities: 'Pre-dawn drive to Horton Plains. World\'s End sunrise cliff walk and Baker\'s Falls. Drive to Ella via Haputale and Lipton\'s Seat viewpoint. Ella afternoon: Nine Arch Bridge, village walk.' },
      { day: 14, title: 'Ella Hikes & Waterfalls', activities: 'Little Adam\'s Peak. Ravana Ella Falls swim. Ella Rock sunrise hike (optional older kids/adults). Ella shops and cafes. Full rest afternoon.' },
      { day: 15, title: 'Yala National Park — Day 1', activities: 'Drive to Yala (2.5 hours). Check in. Afternoon safari: leopards, sloth bears, elephants, peacocks, crocodiles. Dinner at bush camp.' },
      { day: 16, title: 'Yala National Park — Day 2', activities: 'Full day: two safaris (dawn and dusk). Maximum wildlife opportunity. Leopard tracking with expert naturalist. Overnight near Yala.' },
      { day: 17, title: 'Mirissa Whale Watching & Galle', activities: '5:30 AM whale watching catamaran — blue whales, spinner dolphins. Galle Fort afternoon. Rampart walk, lighthouse, boutique lanes. Overnight Galle / Unawatuna.' },
      { day: 18, title: 'South Coast Beach Day', activities: 'Full beach day at Unawatuna: calm, shallow, safe for all ages. Snorkeling on the reef. Turtle hatchery. Seafood dinner at a beach shack. Overnight Unawatuna.' },
      { day: 19, title: 'Trincomalee — East Coast', activities: 'Drive to Trincomalee (4.5 hours). Fort Frederick. Koneswaram Temple clifftop. Nilaveli Beach — some of Sri Lanka\'s most pristine white sand and turquoise water. Overnight Trincomalee.' },
      { day: 20, title: 'Pigeon Island & East Coast Leisure', activities: 'Pigeon Island National Park snorkeling — coral reef, blacktip reef sharks, sea turtles. Afternoon: Nilaveli beach. Boat trips on Trincomalee Bay. Sunset dinner.' },
      { day: 21, title: 'East Coast → Airport → Departure', activities: 'Transfer to Colombo / Bandaranaike International Airport (4.5 hours). Depart Sri Lanka with a full island experience and memories your family will never forget.' },
    ],
  },
];

/* ---- Insert packages ---- */
let inserted = 0;
for (const def of packageDefs) {
  const catId = catMap[def.category];
  if (!catId) { console.warn('  ⚠ Category not found:', def.category); continue; }
  const pkg = new Package({ ...def, category: catId });
  await pkg.save();
  inserted++;
  console.log(`  ✓ [${def.category}] ${def.name}`);
}

console.log(`\n✓ Seeded ${inserted} packages into ${categories.length} categories`);
console.log('Featured packages:', packageDefs.filter(p => p.isFeatured).map(p => p.name.split('—')[0].trim()).join(', '));

await mongoose.disconnect();
process.exit(0);
