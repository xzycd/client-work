const wiki = (page) => `https://en.wikipedia.org/wiki/${page}`;
const commons = (file) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;

const commonsPhoto = (file, credit, license, alt) =>
  photo(`${commons(file)}?width=1280`, file, credit, license, alt);

const photo = (url, file, credit, license, alt) => ({
  url,
  file,
  credit,
  license,
  alt,
  source: commons(file),
});

const VILNIUS_CITY = {
  id: "vilnius",
  name: "Vilnius",
  localName: "Vilnius",
  coordinates: [54.6872, 25.2797],
  eyebrow: "A living city atlas",
  headline: "Every street has a trapdoor.",
  intro:
    "Vilnius hides whole eras in one sightline: pagan legend, baroque theatre, Soviet scars, and stubborn reinvention. Pick a glow and go closer.",
  story:
    "This is not a map with facts pinned to it. It is a city built as a chain of reveals. The rivers hold the shape together, the skyline gives you bearings, and every stop earns its place with a story worth retelling.",
  sourceLabel: "Vilnius on Wikipedia",
  sourceUrl: wiki("Vilnius"),
  photo: photo(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vilnius_Gedimino_Pilies_Bok%C5%A1tas_Blick_auf_die_Skyline_1.jpg/1280px-Vilnius_Gedimino_Pilies_Bok%C5%A1tas_Blick_auf_die_Skyline_1.jpg",
    "Vilnius Gedimino Pilies Bokštas Blick auf die Skyline 1.jpg",
    "Zairon",
    "CC BY-SA 4.0",
    "Vilnius skyline seen from Gediminas Castle Tower",
  ),
  quickFacts: [
    "A howling iron wolf anchors the city's founding legend.",
    "A self-declared republic gives dogs the right to be dogs.",
    "A tsarist prison now holds concerts and artists' studios.",
    "Wooden cottages still sit in the shadow of Baltic skyscrapers.",
  ],
};

