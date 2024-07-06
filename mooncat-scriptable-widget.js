// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;

// ======================================== C O N S T A N T S

// ==================== E N D   P O I N T S

const MORALIS_BASE_URL = "https://deep-index.moralis.io/api/v2";
const MC_BASE_URL = "https://api.mooncat.community";
const OS_BASE_URL = "https://opensea.io/assets/ethereum";
const CONTRACT = {
  ACCLIMATION: "0xc3f733ca98e0dad0386979eb96fb1722a1a05e69",
};

// ==================== C A T S

// Max Rescue IDs
const RESCUE = {
  MAX: 25439,
  DAY_ONE: 491,
  WEEK_ONE: 1568,
};

const AMOUNT = {
  RESCUED: 25344,
  LUNAR: Math.pow(16, 8) - 25344,
  GENESIS: 96,
  HERO: 160,
  COLORED: Math.pow(16, 8),
  COLORLESS: 256,
  DOMESTIC: 25440,
  WILD: Math.pow(16, 8) - 25344 + 160,
};

// ======================================== M A I N

await main();

async function main() {
  const userConfig = getUserConfig();

  // Determine cat
  const cat = await getRandomCatFromUserConfig({
    filter: userConfig.filter,
    cats: userConfig.cats,
    wallets: userConfig.wallets,
    apiKey: userConfig.moralisApiKey,
  });

  const widgetData = {};

  // Image
  widgetData.image = await fetchCatImage(cat);

  // Traits
  const traits = await fetchCatTraits(cat);

  // Title
  widgetData.title = getTitleFromTraits(traits);

  widgetData.description = getDescriptionFromTraits(traits);

  // Colors
  widgetData.shadowColor = getGlowColorFromTraits(traits);
  widgetData.backgroundColor =
    userConfig.backgroundColor === undefined
      ? invertColor(widgetData.shadowColor)
      : getBackgroundColor(userConfig.backgroundColor);
  widgetData.textColor = calculateContrastColor(widgetData.backgroundColor);

  //Background Image
  if (userConfig.backgroundImage) {
    widgetData.backgroundImage = await fetchBackgroundImage(
      userConfig.backgroundImage
    );
  }

  if (traits.details.isAcclimated) {
    widgetData.link = `${OS_BASE_URL}/${CONTRACT.ACCLIMATION}/${traits.details.rescueIndex}`;
  } else {
    widgetData.link = `${MC_BASE_URL}/image/${traits.details.catId}`;
  }

  mountWidget(widgetData);
}

// ======================================== U S E R   I N P U T

function getUserConfig() {
  if (args.widgetParameter === null) return {};
  return JSON.parse(args.widgetParameter);
}

// ======================================== C A T   S E L E C T O R

/**
 *
 * @param {"wallets" | "cats" | "rescued" | "lunar" | "genesis" | "hero" | "colored" | "colorless" | "domesticated" | "wild"} filter
 * @param {string | Array<string>} wallets
 * @param {(string | number) | Array<(string | number)> } cats
 * @returns string - catId or rescueIndex
 */
async function getRandomCatFromUserConfig({ filter, cats, wallets, apiKey }) {
  if (filter === undefined) return getRandomDomesticatedCat();
  const FILTER = {
    WALLETS: "wallets",
    CATS: "cats",
    RESCUED: "rescued",
    LUNAR: "lunar",
    GENESIS: "genesis",
    HERO: "hero",
    COLORED: "colored",
    COLORLESS: "colorless",
    DOMESTICATED: "domesticated",
    WILD: "wild",
    ALL: "all",
  };

  switch (filter) {
    case FILTER.WALLETS:
      return await fetchRandomCatFromWallets(wallets, apiKey);
    case FILTER.CATS:
      return getRandomCatFromList(cats);
    case FILTER.RESCUED:
      return getRandomRescuedCat();
    case FILTER.LUNAR:
      return await fetchRandomLunarCat();
    case FILTER.GENESIS:
      return getRandomGenesisCat();
    case FILTER.HERO:
      return getRandomHeroCat();
    case FILTER.COLORED:
      return getRandomColoredCat();
    case FILTER.COLORLESS:
      return getRandomColorlessCat;
    case FILTER.DOMESTICATED:
      return getRandomDomesticatedCat();
    case FILTER.WILD:
      return await fetchRandomWildCat();
    case FILTER.ALL:
      return getRandomCat();
    default:
      throw new Error("Invalid filter: " + filter);
  }
}

