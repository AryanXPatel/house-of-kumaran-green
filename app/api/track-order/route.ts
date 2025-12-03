import { NextRequest, NextResponse } from "next/server";

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
      // Return a helpful response when API is not configured
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
    // Using REST Admin API to search orders by name (order number)
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

    // Get fulfillment/tracking info
    const fulfillment = order.fulfillments?.[0];

    // Map Shopify fulfillment status to user-friendly status
    const statusMap: Record<string, string> = {
      null: "Processing",
      pending: "Processing",
      open: "Processing",
      success: "Shipped",
      cancelled: "Cancelled",
      error: "Error",
      failure: "Failed",
    };

    const fulfillmentStatusMap: Record<string, string> = {
      null: "Processing",
      unfulfilled: "Processing",
      partial: "Partially Shipped",
      fulfilled: "Shipped",
      restocked: "Restocked",
    };

    // Generate tracking steps based on status
    const steps = generateTrackingSteps(
      order.fulfillment_status,
      fulfillment?.status,
      order.created_at,
      fulfillment?.created_at
    );

    return NextResponse.json({
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
      steps,
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateTrackingSteps(
  fulfillmentStatus: string | null,
  shipmentStatus: string | undefined,
  orderCreatedAt: string,
  fulfillmentCreatedAt: string | undefined
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

  // Determine which steps are completed
  const isShipped =
    fulfillmentStatus === "fulfilled" || shipmentStatus === "success";
  const isInTransit = isShipped; // Assume shipped means in transit
  const isDelivered = false; // Would need delivery confirmation from NimbusPost

  return [
    {
      title: "Order Placed",
      date: orderDate,
      completed: true,
    },
    {
      title: "Order Confirmed",
      date: orderDate,
      completed: true,
    },
    {
      title: "Packed & Shipped",
      date: shipDate || "Pending",
      completed: isShipped,
    },
    {
      title: "In Transit",
      date: isInTransit ? shipDate : "Pending",
      completed: isInTransit,
    },
    {
      title: "Out for Delivery",
      date: "Pending",
      completed: false,
    },
    {
      title: "Delivered",
      date: isDelivered ? "Delivered" : "Pending",
      completed: isDelivered,
    },
  ];
}
