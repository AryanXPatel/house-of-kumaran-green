/**
 * India States and Union Territories with Shopify Province Codes
 * Based on ISO 3166-2:IN standard used by Shopify
 */

export interface IndiaState {
  name: string;
  code: string; // ISO 3166-2:IN code (without 'IN-' prefix)
}

// All Indian States and Union Territories with their Shopify province codes
export const INDIA_STATES: IndiaState[] = [
  { name: "Andaman and Nicobar Islands", code: "AN" },
  { name: "Andhra Pradesh", code: "AP" },
  { name: "Arunachal Pradesh", code: "AR" },
  { name: "Assam", code: "AS" },
  { name: "Bihar", code: "BR" },
  { name: "Chandigarh", code: "CH" },
  { name: "Chhattisgarh", code: "CG" },
  { name: "Dadra and Nagar Haveli", code: "DN" },
  { name: "Daman and Diu", code: "DD" },
  { name: "Delhi", code: "DL" },
  { name: "Goa", code: "GA" },
  { name: "Gujarat", code: "GJ" },
  { name: "Haryana", code: "HR" },
  { name: "Himachal Pradesh", code: "HP" },
  { name: "Jammu and Kashmir", code: "JK" },
  { name: "Jharkhand", code: "JH" },
  { name: "Karnataka", code: "KA" },
  { name: "Kerala", code: "KL" },
  { name: "Ladakh", code: "LA" },
  { name: "Lakshadweep", code: "LD" },
  { name: "Madhya Pradesh", code: "MP" },
  { name: "Maharashtra", code: "MH" },
  { name: "Manipur", code: "MN" },
  { name: "Meghalaya", code: "ML" },
  { name: "Mizoram", code: "MZ" },
  { name: "Nagaland", code: "NL" },
  { name: "Odisha", code: "OR" },
  { name: "Puducherry", code: "PY" },
  { name: "Punjab", code: "PB" },
  { name: "Rajasthan", code: "RJ" },
  { name: "Sikkim", code: "SK" },
  { name: "Tamil Nadu", code: "TN" },
  { name: "Telangana", code: "TS" },
  { name: "Tripura", code: "TR" },
  { name: "Uttar Pradesh", code: "UP" },
  { name: "Uttarakhand", code: "UK" },
  { name: "West Bengal", code: "WB" },
];

// Map for quick lookup by state name (case insensitive)
const stateNameToCodeMap = new Map<string, string>(
  INDIA_STATES.map((s) => [s.name.toLowerCase(), s.code])
);

// Map for quick lookup by code
const codeToStateNameMap = new Map<string, string>(
  INDIA_STATES.map((s) => [s.code, s.name])
);

// Common aliases for states
const STATE_ALIASES: Record<string, string> = {
  // Common abbreviations
  ap: "AP",
  ts: "TS",
  tn: "TN",
  ka: "KA",
  kl: "KL",
  mh: "MH",
  gj: "GJ",
  rj: "RJ",
  up: "UP",
  mp: "MP",
  wb: "WB",
  dl: "DL",
  hr: "HR",
  pb: "PB",
  // Common alternate names
  bangalore: "KA",
  bengaluru: "KA",
  mumbai: "MH",
  bombay: "MH",
  chennai: "TN",
  madras: "TN",
  kolkata: "WB",
  calcutta: "WB",
  hyderabad: "TS",
  "new delhi": "DL",
  ncr: "DL",
  noida: "UP",
  gurgaon: "HR",
  gurugram: "HR",
  pune: "MH",
  ahmedabad: "GJ",
  jaipur: "RJ",
  lucknow: "UP",
  kochi: "KL",
  cochin: "KL",
  coimbatore: "TN",
  orissa: "OR", // Old name
  pondicherry: "PY", // Old name
  uttaranchal: "UK", // Old name
};

/**
 * Get province code from state name or code
 * Handles various formats and aliases
 */
