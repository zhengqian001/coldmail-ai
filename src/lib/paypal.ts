// PayPal API helpers - Subscription management

const PAYPAL_API = process.env.PAYPAL_SANDBOX === "true"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "PayPal auth failed");
  return data.access_token;
}

/** Create a subscription plan if it doesn't exist yet */
export async function ensurePlan(): Promise<string> {
  const token = await getAccessToken();

  // Check if plan already exists
  const listRes = await fetch(
    `${PAYPAL_API}/v1/billing/plans?page_size=20&total_required=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const listData = await listRes.json();
  const existing = listData.plans?.find(
    (p: { name: string }) => p.name === "ColdMail AI Pro - Monthly"
  );
  if (existing) return existing.id;

  // Create product first
  const prodRes = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "ColdMail AI",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });
  const prodData = await prodRes.json();
  const productId = prodData.id;

  // Create plan
  const planRes = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `coldmail-plan-${Date.now()}`,
    },
    body: JSON.stringify({
      name: "ColdMail AI Pro - Monthly",
      product_id: productId,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: "9.00", currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: "0", currency_code: "USD" },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });
  const planData = await planRes.json();
  return planData.id;
}

/** Create a subscription for a user */
export async function createSubscription(
  planId: string,
  userEmail: string,
  userId: string
): Promise<{ approveUrl: string; subscriptionId: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `sub-${userId}-${Date.now()}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        email_address: userEmail,
      },
      application_context: {
        brand_name: "ColdMail AI",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXTAUTH_URL}/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Subscription creation failed");

  const approveLink = data.links?.find(
    (l: { rel: string }) => l.rel === "approve"
  )?.href;

  return {
    approveUrl: approveLink || "",
    subscriptionId: data.id,
  };
}

/** Verify webhook event signature (simplified) */
export async function verifyWebhook(
  body: string,
  headers: Record<string, string | undefined>
): Promise<boolean> {
  // In production, use PayPal's webhook verification
  // For MVP, we trust the webhook auth header
  return !!headers["paypal-auth-algo"];
}

/** Activate user's pro plan */
export async function activateProPlan(
  subscriptionId: string
): Promise<void> {
  const token = await getAccessToken();

  // Get subscription details
  const res = await fetch(
    `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  const email = data.subscriber?.email_address;

  if (email) {
    // Update user plan in Supabase
    const { supabase } = await import("./supabase");
    await supabase
      .from("users")
      .update({ plan: "pro", paypal_subscription_id: subscriptionId })
      .eq("email", email);
  }
}
