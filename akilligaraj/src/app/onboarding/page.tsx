import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
    const session = await auth();

    // Giriş yapmamışsa login'e yönlendir
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    // Zaten firma oluşturulmuşsa dashboard'a yönlendir
    const existingCompany = await db.query.companies.findFirst({
        where: eq(companies.userId, session.user.id),
    });

    if (existingCompany) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <OnboardingWizard userId={session.user.id} userName={session.user.name || ""} />
        </div>
    );
}
