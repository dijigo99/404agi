"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionType {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        webkitSpeechRecognition: new () => SpeechRecognitionType;
    }
}

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    updates?: Array<{
        field: string;
        value: string;
        explanation: string;
    }>;
}

interface WebsiteChatProps {
    onUpdate?: () => void;
}

export function WebsiteChat({ onUpdate }: WebsiteChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Merhaba! Web sitenizi düzenlemenize yardımcı olabilirim. 🚀\n\nÖrneğin:\n• \"Hakkımızda yazısını değiştir\"\n• \"Telefon numaramı güncelle: 0532 XXX XX XX\"\n• \"Biz 20 yıldır nakliyatçıyız\" (Kurumsal dile çevireyim)",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognitionType | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "tr-TR";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert("Tarayıcınız ses tanımayı desteklemiyor");
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/website/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            });

            const data = await response.json();

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message || "Bir hata oluştu.",
                updates: data.updates,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Notify parent if updates were made
            if (data.updates?.length > 0 && onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Bir hata oluştu. Lütfen tekrar deneyin.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fieldLabels: Record<string, string> = {
        heroTitle: "Ana Başlık",
        heroSubtitle: "Alt Başlık",
        aboutTitle: "Hakkımızda Başlık",
        aboutText: "Hakkımızda Metin",
        contactPhone: "Telefon",
        contactEmail: "E-posta",
        contactAddress: "Adres",
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex gap-3",
                            message.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {message.role === "assistant" && (
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                        )}
                        <div
                            className={cn(
                                "max-w-[80%] rounded-lg px-4 py-2",
                                message.role === "user"
                                    ? "bg-accent text-white"
                                    : "bg-muted"
                            )}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                            {/* Show updates */}
                            {message.updates && message.updates.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                                    <p className="text-xs font-medium flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Yapılan Değişiklikler:
                                    </p>
                                    {message.updates.map((update, idx) => (
                                        <div
                                            key={idx}
                                            className="text-xs bg-background/50 rounded p-2"
                                        >
                                            <span className="font-medium">
                                                {fieldLabels[update.field] || update.field}:
                                            </span>{" "}
                                            {update.value.length > 50
                                                ? update.value.substring(0, 50) + "..."
                                                : update.value}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {message.role === "user" && (
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        onClick={toggleRecording}
                        className="flex-shrink-0"
                    >
                        {isRecording ? (
                            <MicOff className="h-4 w-4" />
                        ) : (
                            <Mic className="h-4 w-4" />
                        )}
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isRecording ? "Dinleniyor..." : "Bir şey yazın veya söyleyin..."}
                        disabled={loading || isRecording}
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || loading}
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    💡 Tip: Sesli konuşabilir veya yazabilirsiniz
                </p>
            </div>
        </div>
    );
}
