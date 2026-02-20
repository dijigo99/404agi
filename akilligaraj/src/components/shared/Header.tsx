"use client";

import Link from "next/link";
import { Truck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <Truck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">
                        Akıllı<span className="text-accent">Garaj</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Özellikler
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Fiyatlandırma
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        İletişim
                    </Link>
                </nav>

                {/* Desktop CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" asChild>
                        <Link href="/auth/login">Giriş Yap</Link>
                    </Button>
                    <Button
                        className="bg-accent hover:bg-accent/90 text-accent-foreground btn-touch"
                        asChild
                    >
                        <Link href="/auth/register">Ücretsiz Başla</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Menü"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        <Link
                            href="#features"
                            className="text-base font-medium text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Özellikler
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-base font-medium text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Fiyatlandırma
                        </Link>
                        <Link
                            href="#contact"
                            className="text-base font-medium text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            İletişim
                        </Link>
                        <div className="flex flex-col gap-3 pt-4 border-t border-border">
                            <Button variant="outline" className="w-full btn-touch" asChild>
                                <Link href="/auth/login">Giriş Yap</Link>
                            </Button>
                            <Button
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-touch"
                                asChild
                            >
                                <Link href="/auth/register">Ücretsiz Başla</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
