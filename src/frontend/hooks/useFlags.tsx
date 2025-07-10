import { useQuery } from "@tanstack/react-query";
const CODES_URL = ["au", "in", "us", "gb", "ca", "ke", "ng", "za", "zw"];
export const NAMES_URL = [
  "Australia",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Kenya",
  "Nigeria",
  "South Africa",
  "Zimbabwe",
];
const FLAGS_URL = "https://flagcdn.com/";

async function fetchCountryFlags(codes: string[]) {
  const flags = await Promise.all(
    codes.map((code) => fetch(`${FLAGS_URL}${code}.svg`))
  );
  // map over the flags and assign names to the flags
  const flagsWithNames = flags.map((flag, index) => ({
    flag: flag.url,
    name: NAMES_URL[index],
  }));
  return flagsWithNames;
}

export const useFlags = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["flags"],
    queryFn: () => {
      const countryFlags = fetchCountryFlags(CODES_URL);
      return countryFlags;
    },
  });
  return { data, isLoading, error };
};