const VILNIUS_DISTRICTS = [
  {
    id: "old-town",
    name: "Old Town",
    localName: "Senamiestis",
    coordinates: [54.6818, 25.2884],
    footprint: [3.4, 2.65],
    buildingStyle: "old",
    count: 34,
    hook: "The official city is above ground. Its stranger history is underneath.",
    story:
      "Gothic brick, baroque stucco, Jewish Vilna, royal crypts, and occupation all overlap here. The grand facades matter, but the better stories live in foundations, courtyards, and buildings that were nearly erased.",
    sourceLabel: "Vilnius Old Town on Wikipedia",
    sourceUrl: wiki("Vilnius_Old_Town"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Vilnius_Cathedral_20.jpg/1280px-Vilnius_Cathedral_20.jpg",
      "Vilnius Cathedral 20.jpg",
      "Scotch Mist",
      "CC BY-SA 4.0",
      "Vilnius Cathedral and its bell tower",
    ),
    landmarks: [
      {
        id: "vilnius-cathedral",
        name: "Vilnius Cathedral",
        type: "cathedral",
        coordinates: [54.685833, 25.287778],
        hook: "The city's cleanest facade sits on its messiest religious layer.",
        fact:
          "Archaeology beneath the cathedral found an earlier square structure. Historians still debate whether the site moved from Christian church to pagan shrine and back again.",
        story:
          "The building has burned, changed style, crowned rulers, stored art under Soviet rule, and accumulated a royal underground. One especially Vilnius detail: the heart of King Władysław IV is buried here, while the rest of his body lies in Kraków.",
        lookFor: "The freestanding bell tower began as a defensive tower of the Lower Castle.",
        sourceLabel: "Wikipedia: Vilnius Cathedral",
        sourceUrl: wiki("Vilnius_Cathedral"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Vilnius_Cathedral_20.jpg/1280px-Vilnius_Cathedral_20.jpg",
          "Vilnius Cathedral 20.jpg",
          "Scotch Mist",
          "CC BY-SA 4.0",
          "White neoclassical facade of Vilnius Cathedral",
        ),
      },
      {
        id: "gediminas-tower",
        name: "Gediminas Tower",
        type: "tower",
        coordinates: [54.6867, 25.2907],
        hook: "A national symbol built around a dream loud enough for one hundred wolves.",
        fact:
          "The founding legend says Gediminas dreamed of an iron wolf howling on this hill. A pagan priest read it as an instruction to build a capital whose fame would travel.",
        story:
          "The tower is the last major piece of the Upper Castle. Its symbolism kept changing with the city: Lithuania's flag was raised here again on 7 October 1988, while the independence movement was gathering force below.",
        lookFor: "The brick tower seen today was rebuilt in 1933 from the surviving castle structure.",
        sourceLabel: "Wikipedia: Gediminas's Tower",
        sourceUrl: wiki("Gediminas%27s_Tower"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Gedimino_kalnas_120.jpg/1280px-Gedimino_kalnas_120.jpg",
          "Gedimino kalnas 120.jpg",
          "Gytis Grižas",
          "CC BY-SA 4.0",
          "Gediminas Tower on its wooded hill",
        ),
      },
      {
        id: "st-anne",
        name: "St. Anne's Church",
        type: "church",
        coordinates: [54.683056, 25.293333],
        hook: "Thirty-three kinds of brick, assembled like lace.",
        fact:
          "Its flamboyant facade uses 33 different profiles of clay brick. The exterior has remained almost unchanged since around 1500.",
        story:
          "The famous story says Napoleon wanted to carry the church back to Paris in the palm of his hand. That line is legend, but it makes emotional sense: from a distance, the facade looks less built than folded.",
        lookFor: "The repeated pointed shapes may echo the Columns of Gediminas, an old Lithuanian emblem.",
        sourceLabel: "Wikipedia: Church of St. Anne",
        sourceUrl: wiki("Church_of_St._Anne%2C_Vilnius"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/St._Anne%27s_Church_Exterior_3%2C_Vilnius%2C_Lithuania_-_Diliff.jpg/1280px-St._Anne%27s_Church_Exterior_3%2C_Vilnius%2C_Lithuania_-_Diliff.jpg",
          "St. Anne's Church Exterior 3, Vilnius, Lithuania - Diliff.jpg",
          "Diliff",
          "CC BY-SA 3.0",
          "Intricate red brick facade of St. Anne's Church",
        ),
      },
      {
        id: "gate-of-dawn",
        name: "Gate of Dawn",
        type: "gate",
        coordinates: [54.67432, 25.28954],
        hook: "The only city gate that devotion saved from demolition.",
        fact:
          "Vilnius once had nine gates. When the walls were demolished around 1800, this one survived because its chapel and icon had become too revered to remove.",
        story:
          "The outside still has firing openings; the inside is a chapel covered with votive offerings. Copies of its icon travelled with Lithuanian and Polish communities worldwide, turning a defensive threshold into a portable memory of Vilnius.",
        lookFor: "The image can be seen from the street through the chapel window.",
        sourceLabel: "Wikipedia: Gate of Dawn",
        sourceUrl: wiki("Gate_of_Dawn"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Au%C5%A1ros_Vart%C5%B3_02%28js%29_Vilnius.jpg/1280px-Au%C5%A1ros_Vart%C5%B3_02%28js%29_Vilnius.jpg",
          "Aušros Vartų 02(js) Vilnius.jpg",
          "Jerzy Strzelecki",
          "CC BY-SA 3.0",
          "Gate of Dawn chapel above the street",
        ),
      },
      {
        id: "great-synagogue",
        name: "Great Synagogue Site",
        type: "memory",
        coordinates: [54.68, 25.284722],
        hook: "A five-storey interior hidden inside a three-storey silhouette.",
        fact:
          "Regulations said a synagogue could not rise higher than a church. The builders dug down instead, creating an interior more than five storeys high while keeping the street profile low.",
        story:
          "Before World War II, the complex could hold 5,000 worshippers on major holy days. Nazis devastated it, Soviet authorities demolished the ruins, and a school was built above. Archaeologists later found the baroque bimah below the ground.",
        lookFor: "Three original pieces survive at the Vilna Gaon Museum, including a door from the Holy Ark.",
        sourceLabel: "Wikipedia: Great Synagogue of Vilna",
        sourceUrl: wiki("Great_Synagogue_of_Vilna"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/e/e8/Vilnius_Synagoga%2C_J.Kamarauska-2-.jpg",
          "Vilnius Synagoga, J.Kamarauska-2-.jpg",
          "Juozas Kamarauskas",
          "Public domain",
          "Historic watercolor of the Great Synagogue of Vilna",
        ),
      },
      {
        id: "literatu-street",
        name: "Literatų Street",
        type: "street",
        coordinates: [54.682222, 25.290278],
        hook: "A 140-metre street turned into a collective literary portrait.",
        fact:
          "Around 200 small artworks are embedded in its walls, each dedicated to a writer connected with Vilnius or Lithuania.",
        story:
          "The project began when Vilnius was European Capital of Culture in 2009. The street's older link to literature may come from its printers and booksellers, or from poet Adam Mickiewicz briefly living here in 1823.",
        lookFor: "The pieces use ceramic, metal, glass, wood, and objects that reward close inspection.",
        sourceLabel: "Wikipedia: Literatų Street",
        sourceUrl: wiki("Literat%C5%B3_Street"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Literat%C5%B3_Gatve_02%28js%29_Vilnius.jpg/1280px-Literat%C5%B3_Gatve_02%28js%29_Vilnius.jpg",
          "Literatų Gatve 02(js) Vilnius.jpg",
          "Jerzy Strzelecki",
          "CC BY-SA 3.0",
          "Art plaques covering the walls of Literatų Street",
        ),
      },
    ],
  },
  {
    id: "uzupis",
    name: "Užupis",
    localName: "Užupio Respublika",
    coordinates: [54.6817, 25.3032],
    footprint: [2.5, 2.25],
    buildingStyle: "bohemian",
    count: 22,
    hook: "A neighborhood that uses absurdity as civic infrastructure.",
    story:
      "Užupis means beyond the river. Artists turned a neglected quarter into a republic with a president, ambassadors, an April Fools' independence day, and a constitution more humane than many serious ones.",
    sourceLabel: "Užupis on Wikipedia",
    sourceUrl: wiki("U%C5%BEupis"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uzupis_2020_by_Augustas_Didzgalvis.jpg/1280px-Uzupis_2020_by_Augustas_Didzgalvis.jpg",
      "Uzupis 2020 by Augustas Didzgalvis.jpg",
      "Augustas Didžgalvis",
      "CC BY-SA 4.0",
      "Roofs and hills of Užupis beside the Vilnia River",
    ),
    landmarks: [
      {
        id: "uzupis-constitution",
        name: "Constitution Wall",
        type: "wall",
        coordinates: [54.67994, 25.30262],
        hook: "A constitution with room for joy, misery, cats, dogs, and doubt.",
        fact:
          "Its 38 articles include the right to be happy, the right to be unhappy, and the right for a dog to be a dog. Copies line Paupio Street in many languages.",
        story:
          "The republic declared itself on 1 April 1998, so nobody has to decide where the joke ends. Pope Francis blessed the constitution during his 2018 visit, giving the micronation's gentle absurdity a very official encounter.",
        lookFor: "Article 1 gives the river the right to flow past people, not just people the right to live beside it.",
        sourceLabel: "Wikipedia: Užupis Constitution",
        sourceUrl: `${wiki("U%C5%BEupis")}#Constitution_of_U%C5%BEupis`,
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/199_vilnius_U%C5%BEupis_Constitution_%2815598363386%29.jpg/1280px-199_vilnius_U%C5%BEupis_Constitution_%2815598363386%29.jpg",
          "199 vilnius Užupis Constitution (15598363386).jpg",
          "Brian Toward",
          "CC0",
          "Metal translations of the Užupis Constitution on a wall",
        ),
      },
      {
        id: "uzupis-angel",
        name: "Angel of Užupis",
        type: "monument",
        coordinates: [54.68037, 25.30416],
        hook: "Before there was an angel, the square got an egg.",
        fact:
          "The sculpture missed its unveiling deadline, so residents installed an egg and said the angel would hatch. The finished angel arrived in 2002.",
        story:
          "The monument remembers animator and caricaturist Zenonas Šteinys, who helped revive the district. The community funded it by selling miniature copies, turning a public symbol into something literally bought piece by piece.",
        lookFor: "The egg was later auctioned and now stands on Pylimo Street in another part of the city.",
        sourceLabel: "Go Vilnius: The Angel of Užupis",
        sourceUrl: "https://www.govilnius.lt/visit-vilnius/places/the-angel-of-uzupis",
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/5/50/The_Angel_of_U%C5%BEupis_Vilnius_%285993391627%29.jpg",
          "The Angel of Užupis Vilnius (5993391627).jpg",
          "FaceMePLS",
          "CC BY 2.0",
          "Bronze Angel of Užupis blowing a trumpet",
        ),
      },
      {
        id: "uzupis-mermaid",
        name: "Užupis Mermaid",
        type: "sculpture",
        coordinates: [54.68, 25.29855],
        hook: "A flood carried her away. The city brought her back.",
        fact:
          "The tiny bronze mermaid disappeared into the Vilnia during the 2004 flood and was recovered. Local legend says staring too long may make you stay in Užupis forever.",
        story:
          "Romas Vilčiauskas, who made the district's angel, tucked the mermaid into a niche below the bridge. Her scale is the trick: you have to lean over the river and actively look for her.",
        lookFor: "The river-facing niche sits just below street level near Užupis Bridge.",
        sourceLabel: "Go Vilnius: Under the Užupis Bridge",
        sourceUrl: "https://www.govilnius.lt/visit-vilnius/routes/uzupis-a-republic-inside-vilnius/under-the-uzupis-bridge2",
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/U%C5%BEupis_Mermaid.JPG/1280px-U%C5%BEupis_Mermaid.JPG",
          "Užupis Mermaid.JPG",
          "Michelle Roses",
          "CC BY-SA 3.0",
          "Small bronze Užupis Mermaid in a riverbank niche",
        ),
      },
      {
        id: "bernardine-cemetery",
        name: "Bernardine Cemetery",
        type: "cemetery",
        coordinates: [54.6801, 25.3085],
        hook: "A romantic city of the dead, pushed outside the old city by law.",
        fact:
          "It opened in 1810 after tsarist authorities banned burials beside churches. The new cemetery sat on what was then the edge of town above the river.",
        story:
          "After World War II it was largely abandoned. Moss covered sinking graves and one columbarium nearly vanished. Polish and Lithuanian conservation efforts later restored more than one hundred historic monuments.",
        lookFor: "The steep paths and broken sightlines are part of its atmosphere, not a formal grid.",
        sourceLabel: "Wikipedia: Bernardine Cemetery",
        sourceUrl: wiki("Bernardine_Cemetery"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Bernardine_Cemetery1.jpg/1280px-Bernardine_Cemetery1.jpg",
          "Bernardine Cemetery1.jpg",
          "Alma Pater",
          "Public domain",
          "Tree-covered graves in Bernardine Cemetery",
        ),
      },
    ],
  },
  {
    id: "naujamiestis",
    name: "New Town",
    localName: "Naujamiestis",
    coordinates: [54.6795, 25.2698],
    footprint: [4.2, 2.85],
    buildingStyle: "industrial",
    count: 38,
    hook: "Institutions built for control now hold art, food, and music.",
    story:
      "This is Vilnius in conversion mode. A prison becomes a cultural compound, a Soviet cinema becomes a private art museum, an old market mixes pickles with natural wine, and a musician with no Lithuanian connection becomes a freedom test.",
    sourceLabel: "Naujamiestis in Vilnius",
    sourceUrl: wiki("Naujamiestis%2C_Vilnius"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Luki%C5%A1k%C4%97s_Prison.jpg/1280px-Luki%C5%A1k%C4%97s_Prison.jpg",
      "Lukiškės Prison.jpg",
      "Juliux",
      "CC BY-SA 3.0",
      "Round central block of Lukiškės Prison",
    ),
    landmarks: [
      {
        id: "lukiskes-prison",
        name: "Lukiškės Prison",
        type: "prison",
        coordinates: [54.691389, 25.266389],
        hook: "A century of confinement, followed by a very loud second life.",
        fact:
          "The 1905 complex included Orthodox and Catholic churches plus a small synagogue. It was the most expensive building constructed in the region at the time.",
        story:
          "Regimes used these cells for criminals, political prisoners, Jews from the Vilna Ghetto, and future Israeli prime minister Menachem Begin. It closed in 2019. Soon after, Stranger Things filmed here; today the compound hosts tours, artists, bars, and concerts.",
        lookFor: "Its radial plan borrowed the logic of Jeremy Bentham's panopticon.",
        sourceLabel: "Wikipedia: Lukiškės Prison",
        sourceUrl: wiki("Luki%C5%A1k%C4%97s_Prison"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Luki%C5%A1k%C4%97s_Prison.jpg/1280px-Luki%C5%A1k%C4%97s_Prison.jpg",
          "Lukiškės Prison.jpg",
          "Juliux",
          "CC BY-SA 3.0",
          "Interior courtyard and cell blocks of Lukiškės Prison",
        ),
      },
      {
        id: "zappa-memorial",
        name: "Frank Zappa Memorial",
        type: "monument",
        coordinates: [54.68526, 25.27463],
        hook: "A monument to a man who never visited Lithuania became a test of freedom.",
        fact:
          "The 1995 bust was the world's first bronze memorial to Frank Zappa. Its sculptor, Konstantinas Bogdanas, had previously made portraits of Lenin.",
        story:
          "Zappa had no direct link to Lithuania. That was the point. Artists proposed him after independence to see whether the new authorities would permit something gloriously unnecessary. Approval itself proved that public culture had changed.",
        lookFor: "Baltimore later accepted a replica of Vilnius's unlikely original.",
        sourceLabel: "Wikipedia: Frank Zappa",
        sourceUrl: `${wiki("Frank_Zappa")}#Legacy`,
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/9/9e/Frank_Zappa_Memorial.jpg",
          "Frank Zappa Memorial.jpg",
          "Keropian",
          "CC BY-SA 3.0",
          "Frank Zappa bust mounted on a tall column in Vilnius",
        ),
      },
      {
        id: "mo-museum",
        name: "MO Museum",
        type: "museum",
        coordinates: [54.67853, 25.28471],
        hook: "A museum that spent a decade existing without a building.",
        fact:
          "MO began as a private collection and a 'museum without walls.' When the building opened in 2018, Daniel Libeskind used a spiral form for the first time in his architecture.",
        story:
          "The museum sits where the huge Lietuva cinema once stood. Its collection preserves Lithuanian art from the cultural thaw onward, including work that Soviet institutions ignored for ideological reasons.",
        lookFor: "A diagonal public passage cuts through the white volume from old city to new.",
        sourceLabel: "Wikipedia: MO Museum",
        sourceUrl: wiki("MO_Museum"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/MO_by_Augustas_Didzgalvis.jpg/1280px-MO_by_Augustas_Didzgalvis.jpg",
          "MO by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Angular white exterior of the MO Museum",
        ),
      },
      {
        id: "hales-market",
        name: "Halė Market",
        type: "market",
        coordinates: [54.6729, 25.2859],
        hook: "Vilnius has traded on this spot since horses were the main inventory.",
        fact:
          "The site began as a horse market in the 15th century, then became a grain market. The 1906 hall uses an iron frame related to the engineering age of stations and the Eiffel Tower.",
        story:
          "It is the city's oldest market still in operation. The current mix is very Vilnius: farmers and old-school counters share the hall with bagels, cheese, bistros, and bars rather than being polished out of the picture.",
        lookFor: "The roof structure is the star. Look up before deciding what to eat.",
        sourceLabel: "Go Vilnius: Halė Market",
        sourceUrl: "https://www.govilnius.lt/api/files/66179147fe6751f1aba690b0/EN%20Hales%20Market%202024%202%20%281%29.pdf",
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Hales_turgus_by_Augustas_Didzgalvis.jpg/1280px-Hales_turgus_by_Augustas_Didzgalvis.jpg",
          "Hales turgus by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Brick and iron facade of Halė Market",
        ),
      },
    ],
  },
  {
    id: "snipiskes",
    name: "Šnipiškės",
    localName: "Šnipiškės",
    coordinates: [54.696, 25.281],
    footprint: [4.15, 2.7],
    buildingStyle: "contrast",
    count: 42,
    hook: "A wooden village survives inside the new Baltic skyline.",
    story:
      "From across the Neris, Šnipiškės looks like corporate Vilnius. Walk behind the towers and the texture changes fast: unpaved lanes and timber cottages sit beside glass offices, an urban collision the city now has to decide how to protect.",
    sourceLabel: "Šnipiškės on Wikipedia",
    sourceUrl: wiki("%C5%A0nipi%C5%A1k%C4%97s"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Vilnius_Skyscrapers_15.jpg/1280px-Vilnius_Skyscrapers_15.jpg",
      "Vilnius Skyscrapers 15.jpg",
      "Zairon",
      "CC BY-SA 4.0",
      "Modern skyline of Šnipiškės across the Neris",
    ),
    landmarks: [
      {
        id: "wooden-snipiskes",
        name: "Wooden Šnipiškės",
        type: "neighborhood",
        coordinates: [54.7001, 25.2845],
        hook: "The lane behind the skyline changes century in a few steps.",
        fact:
          "Late 19th and early 20th century wooden houses survive beside the central business district in an area locals have nicknamed Shanghai.",
        story:
          "This is not a recreated heritage village. It is a living neighborhood caught inside land pressure from the fastest-growing part of the city. Its patchwork of wood, concrete, gardens, and towers has been exhibited internationally as an urban phenomenon.",
        lookFor: "The contrast is strongest where narrow lanes frame Europa Tower behind timber roofs.",
        sourceLabel: "Wikipedia: Šnipiškės",
        sourceUrl: wiki("%C5%A0nipi%C5%A1k%C4%97s"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Wooden_House_Kalvariju_Vilnius_Lithuania.jpg/1280px-Wooden_House_Kalvariju_Vilnius_Lithuania.jpg",
          "Wooden House Kalvariju Vilnius Lithuania.jpg",
          "Mojmir Churavy",
          "CC0",
          "Decorated wooden house in Šnipiškės",
        ),
      },
      {
        id: "europa-tower",
        name: "Europa Tower",
        type: "skyscraper",
        coordinates: [54.696, 25.278],
        hook: "A skyline marker timed to a geopolitical arrival.",
        fact:
          "The tower opened on 1 May 2004, the same day Lithuania joined the European Union. At 153 metres to its tip, it announced a new center across the river.",
        story:
          "Its extra three floors triggered a fight with heritage agencies worried about the Old Town skyline. The building's status as both landmark and intrusion is exactly the tension that makes this district interesting.",
        lookFor: "An open roof terrace sits at 114 metres. Alain Robert climbed the outside in 2006.",
        sourceLabel: "Wikipedia: Europa Tower",
        sourceUrl: wiki("Europa_Tower"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Vilnius_Skyscrapers_15.jpg/1280px-Vilnius_Skyscrapers_15.jpg",
          "Vilnius Skyscrapers 15.jpg",
          "Zairon",
          "CC BY-SA 4.0",
          "Europa Tower rising in the Vilnius business district",
        ),
      },
      {
        id: "energy-museum",
        name: "Energy Museum",
        type: "industrial",
        coordinates: [54.690354, 25.287515],
        hook: "The machine that electrified Vilnius is still inside.",
        fact:
          "Vilnius's first public power plant opened here in 1903. Its turbines, generators, boilers, pumps, pipes, and control panel survive in place.",
        story:
          "The building now works as the Energy and Technology Museum. Rather than clearing the plant into a blank gallery, it lets the old equipment remain the architecture, making the city's leap into electric modernity physically legible.",
        lookFor: "Stand beside the turbine hall and imagine the noise before it became an exhibit.",
        sourceLabel: "Wikipedia: Energy and Technology Museum",
        sourceUrl: wiki("Energy_and_Technology_Museum"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Technikosmuziejus.JPG/1280px-Technikosmuziejus.JPG",
          "Technikosmuziejus.JPG",
          "Rimantas Lazdynas",
          "CC BY-SA 3.0",
          "Brick former power plant housing the Energy Museum",
        ),
      },
      {
        id: "green-bridge",
        name: "Green Bridge",
        type: "bridge",
        coordinates: [54.6912, 25.2792],
        hook: "A bridge so repeatedly destroyed that its name outlived its bodies.",
        fact:
          "The first bridge here had toll collectors living upstairs. Later versions burned in war, failed in ice, and were blown up. The crossing has been called Green Bridge since 1739.",
        story:
          "The 1952 bridge carried four Soviet heroic sculpture groups until 2015. Their removal became a national argument over whether public monuments are art, propaganda, or both. Temporary installations now occupy the empty positions.",
        lookFor: "The open plinths still make the missing sculptures part of the view.",
        sourceLabel: "Wikipedia: Green Bridge",
        sourceUrl: wiki("Green_Bridge_%28Vilnius%29"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Zalias_tiltas_by_Augustas_Didzgalvis.jpg/1280px-Zalias_tiltas_by_Augustas_Didzgalvis.jpg",
          "Zalias tiltas by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Green Bridge crossing the Neris in Vilnius",
        ),
      },
    ],
  },
  {
    id: "zverynas",
    name: "Žvėrynas",
    localName: "Žvėrynas",
    coordinates: [54.6888, 25.2526],
    footprint: [3.85, 2.6],
    buildingStyle: "wood",
    count: 30,
    hook: "A grand duke's menagerie became a timber resort inside the capital.",
    story:
      "The Neris wraps this neighborhood on three sides. Behind the embassies and villas, its name still remembers the wild animals once kept here for Radziwiłł hunts. More than one hundred wooden cottages survive from its resort years.",
    sourceLabel: "Žvėrynas on Wikipedia",
    sourceUrl: wiki("%C5%BDv%C4%97rynas"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Zverynas_by_Augustas_Didzgalvis.jpg/1280px-Zverynas_by_Augustas_Didzgalvis.jpg",
      "Zverynas by Augustas Didzgalvis.jpg",
      "Augustas Didžgalvis",
      "CC BY-SA 4.0",
      "Aerial view of green Žvėrynas inside a bend of the Neris",
    ),
    landmarks: [
      {
        id: "zverynas-villas",
        name: "Wooden Villas",
        type: "neighborhood",
        coordinates: [54.6911, 25.2521],
        hook: "The old hunting ground still looks ready for a long summer weekend.",
        fact:
          "More than one hundred wooden summer cottages and city villas survive, most built between the 1890s and 1910s when Žvėrynas was a resort suburb.",
        story:
          "Before the resort came a forest reserve, then a Radziwiłł hunting estate stocked with wild animals. That history survives in the name: Žvėrynas literally means menagerie.",
        lookFor: "Carved window frames and deep porches make every house a different composition.",
        sourceLabel: "Wikipedia: Žvėrynas",
        sourceUrl: wiki("%C5%BDv%C4%97rynas"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Zverynas_by_Augustas_Didzgalvis.jpg/1280px-Zverynas_by_Augustas_Didzgalvis.jpg",
          "Zverynas by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Wooden villas among trees in Žvėrynas",
        ),
      },
      {
        id: "vilnius-kenesa",
        name: "Vilnius Kenesa",
        type: "synagogue",
        coordinates: [54.688611, 25.255556],
        hook: "The city's only Karaite house of worship survived as a club, archive, and flats.",
        fact:
          "Soviet authorities nationalized the kenesa in 1949 and divided its life among a club, an archive, and apartments. It returned to the Karaite community in 1988.",
        story:
          "The small Moorish Revival building belongs to a distinct Jewish tradition brought to Lithuania centuries ago. Restoration from 1989 to 1993 recovered the original interior plan and decorative details.",
        lookFor: "The horseshoe arches and geometric window surrounds separate it from nearby timber villas.",
        sourceLabel: "Wikipedia: Vilnius Kenesa",
        sourceUrl: wiki("Vilnius_Kenesa"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/9/9c/Karaite_Kenesa_Vilnius.jpg",
          "Karaite Kenesa Vilnius.jpg",
          "Juliux",
          "CC BY-SA 3.0",
          "Moorish Revival facade of the Vilnius Kenesa",
        ),
      },
      {
        id: "vingis-park",
        name: "Vingis Park",
        type: "park",
        coordinates: [54.683333, 25.239722],
        hook: "Tolstoy, Napoleon, and a quarter-million-person rally share this bend in the river.",
        fact:
          "In June 1812, Tsar Alexander I learned at a ball here that Napoleon had invaded. Tolstoy later put the scene into War and Peace.",
        story:
          "The palace burned later that year while serving as a French military hospital. In 1988, about 250,000 people filled the park for a Sąjūdis rally demanding truth about the Molotov-Ribbentrop Pact.",
        lookFor: "The huge amphitheater was adapted from the design logic of Tallinn's Song Festival Grounds.",
        sourceLabel: "Wikipedia: Vingis Park",
        sourceUrl: wiki("Vingis_Park"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Vingio_parkas_by_Augustas_Didzgalvis.jpg/1280px-Vingio_parkas_by_Augustas_Didzgalvis.jpg",
          "Vingio parkas by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Tree-lined path through Vingis Park",
        ),
      },
      {
        id: "sign-church",
        name: "Church of the Sign",
        type: "church",
        coordinates: [54.690556, 25.257222],
        hook: "A church that stayed open through two world wars and Soviet rule.",
        fact:
          "Unlike many Orthodox churches in Vilnius, Our Lady of the Sign was never closed during World War I, World War II, or the Soviet period.",
        story:
          "The Orthodox brotherhood collected money across the Russian Empire to build it in 1903. The archbishop also opened a school for poor children and a library, making the new parish a social institution as well as a church.",
        lookFor: "Its clustered Neo-Byzantine domes appear suddenly above the wooden neighborhood.",
        sourceLabel: "Wikipedia: Church of Our Lady of the Sign",
        sourceUrl: wiki("Church_of_Our_Lady_of_the_Sign%2C_Vilnius"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Orthodox_Church_of_Revelation_of_the_Holy_Mother_of_God_Domes%2C_Vilnius%2C_Lithuania_-_Diliff.jpg/1280px-Orthodox_Church_of_Revelation_of_the_Holy_Mother_of_God_Domes%2C_Vilnius%2C_Lithuania_-_Diliff.jpg",
          "Orthodox Church of Revelation of the Holy Mother of God Domes, Vilnius, Lithuania - Diliff.jpg",
          "Diliff",
          "CC BY-SA 3.0",
          "Domes of Our Lady of the Sign Church above Žvėrynas",
        ),
      },
    ],
  },
  {
    id: "antakalnis",
    name: "Antakalnis",
    localName: "Antakalnis",
    coordinates: [54.697, 25.312],
    footprint: [4.25, 2.7],
    buildingStyle: "baroque",
    count: 36,
    hook: "Baroque ambition meets the city's most complicated field of memory.",
    story:
      "Antakalnis follows the river northeast through palaces, wooded slopes, churches, and cemeteries. Its buildings are not restrained: they were made to stage power, faith, language, and remembrance at full volume.",
    sourceLabel: "Antakalnis on Wikipedia",
    sourceUrl: wiki("Antakalnis"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/St._Peter_and_St._Paul%27s_Church_Exterior%2C_Vilnius%2C_Lithuania_-_Diliff.jpg/1280px-St._Peter_and_St._Paul%27s_Church_Exterior%2C_Vilnius%2C_Lithuania_-_Diliff.jpg",
      "St. Peter and St. Paul's Church Exterior, Vilnius, Lithuania - Diliff.jpg",
      "Diliff",
      "CC BY-SA 3.0",
      "Baroque facade of St. Peter and St. Paul's Church",
    ),
    landmarks: [
      {
        id: "peter-paul",
        name: "St. Peter and St. Paul",
        type: "church",
        coordinates: [54.694167, 25.306389],
        hook: "Two thousand white figures, one skeleton, and a chandelier shaped like a boat.",
        fact:
          "Its interior contains around 2,000 stucco figures: saints, soldiers, plants, demons, dragons, centaurs, household tools, and a grim reaper standing on crowns.",
        story:
          "Founder Michał Kazimierz Pac asked to be buried beneath the entrance under the words 'Here lies a sinner.' Lightning later knocked down a sculpture that cracked his stone, feeding rumors that the building was judging its patron.",
        lookFor: "The brass and glass chandelier is a fishing boat, a reference to Saint Peter's first occupation.",
        sourceLabel: "Wikipedia: Church of St. Peter and St. Paul",
        sourceUrl: wiki("Church_of_St._Peter_and_St._Paul%2C_Vilnius"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/St._Peter_and_St._Paul%27s_Church_Exterior%2C_Vilnius%2C_Lithuania_-_Diliff.jpg/1280px-St._Peter_and_St._Paul%27s_Church_Exterior%2C_Vilnius%2C_Lithuania_-_Diliff.jpg",
          "St. Peter and St. Paul's Church Exterior, Vilnius, Lithuania - Diliff.jpg",
          "Diliff",
          "CC BY-SA 3.0",
          "Twin-towered facade of St. Peter and St. Paul's Church",
        ),
      },
      {
        id: "sapieha-palace",
        name: "Sapieha Palace",
        type: "palace",
        coordinates: [54.698611, 25.313889],
        hook: "A palace designed as a political audition.",
        fact:
          "Jan Kazimierz Sapieha built the ensemble to outshine royal projects and advertise that he had the stature to become Grand Duke or King.",
        story:
          "That ambition survives in the axial park and baroque gates, even though later owners filled in arcades and the Russian government turned the palace into a military hospital. Restoration completed a major new chapter in 2024.",
        lookFor: "The palace sits diagonally to its formal garden because it absorbed an older building beneath the design.",
        sourceLabel: "Wikipedia: Sapieha Palace",
        sourceUrl: wiki("Sapieha_Palace%2C_Vilnius"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Main_fa%C3%A7ade_of_the_Sapiegos_Palace_in_Antakalnis_eldership_in_Vilnius%2C_Lithuania_in_2024_%282%29.jpg/1280px-Main_fa%C3%A7ade_of_the_Sapiegos_Palace_in_Antakalnis_eldership_in_Vilnius%2C_Lithuania_in_2024_%282%29.jpg",
          "Main façade of the Sapiegos Palace in Antakalnis eldership in Vilnius, Lithuania in 2024 (2).jpg",
          "Pofka",
          "CC BY-SA 4.0",
          "Restored baroque facade of Sapieha Palace",
        ),
      },
      {
        id: "vileisis-palace",
        name: "Vileišis Palace",
        type: "palace",
        coordinates: [54.6951, 25.3054],
        hook: "A private palace with a language movement working in the basement.",
        fact:
          "Petras Vileišis installed the press for the first legal Lithuanian-language daily newspaper in the palace guesthouse basement.",
        story:
          "After the tsarist press ban ended, Vileišis used his engineering fortune to print books, run a bookstore, publish a daily, and host the first Lithuanian art exhibition. None of it made money, but it helped turn Vilnius into a center of Lithuanian public life.",
        lookFor: "During restoration, documents appeared inside the walls, but not the rumored original Act of Independence.",
        sourceLabel: "Wikipedia: Vileišis Palace",
        sourceUrl: wiki("Vilei%C5%A1is_Palace"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Vileisiu1_by_Augustas_Didzgalvis.jpg/1280px-Vileisiu1_by_Augustas_Didzgalvis.jpg",
          "Vileisiu1 by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Ornate Neo-baroque Vileišis Palace",
        ),
      },
      {
        id: "antakalnis-cemetery",
        name: "Antakalnis Cemetery",
        type: "cemetery",
        coordinates: [54.698, 25.321],
        hook: "Three thousand of Napoleon's soldiers waited almost two centuries for this burial.",
        fact:
          "In 2003, more than 3,000 soldiers from Napoleon's failed 1812 campaign were reburied here after a mass grave was found beneath a Soviet military site.",
        story:
          "The cemetery also holds 12 victims of the 1991 Soviet attack and soldiers from several armies and wars. It reads less like a single national pantheon than a difficult index of who has fought over this city.",
        lookFor: "Memorial groups from different conflicts sit close enough to make history feel uncomfortably simultaneous.",
        sourceLabel: "Wikipedia: Antakalnis Cemetery",
        sourceUrl: wiki("Antakalnis_Cemetery"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Antakalnio_kap_by_Augustas_Didzgalvis.jpg/1280px-Antakalnio_kap_by_Augustas_Didzgalvis.jpg",
          "Antakalnio kap by Augustas Didzgalvis.jpg",
          "Augustas Didžgalvis",
          "CC BY-SA 4.0",
          "Memorial graves at Antakalnis Cemetery",
        ),
      },
      {
        id: "three-crosses",
        name: "Three Crosses",
        type: "monument",
        coordinates: [54.6867, 25.2976],
        hook: "The restored monument stands above fragments of the one the Soviets destroyed.",
        fact:
          "Soviet authorities tore down the concrete crosses in 1950. When Vilnius rebuilt them in 1989, broken pieces of the old monument were left visible below.",
        story:
          "The crosses refer to a disputed legend of murdered Franciscan friars. Whether the medieval story is literal or embellished, the monument acquired a second meaning through its own destruction and return during the independence movement.",
        lookFor: "The rebuilt crosses are 1.8 metres taller than the 1916 version.",
        sourceLabel: "Wikipedia: Three Crosses",
        sourceUrl: wiki("Three_Crosses"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Vilnius_Three_Crosses.jpg/1280px-Vilnius_Three_Crosses.jpg",
          "Vilnius Three Crosses.jpg",
          "Wikimedia Commons contributor",
          "CC BY-SA 3.0",
          "White Three Crosses monument above Vilnius",
        ),
      },
    ],
  },
  {
    id: "karoliniskes",
    name: "Karoliniškės",
    localName: "Karoliniškės",
    coordinates: [54.69, 25.2225],
    footprint: [3.55, 2.6],
    buildingStyle: "soviet",
    count: 40,
    hook: "Here the skyline became the front line of independence.",
    story:
      "Karoliniškės is a Soviet-era residential district on the western escarpment. Its television tower was designed to broadcast across the republic. In January 1991, control of that signal became a matter of tanks, crowds, and lives.",
    sourceLabel: "Karoliniškės on Wikipedia",
    sourceUrl: wiki("Karolini%C5%A1k%C4%97s"),
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Vilnius_TV_Tower_reflected_in_a_puddle_at_Lazdynai.jpg/1280px-Vilnius_TV_Tower_reflected_in_a_puddle_at_Lazdynai.jpg",
      "Vilnius TV Tower reflected in a puddle at Lazdynai.jpg",
      "Illustr",
      "CC BY-SA 4.0",
      "Vilnius TV Tower reflected in rainwater",
    ),
    landmarks: [
      {
        id: "tv-tower",
        name: "Vilnius TV Tower",
        type: "tower",
        coordinates: [54.687222, 25.214722],
        hook: "A broadcast tower, a rotating cafe, and once the world's largest basketball hoop.",
        fact:
          "For the 2011 European Basketball Championship, the 326.5-metre tower became a giant hoop with a 35-metre rim, a 40-metre net, and 545 lights.",
        story:
          "The playful scale sits beside a grave history. On 13 January 1991, unarmed civilians defended the tower from Soviet forces. Fourteen civilians died during the wider attack and hundreds were injured.",
        lookFor: "The observation platform rotates once every 45 minutes, 165 metres above the ground.",
        sourceLabel: "Wikipedia: Vilnius TV Tower",
        sourceUrl: wiki("Vilnius_TV_Tower"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Vilnius_TV_Tower_reflected_in_a_puddle_at_Lazdynai.jpg/1280px-Vilnius_TV_Tower_reflected_in_a_puddle_at_Lazdynai.jpg",
          "Vilnius TV Tower reflected in a puddle at Lazdynai.jpg",
          "Illustr",
          "CC BY-SA 4.0",
          "Vilnius TV Tower reflected in a puddle",
        ),
      },
      {
        id: "january-13-memorial",
        name: "January 13 Memorial",
        type: "memory",
        coordinates: [54.68675, 25.21545],
        hook: "The names around the tower mark exactly where people fell.",
        fact:
          "Markers at the tower identify places where civilians died while holding the blockade against Soviet troops. Nearby streets were later renamed for nine victims.",
        story:
          "People came from across Lithuania to surround the tower, parliament, radio building, and telephone exchange. The broadcast was seized, but the state they were defending survived. January 13 is now the Day of the Defenders of Freedom.",
        lookFor: "The memorial is dispersed around the landscape rather than contained in one object.",
        sourceLabel: "Wikipedia: January Events",
        sourceUrl: wiki("January_Events"),
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/8/85/January_13_events_in_Vilnius_Lithuania.jpg",
          "January 13 events in Vilnius Lithuania.jpg",
          "Unspecified photographer",
          "GFDL",
          "Crowds and Soviet tanks during the January 1991 events in Vilnius",
        ),
      },
      {
        id: "press-house",
        name: "Press House",
        type: "modernist",
        coordinates: [54.6964, 25.2554],
        hook: "The first bullets of the January crisis hit a building made for words.",
        fact:
          "On 11 January 1991, Soviet troops surrounded and seized the Press House. Soldiers used live ammunition and several civilians were hospitalized.",
        story:
          "The attack came two days before the TV Tower killings. Seen in sequence, the targets reveal the strategy: control defense, print, television, telephones, and parliament, then control the story of whether Lithuania existed.",
        lookFor: "The tall modernist slab still dominates the western approach to the center.",
        sourceLabel: "Wikipedia: January Events timeline",
        sourceUrl: `${wiki("January_Events")}#Friday_11_January_1991`,
        photo: photo(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Unarmed_civilians_defend_the_Lithuanian_Press_House_from_Soviet_army_paratroopers%2C_January_1991%2C_Vilnius%2C_Lithuania.jpg/1280px-Unarmed_civilians_defend_the_Lithuanian_Press_House_from_Soviet_army_paratroopers%2C_January_1991%2C_Vilnius%2C_Lithuania.jpg",
          "Unarmed civilians defend the Lithuanian Press House from Soviet army paratroopers, January 1991, Vilnius, Lithuania.jpg",
          "Paulius Lileikis, Lithuanian Central State Archives",
          "CC BY 4.0",
          "Unarmed civilians outside the Press House in January 1991",
        ),
      },
    ],
  },
];

