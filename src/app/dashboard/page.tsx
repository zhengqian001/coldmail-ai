import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getUserPlan } from "@/lib/usage";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const plan = await getUserPlan(session.user.id);

  return <DashboardClient user={session.user} plan={plan} />;
}
