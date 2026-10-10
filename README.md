# food-data

A list of foods with their nutrients per 100 g. One JSON file per language.

Work in progress. Only English is built so far: `dist/foods.en.json`.
Ukrainian names are ready in `names/uk.json`, but no `dist/foods.uk.json` is built from them yet.

## Contents

13,124 foods in total:

| Type    | Count | What it is                       |
| ------- | ----: | -------------------------------- |
| `fndds` | 5,431 | cooked dishes (USDA FNDDS)       |
| `sr`    | 7,693 | plain foods (USDA SR Legacy)     |

## Files

| File                   | What it holds                                              |
| ---------------------- | ---------------------------------------------------------- |
| `dist/foods.en.json`   | All foods with English names and nutrients. Built file.    |
| `names/uk.json`        | Ukrainian names: `{ "<id>": "<name>" }`, 13,124 of 13,124. |
| `scripts/`             | Build and copy scripts.                                    |

## Fields

Each food in `dist/foods.en.json` is one object. All values are per 100 g.

| Field       | Unit | Notes                                  | Foods with `null` |
| ----------- | ---- | -------------------------------------- | ----------------: |
| `id`        |      | USDA FDC id, same key as in `names/`   |                 0 |
| `type`      |      | `sr` or `fndds`                        |                 0 |
| `name`      |      | English name from USDA                 |                 0 |
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

Values are rounded to 2 decimal places. Every `null` is in an `sr` food:
FNDDS has no missing values.

## Ukrainian names

- `names/uk.json` is sorted by id, one food per line.
- Brand names stay in Latin letters (for example, `SILK`, `Archway`).
- Different foods can have the same Ukrainian name when the English
  names differ only in details that do not matter in Ukrainian.

## Build

```
npm run build:foods          # raw/usda/*.json -> dist/foods.en.json
npm run copy -- <app-dir>    # copy dist/foods.*.json into an app
```

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