const VILNIUS_TRAILS = [
  {
    id: "sacred-strange",
    name: "Sacred and strange",
    hook: "Six places where belief refuses to stay simple.",
    stops: [
      "vilnius-cathedral",
      "st-anne",
      "gate-of-dawn",
      "great-synagogue",
      "uzupis-constitution",
      "peter-paul",
    ],
  },
  {
    id: "power-resistance",
    name: "Power and resistance",
    hook: "From buried monuments to the fight for the broadcast signal.",
    stops: [
      "three-crosses",
      "zappa-memorial",
      "vingis-park",
      "press-house",
      "january-13-memorial",
      "tv-tower",
    ],
  },
  {
    id: "second-lives",
    name: "The second-life city",
    hook: "Buildings that became almost the opposite of what they were.",
    stops: [
      "lukiskes-prison",
      "mo-museum",
      "energy-museum",
      "vilnius-kenesa",
      "sapieha-palace",
    ],
  },
];

const KLAIPEDA_CITY = {
  id: "klaipeda",
  name: "Klaipėda",
  localName: "Klaipėda / Memel",
  coordinates: [55.7033, 21.1443],
  eyebrow: "The port is the plot",
  headline: "The city opens like a sea gate.",
  intro:
    "Klaipėda is a city of moving thresholds: land and lagoon, Lithuania and Prussia, fortress and port. Follow the signal colors into each rajonas.",
  story:
    "Klaipėda does not sit beside the water. It is engineered around water. Castle moats became markets, bridges turn for masts, a Prussian fort holds tropical fish, and the Curonian Spit remains a ferry ride from the center. This edition treats the city as a working harbor instrument.",
  sourceLabel: "Klaipėda on Wikipedia",
  sourceUrl: wiki("Klaip%C4%97da"),
  photo: commonsPhoto(
    "Klaipeda old town.jpg",
    "Squareshadow",
    "Public domain",
    "Brick and timber architecture in Klaipėda Old Town",
  ),
  quickFacts: [
    "For one winter, this port became the capital of Prussia.",
    "A bridge still needs two people to turn it by hand.",
    "The aquarium is built inside a fort that almost never fought.",
    "The city's favorite ghost came to warn a guard about groceries.",
  ],
};

