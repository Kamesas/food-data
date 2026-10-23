// Builds dist/foods.en.json from the two USDA FoodData Central files, and one
// dist/foods.<lang>.json for each names/<lang>.json.
// Usage: node scripts/build-foods.mjs <sr-legacy.json> <fndds.json> <names-dir> <out-dir>
import fs from "node:fs";
import path from "node:path";

const [srPath, fnddsPath, namesDir, outDir] = process.argv.slice(2);

if (!srPath || !fnddsPath || !namesDir || !outDir) {
  console.error(
    "Usage: node scripts/build-foods.mjs <sr-legacy.json> <fndds.json> <names-dir> <out-dir>",
  );
  process.exit(1);
}

// USDA nutrient ids for each value, per 100 g. Omega-3 is EPA + DHA only.
const NUTRIENT_IDS = {
  calories: 1008,
  protein: 1003,
  fat: 1004,
  carb: 1005,
  fiber: 1079,
  iron: 1089,
  magnesium: 1090,
  calcium: 1087,
  vitaminD: 1114,
};
const EPA_ID = 1278;
const DHA_ID = 1272;
const GRAMS_TO_MILLIGRAMS = 1000;

const KEYS = [...Object.keys(NUTRIENT_IDS), "omega3"];

const readFoods = (filePath, listKey) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"))[listKey];

const roundValue = (value) => Math.round(value * 100) / 100;

// A missing value is null, never 0. A 0 from USDA means a real 0.
const toAmounts = (food) =>
  new Map(
    food.foodNutrients
      .filter((item) => typeof item.amount === "number")
      .map((item) => [item.nutrient.id, item.amount]),
  );

const toOmega3 = (amounts) => {
  const epa = amounts.get(EPA_ID);
  const dha = amounts.get(DHA_ID);

  if (epa === undefined && dha === undefined) return null;

  return roundValue(((epa ?? 0) + (dha ?? 0)) * GRAMS_TO_MILLIGRAMS);
};

const toRow = (food, type) => {
  const amounts = toAmounts(food);
  const row = { id: food.fdcId, type, name: food.description.trim() };

  for (const [key, id] of Object.entries(NUTRIENT_IDS)) {
    const amount = amounts.get(id);
    row[key] = amount === undefined ? null : roundValue(amount);
  }
  row.omega3 = toOmega3(amounts);

  return row;
};

const hasNutrients = (food) => food.foodNutrients?.length > 0;

const fnddsFoods = readFoods(fnddsPath, "SurveyFoods").filter(hasNutrients);
const srFoods = readFoods(srPath, "SRLegacyFoods").filter(hasNutrients);

// The same name in both sets is one food. FNDDS has no missing values, so its copy stays.
const fnddsNames = new Set(fnddsFoods.map((food) => food.description.toLowerCase()));
const srUnique = srFoods.filter((food) => !fnddsNames.has(food.description.toLowerCase()));

const usdaRows = [
  ...srUnique.map((food) => toRow(food, "sr")),
  ...fnddsFoods.map((food) => toRow(food, "fndds")),
];

const OWN_FOODS_PATH = path.join(import.meta.dirname, "..", "own", "foods.json");
const KCAL_PER_GRAM_OF_FAT = 9;

const ownFoods = JSON.parse(fs.readFileSync(OWN_FOODS_PATH, "utf8"));
const usdaRowsById = new Map(usdaRows.map((row) => [row.id, row]));

const toOwnRow = (own) => {
  const base = usdaRowsById.get(own.base);

  return {
    ...base,
    id: own.id,
    type: "own",
    name: own.en,
    fat: own.fat,
    calories: Math.round(base.calories + (own.fat - base.fat) * KCAL_PER_GRAM_OF_FAT),
  };
};

const rows = [...usdaRows, ...ownFoods.map(toOwnRow)].sort((a, b) => a.id - b.id);

// One food per line keeps the file small and its git diffs readable.
const writeFoods = (lang, foodRows) => {
  const outPath = path.join(outDir, `foods.${lang}.json`);
  const json = `[\n${foodRows.map((row) => JSON.stringify(row)).join(",\n")}\n]\n`;

  fs.writeFileSync(outPath, json);

  return outPath;
};

const readNames = (filePath) =>
  fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : {};

fs.mkdirSync(outDir, { recursive: true });

console.log(`Wrote ${writeFoods("en", rows)}: ${rows.length} foods`);
console.log(`  sr: ${srUnique.length} (${srFoods.length - srUnique.length} duplicates of FNDDS skipped)`);
console.log(`  fndds: ${fnddsFoods.length}`);
console.log(`  own: ${ownFoods.length}`);
console.log("Foods with null:");
for (const key of KEYS) {
  const nullCount = rows.filter((row) => row[key] === null).length;
  console.log(`  ${key.padEnd(10)} ${nullCount}`);
}

// names/<lang>.json holds the translated names. names/<lang>.fixes.json holds hand
// fixes, applied last, so a new translation run cannot undo them. A food without
// a translated name keeps its English one.
const langs = fs.existsSync(namesDir)
  ? fs
      .readdirSync(namesDir)
      .map((name) => name.match(/^([a-z]+)\.json$/)?.[1])
      .filter(Boolean)
  : [];

for (const lang of langs) {
  const names = readNames(path.join(namesDir, `${lang}.json`));
  const fixes = readNames(path.join(namesDir, `${lang}.fixes.json`));
  const ownNames = new Map(ownFoods.map((own) => [own.id, own[lang]]));
  const toName = (row) =>
    fixes[row.id] ?? names[row.id] ?? ownNames.get(row.id) ?? row.name;

  const translatedCount = rows.filter(
    (row) => fixes[row.id] ?? names[row.id] ?? ownNames.get(row.id),
  ).length;
  const outPath = writeFoods(lang, rows.map((row) => ({ ...row, name: toName(row) })));

  console.log(`Wrote ${outPath}: ${translatedCount} of ${rows.length} names translated`);
}
