# PROJE MASTER PLANI: AKILLIGARAJ.COM

> **Vizyon:** Türkiye'deki nakliyecilerin ve kamyoncuların dijital operasyonlarını (Web sitesi, maliyet hesabı, teklif verme) tek bir merkezden yönetmelerini sağlayan, yapay zeka destekli SaaS platformu.
nakliyeci müşteriye nakliye faturası da kesebilecek sistemde.
nakliyeci sosyal medya hesaplarını, seo yu da panelden yönetebilmeli. google işletmeyi de. istediğin apileri vereceğim
tasarım modern ve süper olacak. skills kullanabilirsin.
## 1. TEKNİK STACK VE ALTYAPI
- **Framework:** Next.js 14+ (App Router)
- **Dil:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI (Hızlı ve tutarlı komponentler için)
- **Deployment:** Vercel
- **Database:** Neon (Serverless Postgres)
- **ORM:** Drizzle veya Prisma (Tercihen Drizzle - daha hafif)
- **Auth:** NextAuth (veya Clerk) - Google ve Telefon Girişi öncelikli.
- **AI Entegrasyonu:** Gemini API (İçerik üretimi için)

---

## 2. TASARIM DİLİ VE UI/UX PRENSİPLERİ (The "Esnaf" UI)

Hedef kitlemiz teknolojiyle arası mesafeli olan kamyon şoförleri ve nakliyecilerdir. Arayüz "Instagram kadar basit, banka kadar güvenilir" olmalıdır.

### Renk Paleti (Güven ve Dikkat)
*   **Ana Renk (Primary - IBM Blue):** `#0F172A` (Slate 900) - Güven, kurumsallık ve ciddiyet [1].
*   **Aksiyon Rengi (Accent - Safety Orange):** `#F97316` (Orange 500) - "Hemen Yap", "Hesapla" butonları için. Şantiyelerde ve yollarda kullanılan uyarı rengidir, dikkat çeker [2].
*   **Arkaplan:** `#F8FAFC` (Slate 50) - Göz yormayan, temiz beyaz.
*   **Başarı/Kazanç Rengi:** `#16A34A` (Green 600) - "Kâr", "Onay" durumları için.

### Tipografi ve Düzen
*   **Font:** 'Inter' veya 'Roboto'. Okunaklı, geniş, sans-serif.
*   **Boyutlar:** Mobilde başlıklar en az `24px`, metinler `16px`. Asla `12px` gibi küçük yazılar kullanılmamalı.
*   **Butonlar:** Ekran genişliğini kaplayan (Full width), baş parmakla kolay tıklanabilir büyük butonlar (Min height: 48px).

### UI Kütüphanesi ve Bileşen Standartları
*   **Kütüphane:** Shadcn/UI (Radix Primitives) kullanılacak. Bu kütüphane, temiz, erişilebilir ve modern bir görünüm sağlar.
*   **Styling:** Tailwind CSS kullanılacak.
*   **İkon Seti:** Lucide React (Basit, keskin hatlı ikonlar. Nakliyeciler için net anlaşılır).

### "Temiz Tasarım" Kuralları (Clean Design Rules)
1.  **Beyaz Boşluk (Whitespace):** Elemanlar dip dibe olmamalı. Bölümler (Section) arasında mobilde en az `py-8`, masaüstünde `py-16` boşluk bırakılmalı.
2.  **Kart Yapısı (Card Design):** İçerikler, beyaz arkaplanlı, hafif gölgeli (`shadow-sm`) ve yuvarlatılmış köşeli (`rounded-xl`) kartlar içinde sunulmalı. Bu, karmaşayı önler ve "düzen" hissi verir (E-Myth Prensibi).
3.  **Input Alanları:** Nakliyecilerin parmakları geniş olabilir. Tüm input alanları ve butonlar mobilde en az `h-12` (48px) yüksekliğinde olmalı.
4.  **Görsel Hiyerarşi:** Sayfada asla iki tane "Primary Button" (Turuncu) yan yana olmamalı. Ana eylem Turuncu, ikincil eylemler (Vazgeç, Detaylar) gri veya çerçeveli (outline) olmalı.

### Renk Kodları (Kesin)
*   **Primary (Güven):** `bg-slate-900` (Koyu Lacivert) -> Header ve Footer için.
*   **Action (Harekete Geçirici):** `bg-orange-600` hover: `bg-orange-700` -> "Hesapla", "Üye Ol" butonları için.
*   **Background:** `bg-slate-50` (Tam beyaz değil, göz yormayan kırık beyaz).
*   **Text:** Başlıklar `text-slate-900`, paragraflar `text-slate-600`. Asla simsiyah (`#000`) kullanma, sert durur.
---

## 3. SAYFA YAPISI VE ÖZELLİKLER

Sistem klasik bir "Landing Page -> Login -> Dashboard" yapısı yerine, **"Tool -> Value -> Signup"** (Araç -> Değer -> Kayıt) akışını izleyecektir [3].

### A. Ana Sayfa (Public - The Hook)
Kullanıcı `akilligaraj.com`'a girdiğinde "Biz Kimiz" yazısı görmeyecek. Doğrudan işine yarayan aracı görecek.

