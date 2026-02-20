"use client";

import { useChat } from "@ai-sdk/react";
import { SendHorizontal, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { WebsiteData } from "./WebsiteBuilderClient"; // We'll create this next

interface WebsiteBuilderChatProps {
    onUpdateWebsiteStructure: (updates: Partial<WebsiteData>) => void;
}

export function WebsiteBuilderChat({ onUpdateWebsiteStructure }: WebsiteBuilderChatProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { messages, sendMessage } = useChat({
        onToolCall({ toolCall }: { toolCall: any }) {
            // Whenever the AI decides to call a tool, we intercept it here to update the state.
            // This creates the Optimistic UI.
            if (toolCall.toolName === 'updateHero') {
                const args = toolCall.args as any;
                onUpdateWebsiteStructure({
                    ...(args.heroTitle && { heroTitle: args.heroTitle }),
                    ...(args.heroSubtitle && { heroSubtitle: args.heroSubtitle })
                });
            } else if (toolCall.toolName === 'updateAbout') {
                const args = toolCall.args as any;
                onUpdateWebsiteStructure({
                    ...(args.aboutTitle && { aboutTitle: args.aboutTitle }),
                    ...(args.aboutText && { aboutText: args.aboutText })
                });
            } else if (toolCall.toolName === 'updateTheme') {
                const args = toolCall.args as any;
                onUpdateWebsiteStructure({
                    ...(args.templateId && { templateId: args.templateId }),
                    ...(args.primaryColor && { primaryColor: args.primaryColor })
                });
            }
        }
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        const userMessage = input;
        setInput(""); // clear input

        try {
            await sendMessage({ role: 'user', parts: [{ type: 'text', text: userMessage }] } as any);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h2 className="font-semibold text-slate-900">Dijital Muavin</h2>
                    <p className="text-xs text-slate-500">Siteni kurmak için emrindeyim usta</p>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <p className="text-slate-600 font-medium mb-2">Selamun Aleyküm Patron!</p>
                            <p className="text-sm text-slate-500">
                                Ben senin dijital muavininim. Siteni nasıl yapalım? Örnek: "Ana başlığı Ateşnak Lojistik yap" diyebilirsin.
                            </p>
                        </div>
                    )}

                    {messages.map((m: any) => {
                        // Hide tool messages from user view
                        if (m.role === 'data' || m.role === 'system' || m.toolInvocations) {
                            // But if it has content AND tool invocations, we show the content.
                            if (!m.content) return null;
                        }

                        return (
                            <div
                                key={m.id}
                                className={`flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-600"
                                        }`}
                                >
                                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                </div>

                                <div
                                    className={`p-3 rounded-2xl ${m.role === "user"
                                        ? "bg-orange-500 text-white rounded-tr-sm"
                                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                                        {m.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-slate-500 ml-10">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Motor ısınıyor...</span>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleFormSubmit} className="relative flex items-center">
                    <input
                        className="w-full pl-4 pr-14 py-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base shadow-sm"
                        value={input}
                        placeholder="Ne yapalım usta?"
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="absolute right-2 top-2 bottom-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors h-auto aspect-square"
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
