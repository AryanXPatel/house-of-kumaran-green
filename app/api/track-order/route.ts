import { NextRequest, NextResponse } from "next/server";
import {
  trackShipment,
  mapNimbusPostStatus,
  isNimbusPostConfigured,
  TrackingResult,
} from "@/lib/nimbuspost";

// Shopify Admin API credentials (for server-side only)
const SHOPIFY_ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

interface ShopifyFulfillment {
  status: string;
  tracking_number: string;
  tracking_company: string;
  tracking_url: string;
  created_at: string;
  updated_at: string;
}

interface ShopifyOrder {
  id: number;
  name: string;
  email: string;
  fulfillment_status: string | null;
  fulfillments: ShopifyFulfillment[];
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      );
    }

    // Check if Shopify Admin API is configured
    if (!SHOPIFY_ADMIN_API_URL || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          error: "Tracking service not configured",
          message:
            "Please use your AWB number to track directly with NimbusPost",
        },
        { status: 503 }
      );
    }

    // Clean up order number (remove # if present)
    const cleanOrderNumber = orderNumber.replace(/^#/, "");

    // Query Shopify for the order
    const searchResponse = await fetch(
      `${SHOPIFY_ADMIN_API_URL}/orders.json?name=${encodeURIComponent(
        cleanOrderNumber
      )}&status=any`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (!searchResponse.ok) {
      console.error("Shopify API error:", await searchResponse.text());
      return NextResponse.json(
        { error: "Failed to fetch order information" },
        { status: 500 }
      );
    }

    const { orders } = (await searchResponse.json()) as {
      orders: ShopifyOrder[];
    };

    // Find the order that matches the email
    const order = orders.find(
      (o: ShopifyOrder) => o.email.toLowerCase() === email.toLowerCase()
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get fulfillment/tracking info from Shopify
    const fulfillment = order.fulfillments?.[0];
    const trackingNumber = fulfillment?.tracking_number;

    // If we have a tracking number (AWB) and NimbusPost is configured,
    // fetch live tracking from NimbusPost
    let nimbuspostTracking: TrackingResult | null = null;
    if (trackingNumber && isNimbusPostConfigured()) {
      nimbuspostTracking = await trackShipment(trackingNumber);
    }

    // Build response with combined Shopify + NimbusPost data
    const response = buildTrackingResponse(
      order,
      fulfillment,
      nimbuspostTracking
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildTrackingResponse(
  order: ShopifyOrder,
  fulfillment: ShopifyFulfillment | undefined,
  nimbuspostTracking: TrackingResult | null
) {
  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const shipDate = fulfillment?.created_at
    ? new Date(fulfillment.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // If NimbusPost tracking is available and successful, use it
  if (nimbuspostTracking?.success) {
    const statusInfo = mapNimbusPostStatus(nimbuspostTracking.statusCode || "");
    const steps = generateStepsFromNimbusPost(
      order.created_at,
      fulfillment?.created_at,
      nimbuspostTracking
    );

    return {
      orderId: order.id,
      orderName: order.name,
      fulfillmentStatus: nimbuspostTracking.currentStatus || statusInfo.status,
      trackingNumber: nimbuspostTracking.awbNumber,
      trackingCompany: nimbuspostTracking.courierName || fulfillment?.tracking_company,
      trackingUrl: fulfillment?.tracking_url || null,
      status: statusInfo.status,
      statusColor: statusInfo.color,
      origin: nimbuspostTracking.origin,
      destination: nimbuspostTracking.destination,
      deliveredDate: nimbuspostTracking.deliveredDate,
      steps,
      // Include full tracking history from NimbusPost
      trackingHistory: nimbuspostTracking.trackingHistory || [],
      source: "nimbuspost",
    };
  }

  // Fall back to Shopify-only data
  const fulfillmentStatusMap: Record<string, string> = {
    null: "Processing",
    unfulfilled: "Processing",
    partial: "Partially Shipped",
    fulfilled: "Shipped",
    restocked: "Restocked",
  };

  const statusMap: Record<string, string> = {
    null: "Processing",
    pending: "Processing",
    open: "Processing",
    success: "Shipped",
    cancelled: "Cancelled",
    error: "Error",
    failure: "Failed",
  };

  const isShipped =
    order.fulfillment_status === "fulfilled" || fulfillment?.status === "success";

  const steps = [
    {
      title: "Order Placed",
      date: orderDate,
      completed: true,
      location: "",
    },
    {
      title: "Order Confirmed",
      date: orderDate,
      completed: true,
      location: "",
    },
    {
      title: "Packed & Shipped",
      date: shipDate || "Pending",
      completed: isShipped,
      location: "",
    },
    {
      title: "In Transit",
      date: isShipped ? shipDate : "Pending",
      completed: isShipped,
      location: "",
    },
    {
      title: "Out for Delivery",
      date: "Pending",
      completed: false,
      location: "",
    },
    {
      title: "Delivered",
      date: "Pending",
      completed: false,
      location: "",
    },
  ];

  return {
    orderId: order.id,
    orderName: order.name,
    fulfillmentStatus:
      fulfillmentStatusMap[order.fulfillment_status || "null"] ||
      order.fulfillment_status,
    trackingNumber: fulfillment?.tracking_number || null,
    trackingCompany: fulfillment?.tracking_company || null,
    trackingUrl: fulfillment?.tracking_url || null,
    status: fulfillment
      ? statusMap[fulfillment.status] || fulfillment.status
      : "Processing",
    statusColor: "processing",
    steps,
    trackingHistory: [],
    source: "shopify",
  };
}

function generateStepsFromNimbusPost(
  orderCreatedAt: string,
  fulfillmentCreatedAt: string | undefined,
  tracking: TrackingResult
) {
  const orderDate = new Date(orderCreatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const shipDate = fulfillmentCreatedAt
    ? new Date(fulfillmentCreatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const statusCode = tracking.statusCode?.toUpperCase() || "";

  // Determine completed steps based on NimbusPost status
  const isShipped = ["PU", "IT", "OO", "OD", "OFD", "DL", "DEL"].includes(statusCode);
  const isInTransit = ["IT", "OO", "OD", "OFD", "DL", "DEL"].includes(statusCode);
  const isOutForDelivery = ["OO", "OD", "OFD", "DL", "DEL"].includes(statusCode);
  const isDelivered = ["DL", "DEL"].includes(statusCode);

  // Get latest tracking event for each step
  const history = tracking.trackingHistory || [];
  const getEventDate = (keywords: string[]) => {
    const event = history.find((e) =>
      keywords.some((k) => e.status?.toLowerCase().includes(k.toLowerCase()))
    );
    return event
      ? new Date(event.timestamp).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;
  };

  const deliveredEvent = history.find((e) =>
    ["delivered", "del"].some((k) => e.status?.toLowerCase().includes(k))
  );
  const outForDeliveryEvent = history.find((e) =>
    ["out for delivery", "ofd", "dispatched"].some((k) =>
      e.status?.toLowerCase().includes(k)
    )
  );

  return [
    {
      title: "Order Placed",
      date: orderDate,
      completed: true,
      location: "",
    },
    {
      title: "Order Confirmed",
      date: orderDate,
      completed: true,
      location: "",
    },
    {
      title: "Packed & Shipped",
      date: shipDate || (isShipped ? getEventDate(["picked", "shipped", "pickup"]) || "Shipped" : "Pending"),
      completed: isShipped,
      location: tracking.origin || "",
    },
    {
      title: "In Transit",
      date: isInTransit
        ? getEventDate(["transit", "hub", "arrived", "departed"]) || shipDate || "In Transit"
        : "Pending",
      completed: isInTransit,
      location: "",
    },
    {
      title: "Out for Delivery",
      date: isOutForDelivery
        ? outForDeliveryEvent
          ? new Date(outForDeliveryEvent.timestamp).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Out for Delivery"
        : "Pending",
      completed: isOutForDelivery,
      location: outForDeliveryEvent?.location || "",
    },
    {
      title: "Delivered",
      date: isDelivered
        ? tracking.deliveredDate ||
          (deliveredEvent
            ? new Date(deliveredEvent.timestamp).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Delivered")
        : "Pending",
      completed: isDelivered,
      location: tracking.destination || deliveredEvent?.location || "",
    },
  ];
}
