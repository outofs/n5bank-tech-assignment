export const COUNTRY_OPTIONS = [
  "Estonia",
  "Germany",
  "Lithuania",
  "Poland",
  "Singapore",
  "Spain",
  "UAE",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Finland",
  "France",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
] as const;

export type CountryName = (typeof COUNTRY_OPTIONS)[number];

export type CountryOption = {
  value: CountryName;
  label: CountryName;
};

export const COUNTRY_SELECT_OPTIONS: CountryOption[] = COUNTRY_OPTIONS.map(
  (country) => ({
    value: country,
    label: country,
  }),
);

export function createCountryOption(country: CountryName): CountryOption {
  return { value: country, label: country };
}