const KLAIPEDA_DISTRICTS = [
  {
    id: "klaipeda-old-town",
    name: "Old Town",
    localName: "Senamiestis",
    coordinates: [55.7077, 21.1382],
    footprint: [2.65, 2.2],
    buildingStyle: "old",
    count: 32,
    hook: "A German street grid where castle ditches became public rooms.",
    story:
      "Klaipėda's old center looks unlike the curving medieval towns elsewhere in Lithuania. Its right-angle streets, fachwerk frames, market spaces, and brick warehouses carry the memory of Memel, a Prussian trading city repeatedly rebuilt after fire and war.",
    sourceLabel: "Klaipėda Old Town",
    sourceUrl: `${wiki("Klaip%C4%97da")}#Old_town`,
    photo: commonsPhoto(
      "Klaipeda old town.jpg",
      "Squareshadow",
      "Public domain",
      "A street in Klaipėda Old Town",
    ),
    landmarks: [
      {
        id: "klaipeda-theatre-square",
        name: "Theatre Square",
        type: "square",
        coordinates: [55.70723, 21.13545],
        hook: "The city's ceremonial square began with a filled-in moat and a butcher market.",
        fact:
          "The New Market opened here in 1819 after part of Klaipėda Castle's defensive moat was filled. Fishermen later sold catch from boats decorated with Curonian weathervanes.",
        story:
          "The square moved from meat and fish to performance without losing its appetite for crowds. Touring actors were staging outdoor shows nearby as early as the 17th century. Today the Sea Festival and concerts occupy ground once used by market carts and castle defenses.",
        lookFor: "The square's unusually broad shape makes more sense when you imagine water and market stalls beneath it.",
        sourceLabel: "Klaipėda Travel: Theatre Square",
        sourceUrl: "https://klaipedatravel.lt/en/place/theater-square/",
        photo: commonsPhoto(
          "Klaipėda teatra placo (teatros aikštė) Ännchen von Tharau 1.jpg",
          "Thomas Pusch",
          "CC BY-SA 3.0",
          "Theatre Square and the Ann from Tharau fountain in Klaipėda",
        ),
      },
      {
        id: "klaipeda-ann-tharau",
        name: "Ann from Tharau",
        type: "sculpture",
        coordinates: [55.70739, 21.13532],
        hook: "The famous girl is really the frontispiece of a monument to a poet.",
        fact:
          "The fountain honors Klaipėda-born poet Simon Dach. Ann is the heroine of his best-known love song, a melody still played by the bells of Munich's New Town Hall.",
        story:
          "The original 1912 statue disappeared during World War II. A reconstruction returned in 1989, funded by citizens of Klaipėda and Germany. The result is a compact lesson in the city's layered identity: a Lithuanian square, a German-language poet, and a song that wandered across Europe.",
        lookFor: "Ann faces the theatre, holding the quiet center while the square changes around her.",
        sourceLabel: "Klaipėda Travel: Ann from Tharau",
        sourceUrl: "https://klaipedatravel.lt/en/place/sculpture-ann-from-tharau/",
        photo: commonsPhoto(
          "Ännchen von Tharau Klaipėda.jpg",
          "Barnos",
          "CC BY-SA 4.0",
          "Ann from Tharau sculpture and fountain in Klaipėda",
        ),
      },
      {
        id: "klaipeda-old-warehouses",
        name: "The Two Brothers",
        type: "industrial",
        coordinates: [55.70861, 21.13118],
        hook: "Even the warehouses had stage names.",
        fact:
          "Two similar riverside granaries became the Germania-Speicher and Dange-Speicher, then simply the Two Brothers. Other warehouses were called Leopard, Hermes, Three Roofs, and Green Warehouse.",
        story:
          "Warehouses appear on the river in the oldest known view of Klaipėda from 1535. Their names turned practical trade buildings into characters in the city. The surviving timber frames are not rustic decoration. They are a visual record of a port designed around storing, weighing, and moving goods.",
        lookFor: "Dark structural timbers remain legible against the pale infill, like a building showing its skeleton.",
        sourceLabel: "Klaipėda Travel: Old Warehouses",
        sourceUrl: "https://klaipedatravel.lt/en/place/the-old-warehouses/",
        photo: commonsPhoto(
          "Fachwerk uploaded 2026-05-25.jpg",
          "Rob Oo [OFF]",
          "CC BY 4.0",
          "Fachwerk timber framing in Klaipėda",
        ),
      },
      {
        id: "klaipeda-bastions",
        name: "Jono Hill Bastions",
        type: "fort",
        coordinates: [55.70808, 21.14461],
        hook: "A Dutch fortress became a garden with dancing fountains.",
        fact:
          "Engineers wrapped Klaipėda in Dutch-style earthworks from 1627. During the Seven Years' War, future Russian general Alexander Suvorov served here as commandant.",
        story:
          "Only three gates once pierced the system of ramparts, bastions, ditches, and a ravelin. At Jono Hill, the old military geometry survives but the purpose has inverted. Paths, play areas, lights, and fountains now occupy land engineered to keep people out.",
        lookFor: "Read the low green slopes as walls. The empty-looking landscape is the architecture.",
        sourceLabel: "Klaipėda Travel: Bastions",
        sourceUrl: "https://klaipedatravel.lt/en/place/klaipeda-bastions-fortresses-that-turned-into-a-city-garden/",
        photo: commonsPhoto(
          "Klaipeda castle ruins.jpg",
          "Andrius Vanagas",
          "CC BY 3.0",
          "Brick remains at the Klaipėda castle and bastion complex",
        ),
      },
    ],
  },
  {
    id: "klaipeda-castle-quarter",
    name: "Castle Quarter",
    localName: "Piliavietė",
    coordinates: [55.7058, 21.1286],
    footprint: [2.5, 2.15],
    buildingStyle: "industrial",
    count: 23,
    hook: "The city began on marshland and kept rebuilding the threshold.",
    story:
      "At the mouth of the Danė, castle engineering, dock machinery, sculpture, and surviving industrial buildings overlap. It is the clearest place to see Klaipėda's core habit: turning defensive infrastructure into civic theater without sanding away the mechanics.",
    sourceLabel: "Klaipėda Castle on Wikipedia",
    sourceUrl: wiki("Klaip%C4%97da_Castle"),
    photo: commonsPhoto(
      "Klaipeda castle tower.JPG",
      "Andrius Vanagas",
      "CC BY 3.0",
      "Reconstructed tower at the Klaipėda Castle site",
    ),
    landmarks: [
      {
        id: "klaipeda-castle",
        name: "Klaipėda Castle",
        type: "fort",
        coordinates: [55.70591, 21.12862],
        hook: "A geographical misunderstanding helped name the city Memelburg.",
        fact:
          "The Teutonic founders believed the Curonian Lagoon was a branch of the Nemunas, known in German as the Memel. The new castle became Memelburg, and the city was known as Memel for centuries.",
        story:
          "The first wooden fort rose on a marshy cape in 1252. Fire, Lithuanian and Samogitian attacks, Swedish forces, and changing artillery repeatedly forced new walls and earthworks. What remains is less a frozen castle than a cross-section through 700 years of military adaptation.",
        lookFor: "The ground plan and recovered brickwork reveal the footprint more clearly than a picturesque ruin would.",
        sourceLabel: "Klaipėda Travel: Castle Site",
        sourceUrl: "https://klaipedatravel.lt/en/place/castle-place/",
        photo: commonsPhoto(
          "Klaipeda castle tower.JPG",
          "Andrius Vanagas",
          "CC BY 3.0",
          "Tower and archaeological remains at Klaipėda Castle",
        ),
      },
      {
        id: "klaipeda-black-ghost",
        name: "Black Ghost",
        type: "sculpture",
        coordinates: [55.70643, 21.12669],
        hook: "Klaipėda's monster appeared to discuss grain and firewood.",
        fact:
          "A 1595 chronicle tells of a cloaked figure rising beside the castle and asking guard Hans von Heide whether the stores were full. It warned that grain and firewood would soon run short, then vanished.",
        story:
          "The sculpture by Svajūnas Jurkus and Sergejus Plotnikov appears halfway out of the harbor edge, turning a practical warning about provisions into the city's most theatrical photo encounter. It is folklore shaped by port anxiety: weather, siege, and supply all arriving from the water.",
        lookFor: "The figure is not on a plinth. Its bronze cloak uses the quay itself as the threshold.",
        sourceLabel: "Klaipėda Travel: Black Ghost",
        sourceUrl: "https://klaipedatravel.lt/en/place/jv/",
        photo: commonsPhoto(
          "Klaipeda most obrotowy 3.jpg",
          "Andrzej Otrębski",
          "CC BY-SA 4.0",
          "The castle harbor edge and swing bridge beside the Black Ghost sculpture",
        ),
      },
      {
        id: "klaipeda-swing-bridge",
        name: "Hand-Turned Bridge",
        type: "bridge",
        coordinates: [55.70624, 21.12754],
        hook: "The harbor still pauses while two people rotate a bridge by hand.",
        fact:
          "Built in 1855 from riveted iron, the bridge is the only one of its kind in Lithuania. Two operators physically turn it so boats can enter the former castle moat.",
        story:
          "Before electric motors made infrastructure disappear into a button, opening a route was visible labor. Klaipėda has kept that choreography. Pedestrians wait, operators push, the deck swings, masts pass, and the city closes itself again.",
        lookFor: "Chains and rivets make the bridge's forces visible. Nothing is hidden behind cladding.",
        sourceLabel: "Klaipėda Travel: Swing Bridge",
        sourceUrl: "https://klaipedatravel.lt/en/place/swing-bridge-also-known-as-the-chain-bridge/",
        photo: commonsPhoto(
          "Klaipeda most obrotowy 4.jpg",
          "Andrzej Otrębski",
          "CC BY-SA 4.0",
          "The hand-operated swing bridge at Klaipėda Castle harbor",
        ),
      },
      {
        id: "klaipeda-bokstas",
        name: "Bokštas",
        type: "sculpture",
        coordinates: [55.70931, 21.13895],
        hook: "A bronze house occupies the address of a house erased by war.",
        fact:
          "The 1990 sculpture stands where a building burned during World War II. It won a competition after plans for a fountain were abandoned.",
        story:
          "Algirdas Bosas compressed architectural styles, residents, local customs, private names, and dates into one bronze tower. It behaves like a memory building: the lost address remains inhabited, but by several eras at once.",
        lookFor: "Tiny figures and fragments reward orbiting the object rather than reading it from one official front.",
        sourceLabel: "Klaipėda Travel: Bokštas",
        sourceUrl: "https://klaipedatravel.lt/en/place/sculpture-bokstas-tower/",
        photo: commonsPhoto(
          "Klaipeda, \"Bokštas\" - panoramio.jpg",
          "Laima Gūtmane",
          "CC BY-SA 3.0",
          "The bronze Bokštas memory sculpture in Klaipėda",
        ),
      },
    ],
  },
  {
    id: "klaipeda-dane",
    name: "Danė Waterfront",
    localName: "Danės krantinė",
    coordinates: [55.7108, 21.1329],
    footprint: [3.15, 1.75],
    buildingStyle: "contrast",
    count: 27,
    hook: "Bridges, rulers, ships, and trade all face the same strip of water.",
    story:
      "The Danė is Klaipėda's moving main street. Warehouses and civic buildings line its banks, bridges open for vessels, and a training ship has become a city emblem. The riverfront tells political history through working objects rather than monuments alone.",
    sourceLabel: "Klaipėda on Wikipedia",
    sourceUrl: wiki("Klaip%C4%97da"),
    photo: commonsPhoto(
      "Meridianas 2019 m.jpg",
      "Turaids",
      "CC BY-SA 4.0",
      "Meridianas sailing ship on the Danė River",
    ),
    landmarks: [
      {
        id: "klaipeda-meridianas",
        name: "Meridianas",
        type: "ship",
        coordinates: [55.71003, 21.13707],
        hook: "A Finnish war-reparation ship became Klaipėda's dining-room masthead.",
        fact:
          "Built in Turku in 1948 as part of Finland's postwar contributions to the Soviet Union, Meridianas later trained Klaipėda sailors. Only a few of its 48 sister ships survive.",
        story:
          "The ship ended training service in 1967 and returned as a floating restaurant, tying maritime memory to ordinary evenings in the city. After a major restoration, it came back to this river berth in 2013.",
        lookFor: "Its rigging turns the low river skyline into a port silhouette even when no cargo ship is visible.",
        sourceLabel: "Klaipėda Travel: Meridianas",
        sourceUrl: "https://klaipedatravel.lt/en/place/sailing-vessel-meridianas/",
        photo: commonsPhoto(
          "Meridianas, Klaipėda, 2006 (02).jpg",
          "Bahnfrend",
          "CC BY-SA 4.0",
          "Meridianas sailing ship moored on the Danė River",
        ),
      },
      {
        id: "klaipeda-birzos-bridge",
        name: "Biržos Bridge",
        type: "bridge",
        coordinates: [55.70903, 21.13312],
        hook: "The bridge once worked as a cash register for every passing mast.",
        fact:
          "The wooden predecessor had a removable center section. Ships paid a toll to pass through, making the bridge an engineering gate that also measured trade.",
        story:
          "A steel bascule bridge replaced it in 1879, was destroyed in World War II, rebuilt in 1948, and reconstructed again in 2007. Its name comes from the stock exchange that once stood nearby. Movement, money, and river clearance were concentrated at one crossing.",
        lookFor: "Stand back far enough to read the road deck as something designed to move, not permanent ground.",
        sourceLabel: "Klaipėda Travel: Biržos Bridge",
        sourceUrl: "https://klaipedatravel.lt/en/place/birza-bridge/",
        photo: commonsPhoto(
          "Bridge in Klaipėda, Lithuania..jpg",
          "Vasarossunus",
          "Public domain",
          "Biržos Bridge crossing the Danė River in Klaipėda",
        ),
      },
      {
        id: "klaipeda-town-hall",
        name: "Town Hall",
        type: "palace",
        coordinates: [55.71144, 21.13288],
        hook: "Napoleon chased the Prussian court until Klaipėda became a capital.",
        fact:
          "King Frederick William III and Queen Louise lived here in 1807 and 1808. During their refuge from Napoleon, Klaipėda briefly served as the capital of Prussia.",
        story:
          "The building began as the house of Danish consul Lork. The city bought it in 1846 and turned a private riverfront residence into the town hall. Its modest scale makes the temporary-capital episode feel even stranger: major Prussian decisions passed through a house beside the Danė.",
        lookFor: "The restrained classicist facade gives almost no warning of its royal interlude.",
        sourceLabel: "Klaipėda Travel: Town Hall",
        sourceUrl: "https://klaipedatravel.lt/en/place/the-town-hall/",
        photo: commonsPhoto(
          "Klaipedos Rotuse (02).JPG",
          "Squareshadow",
          "Public domain",
          "Klaipėda Town Hall beside the Danė River",
        ),
      },
      {
        id: "klaipeda-arka",
        name: "Arka",
        type: "monument",
        coordinates: [55.71074, 21.12652],
        hook: "A 150-ton reunion leaves one corner permanently missing.",
        fact:
          "The red granite column represents Lithuania Minor and the grey column Lithuania Major. A broken section at the top stands for land and connection that were lost.",
        story:
          "Arūnas Sakalauskas created the 8.5-meter monument in 2003 for the 80th anniversary of the Klaipėda Region joining Lithuania. Its two stones meet, but the join is not made whole. Unity is shown as weight, tension, and remembered absence.",
        lookFor: "The negative space at the top carries as much meaning as the stone below it.",
        sourceLabel: "Klaipėda Travel: Arka",
        sourceUrl: "https://klaipedatravel.lt/en/place/arch-monument-to-the-united-lithuania/",
        photo: commonsPhoto(
          "Arka Monument in Klaipeda.JPG",
          "Squareshadow",
          "Public domain",
          "Arka monument on the Danė waterfront in Klaipėda",
        ),
      },
    ],
  },
  {
    id: "klaipeda-new-town",
    name: "New Town",
    localName: "Naujamiestis",
    coordinates: [55.7197, 21.1346],
    footprint: [3.05, 3.25],
    buildingStyle: "industrial",
    count: 31,
    hook: "Red brick institutions keep changing jobs without losing their posture.",
    story:
      "North of the old center, Klaipėda's expansion reads as a chain of disciplined brick ensembles: post, railway, barracks, and cemetery. Their second lives reveal how the city reused structures left by very different political systems.",
    sourceLabel: "Klaipėda on Wikipedia",
    sourceUrl: wiki("Klaip%C4%97da"),
    photo: commonsPhoto(
      "Main post office building in Klaipėda 01.jpg",
      "Derbrauni",
      "CC BY 4.0",
      "Red brick Old Post Office in Klaipėda",
    ),
    landmarks: [
      {
        id: "klaipeda-post-office",
        name: "Old Post Office",
        type: "gate",
        coordinates: [55.71358, 21.13534],
        hook: "A communications building still broadcasts through 48 bells.",
        fact:
          "One side wing stored goods and horses; the other was a carriage house. Above them, a carillon of 48 Dutch-cast bells continues the building's job of sending signals.",
        story:
          "The ensemble mixes neo-Gothic pointed forms, green glazed ceramics, classicist fence details, and the logistics of mail before engines. Its architecture turns communication into a complete campus: people, parcels, animals, vehicles, and sound.",
        lookFor: "Green glazed accents interrupt the red clinker brick at exactly the points the eye wants to follow.",
        sourceLabel: "Klaipėda Travel: Old Post Office",
        sourceUrl: "https://klaipedatravel.lt/en/place/the-old-post-office/",
        photo: commonsPhoto(
          "Main post office building in Klaipėda 01.jpg",
          "Derbrauni",
          "CC BY 4.0",
          "Neo-Gothic facade of Klaipėda Old Post Office",
        ),
      },
      {
        id: "klaipeda-sculpture-park",
        name: "Sculpture Park",
        type: "park",
        coordinates: [55.71684, 21.13374],
        hook: "A Soviet sculpture park was laid across the city's main cemetery.",
        fact:
          "The 12-hectare park opened in 1977 on Klaipėda's central cemetery, used from 1820. It now holds 116 works by 67 Lithuanian artists and monuments to people still buried below.",
        story:
          "The site is both open-air modernism and damaged memory. Among the sculptures stands an authentic 1925 border marker that once separated Lithuania Minor from Lithuania Major. The park's calm cannot be read honestly without both layers.",
        lookFor: "Two old entrance columns survive as quiet evidence that the park once had a different name and ritual.",
        sourceLabel: "Klaipėda Travel: Sculpture Park",
        sourceUrl: "https://klaipedatravel.lt/en/place/sculpture-park/",
        photo: commonsPhoto(
          "In Klaipeda Sculpture Park, 2019-08-18.jpg",
          "Alexey Komarov",
          "CC BY-SA 4.0",
          "Modern sculptures among trees in Klaipėda Sculpture Park",
        ),
      },
      {
        id: "klaipeda-university",
        name: "University Campus",
        type: "industrial",
        coordinates: [55.73126, 21.13314],
        hook: "An armory and barracks now issue library cards.",
        fact:
          "Six neo-Gothic red-brick buildings were erected from 1904 to 1907 with barracks, a chapel, dining rooms, and an armory. Klaipėda University moved into the military ensemble decades later.",
        story:
          "The university itself was founded only in 1991, the year Lithuania restored its institutions after Soviet rule. The campus makes that transition spatially visible: a place organized for discipline and weapons now supports marine research, publishing, study, and a botanical garden.",
        lookFor: "Repeated windows and steep brick gables still carry the order of a military compound.",
        sourceLabel: "Klaipėda Travel: University Ensemble",
        sourceUrl: "https://klaipedatravel.lt/en/place/klaipeda-university-building-complex/",
        photo: commonsPhoto(
          "Academic campus of Klaipėda University in Klaipėda, Lithuania in 2022.jpg",
          "Klaipėda University",
          "CC BY-SA 4.0",
          "Historic red brick buildings of Klaipėda University campus",
        ),
      },
      {
        id: "klaipeda-siaurukas",
        name: "Siaurukas Station",
        type: "station",
        coordinates: [55.72017, 21.13763],
        hook: "A tiny railway gave the region its first taste of everyday departure.",
        fact:
          "From 1906, privately operated trains left this station on rails only 1,000 millimeters apart. The Memeler Kleinbahn carried passengers, lime, and sawmill products into the region.",
        story:
          "The trains were slow but dependable, and contemporary memory treats the trip itself as an event, especially for children. The dark-red station is a leftover interface from a network that once made small surrounding towns feel connected to the port.",
        lookFor: "Its scale is the clue. This was not a monumental terminal but the front door to a narrow local system.",
        sourceLabel: "Klaipėda Travel: Narrow-Gauge Station",
        sourceUrl: "https://klaipedatravel.lt/en/place/narrow-gauge-railway-station/",
        photo: commonsPhoto(
          "Skultūra prie buvusios Klaipėdos siauruko geležinkelio stoties.jpg",
          "Petriukas",
          "CC BY-SA 4.0",
          "Sculpture beside the former Klaipėda narrow-gauge railway station",
        ),
      },
    ],
  },
  {
    id: "klaipeda-smiltyne",
    name: "Smiltynė",
    localName: "Smiltynė / Sandkrug",
    coordinates: [55.7138, 21.0997],
    footprint: [2.3, 5.5],
    buildingStyle: "wood",
    count: 24,
    hook: "A city district you can reach only by crossing water.",
    story:
      "Smiltynė is the northern tip of the Curonian Spit and still feels like an island in city life. Ferries replace streets, dunes replace blocks, villas sit among pine, and layers of coastal defense are hidden beneath recreational paths.",
    sourceLabel: "Smiltynė on Wikipedia",
    sourceUrl: wiki("Smiltyn%C4%97"),
    photo: commonsPhoto(
      "Beach of smiltyne.JPG",
      "Pavel Gromov",
      "CC BY 2.5",
      "Sand beach and Baltic Sea at Smiltynė",
    ),
    landmarks: [
      {
        id: "klaipeda-sea-museum",
        name: "Nerija Fort Aquarium",
        type: "fort",
        coordinates: [55.71694, 21.10072],
        hook: "A tropical aquarium occupies the shape of a Prussian gun fort.",
        fact:
          "The 1865 fort was almost never used for combat. Its one practical wartime role was sheltering townspeople during the Russian occupation in World War I. The aquarium opened inside it in 1979.",
        story:
          "Retreating German forces blew up the central redoubt in World War II. The modern aquarium echoes its circular form, while former casemates, powder stores, and caponiers hold maritime exhibits. A defensive journey into earth now becomes a journey from Lithuanian streams to tropical seas.",
        lookFor: "The water-filled moat and single bridge make the museum visit preserve the original sequence of entering a fort.",
        sourceLabel: "Lithuanian Sea Museum: Nerija Fort",
        sourceUrl: "https://old.muziejus.lt/en/paslaugos/nerija-fort",
        photo: commonsPhoto(
          "Lithuania Sea Museum - Kolyma.jpg",
          "Ewa Dryjanska",
          "CC BY-SA 3.0",
          "Fort walls and entrance of the Lithuanian Sea Museum",
        ),
      },
      {
        id: "klaipeda-smiltyne-resort",
        name: "Sandkrug Shore",
        type: "park",
        coordinates: [55.71076, 21.09541],
        hook: "This city neighborhood has no road or tunnel to the rest of its city.",
        fact:
          "The settlement was recorded in 1429 as Sandberg, then as Sandkrug, the sand tavern. There is still no bridge to central Klaipėda. Residents and visitors cross by ferry.",
        story:
          "In the 19th century, Smiltynė became a resort of beaches, forest walks, and villas. The short boat crossing creates a powerful spatial edit: brick port city on one side, pine and dune landscape on the other, both inside Klaipėda.",
        lookFor: "Old villas use timber details that sit between resort fantasy and practical coastal construction.",
        sourceLabel: "Klaipėda Travel: Smiltynė",
        sourceUrl: "https://klaipedatravel.lt/apie-smiltynes-papludimi/",
        photo: commonsPhoto(
          "Ferry pedestrian Smiltyne Klaipeda.JPG",
          "ThomasMelle",
          "CC BY-SA 3.0",
          "Pedestrian ferry crossing between central Klaipėda and Smiltynė",
        ),
      },
      {
        id: "klaipeda-jachmann-battery",
        name: "Jachmann Battery",
        type: "fort",
        coordinates: [55.70438, 21.09862],
        hook: "A coastal battery was listed as lost while its concrete waited under the dunes.",
        fact:
          "Construction began in 1939 for four 150-millimeter naval guns. The permanent armament was never completed, and the guns remained on temporary concrete platforms.",
        story:
          "Named for German vice admiral Eduard von Jachmann, Memel Süd defended the sea approach to the port. Its surviving two-story fire-control position and concrete traces merge into pine and sand without signs or a formal path, so rediscovery feels appropriately accidental.",
        lookFor: "Changes in the dune profile and abrupt concrete edges are the map. The fortification hides by becoming landscape.",
        sourceLabel: "Klaipėda Travel: Jachmann Battery",
        sourceUrl: "https://klaipedatravel.lt/en/place/remaining-fortifications-the-jachmann-or-memel-sud/",
        photo: commonsPhoto(
          "Beach of smiltyne.JPG",
          "Pavel Gromov",
          "CC BY 2.5",
          "Dunes and coastal landscape at Smiltynė where the Jachmann Battery is hidden",
        ),
      },
      {
        id: "klaipeda-sea-gate",
        name: "Sea Gate Piers",
        type: "lighthouse",
        coordinates: [55.72874, 21.08742],
        hook: "Two long lines of stone keep an ice-prone sea from rewriting the harbor mouth.",
        fact:
          "The north and south piers do three jobs at once: reduce swell, resist ice, and limit sediment from choking the port entrance.",
        story:
          "The piers are infrastructure you can walk into. Cargo ships pass between them while waves strike from outside, turning the geometry of a protected harbor into something felt through wind, spray, and scale.",
        lookFor: "Watch the difference between the turbulent Baltic side and the calmer channel inside the gate.",
        sourceLabel: "Klaipėda Travel: Sea Gate Piers",
        sourceUrl: "https://klaipedatravel.lt/en/place/klaipeda-pier/",
        photo: commonsPhoto(
          "Klaipėda sea port gate 02.jpg",
          "GiW",
          "CC BY-SA 3.0",
          "Klaipėda's sea gate and protective harbor piers",
        ),
      },
    ],
  },
];

