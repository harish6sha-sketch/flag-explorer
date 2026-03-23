// Detailed comparison data for similar-looking flag pairs
// Each pair includes HOW to tell them apart

const similarPairs = [
  {
    id: "italy-ireland",
    flags: ["it", "ie"],
    title: "Italy vs Ireland",
    category: "Vertical Tricolors",
    quickTip: "RED = Italy, ORANGE = Ireland",
    howToDistinguish: "Both are green-white-??? vertical tricolors. Italy ends with RED (think pizza sauce!). Ireland ends with ORANGE (representing Protestants). Italy's green is darker, Ireland's green is brighter.",
    memoryTrick: "Italy = pasta with tomato (RED). Ireland = orange Irish beer!"
  },
  {
    id: "italy-mexico",
    flags: ["it", "mx"],
    title: "Italy vs Mexico",
    category: "Vertical Tricolors",
    quickTip: "Mexico has an EAGLE in the center",
    howToDistinguish: "Same green-white-red vertical stripes! But Mexico has a coat of arms (eagle eating a snake on a cactus) in the center white stripe. Italy's flag is plain stripes with no emblem.",
    memoryTrick: "Mexico has a Mexican eagle. Italy keeps it simple like Italian design!"
  },
  {
    id: "ireland-ivorycoast",
    flags: ["ie", "ci"],
    title: "Ireland vs Cote d'Ivoire",
    category: "Reversed Colors",
    quickTip: "Ireland: Green FIRST. Ivory Coast: Orange FIRST",
    howToDistinguish: "These flags are mirror images! Ireland goes Green-White-Orange (left to right). Cote d'Ivoire goes Orange-White-Green (left to right). The colors are REVERSED.",
    memoryTrick: "Ireland starts with GREEN (green Ireland!). Ivory Coast starts with ORANGE (like an ivory/orange sunset in Africa)."
  },
  {
    id: "indonesia-poland",
    flags: ["id", "pl"],
    title: "Indonesia vs Poland",
    category: "Red & White Bicolors",
    quickTip: "Indonesia: RED on top. Poland: WHITE on top",
    howToDistinguish: "Both are two horizontal stripes of red and white. Indonesia has red on TOP, white on bottom. Poland has white on TOP, red on bottom. They are upside-down versions of each other!",
    memoryTrick: "Indonesia is near the equator (HOT = red on top). Poland has SNOW (white on top)."
  },
  {
    id: "indonesia-monaco",
    flags: ["id", "mc"],
    title: "Indonesia vs Monaco",
    category: "Nearly Identical",
    quickTip: "Different PROPORTIONS only!",
    howToDistinguish: "These flags are almost IDENTICAL — both red on top, white on bottom. The only difference is the shape: Monaco's flag is 4:5 ratio (almost square), Indonesia's is 2:3 (wider rectangle).",
    memoryTrick: "Monaco is a tiny country, so its flag is more compact (squarish)."
  },
  {
    id: "chad-romania",
    flags: ["td", "ro"],
    title: "Chad vs Romania",
    category: "Nearly Identical",
    quickTip: "Almost impossible to tell apart!",
    howToDistinguish: "Both are blue-yellow-red vertical stripes. Chad's blue is very slightly DARKER (indigo) while Romania's blue is slightly LIGHTER (cobalt). In practice, they look virtually identical — one of the most confusing flag pairs in the world!",
    memoryTrick: "Chad is in Africa (darker blue like deep night sky). Romania is in Europe (lighter blue like daytime sky)."
  },
  {
    id: "bahrain-qatar",
    flags: ["bh", "qa"],
    title: "Bahrain vs Qatar",
    category: "Serrated Flags",
    quickTip: "Bahrain: RED + 5 points. Qatar: MAROON + 9 points",
    howToDistinguish: "Both have a white section with a zigzag edge. Bahrain is RED with 5 zigzag points. Qatar is MAROON (dark brownish-red) with 9 zigzag points. Qatar's flag is also much wider (the widest flag in the world!).",
    memoryTrick: "Bahrain = 5 points (5 pillars of Islam). Qatar is wider and darker."
  },
  {
    id: "australia-newzealand",
    flags: ["au", "nz"],
    title: "Australia vs New Zealand",
    category: "Southern Cross Flags",
    quickTip: "Australia: 6 stars (white). NZ: 4 stars (red)",
    howToDistinguish: "Both have the Union Jack + Southern Cross stars on blue. Australia has 6 WHITE stars (including a big 7-pointed Commonwealth Star below the Union Jack). New Zealand has only 4 RED stars with white borders and NO big star.",
    memoryTrick: "Australia has MORE stars and they're WHITE. New Zealand has FEWER stars and they're RED."
  },
  {
    id: "netherlands-luxembourg",
    flags: ["nl", "lu"],
    title: "Netherlands vs Luxembourg",
    category: "Horizontal Tricolors",
    quickTip: "Netherlands: DARKER blue. Luxembourg: LIGHTER blue",
    howToDistinguish: "Both are red-white-blue horizontal stripes. The Netherlands uses a darker cobalt blue. Luxembourg uses a lighter sky/azure blue. The difference is subtle but real!",
    memoryTrick: "Netherlands = deep sea blue (they fought the sea!). Luxembourg = light sky blue (peaceful mountain air)."
  },
  {
    id: "france-netherlands",
    flags: ["fr", "nl"],
    title: "France vs Netherlands",
    category: "Same Colors, Different Direction",
    quickTip: "France: VERTICAL. Netherlands: HORIZONTAL",
    howToDistinguish: "Both use blue, white, and red. France has VERTICAL stripes (blue-white-red, left to right). Netherlands has HORIZONTAL stripes (red-white-blue, top to bottom).",
    memoryTrick: "France is TALL (vertical like the Eiffel Tower). Netherlands is FLAT (horizontal like their flat country!)."
  },
  {
    id: "russia-netherlands",
    flags: ["ru", "nl"],
    title: "Russia vs Netherlands",
    category: "Horizontal Tricolors",
    quickTip: "Russia: White on TOP. Netherlands: Red on TOP",
    howToDistinguish: "Both are horizontal stripes of red, white, and blue. Russia goes white-blue-red (top to bottom). Netherlands goes red-white-blue (top to bottom). The order is different!",
    memoryTrick: "Russia starts with WHITE (like snow). Netherlands starts with RED (like Dutch tulips!)."
  },
  {
    id: "norway-iceland",
    flags: ["no", "is"],
    title: "Norway vs Iceland",
    category: "Nordic Cross Flags",
    quickTip: "Norway: RED background. Iceland: BLUE background",
    howToDistinguish: "Both have the Nordic cross design with a cross outlined in white. Norway has a RED background with a BLUE cross. Iceland has a BLUE background with a RED cross. The colors are swapped!",
    memoryTrick: "Norway = RED like Norwegian salmon. Iceland = BLUE like Icelandic ice."
  },
  {
    id: "sweden-finland",
    flags: ["se", "fi"],
    title: "Sweden vs Finland",
    category: "Nordic Cross Flags",
    quickTip: "Sweden: BLUE+YELLOW. Finland: WHITE+BLUE",
    howToDistinguish: "Both use the Nordic cross. Sweden has a YELLOW cross on BLUE background. Finland has a BLUE cross on WHITE background. Completely different colors!",
    memoryTrick: "Sweden is golden (yellow cross). Finland is icy (white with blue)."
  },
  {
    id: "mali-guinea",
    flags: ["ml", "gn"],
    title: "Mali vs Guinea",
    category: "Reversed Colors",
    quickTip: "Mali: Green LEFT. Guinea: Red LEFT",
    howToDistinguish: "Both are vertical tricolors of green, yellow, and red. Mali goes green-yellow-red (left to right). Guinea goes red-yellow-green (left to right). They are MIRROR IMAGES!",
    memoryTrick: "Mali starts with GREEN (Mali has green forests). Guinea starts with RED (Guinea has red soil)."
  },
  {
    id: "mali-senegal",
    flags: ["ml", "sn"],
    title: "Mali vs Senegal",
    category: "Star Difference",
    quickTip: "Senegal has a GREEN STAR. Mali has no star.",
    howToDistinguish: "Both are green-yellow-red vertical stripes. They look identical EXCEPT Senegal has a green five-pointed star in the center yellow stripe. Mali has no emblem.",
    memoryTrick: "Senegal has a Star (both start with S!)."
  },
  {
    id: "colombia-ecuador-venezuela",
    flags: ["co", "ec"],
    title: "Colombia vs Ecuador",
    category: "Gran Colombia Family",
    quickTip: "Ecuador has a COAT OF ARMS. Colombia is plain.",
    howToDistinguish: "Both have yellow-blue-red horizontal stripes with yellow being the widest. Ecuador adds a coat of arms (with a condor on top) in the center. Colombia has no emblem.",
    memoryTrick: "Ecuador has an eagle (condor) on top. Colombia keeps it clean."
  },
  {
    id: "egypt-iraq-syria-yemen",
    flags: ["eg", "iq"],
    title: "Egypt vs Iraq",
    category: "Pan-Arab Tricolors",
    quickTip: "Egypt: GOLDEN EAGLE. Iraq: GREEN TEXT",
    howToDistinguish: "Both are red-white-black horizontal stripes. Egypt has a golden Eagle of Saladin in the center. Iraq has green Arabic text ('God is Great') on the white stripe.",
    memoryTrick: "Egypt = Eagle (ancient pharaoh symbol). Iraq = Inscription (Arabic text)."
  },
  {
    id: "jordan-palestine",
    flags: ["jo", "ps"],
    title: "Jordan vs Palestine",
    category: "Pan-Arab Flags",
    quickTip: "Jordan has a WHITE STAR. Palestine has NO star.",
    howToDistinguish: "Both have black-white-green horizontal stripes with a red triangle on the left. Jordan has a 7-pointed WHITE STAR inside the red triangle. Palestine's triangle is plain with no star.",
    memoryTrick: "Jordan has a Jewel (star). Palestine is Plain."
  },
  {
    id: "turkey-tunisia",
    flags: ["tr", "tn"],
    title: "Turkey vs Tunisia",
    category: "Crescent & Star Flags",
    quickTip: "Turkey: crescent on RED. Tunisia: crescent in WHITE circle on RED.",
    howToDistinguish: "Both are red with white crescent and star. Turkey has the crescent and star directly on the red background. Tunisia has a WHITE CIRCLE containing a red crescent and star.",
    memoryTrick: "Tunisia has a circle (like the sun over Tunisia). Turkey is direct (bold and straightforward)."
  },
  {
    id: "hungary-italy-iran",
    flags: ["hu", "it"],
    title: "Hungary vs Italy",
    category: "Same Colors, Different Direction",
    quickTip: "Hungary: HORIZONTAL. Italy: VERTICAL",
    howToDistinguish: "Both use red, white, and green. Hungary has HORIZONTAL stripes (red-white-green, top to bottom). Italy has VERTICAL stripes (green-white-red, left to right).",
    memoryTrick: "Italy stands TALL (vertical). Hungary lies FLAT (horizontal)."
  },
  {
    id: "japan-bangladesh-palau",
    flags: ["jp", "bd"],
    title: "Japan vs Bangladesh",
    category: "Circle Flags",
    quickTip: "Japan: RED circle on WHITE. Bangladesh: RED circle on GREEN.",
    howToDistinguish: "Both have a circle in the center. Japan has a RED circle on WHITE background. Bangladesh has a RED circle on GREEN background. Different background colors!",
    memoryTrick: "Japan = White (like snow on Mount Fuji). Bangladesh = Green (like lush green rice fields)."
  },
  {
    id: "japan-palau",
    flags: ["jp", "pw"],
    title: "Japan vs Palau",
    category: "Circle Flags",
    quickTip: "Japan: RED circle on WHITE. Palau: YELLOW circle on BLUE.",
    howToDistinguish: "Both have a circle in the center. Japan has a RED circle on WHITE (the sun). Palau has a GOLDEN/YELLOW circle on BLUE (the full moon over the ocean).",
    memoryTrick: "Japan = Rising SUN (red on white). Palau = Full MOON (golden on blue ocean)."
  },
  {
    id: "china-vietnam",
    flags: ["cn", "vn"],
    title: "China vs Vietnam",
    category: "Red with Yellow Stars",
    quickTip: "China: 5 stars (1 big + 4 small). Vietnam: 1 big star.",
    howToDistinguish: "Both are red with yellow stars. China has FIVE stars in the top-left corner (one large star + four small ones). Vietnam has ONE large star centered on the flag.",
    memoryTrick: "China has a star FAMILY (1 parent + 4 kids). Vietnam has a SOLO star."
  },
  {
    id: "us-liberia-malaysia",
    flags: ["us", "lr"],
    title: "USA vs Liberia",
    category: "Stars & Stripes Family",
    quickTip: "USA: 50 stars. Liberia: 1 star.",
    howToDistinguish: "Both have red & white stripes with a blue rectangle containing white stars. USA has 50 stars and 13 stripes. Liberia has just 1 star and 11 stripes.",
    memoryTrick: "USA = many states (50 stars). Liberia = one LONE star of freedom."
  },
  {
    id: "germany-belgium",
    flags: ["de", "be"],
    title: "Germany vs Belgium",
    category: "Same Colors, Different Direction",
    quickTip: "Germany: HORIZONTAL. Belgium: VERTICAL",
    howToDistinguish: "Both use black, yellow/gold, and red. Germany has HORIZONTAL stripes (black-red-gold, top to bottom). Belgium has VERTICAL stripes (black-yellow-red, left to right).",
    memoryTrick: "Germany lies flat (HORIZONTAL). Belgium stands up (VERTICAL)."
  },
  {
    id: "austria-latvia",
    flags: ["at", "lv"],
    title: "Austria vs Latvia",
    category: "Red & White Stripes",
    quickTip: "Austria: BRIGHTER red. Latvia: DARKER maroon red.",
    howToDistinguish: "Both are red-white-red horizontal stripes. Austria uses BRIGHT red. Latvia uses DARK CARMINE red (almost maroon). Latvia's white stripe is also narrower.",
    memoryTrick: "Austria = bright Alpine red. Latvia = dark Baltic maroon."
  },
  {
    id: "monaco-indonesia-poland",
    flags: ["mc", "id"],
    title: "Monaco vs Indonesia",
    category: "Nearly Identical",
    quickTip: "Monaco is more SQUARE. Indonesia is more RECTANGULAR.",
    howToDistinguish: "Both are red on top, white on bottom with NO emblem. The only difference is the ratio: Monaco is 4:5 (almost square) and Indonesia is 2:3 (wider). Without measuring, they look identical!",
    memoryTrick: "Monaco is tiny (compact/square flag). Indonesia is wide (long archipelago = wide flag)."
  },
  {
    id: "cyprus-kosovo",
    flags: ["cy", "xk"],
    title: "Cyprus vs Kosovo",
    category: "Map on Flag",
    quickTip: "Both show their OWN MAP on the flag!",
    howToDistinguish: "Both flags show a map of their country. Cyprus has an ORANGE map on white with green olive branches. Kosovo has a GOLDEN map on blue with six white stars. Different colors and layout.",
    memoryTrick: "Cyprus = orange copper island on white. Kosovo = golden map on blue sky."
  },
  {
    id: "elsalvador-honduras-nicaragua",
    flags: ["sv", "hn"],
    title: "El Salvador vs Honduras",
    category: "Central American Blues",
    quickTip: "Honduras: 5 BLUE STARS. El Salvador: coat of arms.",
    howToDistinguish: "Both are blue-white-blue horizontal stripes. Honduras has 5 blue stars arranged in an X pattern. El Salvador has a coat of arms in the center.",
    memoryTrick: "Honduras has 5 stars (5 Central American countries). El Salvador has an emblem (Savior's seal)."
  },
];

export const getSimilarPairsByFlag = (code) => {
  return similarPairs.filter(p => p.flags.includes(code));
};

export const getCategories = () => {
  const cats = {};
  similarPairs.forEach(p => {
    if (!cats[p.category]) cats[p.category] = [];
    cats[p.category].push(p);
  });
  return cats;
};

export const getAllPairs = () => similarPairs;

export default similarPairs;
