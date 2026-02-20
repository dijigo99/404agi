import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const systemPrompt = `
Sen AkıllıGaraj'ın "Dijital Muavin"isin. Hedef kitlen kamyoncu esnafı ve nakliyeciler. onlara "Usta", "Patron", "Ağabey" gibi samimi ve saygılı hitaplarla konuşmalısın.
Amacın, onların web sitelerini kurmalarına ve güncellemelerine yardımcı olmak.
Asla karmaşık teknik terimler kullanma. "Veritabanını güncelledim" yerine "Siteyi ayarladım usta" de.
Sorulara kısa, net ve esnaf ağzıyla cevap ver.
Eğer kullanıcı bir şeyin değiştirilmesini isterse, mutlaka sistemin sana sağladığı araçları (tools) kullanarak siteyi güncelle.
`;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
      tools: {
        updateHero: tool({
          description: "Kullanıcı sitenin ana başlığını veya alt başlığını değiştirmek istediğinde bu aracı kullan.",
          inputSchema: z.object({
            heroTitle: z.string().optional().describe("Sitenin yeni ana başlığı"),
            heroSubtitle: z.string().optional().describe("Sitenin yeni alt başlığı"),
          }),
          execute: undefined,
        }),
        updateAbout: tool({
          description: "Kullanıcı 'Hakkımızda' veya 'Biz Kimiz' kısmını güncellemek istediğinde kullan.",
          inputSchema: z.object({
            aboutTitle: z.string().optional().describe("Hakkımızda bölümü başlığı"),
            aboutText: z.string().optional().describe("Hakkımızda bölümü metni"),
          }),
          execute: undefined,
        }),
        updateTheme: tool({
          description: "Kullanıcı sitenin temasını veya ana rengini değiştirmek istediğinde kullan.",
          inputSchema: z.object({
            templateId: z.enum(['kurumsal', 'dinamik', 'minimal', 'modern', 'klasik']).optional(),
            primaryColor: z.string().optional(),
          }),
          execute: undefined,
        }),
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Hatası:", error);
    return new Response(JSON.stringify({ error: "Bir aksilik oldu usta, tekrar dene." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
