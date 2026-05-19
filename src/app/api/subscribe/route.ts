import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { ensurePlan, createSubscription } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planId = await ensurePlan();
    const { approveUrl, subscriptionId } = await createSubscription(
      planId,
      session.user.email,
      session.user.id
    );

    return NextResponse.json({ approveUrl, subscriptionId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
