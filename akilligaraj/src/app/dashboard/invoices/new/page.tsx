"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Customer {
    id: string;
    name: string;
}

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export default function NewInvoicePage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [customerId, setCustomerId] = useState<string>("");
    const [taxRate, setTaxRate] = useState(20);
    const [dueDate, setDueDate] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customers");
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const addItem = () => {
        setItems([
            ...items,
            { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 },
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value };
                    if (field === "quantity" || field === "unitPrice") {
                        updated.total = updated.quantity * updated.unitPrice;
                    }
                    return updated;
                }
                return item;
            })
        );
    };

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
        }).format(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.every((item) => !item.description)) {
            alert("En az bir kalem eklemelisiniz");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: customerId || null,
                    items: items.filter((item) => item.description),
                    subtotal,
                    taxRate,
                    taxAmount,
                    total,
                    dueDate: dueDate || null,
                    notes: notes || null,
                }),
            });

            if (response.ok) {
                router.push("/dashboard/invoices");
            } else {
                alert("Fatura oluşturulamadı");
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/invoices">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Fatura</h1>
                    <p className="text-muted-foreground">Fatura bilgilerini girin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Müşteri Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="customer">Müşteri</Label>
                                        <Select value={customerId} onValueChange={setCustomerId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Müşteri seçin (opsiyonel)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id}>
                                                        {customer.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            Müşteri yoksa{" "}
                                            <Link href="/dashboard/customers" className="text-accent hover:underline">
                                                buradan ekleyebilirsiniz
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Invoice Items */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Fatura Kalemleri</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Kalem Ekle
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                                        <div className="col-span-5">Açıklama</div>
                                        <div className="col-span-2">Miktar</div>
                                        <div className="col-span-2">Birim Fiyat</div>
                                        <div className="col-span-2">Toplam</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {/* Items */}
                                    {items.map((item, index) => (
                                        <div key={item.id} className="grid md:grid-cols-12 gap-4 items-start">
                                            <div className="md:col-span-5">
                                                <Label className="md:hidden mb-2 block">Açıklama</Label>
                                                <Input
                                                    placeholder="Hizmet veya ürün açıklaması"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="md:hidden mb-2 block">Miktar</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                                                    }
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="md:hidden mb-2 block">Birim Fiyat (₺)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unitPrice}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                                                    }
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex items-center h-10">
                                                <span className="font-medium">{formatCurrency(item.total)}</span>
                                            </div>
                                            <div className="md:col-span-1 flex items-center h-10">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={items.length === 1}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Özet</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ara Toplam</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm flex-1">KDV (%)</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                                        className="w-20 text-right"
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">KDV Tutarı</span>
                                    <span>{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between">
                                    <span className="font-semibold">Genel Toplam</span>
                                    <span className="text-xl font-bold text-accent">{formatCurrency(total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Diğer Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="dueDate">Vade Tarihi</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notlar</Label>
                                    <Input
                                        id="notes"
                                        placeholder="Ek notlar (opsiyonel)"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Button type="submit" className="w-full" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Kaydediliyor..." : "Faturayı Kaydet"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
