import { NextRequest, NextResponse } from "next/server";
import { activateProPlan, verifyWebhook } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers: Record<string, string | undefined> = {};
    req.headers.forEach((v, k) => {
      headers[k] = v;
    });

    // Verify webhook
    const valid = await verifyWebhook(body, headers);
    if (!valid) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle subscription activation
    if (
      event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED" ||
      event.event_type === "BILLING.SUBSCRIPTION.RENEWED"
    ) {
      const subscriptionId = event.resource?.id;
      if (subscriptionId) {
        await activateProPlan(subscriptionId);
      }
    }

    // Handle subscription cancellation
    if (event.event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
      const email = event.resource?.subscriber?.email_address;
      if (email) {
        const { supabase } = await import("@/lib/supabase");
        await supabase
          .from("users")
          .update({ plan: "free", paypal_subscription_id: null })
          .eq("email", email);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook error";
    console.error("PayPal webhook error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
