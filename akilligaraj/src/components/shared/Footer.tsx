import Link from "next/link";
import { Truck, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                                <Truck className="h-6 w-6 text-accent-foreground" />
                            </div>
                            <span className="text-xl font-bold">
                                Akıllı<span className="text-accent">Garaj</span>
                            </span>
                        </Link>
                        <p className="text-sm text-primary-foreground/70 max-w-xs">
                            Türkiye&apos;nin en büyük nakliyeci platformu. Maliyetini hesapla,
                            web siteni oluştur, müşterilerine ulaş.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Hızlı Erişim</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#features"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    Özellikler
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#pricing"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    Fiyatlandırma
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    Giriş Yap
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/auth/register"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    Ücretsiz Başla
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Yasal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/legal/privacy"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    Gizlilik Politikası
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/legal/terms"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    Kullanım Koşulları
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/legal/kvkk"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    KVKK Aydınlatma Metni
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İletişim</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-accent" />
                                <a
                                    href="tel:+908501234567"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    0850 123 45 67
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-accent" />
                                <a
                                    href="mailto:info@akilligaraj.com"
                                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    info@akilligaraj.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                                <span className="text-sm text-primary-foreground/70">
                                    İstanbul, Türkiye
                                </span>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-foreground/70 hover:text-accent transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-foreground/70 hover:text-accent transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-foreground/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-primary-foreground/50">
                            © {new Date().getFullYear()} AkılliGaraj. Tüm hakları saklıdır.
                        </p>
                        <p className="text-sm text-primary-foreground/50">
                            🇹🇷 Türkiye&apos;de tasarlandı ve geliştirildi
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
