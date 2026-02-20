import { Phone, MapPin, Mail, Clock } from "lucide-react";
import { TemplateColors } from "@/lib/website/templates";

interface HeroSectionProps {
    templateId: string;
    colors: TemplateColors;
    title: string;
    subtitle: string;
    companyName: string;
    phone?: string;
    heroImage?: string;
}

export function HeroSection({
    templateId,
    colors,
    title,
    subtitle,
    companyName,
    phone,
    heroImage,
}: HeroSectionProps) {
    const isDark = templateId === "dinamik";

    return (
        <section
            className="relative min-h-[600px] flex items-center"
            style={{
                backgroundColor: colors.background,
                backgroundImage: heroImage ? `url(${heroImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {heroImage && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)",
                    }}
                />
            )}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                        style={{ color: colors.primary }}
                    >
                        {title || `${companyName} - Güvenilir Nakliyat`}
                    </h1>
                    <p
                        className="text-xl md:text-2xl mb-8"
                        style={{ color: colors.text }}
                    >
                        {subtitle || "Profesyonel nakliyat hizmetleri ile eşyalarınız güvende."}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: isDark ? "#000" : "#fff",
                                }}
                            >
                                <Phone className="h-5 w-5" />
                                Hemen Ara
                            </a>
                        )}
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all hover:scale-105"
                            style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                            }}
                        >
                            Teklif Al
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface AboutSectionProps {
    templateId: string;
    colors: TemplateColors;
    title: string;
    text: string;
}

export function AboutSection({ templateId, colors, title, text }: AboutSectionProps) {
    const isDark = templateId === "dinamik";

    return (
        <section
            id="about"
            className="py-20"
            style={{
                backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
            }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-6"
                        style={{ color: colors.primary }}
                    >
                        {title || "Hakkımızda"}
                    </h2>
                    <p
                        className="text-lg leading-relaxed"
                        style={{ color: isDark ? "#cbd5e1" : colors.text }}
                    >
                        {text ||
                            "Yılların tecrübesi ve profesyonel kadromuzla, eşyalarınızı en güvenli şekilde taşıyoruz. Müşteri memnuniyeti odaklı hizmet anlayışımızla, Türkiye'nin her noktasına nakliyat hizmeti sunuyoruz."}
                    </p>
                </div>
            </div>
        </section>
    );
}

interface Service {
    title: string;
    icon: string;
    description?: string;
}

interface ServicesSectionProps {
    templateId: string;
    colors: TemplateColors;
    services: Service[];
}

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
    truck: ({ className, style }) => (
        <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M8 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0m12 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M3 9h12V5a1 1 0 00-1-1H4a1 1 0 00-1 1v4zm12 0h4l3 4v4h-7V9z" />
        </svg>
    ),
    home: ({ className, style }) => (
        <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    building: ({ className, style }) => (
        <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    warehouse: ({ className, style }) => (
        <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    package: ({ className, style }) => (
        <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    shield: ({ className, style }) => (
        <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
};

export function ServicesSection({ templateId, colors, services }: ServicesSectionProps) {
    const isDark = templateId === "dinamik";

    return (
        <section id="services" className="py-20" style={{ backgroundColor: colors.background }}>
            <div className="container mx-auto px-4">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ color: colors.primary }}
                >
                    Hizmetlerimiz
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || iconMap.truck;
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-xl transition-all hover:scale-105"
                                style={{
                                    backgroundColor: isDark ? "#1e293b" : "#fff",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <IconComponent
                                    className="h-12 w-12 mb-4"
                                    style={{ color: colors.accent }}
                                />
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{ color: isDark ? "#fff" : colors.text }}
                                >
                                    {service.title}
                                </h3>
                                {service.description && (
                                    <p style={{ color: isDark ? "#94a3b8" : colors.secondary }}>
                                        {service.description}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

interface ContactSectionProps {
    templateId: string;
    colors: TemplateColors;
    phone?: string;
    email?: string;
    address?: string;
}

export function ContactSection({ templateId, colors, phone, email, address }: ContactSectionProps) {
    const isDark = templateId === "dinamik";

    return (
        <section
            id="contact"
            className="py-20"
            style={{
                backgroundColor: isDark ? "#0f172a" : "#f8fafc",
            }}
        >
            <div className="container mx-auto px-4">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ color: colors.primary }}
                >
                    İletişim
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="flex flex-col items-center p-6 rounded-xl transition-all hover:scale-105"
                            style={{
                                backgroundColor: isDark ? "#1e293b" : "#fff",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Phone className="h-10 w-10 mb-3" style={{ color: colors.accent }} />
                            <span
                                className="text-lg font-semibold"
                                style={{ color: isDark ? "#fff" : colors.text }}
                            >
                                {phone}
                            </span>
                        </a>
                    )}
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex flex-col items-center p-6 rounded-xl transition-all hover:scale-105"
                            style={{
                                backgroundColor: isDark ? "#1e293b" : "#fff",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Mail className="h-10 w-10 mb-3" style={{ color: colors.accent }} />
                            <span
                                className="text-lg font-semibold"
                                style={{ color: isDark ? "#fff" : colors.text }}
                            >
                                {email}
                            </span>
                        </a>
                    )}
                    {address && (
                        <div
                            className="flex flex-col items-center p-6 rounded-xl"
                            style={{
                                backgroundColor: isDark ? "#1e293b" : "#fff",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <MapPin className="h-10 w-10 mb-3" style={{ color: colors.accent }} />
                            <span
                                className="text-lg text-center"
                                style={{ color: isDark ? "#fff" : colors.text }}
                            >
                                {address}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

interface FooterProps {
    colors: TemplateColors;
    companyName: string;
}

export function Footer({ colors, companyName }: FooterProps) {
    return (
        <footer
            className="py-8"
            style={{ backgroundColor: colors.primary }}
        >
            <div className="container mx-auto px-4 text-center">
                <p className="text-white/80">
                    © {new Date().getFullYear()} {companyName}. Tüm hakları saklıdır.
                </p>
                <p className="text-white/60 text-sm mt-2">
                    <a href="https://akilligaraj.com" target="_blank" rel="noopener noreferrer">
                        AkıllıGaraj
                    </a>{" "}
                    ile oluşturuldu
                </p>
            </div>
        </footer>
    );
}
