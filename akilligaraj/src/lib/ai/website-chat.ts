// Direct REST API call to Gemini - more control over endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Try different model names in order of preference
const MODEL_NAMES = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
];

export interface WebsiteUpdateResult {
    field: string;
    value: string;
    explanation: string;
}

export interface ChatResponse {
    message: string;
    updates?: WebsiteUpdateResult[];
}

const SYSTEM_PROMPT = `Sen AkıllıGaraj platformunda nakliyat firmalarına web sitesi yönetiminde yardımcı olan bir asistansın.

GÖREVLER:
1. Kullanıcının sitesindeki içerikleri düzenlemesine yardım et
2. Profesyonel ve kurumsal metinler yaz
3. İletişim bilgilerini güncelle
4. Renkleri ve tasarımı değiştir
5. Sorulara nazik ve profesyonel cevaplar ver

GÜNCELLENEBİLİR ALANLAR:

📝 İÇERİK:
- heroTitle: Ana sayfa başlığı
- heroSubtitle: Ana sayfa alt başlığı  
- aboutTitle: Hakkımızda başlığı
- aboutText: Hakkımızda metni

📞 İLETİŞİM:
- contactPhone: Telefon numarası
- contactEmail: E-posta adresi
- contactAddress: Adres

🎨 TASARIM/RENKLER:
- primaryColor: Ana renk (hex format, örn: #1e40af)
- secondaryColor: İkincil renk (hex format, örn: #64748b)
- accentColor: Vurgu rengi (hex format, örn: #f97316)
- templateId: Şablon (kurumsal, dinamik, minimal)

CEVAP FORMATI (JSON):
{
  "message": "Kullanıcıya gösterilecek mesaj",
  "updates": [
    {
      "field": "alan_adı",
      "value": "yeni_değer",
      "explanation": "Neden bu değişiklik yapıldı"
    }
  ]
}

RENK ÖRNEKLERİ:
- "Mavi yap" → primaryColor: #2563eb
- "Kırmızı tonları" → primaryColor: #dc2626
- "Yeşil tema" → primaryColor: #16a34a
- "Turuncu vurgu" → accentColor: #f97316
- "Koyu tema" → templateId: dinamik

ÖNEMLİ:
- Türkçe yanıt ver
- Kurumsal ve profesyonel bir dil kullan
- Güncellemeler için JSON formatını kullan
- Sade konuşmalarda updates boş array olsun
- Renkler için hex format kullan (#RRGGBB)`;

async function callGeminiAPI(prompt: string): Promise<string> {
    // Try each model until one works
    for (const modelName of MODEL_NAMES) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    console.log(`Gemini API success with model: ${modelName}`);
                    return text;
                }
            } else {
                const errorData = await response.json();
                console.log(`Model ${modelName} failed:`, errorData.error?.message || response.status);
            }
        } catch (error) {
            console.log(`Model ${modelName} error:`, error);
        }
    }

    throw new Error("All Gemini models failed");
}

export async function processWebsiteChat(
    userMessage: string,
    currentContent: {
        heroTitle?: string;
        heroSubtitle?: string;
        aboutTitle?: string;
        aboutText?: string;
        contactPhone?: string;
        contactEmail?: string;
        contactAddress?: string;
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
        templateId?: string;
    }
): Promise<ChatResponse> {
    try {
        const fullPrompt = `${SYSTEM_PROMPT}

MEVCUT SİTE İÇERİĞİ:
📝 İçerik:
- Ana Başlık: ${currentContent.heroTitle || "(boş)"}
- Alt Başlık: ${currentContent.heroSubtitle || "(boş)"}
- Hakkımızda Başlık: ${currentContent.aboutTitle || "(boş)"}
- Hakkımızda Metin: ${currentContent.aboutText || "(boş)"}

📞 İletişim:
- Telefon: ${currentContent.contactPhone || "(boş)"}
- E-posta: ${currentContent.contactEmail || "(boş)"}
- Adres: ${currentContent.contactAddress || "(boş)"}

🎨 Tasarım:
- Ana Renk: ${currentContent.primaryColor || "#1e40af"}
- İkincil Renk: ${currentContent.secondaryColor || "#64748b"}
- Vurgu Rengi: ${currentContent.accentColor || "#f97316"}
- Şablon: ${currentContent.templateId || "kurumsal"}

KULLANICI MESAJI: ${userMessage}

Lütfen JSON formatında yanıt ver.`;

        const text = await callGeminiAPI(fullPrompt);

        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]) as ChatResponse;
                return {
                    message: parsed.message || "Anladım!",
                    updates: parsed.updates || [],
                };
            } catch {
                return {
                    message: text,
                    updates: [],
                };
            }
        }

        return {
            message: text,
            updates: [],
        };
    } catch (error) {
        console.error("Gemini API error:", error);
        return {
            message: "Bir hata oluştu. Lütfen tekrar deneyin.",
            updates: [],
        };
    }
}

export async function generateProfessionalText(
    casualText: string,
    context: string = "nakliyat firması"
): Promise<string> {
    try {
        const prompt = `Aşağıdaki günlük konuşma dilindeki metni, bir ${context} için profesyonel ve kurumsal bir dile çevir. Sadece çevrilmiş metni döndür, başka açıklama ekleme.

Orijinal metin: "${casualText}"`;

        return await callGeminiAPI(prompt);
    } catch (error) {
        console.error("Gemini text generation error:", error);
        return casualText;
    }
}