export function getProvinceCode(input: string): string | null {
  if (!input) return null;

  const normalized = input.trim().toLowerCase();

  // Check if it's already a valid code
  if (codeToStateNameMap.has(input.toUpperCase())) {
    return input.toUpperCase();
  }

  // Check aliases first (for city names and abbreviations)
  if (STATE_ALIASES[normalized]) {
    return STATE_ALIASES[normalized];
  }

  // Check exact state name match
  if (stateNameToCodeMap.has(normalized)) {
    return stateNameToCodeMap.get(normalized)!;
  }

  // Partial match (for autocomplete results that might include extra text)
  for (const [name, code] of stateNameToCodeMap.entries()) {
    if (normalized.includes(name) || name.includes(normalized)) {
      return code;
    }
  }

  return null;
}

/**
 * Get state name from province code
 */
export function getStateName(code: string): string | null {
  return codeToStateNameMap.get(code.toUpperCase()) || null;
}

/**
 * Validate if a province code is valid for India
 */
export function isValidProvinceCode(code: string): boolean {
  return codeToStateNameMap.has(code.toUpperCase());
}

/**
 * Validate Indian phone number
 * Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX
 */
export function validateIndianPhone(phone: string): {
  isValid: boolean;
  formatted: string | null;
  error: string | null;
} {
  if (!phone) {
    return {
      isValid: false,
      formatted: null,
      error: "Phone number is required",
    };
  }

  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Handle various formats
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("91") && cleaned.length > 10) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // Must be exactly 10 digits now
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      formatted: null,
      error: "Phone number must be 10 digits",
    };
  }

  // Indian mobile numbers start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(cleaned)) {
    return {
      isValid: false,
      formatted: null,
      error: "Invalid Indian mobile number",
    };
  }

  // All digits check
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      formatted: null,
      error: "Phone number must contain only digits",
    };
  }

  // Format as +91 XXXXX XXXXX
  const formatted = `+91${cleaned}`;

  return { isValid: true, formatted, error: null };
}

/**
 * Validate Indian PIN code (6 digits)
 */
export function validatePincode(pincode: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!pincode) {
    return { isValid: false, error: "PIN code is required" };
  }

  const cleaned = pincode.replace(/\s/g, "");

  if (!/^\d{6}$/.test(cleaned)) {
    return { isValid: false, error: "PIN code must be 6 digits" };
  }

  // First digit cannot be 0
  if (cleaned.startsWith("0")) {
    return { isValid: false, error: "Invalid PIN code" };
  }

  return { isValid: true, error: null };
}

/**
 * Extract address components from Google Places result
 */
export function extractAddressComponents(
  addressComponents: google.maps.GeocoderAddressComponent[]
): {
  address1: string;
  address2: string;
  city: string;
  state: string;
  stateCode: string | null;
  pincode: string;
  country: string;
} {
  let streetNumber = "";
  let route = "";
  let sublocality = "";
  let locality = "";
  let city = "";
  let state = "";
  let pincode = "";
  let country = "";

  for (const component of addressComponents) {
    const types = component.types;

    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    }
    if (types.includes("route")) {
      route = component.long_name;
    }
    if (
      types.includes("sublocality_level_1") ||
      types.includes("sublocality")
    ) {
      sublocality = component.long_name;
    }
    if (types.includes("locality")) {
      locality = component.long_name;
    }
    if (types.includes("administrative_area_level_2")) {
      // District - can be used as city if locality is not available
      if (!city) city = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      state = component.long_name;
    }
    if (types.includes("postal_code")) {
      pincode = component.long_name;
    }
    if (types.includes("country")) {
      country = component.long_name;
    }
  }

  // Build address lines
  const address1Parts = [streetNumber, route].filter(Boolean);
  const address1 =
    address1Parts.length > 0 ? address1Parts.join(" ") : sublocality;
  const address2 = address1Parts.length > 0 ? sublocality : "";

  // City preference: locality > district
  const finalCity = locality || city;

  // Get state code for Shopify
  const stateCode = getProvinceCode(state);

  return {
    address1,
    address2,
    city: finalCity,
    state,
    stateCode,
    pincode,
    country,
  };
}
