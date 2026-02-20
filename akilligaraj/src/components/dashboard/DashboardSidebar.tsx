"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    Truck,
    LayoutDashboard,
    Calculator,
    FileText,
    Globe,
    Car,
    Instagram,
    Settings,
    LogOut,
    ChevronRight,
    Users,
    Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface DashboardSidebarProps {
    user: User;
}

const menuItems = [
    {
        title: "Ana Panel",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Maliyet Hesapla",
        href: "/dashboard/calculator",
        icon: Calculator,
    },
    {
        title: "Seferlerim",
        href: "/dashboard/trips",
        icon: Truck,
    },
    {
        title: "Tekliflerim",
        href: "/dashboard/offers",
        icon: FileText,
    },
    {
        title: "Müşterilerim",
        href: "/dashboard/customers",
        icon: Users,
    },
    {
        title: "Faturalarım",
        href: "/dashboard/invoices",
        icon: Receipt,
    },
    {
        title: "Web Sitem",
        href: "/dashboard/website",
        icon: Globe,
    },
    {
        title: "Araçlarım",
        href: "/dashboard/vehicles",
        icon: Car,
    },
    {
        title: "Sosyal Medya",
        href: "/dashboard/social",
        icon: Instagram,
    },
    {
        title: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                    <Truck className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-lg font-bold">
                    Akıllı<span className="text-accent">Garaj</span>
                </span>
            </div>

            {/* User Info */}
            <div className="border-b border-sidebar-border p-4">
                <div className="flex items-center gap-3">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-10 w-10 rounded-full"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                            {user.name?.[0] || "U"}
                        </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm truncate">{user.name || "Kullanıcı"}</p>
                        <p className="text-xs text-sidebar-foreground/70 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.title}
                                    {isActive && (
                                        <ChevronRight className="ml-auto h-4 w-4" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Sign Out */}
            <div className="border-t border-sidebar-border p-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Çıkış Yap
                </Button>
            </div>
        </aside>
    );
}
