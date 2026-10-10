# food-data

A list of foods with their nutrients per 100 g. One JSON file per language.

Work in progress. Only English is built so far: `dist/foods.en.json`.

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
