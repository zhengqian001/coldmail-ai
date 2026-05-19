import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { supabase } from "@/lib/supabase";
import { checkDailyLimit, incrementDailyUsage, getUserPlan } from "@/lib/usage";
import { generateEmails } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const plan = await getUserPlan(userId);

    if (plan === "free") {
      const { allowed, count } = await checkDailyLimit(userId);
      if (!allowed) {
        return NextResponse.json(
          {
            error: "Daily limit reached. Upgrade to Pro for unlimited generations.",
            count,
          },
          { status: 429 }
        );
      }
    }

    const { product, targetCustomer, tone } = await req.json();
    if (!product || !targetCustomer) {
      return NextResponse.json(
        { error: "Product and target customer are required" },
        { status: 400 }
      );
    }

    const results = await generateEmails(product, targetCustomer, tone || "professional");

    await supabase.from("generations").insert({
      user_id: userId,
      product,
      target_customer: targetCustomer,
      tone: tone || "professional",
      results,
    });

    await incrementDailyUsage(userId);

    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