// ==================== S P E C I F I C   C A T S

function getRandomCatFromList(cats) {
  if (cats === undefined) throw new Error("Missing config parameter: cats.");
  const catList = Array.isArray(cats) ? cats : [cats];
  catList.forEach((cat) => {
    if (!isValidCat(cat)) throw new Error(`Invalid cat identifier: ${cat}`);
  });
  return getRandomElementFromArray(catList);
}

// ==================== W A L L E T S   A P I

async function fetchRandomCatFromWallets(walletIds, apiKey) {
  if (walletIds === undefined)
    throw new Error("Missing config parameter: wallets");
  if (apiKey === undefined)
    throw new Error("Missing config parameter: moralisApiKey");
  const wallets = Array.isArray(walletIds) ? walletIds : [walletIds];
  wallets.forEach(validateWalletId);

  const cats = await fetchCombinedCatsFromWallets(wallets, apiKey);
  if (cats.length < 0)
    throw new Error(
      "No cats could be found in the wallets, either due to an invalid moralisApiKey, network problems or because they do not have acclimated cats."
    );
  return getRandomElementFromArray(cats);
}

async function fetchCatsFromWallet(walletId, apiKey) {
  let cursor = null;
  let res = [];
  do {
    const req = new Request(
      `${MORALIS_BASE_URL}/${walletId}/nft/${
        CONTRACT.ACCLIMATION
      }?chain=eth&format=decimal${cursor != null ? `&cursor=${cursor}` : ""}`
    );
    req.headers = {
      "X-API-Key": apiKey,
    };
    let json = await req.loadJSON();
    if (json === undefined) return [];
    let ids = json.result.map((obj) => obj.token_id);
    res.push(...ids);
    cursor = json.cursor;
  } while (cursor != "" && cursor != null);

  return res;
}

async function fetchCombinedCatsFromWallets(walletIds, apiKey) {
  const result = [];
  for (const walletId of walletIds) {
    try {
      const cats = await fetchCatsFromWallet(walletId, apiKey);
      result.push(...cats);
    } catch (error) {}
  }
  return result;
}

function validateWalletId(walletId) {
  const walletIdPattern = /^0x[a-fA-F0-9]{40}$/;
  if (!walletIdPattern.test(walletId)) {
    throw new Error(`Invalid walletId: ${walletId}`);
  }
}

// ==================== C A T   T Y P E S

function getRandomRescuedCat() {
  while (true) {
    const rescueIndex = getRandomDomesticatedCat();
    if (!isGenesisRescueIndex(rescueIndex)) return rescueIndex;
  }
}

async function fetchRandomLunarCat() {
  while (true) {
    const catId = getRandomColoredCat();
    const traits = await fetchCatTraits(catId);
    if (traits.details.classification === "lunar") return catId;
  }
}

function getRandomGenesisCat() {
  return (
    "0xff" +
    Math.floor(Math.random() * 6).toString(16) +
    Math.floor(Math.random() * 16).toString(16) +
    "000ca7"
  );
}

function getRandomHeroCat() {
  return (
    "0xff" +
    (6 + Math.floor(Math.random() * 10)).toString(16) +
    Math.floor(Math.random() * 16).toString(16) +
    "000ca7"
  );
}