const KLAIPEDA_TRAILS = [
  {
    id: "klaipeda-moving-parts",
    name: "The moving port",
    hook: "Four machines that make water part of the street plan.",
    stops: [
      "klaipeda-swing-bridge",
      "klaipeda-birzos-bridge",
      "klaipeda-meridianas",
      "klaipeda-sea-gate",
    ],
  },
  {
    id: "klaipeda-memel-afterimages",
    name: "Memel afterimages",
    hook: "The Prussian city is gone, but its structures keep taking new jobs.",
    stops: [
      "klaipeda-castle",
      "klaipeda-town-hall",
      "klaipeda-ann-tharau",
      "klaipeda-post-office",
      "klaipeda-university",
      "klaipeda-sculpture-park",
    ],
  },
  {
    id: "klaipeda-between-waters",
    name: "Between two waters",
    hook: "Cross the lagoon into dunes, forts, and the Baltic edge.",
    stops: [
      "klaipeda-black-ghost",
      "klaipeda-sea-museum",
      "klaipeda-smiltyne-resort",
      "klaipeda-jachmann-battery",
      "klaipeda-sea-gate",
    ],
  },
];

const VILNIUS_COLORS = ["#ff8a4c", "#c9ef5b", "#bd7dff", "#42c8e8", "#ff6f91", "#f2c94c", "#ed5f57"];
const KLAIPEDA_COLORS = ["#ff675d", "#ffc83d", "#28d7c0", "#4f8cff", "#9ee548"];

