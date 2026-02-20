import { db } from "@/lib/db";
import { websites, companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { HeroSection, AboutSection, ServicesSection, ContactSection, Footer } from "@/components/website/sections";
import { getTemplate, TemplateId } from "@/lib/website/templates";

interface PageProps {
    params: Promise<{ subdomain: string }>;
}

async function getWebsite(subdomain: string) {
    const [website] = await db
        .select()
        .from(websites)
        .where(eq(websites.subdomain, subdomain));

    if (!website || !website.isPublished) {
        return null;
    }

    // Get company info for additional data
    const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.userId, website.userId));

    return { website, company };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { subdomain } = await params;
    const data = await getWebsite(subdomain);

    if (!data) {
        return { title: "Site Bulunamadı" };
    }

    return {
        title: data.website.metaTitle || `${data.company?.companyName || "Nakliyat"} - Güvenilir Nakliyat`,
        description: data.website.metaDescription || "Profesyonel nakliyat hizmetleri",
    };
}

export default async function SubdomainSitePage({ params }: PageProps) {
    const { subdomain } = await params;
    const data = await getWebsite(subdomain);

    if (!data) {
        notFound();
    }

    const { website, company } = data;
    const template = getTemplate(website.templateId as TemplateId);

    const colors = {
        primary: website.primaryColor || template.colors.primary,
        secondary: website.secondaryColor || template.colors.secondary,
        accent: website.accentColor || template.colors.accent,
        background: template.colors.background,
        text: template.colors.text,
    };

    const companyName = company?.companyName || "Nakliyat Firması";
    const services = website.services ? JSON.parse(website.services) : [];

    return (
        <main className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            <HeroSection
                templateId={website.templateId}
                colors={colors}
                title={website.heroTitle || `${companyName} - Güvenilir Nakliyat`}
                subtitle={website.heroSubtitle || "Profesyonel nakliyat hizmetleri ile eşyalarınız güvende."}
                companyName={companyName}
                phone={website.contactPhone || undefined}
                heroImage={website.heroImageUrl || undefined}
            />

            <AboutSection
                templateId={website.templateId}
                colors={colors}
                title={website.aboutTitle || "Hakkımızda"}
                text={website.aboutText || ""}
            />

            {services.length > 0 && (
                <ServicesSection
                    templateId={website.templateId}
                    colors={colors}
                    services={services}
                />
            )}

            <ContactSection
                templateId={website.templateId}
                colors={colors}
                phone={website.contactPhone || undefined}
                email={website.contactEmail || undefined}
                address={website.contactAddress || undefined}
            />

            <Footer colors={colors} companyName={companyName} />
        </main>
    );
}