function getRandomColoredCat() {
  return (
    "0x00" +
    [...Array(8)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
}

function getRandomColorlessCat() {
  return (
    "0xff" +
    [...Array(2)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("") +
    "000ca7"
  );
}

function getRandomDomesticatedCat() {
  return Math.floor(Math.random() * RESCUE.MAX);
}

async function fetchRandomWildCat() {
  if (Math.random() * AMOUNT.WILD < AMOUNT.HERO) return generateHeroCatId();
  return await fetchRandomLunarCat();
}

function getRandomCat() {
  if (Math.random() * AMOUNT.ALL < AMOUNT.COLORLESS)
    return getRandomColorlessCat();
  return getRandomColoredCat();
}

// ==================== C A T   U T I L S

function isValidCat(cat) {
  if (typeof cat === "number") return isRescueIndex(cat);
  if (typeof cat === "string") {
    return isCatId(cat) || (/^\d+$/.test(cat) && isRescueIndex(parseInt(cat)));
  }
  return false;
}

function isCatId(id) {
  return isColoredCatId(id) || isColorlessCatId(id);
}

function isColoredCatId(id) {
  return /^0x00[a-f0-9]{8}$/i.test(id);
}

function isColorlessCatId(id) {
  return /^0xff[a-f0-9]{2}000ca7$/i.test(id);
}

function isRescueIndex(index) {
  return Number.isInteger(index) && index >= 0 && index <= RESCUE.MAX;
}

function isGenesisRescueIndex(index) {
  return [
    [84, 99],
    [524, 539],
    [1102, 1117],
    [1749, 1746],
    [2364, 2379],
    [2876, 2891],
  ].some((range) => isInRange(index, range[0], range[1]));
}

// ======================================== M O O N C A T S   A P I

/**
 * @param {string | number} cat - rescueIndex or catId
 * @returns image
 */
async function fetchCatImage(cat) {
  const res = new Request(`${MC_BASE_URL}/image/${cat}`);
  return await res.loadImage();
}

/**
 * @param {string | number} cat - rescueIndex or catId
 * @returns traits object
 */
async function fetchCatTraits(cat) {
  const res = new Request(`${MC_BASE_URL}/traits/${cat}`);
  return await res.loadJSON();
}

// ======================================== T E X T

// ==================== T I T L E

function getTitleFromTraits(traits) {
  if (traits.details.classification === "lunar") return traits.details.catId;
  let res = [];
  traits.details.name === null || res.push(traits.details.name);
  res.push("#" + traits.details.rescueIndex);
  config.widgetFamily === "small" || res.push(traits.details.catId);
  return res.join(" - ");
}

function getDescriptionFromTraits(traits) {
  // Cat descriptions for large widget
  const LUNAR_DESCRIPTION_SUFFIX = [
    ".",
    " and still purrs through outer space.",
    " and still roams through outer space in search of love.",
    " and is lost furever between the dimensions.",
    " and meows with the stars for eternity.",
    ". It will never be cudled.",
    " and enjoys its boundless freedom for eternity.",
    ". It is purrfectly satisfied with its freedom.",
    ". Fur real!",
    ". Meow!",
    ". How could you leave this poor creature behind?",
    ". Furtunately it can take care of itself purrfectly.",
    ". Just like 4294941952 other cats, who now all together celebrate a huge party behind the moon.",
    ", although it would have cost only $0.50 gas.",
    ". You missed the chance to have a friend for eternity.",
    " by you or anyone else.",
    ". We have no choice but to admire it from afar.",
    ". It doesn’t care. The world is coming to an end anyway.",
    ". Unlike others of its kind, it refused to be domesticated.",
    ". A wild Lunar Cat appeared.",
    ", but that’s ok.",
    ", but that’s fine.",
    ". It’s a stray.",
    " and still wonders why.",
    ". That’s life.",
    ", but it lived happily ever after.",
    ". A party! Let’s have a party.",
    ". Pardonnez-moi, monsieur.",
    ". Valerie.",
    ". Goodnight, my kitten.",
    ". It was one coffee away.",
    ". Oh wow. Oh wow. Oh wow.",
    ". Adieu, mon ami. Va à la gloire.",
    " and still hunts moon mice in Clavius and Moretus.",
    ". Cats choose us, we don’t own them.",
    ", but time spent with a cat is never wasted.",
    ", but for some it’s still masterpiece.",
    ". Every day is moonday.",
    ". The cat has four paws and lives on the moon.",
    ", but it has four paws and not just one.",
    ", but from a distance, many problems look trivial.",
    ". See you on the moon, little kitten.",
    ", but the gravitation on the moon is much more fun anyway.",
    ". Some simply feel most comfortable at home.",
    ". Disco, disco!",
    ", but goes to Bingo on Mars every other Saturday.",
    ", and goes weak on cotton candy.",
    ", but is pen pals with mister moo.",
    ". It loves poetry and is a great admirer of Eliot.",
  ];

  const details = traits.details;
  const catId = details.catId;
  const classification = details.classification;

  if (config.widgetFamily === "small") {
    if (classification === "lunar") return "This MoonCat was never rescued.";
    return catId;
  }

  // General trait data
  const isGenesis = details.genesis;
  const isLunar = classification === "lunar";
  const isNamed = details.isNamed && details.isNamed !== "No";
  const name = isNamed ? details.name : "";
  const isPale = details.isPale;
  const color = details.hue === "skyBlue" ? "sky blue" : details.hue;
  const hue = details.hueValue;
  const expression = details.expression;
  const pattern = details.pattern;
  const character = getCharacter({
    pattern,
    isPale,
    hue,
    expression,
    color,
    catId,
  });
  const isCharacter = character !== "";
  const isGarf = character.endsWith("Garfield");

  // General description start
  let res = `This ${expression}, ${pattern} ${isPale ? "pale " : ""}${color} `;

  // Lunar
  if (isLunar) {
    // Rare Yoda Talk
    if (Math.random() < 0.01) {
      res = `Never rescued, this ${expression}, ${pattern} ${
        isPale ? "pale " : ""
      }${color} ${isCharacter ? character : "MoonCat"} was.`;
      if (Math.random() < 0.1) {
        res += ` Truly wonderful the mind of a ${
          isCharacter ? "MoonCat" : "cat"
        } is.`;
      } else if (Math.random() < 0.1) {
        res += " Master Yoda knows these things. His job it is.";
      } else if (Math.random() < 0.1) {
        res += " Its path it must decide.";
      }
      return res;
    }

    res += ` ${
      isCharacter ? character : "MoonCat"
    } was never rescued${getRandomElementFromArray(LUNAR_DESCRIPTION_SUFFIX)}${
      isGarf && Math.random() < 0.5 ? " Lasagna?" : ""
    }`;
    return res;
  }

  // Minted specific trait data
  let rescueIndex = details.rescueIndex;
  let isAcclimated = details.isAcclimated;
  let year = details.rescueYear;
  let isDayOne = details.rescueIndex < RESCUE.DAY_ONE;
  let isWeekOne = details.rescueIndex < RESCUE.WEEK_ONE;
  let onlyChild = details.onlyChild;
  let siblings = details.litterSize - 1;
  let hasTwins = details.hasTwins;
  let twins = details.twinSetSize - 1;
  let hasMirrors = details.mirrors;
  let hasClones = details.hasClones;
  let mirrors = details.mirrorSetSize - 1;
  let clones = details.cloneSetSize - 1;

  // Genesis
  if (isGenesis) {
    res += `${
      isNamed
        ? "Genesis MoonCat is called " + details.name
        : "is a Genesis MoonCat"
    }`;
    if (isDayOne || isWeekOne) {
      res += `${isNamed ? " and was" : ","} rescued ${
        isDayOne ? "on Day" : "in Week"
      } 1. `;
    } else {
      res += ". All Genesis cats were rescued in 2017. ";
    }
  } else {
    res += `MoonCat${isNamed ? "," : " was"} rescued `;
    if (isDayOne) res += "on Day 1";
    else if (isWeekOne) res += "in Week 1";
    else res += "in " + year;
    res += `${isNamed ? ", is called " + details.name : ""}. `;
  }

  if (isCharacter) {
    if (isNamed && character.toUpperCase() === details.name.toUpperCase()) {
      res += details.name;
    } else {
      res += "The " + character;
    }
  } else if (isNamed) res += details.name;
  else if (isGenesis) res += "This beauty";
  else res += "The cat";
  if (onlyChild) {
    res += " is an only child.";
  } else {
    res += ` has ${numberToWordsPlural(siblings, "sibling")}`;
    if (!hasTwins) {
      res += ", but no twins.";
    } else {
      if (!hasMirrors && !hasClones) {
        res += ` and ${numberToWordsPlural(
          twins,
          "twin"
        )}, but neither mirrors nor clones.`;
      } else if (!hasMirrors && hasClones) {
        res += `, ${numberToWordsPlural(
          twins,
          "twin"
        )} and ${numberToWordsPlural(clones, "clone")}, but no mirrors.`;
      } else if (hasMirrors && !hasClones) {
        res += `, ${numberToWordsPlural(
          twins,
          "twin"
        )} and ${numberToWordsPlural(mirrors, "mirror")}, but no clones.`;
      } else {
        res += `, ${numberToWordsPlural(twins, "twin")}, ${numberToWordsPlural(
          mirrors,
          "mirror"
        )} and ${numberToWordsPlural(clones, "clone")}.`;
      }
    }
  }

  if (rescueIndex > RESCUE.MAX - 10)
    res += " Wow, this is a countdown cat. Very rare!";
  else if (rescueIndex === 0)
    res += " Wow, this was the first cat to be rescued. Inspiring!";
  else if (rescueIndex === 6)
    res += " This was the first MoonCat to be given a name. Very rare!";
  else if (rescueIndex === 392)
    res +=
      " In 1939 the writer T. S. Eliot published the poem ”The naming of cats“, which was later to inspire a world-famous musical.";
  if (isGarf && Math.random() < 0.5) res += " Lasagna?";
  if (Math.random() < 0.1) res += " Meow!";

  function numberToWordsPlural(num, singular) {
    let numbers = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "eleven",
      "twelve",
    ];
    let writtenNumber = num > 12 || num < 0 ? "" + num : numbers[num];
    return `${writtenNumber} ${singular}${num > 1 ? "s" : ""}`;
  }

  return res;
}

function getCharacter({ pattern, isPale, hue, expression, color, catId }) {
  if (pattern === "tabby") {
    if (isPale) {
      if (isInRange(hue, 285, 305) && expression === "smiling")
        return "perfect Cheshire Cat";
      if (isInRange(hue, 270, 320)) return "Cheshire Cat";
    } else {
      if (isInRange(hue, 26, 40)) return "perfect Garfield";
      if (isInRange(hue, 17, 49)) return "Garfield";
      if (color === "chartreuse") return "perfect Melon Cat";
      if (color === "green") return "Melon Cat";
      if (isInRange(hue, 40, 60)) return "Pikachu";
    }
  } else if (pattern === "pure") {
    if (isPale) {
      if (isInRange(hue, 335, 355)) return "perfect Pink Panther";
      if (hue >= 325 || hue <= 10) return "Pink Panther";
      if (isInRange(hue, 205, 225)) return "perfect Alien Cat";
      if (isInRange(hue, 195, 235)) return "Alien Cat";
      if (isInRange(hue, 130, 155)) return "perfect Zombie Cat";
      if (isInRange(hue, 115, 170)) return "Zombie Cat";
    } else {
      if (color === "red") return "Red Devil";
      if (isInRange(hue, 30, 60)) return "Simba";
    }
  } else if (pattern === "spotted") {
    if (isPale) {
      if (["orange", "yellow"].includes(color)) return "Glitter Pig";
    } else {
      if (isInRange(hue, 26, 40)) return "perfect Gutter Garf";
      if (isInRange(hue, 17, 49)) return "Gutter Garf";
    }
  }
  if (catId === "0x00e4057a85") return "Bisasam";
  return "";
}

// ======================================== C O L O R S

// ==================== G L O W   C O L O R

function getGlowColorFromTraits(traits) {
  return new Color(rgbToHex(...traits.details.glow));
}

// ==================== B A C K G R O U N D   C O L O R

function getBackgroundColor(backgroundColor) {
  const BACKGROUND_COLOR = {
    BLACK: "black",
    WHITE: "white",
    BLUE: "blue",
    BROWN: "brown",
    CYAN: "cyan",
    DARK_GRAY: "darkGray",
    GRAY: "gray",
    GREEN: "green",
    LIGHT_GRAY: "lightGray",
    MAGENTA: "magenta",
    ORANGE: "orange",
    PURPLE: "purple",
    RED: "red",
    YELLOW: "yellow",
  };

  if (isHexColor(backgroundColor)) return new Color(backgroundColor);

  switch (backgroundColor) {
    case BACKGROUND_COLOR.BLACK:
      return Color.black();
    case BACKGROUND_COLOR.WHITE:
      return Color.white();
    case BACKGROUND_COLOR.BLUE:
      return Color.blue();
    case BACKGROUND_COLOR.BROWN:
      return Color.brown();
    case BACKGROUND_COLOR.CYAN:
      return Color.cyan();
    case BACKGROUND_COLOR.DARK_GRAY:
      return Color.darkGray();
    case BACKGROUND_COLOR.GRAY:
      return Color.gray();
    case BACKGROUND_COLOR.GREEN:
      return Color.green();
    case BACKGROUND_COLOR.LIGHT_GRAY:
      return Color.lightGray();
    case BACKGROUND_COLOR.MAGENTA:
      return Color.magenta();
    case BACKGROUND_COLOR.ORANGE:
      return Color.orange();
    case BACKGROUND_COLOR.PURPLE:
      return Color.purple();
    case BACKGROUND_COLOR.RED:
      return Color.red();
    case BACKGROUND_COLOR.YELLOW:
      return Color.yellow();
    default:
      throw new Error("Invalid background: " + backgroundColor);
  }
}

// ==================== C O L O R   U T I L S

function isHexColor(str) {
  return /^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(str);
}

function calculateContrastColor(color) {
  const threshold = 0.7;
  const brightness =
    (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;
  return brightness < threshold ? Color.white() : Color.black();
}

// ======================================== B A C K G R O U N D   I M A G E

async function fetchBackgroundImage(url) {
  if (url === undefined) return;
  const req = new Request(url);
  return await req.loadImage();
}

// ======================================== W I D G E T

function mountWidget({
  image,
  backgroundColor,
  backgroundImage,
  shadowColor,
  textColor,
  title = "",
  description = "",
  link,
}) {
  function addText(wrapper, text, fontSize) {
    const result = wrapper.addText(text);
    textColor && (result.textColor = textColor);
    shadowColor && (result.shadowColor = shadowColor);
    result.shadowRadius = 3;
    result.font = Font.regularMonospacedSystemFont(fontSize);
    result.centerAlignText();
    return result;
  }

  const widget = new ListWidget();

  // Background
  if (backgroundColor !== undefined) {
    widget.backgroundColor = backgroundColor;
  }
  if (backgroundImage !== undefined) {
    widget.backgroundImage = backgroundImage;
  }

  // Title
  addText(widget, title, 14);

  // Image
  widget.addSpacer();
  const stack = widget.addStack();
  stack.addSpacer();
  stack.addImage(image);
  stack.addSpacer();
  widget.addSpacer();

  // Description
  addText(widget, description, 10);

  // Url on Click
  link && (widget.url = link);

  widget.setPadding(10, 10, 10, 10);
  if (config.widgetFamily === "small") {
    widget.setPadding(5, 5, 5, 5);
  }

  // Show widget
  if (config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
  } else widget.presentLarge();
}

// ======================================== U T I L S

// ==================== M A T H

function isInRange(value, min, max) {
  return value >= min && value <= max;
}

// ==================== A R R A Y

function getRandomElementFromArray(array) {
  if (array.length > 0) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// ==================== C O L O R

function rgbToHex(r, g, b) {
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function invertColor(color) {
  return new Color(
    "#" +
      color.hex
        .match(/[a-f0-9]{2}/gi)
        .map((e) =>
          ((255 - parseInt(e, 16)) | 0)
            .toString(16)
            .replace(/^([a-f0-9])$/, "0$1")
        )
        .join("")
  );
}
