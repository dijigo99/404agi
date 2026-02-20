import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Giriş yapmamışsa login'e yönlendir
    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Mobile Header */}
            <DashboardHeader user={session.user} />

            <div className="flex">
                {/* Sidebar - Desktop */}
                <DashboardSidebar user={session.user} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
