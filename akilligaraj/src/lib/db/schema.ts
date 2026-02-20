import { pgTable, text, timestamp, uuid, varchar, integer, decimal, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// Kullanıcılar tablosu - NextAuth uyumlu
export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    phone: varchar("phone", { length: 20 }),
    role: varchar("role", { length: 20 }).default("free").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// NextAuth için accounts tablosu
export const accounts = pgTable("account", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

// NextAuth için sessions tablosu
export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

// NextAuth için verification tokens
export const verificationTokens = pgTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (verificationToken) => [
    primaryKey({ columns: [verificationToken.identifier, verificationToken.token] }),
]);

// Firmalar tablosu
export const companies = pgTable("companies", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    subdomain: varchar("subdomain", { length: 100 }).unique().notNull(),
    city: varchar("city", { length: 100 }),
    district: varchar("district", { length: 100 }),
    bio: text("bio"),
    logoUrl: text("logo_url"),
    phone: varchar("phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    email: varchar("email", { length: 255 }),
    address: text("address"),
    // NES Bilgi API bilgileri
    nesApiKey: text("nes_api_key"),
    nesVkn: varchar("nes_vkn", { length: 11 }),
    nesSenderAlias: text("nes_sender_alias"), // urn:mail:xxx@nes.com.tr
    nesMailboxAlias: text("nes_mailbox_alias"), // urn:mail:xxx@nes.com.tr
    nesTaxOffice: varchar("nes_tax_office", { length: 100 }), // Vergi dairesi
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Seferler tablosu
export const trips = pgTable("trips", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    fromLocation: varchar("from_location", { length: 255 }).notNull(),
    toLocation: varchar("to_location", { length: 255 }).notNull(),
    distanceKm: integer("distance_km").notNull(),
    vehicleType: varchar("vehicle_type", { length: 50 }).notNull(),
    fuelCost: decimal("fuel_cost", { precision: 10, scale: 2 }),
    tollCost: decimal("toll_cost", { precision: 10, scale: 2 }),
    maintenanceCost: decimal("maintenance_cost", { precision: 10, scale: 2 }),
    driverCost: decimal("driver_cost", { precision: 10, scale: 2 }),
    totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    profit: decimal("profit", { precision: 10, scale: 2 }),
    date: timestamp("date").defaultNow().notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Teklifler tablosu
export const offers = pgTable("offers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }),
    customerEmail: varchar("customer_email", { length: 255 }),
    fromLocation: varchar("from_location", { length: 255 }).notNull(),
    toLocation: varchar("to_location", { length: 255 }).notNull(),
    details: text("details"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    pdfUrl: text("pdf_url"),
    validUntil: timestamp("valid_until"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Araçlar tablosu
export const vehicles = pgTable("vehicles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    plate: varchar("plate", { length: 20 }).notNull(),
    vehicleType: varchar("vehicle_type", { length: 50 }).notNull(),
    brand: varchar("brand", { length: 100 }),
    model: varchar("model", { length: 100 }),
    year: integer("year"),
    insuranceExpiryDate: timestamp("insurance_expiry_date"),
    inspectionExpiryDate: timestamp("inspection_expiry_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Müşteriler tablosu
export const customers = pgTable("customers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    taxNumber: varchar("tax_number", { length: 20 }),
    taxOffice: varchar("tax_office", { length: 100 }),
    address: text("address"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Faturalar tablosu
export const invoices = pgTable("invoices", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    offerId: uuid("offer_id").references(() => offers.id, { onDelete: "set null" }),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    items: text("items").notNull(), // JSON string for invoice items
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    taxRate: integer("tax_rate").default(18).notNull(), // KDV oranı (%) - varsayılan %18
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, sent, paid, cancelled
    dueDate: timestamp("due_date"),
    paidAt: timestamp("paid_at"),
    notes: text("notes"),
    // NES Bilgi e-Fatura bilgileri
    nesUuid: uuid("nes_uuid"), // NES'ten dönen fatura UUID'si
    invoiceType: varchar("invoice_type", { length: 20 }).default("earchive"), // earchive veya einvoice
    gibStatus: varchar("gib_status", { length: 30 }).default("draft"), // draft, processing, approved, rejected, cancelled
    nesDocumentNumber: varchar("nes_document_number", { length: 50 }), // GİB fatura numarası
    nesPdfUrl: text("nes_pdf_url"), // NES'ten alınan PDF URL'si
    nesSentAt: timestamp("nes_sent_at"), // NES'e gönderilme tarihi
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Web siteleri tablosu
export const websites = pgTable("websites", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subdomain: varchar("subdomain", { length: 100 }).unique().notNull(),
    customDomain: varchar("custom_domain", { length: 255 }).unique(),
    templateId: varchar("template_id", { length: 50 }).default("kurumsal").notNull(), // kurumsal, dinamik, minimal
    // Renkler
    primaryColor: varchar("primary_color", { length: 20 }).default("#1e40af"),
    secondaryColor: varchar("secondary_color", { length: 20 }).default("#64748b"),
    accentColor: varchar("accent_color", { length: 20 }).default("#f97316"),
    // İçerik (JSON)
    heroTitle: varchar("hero_title", { length: 255 }),
    heroSubtitle: text("hero_subtitle"),
    aboutTitle: varchar("about_title", { length: 255 }),
    aboutText: text("about_text"),
    services: text("services"), // JSON array
    contactPhone: varchar("contact_phone", { length: 20 }),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactAddress: text("contact_address"),
    // Görseller
    logoUrl: text("logo_url"),
    faviconUrl: text("favicon_url"),
    heroImageUrl: text("hero_image_url"),
    // Meta
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    // Durum
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// İlişkiler
export const usersRelations = relations(users, ({ many, one }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    company: one(companies),
    trips: many(trips),
    offers: many(offers),
    vehicles: many(vehicles),
    customers: many(customers),
    invoices: many(invoices),
    website: one(websites),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const companiesRelations = relations(companies, ({ one }) => ({
    user: one(users, {
        fields: [companies.userId],
        references: [users.id],
    }),
}));

export const tripsRelations = relations(trips, ({ one }) => ({
    user: one(users, {
        fields: [trips.userId],
        references: [users.id],
    }),
}));

export const offersRelations = relations(offers, ({ one, many }) => ({
    user: one(users, {
        fields: [offers.userId],
        references: [users.id],
    }),
    invoices: many(invoices),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
    user: one(users, {
        fields: [vehicles.userId],
        references: [users.id],
    }),
}));

export const websitesRelations = relations(websites, ({ one }) => ({
    user: one(users, {
        fields: [websites.userId],
        references: [users.id],
    }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
    user: one(users, {
        fields: [invoices.userId],
        references: [users.id],
    }),
    customer: one(customers, {
        fields: [invoices.customerId],
        references: [customers.id],
    }),
    offer: one(offers, {
        fields: [invoices.offerId],
        references: [offers.id],
    }),
}));
