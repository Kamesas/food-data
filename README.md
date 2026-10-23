# food-data

A list of foods with their nutrients per 100 g. One JSON file per language.

Two languages are built: `dist/foods.en.json` and `dist/foods.uk.json`.

## Contents

13,152 foods in total:

| Type    | Count | What it is                       |
| ------- | ----: | -------------------------------- |
| `fndds` | 5,431 | cooked dishes (USDA FNDDS)       |
| `sr`    | 7,693 | plain foods (USDA SR Legacy)     |
| `own`   |    28 | our own foods (`own/foods.json`) |

## Files

| File                     | What it holds                                                  |
| ------------------------ | -------------------------------------------------------------- |
| `dist/foods.<lang>.json` | All foods with names in that language, and nutrients. Built.   |
| `names/uk.json`          | Translated Ukrainian names: `{ "<id>": "<name>" }`, all foods. |
| `names/uk.fixes.json`    | Hand-fixed Ukrainian names for common foods. Win over the above. |
| `own/foods.json`         | Our own foods. See "Own foods" below.                          |
| `scripts/`               | Build and copy scripts.                                        |

## Fields

Each food is one object. All values are per 100 g.

| Field       | Unit | Notes                                  | Foods with `null` |
| ----------- | ---- | -------------------------------------- | ----------------: |
| `id`        |      | USDA FDC id, same key as in `names/`   |                 0 |
| `type`      |      | `sr` or `fndds`                        |                 0 |
| `name`      |      | in the file's language                 |                 0 |
| `calories`  | kcal |                                        |                 0 |
| `protein`   | g    |                                        |                 0 |
| `fat`       | g    | total fat                              |                 0 |
| `carb`      | g    | carbohydrate, by difference            |                 0 |
| `fiber`     | g    |                                        |               562 |
| `iron`      | mg   |                                        |                80 |
| `magnesium` | mg   |                                        |               372 |
| `calcium`   | mg   |                                        |                85 |
| `vitaminD`  | µg   | D2 + D3                                |             2,608 |
| `omega3`    | mg   | EPA + DHA only                         |             1,976 |
| `pieceGrams` | g  | one piece: bar, candy, cookie, cone, egg. Only on foods that have it |  |

Values are rounded to 2 decimal places. Every `null` is in an `sr` food:
FNDDS has no missing values.

## Ukrainian names

- `names/uk.json` and `names/uk.fixes.json` are sorted by id, one food per line.
- Brand names stay in Latin letters (for example, `SILK`, `Archway`).
- Dairy names in the fixes show fat as a percent, taken from `fat`:
  "Сметана, 18% жиру".
- Different foods can share a Ukrainian name when the English names differ only in
  details that do not matter in Ukrainian. An app that hides repeated names shows
  only one of them, so a hand fix must not reuse an existing name.

## Own foods

Foods USDA does not have, mostly Ukrainian dairy with a common fat percent
("Кефір, 2,5% жиру"). Each one copies the nutrients of a similar USDA food (`base`)
and changes only the fat, and the calories with it (9 kcal per gram of fat). So the
other numbers are close, not exact.

Own ids start at 9,000,001, far above the USDA ids. Never reuse or change an id:
diaries store foods by id.

## Build

```
npm run build:foods          # raw/usda/*.json + names/*.json -> dist/foods.<lang>.json
npm run copy -- <app-dir>    # copy dist/foods.*.json into an app
```

Translated names live in `names/<lang>.json` (id → name). Hand fixes go in
`names/<lang>.fixes.json` and win over the translation. A food without a translated
name keeps its English one.

The USDA files are not in git. Download them into `raw/usda/` first (links below).

## Source

The numbers come from [USDA FoodData Central](https://fdc.nal.usda.gov/).
Two of its datasets are used:

- SR Legacy (April 2018): plain foods.
  [JSON zip](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip)
- FNDDS (October 2024): cooked dishes.
  [JSON zip](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_survey_food_json_2024-10-31.zip)

When a food has the same name in both sets, only the FNDDS one is kept.
A value USDA does not give is `null`, not 0.

USDA FoodData Central is in the public domain
([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)).

## License

Not chosen yet.
