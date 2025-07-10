export const fetchCountryCode = (country: string): string => {
  switch (country) {
    case "Australia":
      return "+61";
    case "India":
      return "+91";
    case "United States":
      return "+1";
    case "United Kingdom":
      return "+44";
    case "Canada":
      return "+1";
    case "Kenya":
      return "+254";
    case "Nigeria":
      return "+234";
    case "South Africa":
      return "+27";
    case "Zimbabwe":
      return "+263";
    default:
      return "-";
  }
};
