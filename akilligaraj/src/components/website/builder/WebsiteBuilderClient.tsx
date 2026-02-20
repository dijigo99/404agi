"use client";

import { useState } from "react";
import { WebsiteBuilderChat } from "./WebsiteBuilderChat";
import { WebsitePreview } from "./WebsitePreview";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { publishWebsite } from "@/app/dashboard/website/builder/actions";

export interface WebsiteData {
    id: string;
    templateId: string;
    primaryColor: string;
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText: string;
    logoUrl?: string;
}

interface Props {
    initialData: WebsiteData;
}

export function WebsiteBuilderClient({ initialData }: Props) {
    const [data, setData] = useState<WebsiteData>(initialData);
    const [isPublishing, setIsPublishing] = useState(false);

    const handleUpdate = (updates: Partial<WebsiteData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await publishWebsite(data.id, data);
            toast.success("Site başarıyla yayınlandı usta!");
        } catch (error) {
            toast.error("Bir aksilik oldu usta, tekrar dener misin?");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-[header-height])] overflow-hidden">
            {/* Top Bar for Mobile / Publish Button */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Site Düzenleyici</h1>
                    <p className="text-sm text-slate-500">Dijital Muavin ile siteni anında güncelle.</p>
                </div>
                <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
                >
                    {isPublishing ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                    )}
                    Yayınla
                </Button>
            </div>

            {/* Main Split Interface */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
                {/* Left Panel: Chatbot */}
                <div className="w-full md:w-[400px] h-1/2 md:h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-10">
                    <WebsiteBuilderChat onUpdateWebsiteStructure={handleUpdate} />
                </div>

                {/* Right Panel: Preview */}
                <div className="flex-1 h-1/2 md:h-full overflow-y-auto p-4 md:p-8 flex items-center justify-center">
                    <div className="w-full max-w-[400px] h-[800px] max-h-full aspect-[9/19.5] bg-white rounded-[2.5rem] border-8 border-slate-900 shadow-2xl relative overflow-hidden flex flex-col items-center">
                        {/* Phone Notch */}
                        <div className="absolute top-0 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

                        {/* The actual live website preview */}
                        <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                            <WebsitePreview data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
