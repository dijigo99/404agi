"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Truck, Menu, X, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface DashboardHeaderProps {
    user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 md:ml-64 bg-background border-b border-border">
            <div className="flex h-16 items-center justify-between px-4">
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 -ml-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Menü"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                {/* Mobile Logo */}
                <Link href="/dashboard" className="md:hidden flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Truck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">
                        Akıllı<span className="text-accent">Garaj</span>
                    </span>
                </Link>

                {/* Right Side - Desktop */}
                <div className="hidden md:flex items-center gap-4 ml-auto">
                    {/* View Website Button */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/s/demo" target="_blank">
                            <Globe className="h-4 w-4 mr-2" />
                            Web Sitemi Gör
                        </Link>
                    </Button>

                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
                    </button>

                    {/* User Avatar */}
                    <div className="flex items-center gap-3">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-9 w-9 rounded-full"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                                {user.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile - User Avatar */}
                <div className="md:hidden">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                            {user.name?.[0] || "U"}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="p-4 space-y-2">
                        <Link
                            href="/dashboard"
                            className="block px-3 py-2 rounded-lg hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Ana Panel
                        </Link>
                        <Link
                            href="/dashboard/calculator"
                            className="block px-3 py-2 rounded-lg hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Maliyet Hesapla
                        </Link>
                        <Link
                            href="/dashboard/trips"
                            className="block px-3 py-2 rounded-lg hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Seferlerim
                        </Link>
                        <Link
                            href="/dashboard/offers"
                            className="block px-3 py-2 rounded-lg hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Tekliflerim
                        </Link>
                        <Link
                            href="/dashboard/website"
                            className="block px-3 py-2 rounded-lg hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Web Sitem
                        </Link>
                        <Link
                            href="/dashboard/vehicles"
                            className="block px-3 py-2 rounded-lg hover:bg-muted"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Araçlarım
                        </Link>
                        <div className="pt-4 border-t border-border">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Çıkış Yap
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
