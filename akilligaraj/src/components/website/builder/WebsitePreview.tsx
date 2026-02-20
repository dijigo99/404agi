"use client";

import { WebsiteData } from "./WebsiteBuilderClient";
import { Truck } from "lucide-react";

export function WebsitePreview({ data }: { data: WebsiteData }) {
    const { templateId, primaryColor, heroTitle, heroSubtitle, aboutTitle, aboutText } = data;

    // Simple Theme Definitions
    const isDinamic = templateId === "dinamik";
    const isMinimal = templateId === "minimal";
    const isModern = templateId === "modern";
    const isKlasik = templateId === "klasik";

    return (
        <div className="min-h-full flex flex-col bg-white overflow-x-hidden font-sans">
            {/* MOCK HEADER */}
            <header className={`p-4 flex items-center justify-between ${isDinamic ? 'bg-slate-900 text-white' : 'bg-white border-b'}`}>
                <div className="flex items-center gap-2 font-bold text-lg" style={{ color: isDinamic ? 'white' : primaryColor }}>
                    <Truck className="w-6 h-6" />
                    {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="h-6" /> : "Firma Logo"}
                </div>
                <div className="flex gap-2">
                    <div className="w-6 h-1 bg-slate-200 rounded"></div>
                    <div className="w-6 h-1 bg-slate-200 rounded"></div>
                </div>
            </header>

            {/* MOCK HERO SECTION */}
            <section
                className={`flex-1 flex flex-col justify-center items-center text-center p-8 min-h-[400px] relative`}
                style={isDinamic ? { backgroundColor: primaryColor, color: 'white' } : { backgroundColor: `${primaryColor}10` }}
            >
                {isModern && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50 pointer-events-none"></div>
                )}

                <h1
                    className={`text-3xl font-extrabold mb-4 leading-tight relative z-10`}
                    style={{ color: isDinamic ? 'white' : primaryColor }}
                >
                    {heroTitle || "Ateşnak Lojistik"}
                </h1>

                <p className={`text-base mb-8 opacity-90 relative z-10 ${isKlasik ? 'font-serif italic' : ''}`}>
                    {heroSubtitle || "Türkiye'nin yükünü biz çekiyoruz. Güvenli ve hızlı taşıma."}
                </p>

                <button
                    className={`px-8 py-3 rounded-full font-bold relative z-10 shadow-lg`}
                    style={{
                        backgroundColor: isDinamic ? 'white' : primaryColor,
                        color: isDinamic ? primaryColor : 'white',
                        borderRadius: isMinimal ? '8px' : '9999px'
                    }}
                >
                    Fiyat Al
                </button>
            </section>

            {/* MOCK ABOUT SECTION */}
            <section className={`p-8 ${isDinamic ? 'bg-white' : 'bg-slate-50'}`}>
                <h2
                    className={`text-2xl font-bold mb-4 ${isMinimal ? 'border-b-2 pb-2 inline-block' : ''}`}
                    style={{ borderColor: primaryColor }}
                >
                    {aboutTitle || "Hakkımızda"}
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                    {aboutText || "Yılların verdiği tecrübe ile müşteri memnuniyetini her zaman ön planda tutuyoruz."}
                </p>
            </section>

            {/* MOCK FOOTER */}
            <footer className="mt-auto p-6 bg-slate-900 text-slate-400 text-center text-xs">
                <p>© 2026 Nakliyat. Tüm hakları saklıdır.</p>
                <p className="mt-2 text-[10px] opacity-50">AkıllıGaraj Altyapısı ile Üretilmiştir.</p>
            </footer>
        </div>
    );
}
