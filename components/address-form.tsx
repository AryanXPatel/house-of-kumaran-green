"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, Loader2, MapPin, AlertCircle } from "lucide-react";
import {
  INDIA_STATES,
  getProvinceCode,
  validateIndianPhone,
  validatePincode,
} from "@/lib/india-states";

export interface AddressFormData {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string; // State code for Shopify (e.g., "TN", "MH")
  country: string;
  zip: string;
  phone: string;
}

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  address1?: string;
  city?: string;
  province?: string;
  zip?: string;
  phone?: string;
}

// Geoapify suggestion type
interface GeoapifySuggestion {
  place_id: string;
  formatted: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  housenumber?: string;
  street?: string;
  suburb?: string;
  district?: string;
}

// Geoapify API key from environment
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Address",
}: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    address1: initialData?.address1 || "",
    address2: initialData?.address2 || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    country: initialData?.country || "India",
    zip: initialData?.zip || "",
    phone: initialData?.phone || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch address suggestions from Geoapify
  const fetchSuggestions = useCallback(async (input: string) => {
    if (!GEOAPIFY_API_KEY || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingPlaces(true);

    try {
      // Use Geoapify Autocomplete API
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          input
        )}&filter=countrycode:in&format=json&apiKey=${GEOAPIFY_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Geoapify API error");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSuggestions(
          data.results.map((result: Record<string, unknown>) => ({
            place_id: result.place_id as string,
            formatted: result.formatted as string,
            address_line1: result.address_line1 as string | undefined,
            address_line2: result.address_line2 as string | undefined,
            city: result.city as string | undefined,
            state: result.state as string | undefined,
            state_code: result.state_code as string | undefined,
            postcode: result.postcode as string | undefined,
            country: result.country as string | undefined,
            country_code: result.country_code as string | undefined,
            housenumber: result.housenumber as string | undefined,
            street: result.street as string | undefined,
            suburb: result.suburb as string | undefined,
            district: result.district as string | undefined,
          }))
        );
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Geoapify autocomplete error:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingPlaces(false);
    }
  }, []);

  // Handle address input change with debounce
  const handleAddressChange = (value: string) => {
    setForm((prev) => ({ ...prev, address1: value }));
    setTouched((prev) => new Set(prev).add("address1"));

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce API calls
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle place selection from Geoapify suggestions
  const handlePlaceSelect = (suggestion: GeoapifySuggestion) => {
    setShowSuggestions(false);

    // Build address line 1
    const addressParts = [];
    if (suggestion.housenumber) addressParts.push(suggestion.housenumber);
    if (suggestion.street) addressParts.push(suggestion.street);

    const address1 =
      addressParts.length > 0
        ? addressParts.join(" ")
        : suggestion.address_line1 || suggestion.suburb || "";

    // Address line 2 (suburb/district if not in address1)
    const address2 =
      addressParts.length > 0
        ? suggestion.suburb || suggestion.district || ""
        : suggestion.address_line2 || "";

    // Get city (prefer city, then district)
    const city = suggestion.city || suggestion.district || "";

    // Get state code from Geoapify state or map from state name
    let stateCode = "";
    if (suggestion.state) {
      // Try to get the Shopify province code
      const provinceCode = getProvinceCode(suggestion.state);
      stateCode = provinceCode || "";
    }

    // Update form with extracted data
    setForm((prev) => ({
      ...prev,
      address1: address1 || prev.address1,
      address2: address2,
      city: city,
      province: stateCode,
      zip: suggestion.postcode || "",
    }));

    // Mark fields as touched
    setTouched(new Set(["address1", "address2", "city", "province", "zip"]));

    // Clear errors for auto-filled fields
    setErrors((prev) => ({
      ...prev,
      address1: undefined,
      city: undefined,
      province: undefined,
      zip: undefined,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!form.address1.trim()) {
      newErrors.address1 = "Address is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    // Validate province
    if (!form.province) {
      newErrors.province = "State is required";
    } else {
      const provinceCode = getProvinceCode(form.province);
      if (!provinceCode) {
        newErrors.province = "Please select a valid state";
      }
    }

    // Validate PIN code
    const pincodeValidation = validatePincode(form.zip);
    if (!pincodeValidation.isValid) {
      newErrors.zip = pincodeValidation.error || "Invalid PIN code";
    }

    // Validate phone
    const phoneValidation = validateIndianPhone(form.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched(
      new Set([
        "firstName",
        "lastName",
        "address1",
        "city",
        "province",
        "zip",
        "phone",
      ])
    );

    if (!validateForm()) {
      return;
    }

    // Format phone number before submitting
    const phoneValidation = validateIndianPhone(form.phone);

    // Get proper province code
    const provinceCode = getProvinceCode(form.province);

    await onSubmit({
      ...form,
      phone: phoneValidation.formatted || form.phone,
      province: provinceCode || form.province,
    });
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));

    // Validate specific field on blur
    if (field === "phone" && form.phone) {
      const validation = validateIndianPhone(form.phone);
      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          phone: validation.error || "Invalid phone",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
    }

    if (field === "zip" && form.zip) {
      const validation = validatePincode(form.zip);
      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          zip: validation.error || "Invalid PIN code",
        }));
      } else {
        setErrors((prev) => ({ ...prev, zip: undefined }));
      }
    }

    if (field === "province" && form.province) {
      const code = getProvinceCode(form.province);
      if (!code) {
        setErrors((prev) => ({
          ...prev,
          province: "Please select a valid state",
        }));
      } else {
        setErrors((prev) => ({ ...prev, province: undefined }));
      }
    }
  };

  const inputClasses = (field: keyof FormErrors) =>
    `w-full px-4 py-3 bg-[#0d1f14] border rounded-lg text-[#f5f0e1] transition-colors focus:outline-none ${
      touched.has(field) && errors[field]
        ? "border-red-500 focus:border-red-400"
        : "border-[#2a4a35] focus:border-[#b8860b]"
    }`;

  const isAutocompleteEnabled = !!GEOAPIFY_API_KEY;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="First Name *"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            onBlur={() => handleBlur("firstName")}
            className={inputClasses("firstName")}
          />
          {touched.has("firstName") && errors.firstName && (
            <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name *"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            onBlur={() => handleBlur("lastName")}
            className={inputClasses("lastName")}
          />
          {touched.has("lastName") && errors.lastName && (
            <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Address with Autocomplete */}
      <div className="relative">
        <div className="relative">
          <input
            ref={addressInputRef}
            type="text"
            placeholder={
              isAutocompleteEnabled
                ? "Start typing address... (autocomplete enabled)"
                : "Address Line 1 *"
            }
            value={form.address1}
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() =>
              form.address1.length >= 3 && setShowSuggestions(true)
            }
            onBlur={() => handleBlur("address1")}
            className={`${inputClasses("address1")} pr-10`}
          />
          {isLoadingPlaces && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8860b] animate-spin" />
          )}
          {!isLoadingPlaces && isAutocompleteEnabled && (
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8860b]/50" />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-[#0d1f14] border border-[#2a4a35] rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => handlePlaceSelect(suggestion)}
                className="w-full px-4 py-3 text-left text-[#f5f0e1] hover:bg-[#1a472a] transition-colors flex items-start gap-2 border-b border-[#2a4a35] last:border-0"
              >
                <MapPin className="w-4 h-4 text-[#b8860b] mt-0.5 shrink-0" />
                <span className="text-sm">{suggestion.formatted}</span>
              </button>
            ))}
          </div>
        )}

        {touched.has("address1") && errors.address1 && (
          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.address1}
          </p>
        )}

        {isAutocompleteEnabled && (
          <p className="mt-1 text-[#b8860b]/60 text-xs">
            💡 Type your area, society, or landmark name for auto-fill
          </p>
        )}
      </div>

      {/* Address Line 2 */}
      <input
        type="text"
        placeholder="Address Line 2 (Apartment, Suite, etc.)"
        value={form.address2}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, address2: e.target.value }))
        }
        className="w-full px-4 py-3 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
      />

      {/* City and State Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="City *"
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
            onBlur={() => handleBlur("city")}
            className={inputClasses("city")}
          />
          {touched.has("city") && errors.city && (
            <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.city}
            </p>
          )}
        </div>
        <div>
          <select
            value={form.province}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, province: e.target.value }))
            }
            onBlur={() => handleBlur("province")}
            className={`${inputClasses(
              "province"
            )} appearance-none cursor-pointer`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23b8860b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.25rem",
            }}
          >
            <option value="">Select State *</option>
            {INDIA_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          {touched.has("province") && errors.province && (
            <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.province}
            </p>
          )}
        </div>
      </div>

      {/* PIN Code and Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="PIN Code *"
            value={form.zip}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setForm((prev) => ({ ...prev, zip: value }));
            }}
            onBlur={() => handleBlur("zip")}
            className={inputClasses("zip")}
            inputMode="numeric"
            maxLength={6}
          />
          {touched.has("zip") && errors.zip && (
            <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.zip}
            </p>
          )}
        </div>
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f5f0e1]/50">
              +91
            </span>
            <input
              type="tel"
              placeholder="Phone Number *"
              value={form.phone.replace(/^\+91/, "")}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm((prev) => ({ ...prev, phone: value }));
              }}
              onBlur={() => handleBlur("phone")}
              className={`${inputClasses("phone")} pl-12`}
              inputMode="numeric"
              maxLength={10}
            />
          </div>
          {touched.has("phone") && errors.phone && (
            <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Country (read-only for now) */}
      <input
        type="text"
        value="India"
        disabled
        className="w-full px-4 py-3 bg-[#0d1f14]/50 border border-[#2a4a35] rounded-lg text-[#f5f0e1]/70 cursor-not-allowed"
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 border border-[#2a4a35] text-[#f5f0e1] rounded-full hover:border-[#b8860b] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
