// Website template tanımları
export type TemplateId = "kurumsal" | "dinamik" | "minimal";

export interface TemplateColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

export interface Template {
    id: TemplateId;
    name: string;
    description: string;
    preview: string; // Preview image URL
    colors: TemplateColors;
}

export const templates: Template[] = [
    {
        id: "kurumsal",
        name: "Kurumsal",
        description: "Ciddi ve profesyonel görünüm. Büyük filolar için ideal.",
        preview: "/templates/kurumsal-preview.png",
        colors: {
            primary: "#1e40af", // Mavi
            secondary: "#475569", // Gri
            accent: "#3b82f6",
            background: "#f8fafc",
            text: "#1e293b",
        },
    },
    {
        id: "dinamik",
        name: "Dinamik",
        description: "Enerjik ve modern görünüm. Genç lojistikçiler için.",
        preview: "/templates/dinamik-preview.png",
        colors: {
            primary: "#f97316", // Turuncu
            secondary: "#1e293b", // Siyah
            accent: "#fb923c",
            background: "#0f172a",
            text: "#f8fafc",
        },
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Sade ve temiz görünüm. Net izlenim bırakmak için.",
        preview: "/templates/minimal-preview.png",
        colors: {
            primary: "#16a34a", // Yeşil
            secondary: "#64748b",
            accent: "#22c55e",
            background: "#ffffff",
            text: "#374151",
        },
    },
];

export const getTemplate = (id: TemplateId): Template => {
    return templates.find((t) => t.id === id) || templates[0];
};

// Varsayılan hizmetler
export const defaultServices = [
    { title: "Şehirlerarası Nakliyat", icon: "truck" },
    { title: "Evden Eve Taşımacılık", icon: "home" },
    { title: "Ofis Taşıma", icon: "building" },
    { title: "Eşya Depolama", icon: "warehouse" },
    { title: "Ambalajlama", icon: "package" },
    { title: "Sigortalı Taşıma", icon: "shield" },
];
