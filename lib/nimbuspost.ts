// NimbusPost API Client
// Documentation: https://documenter.getpostman.com/view/9692837/TW6wHnoz

const NIMBUSPOST_API_URL = process.env.NIMBUSPOST_API_URL || "https://api.nimbuspost.com";
const NIMBUSPOST_EMAIL = process.env.NIMBUSPOST_EMAIL;
const NIMBUSPOST_PASSWORD = process.env.NIMBUSPOST_PASSWORD;

// Token cache to avoid re-authentication on every request
let cachedToken: { token: string; expiresAt: number } | null = null;

export interface NimbusPostTrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  message: string;
}

export interface NimbusPostTrackingResponse {
  status: boolean;
  message: string;
  data?: {
    awb_number: string;
    courier_id: number;
    courier_name: string;
    current_status: string;
    current_status_code: string;
    shipment_status: string;
    delivered_date?: string;
    origin: string;
    destination: string;
    tracking_history: NimbusPostTrackingEvent[];
  };
}

export interface TrackingResult {
  success: boolean;
  awbNumber?: string;
  courierName?: string;
  currentStatus?: string;
  statusCode?: string;
  shipmentStatus?: string;
  deliveredDate?: string;
  origin?: string;
  destination?: string;
  trackingHistory?: {
    timestamp: string;
    status: string;
    location: string;
    message: string;
  }[];
  error?: string;
}

/**
 * Authenticate with NimbusPost API and get bearer token
 */
async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  if (!NIMBUSPOST_EMAIL || !NIMBUSPOST_PASSWORD) {
    throw new Error("NimbusPost credentials not configured");
  }

  const response = await fetch(`${NIMBUSPOST_API_URL}/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: NIMBUSPOST_EMAIL,
      password: NIMBUSPOST_PASSWORD,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("NimbusPost login failed:", errorText);
    throw new Error("Failed to authenticate with NimbusPost");
  }

  const data = await response.json();

  if (!data.status || !data.data?.token) {
    throw new Error(data.message || "Authentication failed");
  }

  // Cache token for 23 hours (tokens typically last 24 hours)
  cachedToken = {
    token: data.data.token,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };

  return cachedToken.token;
}

/**
 * Track a single shipment by AWB number
 */
export async function trackShipment(awbNumber: string): Promise<TrackingResult> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${NIMBUSPOST_API_URL}/v1/shipments/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        awb: awbNumber,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NimbusPost tracking failed:", errorText);
      return {
        success: false,
        error: "Failed to fetch tracking information",
      };
    }

    const data: NimbusPostTrackingResponse = await response.json();

    if (!data.status || !data.data) {
      return {
        success: false,
        error: data.message || "Tracking information not available",
      };
    }

    return {
      success: true,
      awbNumber: data.data.awb_number,
      courierName: data.data.courier_name,
      currentStatus: data.data.current_status,
      statusCode: data.data.current_status_code,
      shipmentStatus: data.data.shipment_status,
      deliveredDate: data.data.delivered_date,
      origin: data.data.origin,
      destination: data.data.destination,
      trackingHistory: data.data.tracking_history?.map((event) => ({
        timestamp: event.timestamp,
        status: event.status,
        location: event.location,
        message: event.message,
      })),
    };
  } catch (error) {
    console.error("Track shipment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to track shipment",
    };
  }
}

/**
 * Track multiple shipments by AWB numbers
 */
export async function trackMultipleShipments(awbNumbers: string[]): Promise<TrackingResult[]> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${NIMBUSPOST_API_URL}/v1/shipments/track/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        awb: awbNumbers,
      }),
    });

    if (!response.ok) {
      return awbNumbers.map(() => ({
        success: false,
        error: "Failed to fetch tracking information",
      }));
    }

    const data = await response.json();

    if (!data.status || !data.data) {
      return awbNumbers.map(() => ({
        success: false,
        error: data.message || "Tracking information not available",
      }));
    }

    // Handle bulk response format
    return data.data.map((shipment: NimbusPostTrackingResponse["data"]) => ({
      success: true,
      awbNumber: shipment?.awb_number,
      courierName: shipment?.courier_name,
      currentStatus: shipment?.current_status,
      statusCode: shipment?.current_status_code,
      shipmentStatus: shipment?.shipment_status,
      deliveredDate: shipment?.delivered_date,
      origin: shipment?.origin,
      destination: shipment?.destination,
      trackingHistory: shipment?.tracking_history?.map((event) => ({
        timestamp: event.timestamp,
        status: event.status,
        location: event.location,
        message: event.message,
      })),
    }));
  } catch (error) {
    console.error("Track multiple shipments error:", error);
    return awbNumbers.map(() => ({
      success: false,
      error: error instanceof Error ? error.message : "Failed to track shipments",
    }));
  }
}

/**
 * Map NimbusPost status codes to user-friendly status
 */
export function mapNimbusPostStatus(statusCode: string): {
  status: string;
  color: "processing" | "shipped" | "in-transit" | "out-for-delivery" | "delivered" | "exception";
} {
  const statusMap: Record<
    string,
    { status: string; color: "processing" | "shipped" | "in-transit" | "out-for-delivery" | "delivered" | "exception" }
  > = {
    // Common NimbusPost status codes
    PP: { status: "Pickup Pending", color: "processing" },
    PU: { status: "Picked Up", color: "shipped" },
    IT: { status: "In Transit", color: "in-transit" },
    OO: { status: "Out for Delivery", color: "out-for-delivery" },
    DL: { status: "Delivered", color: "delivered" },
    UD: { status: "Undelivered", color: "exception" },
    RTO: { status: "Return to Origin", color: "exception" },
    CA: { status: "Cancelled", color: "exception" },
    OD: { status: "Out for Delivery", color: "out-for-delivery" },
    OFD: { status: "Out for Delivery", color: "out-for-delivery" },
    DEL: { status: "Delivered", color: "delivered" },
    NDR: { status: "Non-Delivery Report", color: "exception" },
  };

  return statusMap[statusCode?.toUpperCase()] || { status: statusCode || "Unknown", color: "processing" };
}

/**
 * Check if NimbusPost is configured
 */
export function isNimbusPostConfigured(): boolean {
  return !!(NIMBUSPOST_EMAIL && NIMBUSPOST_PASSWORD);
}