const colorDistricts = (districts, colors) =>
  districts.map((district, index) => ({ ...district, color: colors[index % colors.length] }));

export const CITIES = [
  {
    ...VILNIUS_CITY,
    shortMark: "VI",
    alternateId: "klaipeda",
    districts: colorDistricts(VILNIUS_DISTRICTS, VILNIUS_COLORS),
    trails: VILNIUS_TRAILS,
    scene: {
      center: [54.6872, 25.2797],
      scale: [190, 310],
      accent: "#d6e967",
      secondary: "#ff8a4c",
      groundShapes: [[
        [-15.4, -1.8], [-13.2, -5.7], [-8.4, -7.1], [-1.3, -7.6],
        [5.8, -6.5], [10.9, -3.7], [12.1, 0.8], [9.3, 5.3],
        [3.4, 7.4], [-4.6, 7.1], [-11.2, 5.3], [-15.8, 1.9],
      ]],
      waterRoutes: [
        { width: 0.62, height: 0.075, points: [[-16, -0.25], [-12.2, -0.78], [-8.8, -0.62], [-5.6, -1.15], [-2.5, -1.35], [0.8, -0.98], [4.2, -1.55], [8.3, -1.28], [12.8, -1.72]] },
        { width: 0.25, height: 0.082, points: [[9.2, 4.9], [7.6, 3.5], [6.1, 2.55], [4.55, 1.25], [3.35, 1.62], [2.3, 0.35], [1.15, -0.96]] },
      ],
      moverPaths: [
        { kind: "tram", speed: 0.035, color: "#ff8a4c", points: [[-11, 4.5], [-6, 2.8], [-1, 0.6], [4, -1.1], [9, -2.8]] },
        { kind: "boat", speed: 0.024, color: "#42c8e8", points: [[-13, -0.7], [-7, -0.8], [-1, -1.25], [5, -1.45], [10, -1.5]] },
      ],
      palette: {
        dark: { background: 0x0d1110, fog: 0x0d1110, land: 0x18201b, landEdge: 0x5d7262, district: 0x27332b, districtLine: 0xa9ba9e, building: 0x526257, buildingSelected: 0x7f927e, roof: 0x643f42, road: 0xa6b39c, river: 0x2e8295, landmark: 0xe7e2cf, landmarkDim: 0x657167, light: 0xfff5dc },
        light: { background: 0xe4eadf, fog: 0xe4eadf, land: 0xcbd8c9, landEdge: 0x6e8c73, district: 0xb5c8b5, districtLine: 0x5e7862, building: 0x7f9884, buildingSelected: 0x536e59, roof: 0x9a6464, road: 0x647a67, river: 0x287489, landmark: 0x344a3a, landmarkDim: 0x879789, light: 0xffffff },
      },
    },
  },
  {
    ...KLAIPEDA_CITY,
    shortMark: "KL",
    alternateId: "vilnius",
    districts: colorDistricts(KLAIPEDA_DISTRICTS, KLAIPEDA_COLORS),
    trails: KLAIPEDA_TRAILS,
    scene: {
      center: [55.712, 21.122],
      scale: [260, 320],
      accent: "#ff675d",
      secondary: "#28d7c0",
      groundShapes: [
        [[-0.8, -8.8], [15.8, -8.8], [15.8, 8.8], [-0.2, 8.8], [-0.7, 4.3], [-0.4, 0.4], [-1.2, -3.2]],
        [[-10.2, -8.8], [-6.3, -8.8], [-5.0, -4.2], [-4.8, 0.2], [-5.6, 4.6], [-7.1, 8.8], [-10.5, 8.8]],
      ],
      waterRoutes: [
        { width: 4.5, height: 0.055, points: [[-4.8, -9.5], [-3.9, -5.8], [-3.3, -1.5], [-3.2, 2.3], [-4.3, 6.0], [-5.1, 9.5]] },
        { width: 0.72, height: 0.074, points: [[11.8, 1.45], [9.0, 1.15], [6.1, 1.25], [3.4, 1.1], [0.4, 1.3], [-2.0, 1.5]] },
      ],
      moverPaths: [
        { kind: "ferry", speed: 0.055, color: "#ffc83d", points: [[0.3, 1.0], [-1.2, 0.5], [-2.8, 0.1], [-4.9, -0.1], [-6.2, 0.5]] },
        { kind: "ship", speed: 0.018, color: "#ff675d", points: [[-4.4, -8.5], [-3.7, -4.1], [-3.3, 0], [-3.8, 4.4], [-4.9, 8.7]] },
        { kind: "boat", speed: 0.04, color: "#28d7c0", points: [[9.8, 1.2], [6.5, 1.2], [3.5, 1.15], [0.4, 1.3], [-2.2, 1.45]] },
      ],
      palette: {
        dark: { background: 0x06161d, fog: 0x06161d, land: 0x10272a, landEdge: 0x3a9194, district: 0x18393b, districtLine: 0x6dbdb8, building: 0x315b5c, buildingSelected: 0x56898a, roof: 0x203d48, road: 0x73aaa5, river: 0x0b7890, landmark: 0xe9f4ed, landmarkDim: 0x4f7475, light: 0xe4fff7 },
        light: { background: 0xdff0ef, fog: 0xdff0ef, land: 0xc1ddd7, landEdge: 0x3f8584, district: 0xa6cec7, districtLine: 0x376f70, building: 0x6ca6a1, buildingSelected: 0x347b7b, roof: 0x587588, road: 0x4d7f7c, river: 0x08758d, landmark: 0x244b4c, landmarkDim: 0x779b98, light: 0xffffff },
      },
    },
  },
];

export const getCity = (id) => CITIES.find((city) => city.id === id) || CITIES[0];

export const getAllLandmarks = (city) =>
  city.districts.flatMap((district) =>
    district.landmarks.map((landmark) => ({ ...landmark, districtId: district.id })),
  );

export const getDistrict = (city, id) => city.districts.find((district) => district.id === id);

export const getLandmark = (city, id) => getAllLandmarks(city).find((landmark) => landmark.id === id);

export const getDistrictForLandmark = (city, id) =>
  city.districts.find((district) => district.landmarks.some((landmark) => landmark.id === id));