**1. Hero Bölümü (Hesaplayıcı):**
*   **Başlık:** "Bu Seferden Zarar Mı Edeceksin, Kâr Mı?"
*   **Alt Başlık:** "Mazot, köprü, lastik... 10 saniyede gerçek maliyetini gör, paran cebinde kalsın."
*   **İnteraktif Araç (Lead Magnet):**
    *   *Input 1:* Nereden? (İl/İlçe seçimi)
    *   *Input 2:* Nereye? (İl/İlçe seçimi)
    *   *Input 3:* Araç Tipi (Tır, Kırkayak, Kamyonet - Görsel İkonlu Seçim)
    *   **Dev Buton:** "MALİYETİ HESAPLA"

**2. Sonuç Ekranı (The "Gap"):**
*   Hesapla denince tahmini bir özet gösterilir (Örn: "Tahmini Yakıt: 8.500 TL").
*   **Blur Efekti:** Detaylı döküm (Amortisman, Köprü ücretleri, Net Kâr) flu gösterilir.
*   **Call to Action (Kayıt):** "Detaylı dökümü görmek ve bu seferi kaydetmek için ÜCRETSİZ devam et."

**3. Sosyal Kanıt ve Fayda (Aşağıda):**
*   "350+ Nakliyeci şu an bu sistemi kullanıyor."
*   3 Temel Fayda Kartı:
    *   🚛 **Web Siten Hazır:** "Tek tıkla `firmaadi.akilligaraj.com` senin olsun."
    *   📄 **Teklif Ver:** "Müşterine saniyeler içinde PDF teklif at."
    *   💰 **Hesabını Bil:** "Ay sonunda ne kazandığını gör."

### B. Onboarding (Üye Olma Süreci)
Kullanıcıyı en kısa yoldan içeri almalıyız.
*   **Yöntem:** Sadece Telefon Numarası veya Google ile Giriş.
*   **Sihirbaz (Wizard):** Kayıt sonrası 3 basit soru sorarak profili ve **otomatik web sitesini** oluştur:
    1.  "Firma Adın ne?" (Örn: Yıldırım Nakliyat) -> *Sistem anında subdomain oluşturur.*
    2.  "Hangi şehirde çalışıyorsun?"
    3.  "Telefon numaran bu mu?" (WhatsApp butonu için).
*   **Sonuç:** "Tebrikler usta! Web siten hazır: `yildirim.akilligaraj.com`. İlk seferini de kaydettik."

### C. Kullanıcı Paneli (Dashboard - The "Cockpit")
Panel, bir yazılım yönetim ekranı gibi değil, bir aracın ön konsolu gibi durmalıdır.

**1. Üst Bar (Header):**
*   Kullanıcı Adı / Firma Adı.
*   **Büyük Buton:** "Web Sitemi Gör" (Kendi oluşturulan subdomainine link).

**2. Ana Kartlar (Grid Yapısı):**
*   **Kart 1: Hızlı İşlemler:**
    *   [Yeni Sefer Ekle]
    *   [Teklif Oluştur]
    *   [Kartvizitimi Paylaş] (WhatsApp story görseli üretir).
*   **Kart 2: Durum Özeti (Finans):**
    *   Bu Ay Toplam Sefer: 5
    *   Tahmini Ciro / Tahmini Gider (Basit bar grafik).
*   **Kart 3: Web Sitesi Yönetimi (SaaS Core):**
    *   Basit ayarlar: "Hakkımda yazısını değiştir", "Araç fotoğrafı yükle".
    *   *AI Özelliği:* "Yüklediğim fotoğrafı anlat" (Kamyoncu foto yükler, AI "İstanbul-Ankara arası parsiyel yükleme tamamlanmıştır" diye caption yazar).

---

## 4. VERİTABANI ŞEMASI (ÖZET - NEON/POSTGRES)

*   **Users:** (id, name, phone, email, role[free, pro], created_at)
*   **Companies:** (id, user_id, company_name, subdomain, city, bio, logo_url) -> *Wildcard subdomain buraya bakacak.*
*   **Trips (Seferler):** (id, user_id, from_loc, to_loc, distance_km, fuel_cost, toll_cost, price, date)
*   **Offers (Teklifler):** (id, user_id, customer_name, details, price, status, generated_pdf_url)

---

## 5. GELİŞTİRME FAZLARI

### Faz 1: MVP (Şu an yapacağımız)
*   Landing Page (Hesaplayıcı dahil).
*   Auth (Giriş/Kayıt).
*   Otomatik Subdomain Sistemi (Kullanıcı kaydolunca `user.akilligaraj.com` açılması).
*   Basit Dashboard (Sadece siteyi düzenleme ve hesaplayıcı geçmişi).

### Faz 2: Monetization (Sonraki adım)
*   Ödeme entegrasyonu (Iyzico/Stripe).
*   Özel Domain bağlama.
*   Gelişmiş Teklif Modülü.

---

## ANTIGRAVITY İÇİN NOTLAR (Prompt Instructions)
*   **Kodlama Stili:** Clean code, modüler komponentler.
*   **Mobil Uyumluluk:** Her şeyi önce mobil (375px genişlik) için tasarla, sonra masaüstüne genişlet.
*   **Hız:** Next.js Image optimizasyonlarını ve Server Components'i agresif kullan. Hedef kitle genellikle 4G/3G ile bağlanacak.
*   **Hata Yönetimi:** Hata mesajları teknik olmamalı. "500 Server Error" yerine "Bir aksilik oldu usta, sayfayı yenile" yazmalı.