"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, CheckCircle, XCircle, Clock, Download, Send, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    customerTaxNumber: string | null;
    customerTaxOffice: string | null;
    customerAddress: string | null;
    items: InvoiceItem[];
    subtotal: string;
    taxRate: number;
    taxAmount: string;
    total: string;
    status: "draft" | "sent" | "paid" | "cancelled";
    dueDate: string | null;
    paidAt: string | null;
    notes: string | null;
    createdAt: string;
    // NES fields
    nesUuid: string | null;
    invoiceType: string | null;
    gibStatus: string | null;
    nesDocumentNumber: string | null;
    nesSentAt: string | null;
}

const statusConfig = {
    draft: { label: "Taslak", color: "bg-gray-100 text-gray-700", icon: Clock },
    sent: { label: "Gönderildi", color: "bg-blue-100 text-blue-700", icon: Clock },
    paid: { label: "Ödendi", color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { label: "İptal", color: "bg-red-100 text-red-700", icon: XCircle },
};

const gibStatusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: "Taslak", color: "bg-gray-100 text-gray-700" },
    processing: { label: "İşleniyor", color: "bg-yellow-100 text-yellow-700" },
    approved: { label: "GİB Onaylı", color: "bg-green-100 text-green-700" },
    rejected: { label: "Reddedildi", color: "bg-red-100 text-red-700" },
    cancelled: { label: "İptal", color: "bg-red-100 text-red-700" },
    waiting: { label: "Beklemede", color: "bg-orange-100 text-orange-700" },
};

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [sendingNes, setSendingNes] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            const response = await fetch(`/api/invoices/${id}`);
            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            }
        } catch (error) {
            console.error("Error fetching invoice:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: string) => {
        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok && invoice) {
                setInvoice({ ...invoice, status: status as Invoice["status"] });
            }
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };

    const sendToNes = async (invoiceType: "earchive" | "einvoice") => {
        if (!invoice) return;

        setSendingNes(true);
        try {
            const response = await fetch("/api/invoices/nes/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoiceId: invoice.id, invoiceType }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Fatura başarıyla gönderildi!\nBelge No: ${data.documentNumber || data.nesUuid}`);
                fetchInvoice(); // Refresh invoice data
            } else {
                alert(`Hata: ${data.error}\n${data.suggestion === 'earchive' ? 'Önerilen: e-Arşiv fatura kullanın.' : ''}`);
            }
        } catch (error) {
            console.error("NES gönderme hatası:", error);
            alert("Fatura gönderilirken bir hata oluştu.");
        } finally {
            setSendingNes(false);
        }
    };

    const checkNesStatus = async () => {
        if (!invoice) return;

        setCheckingStatus(true);
        try {
            const response = await fetch(`/api/invoices/nes/status?invoiceId=${invoice.id}`);
            const data = await response.json();

            if (response.ok) {
                setInvoice({
                    ...invoice,
                    gibStatus: data.gibStatus,
                    nesDocumentNumber: data.documentNumber || invoice.nesDocumentNumber,
                });
            } else {
                alert(`Durum kontrol hatası: ${data.error}`);
            }
        } catch (error) {
            console.error("Durum kontrol hatası:", error);
        } finally {
            setCheckingStatus(false);
        }
    };

    const downloadNesPdf = async () => {
        if (!invoice?.nesUuid) return;

        try {
            const response = await fetch(`/api/invoices/nes/pdf?invoiceId=${invoice.id}`);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${invoice.invoiceNumber}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const data = await response.json();
                alert(`PDF indirme hatası: ${data.error}`);
            }
        } catch (error) {
            console.error("PDF indirme hatası:", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
        }).format(parseFloat(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <p className="text-muted-foreground mb-4">Fatura bulunamadı</p>
                <Button asChild>
                    <Link href="/dashboard/invoices">Faturalara Dön</Link>
                </Button>
            </div>
        );
    }

    const StatusIcon = statusConfig[invoice.status].icon;
    const gibStatus = gibStatusConfig[invoice.gibStatus || "draft"];

    return (
        <div className="space-y-6">
            {/* Header - hide on print */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/invoices">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[invoice.status].color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig[invoice.status].label}
                            </span>
                            {invoice.nesUuid && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${gibStatus.color}`}>
                                    <FileText className="h-3 w-3" />
                                    {gibStatus.label}
                                </span>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            {formatDate(invoice.createdAt)}
                            {invoice.nesDocumentNumber && (
                                <span className="ml-2 text-xs">
                                    (GİB No: {invoice.nesDocumentNumber})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* NES Actions */}
                    {!invoice.nesUuid ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={sendingNes} className="bg-blue-600 hover:bg-blue-700">
                                    {sendingNes ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            e-Fatura Kes
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => sendToNes("earchive")}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    e-Arşiv Fatura
                                    <span className="ml-2 text-xs text-muted-foreground">(Bireysel)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => sendToNes("einvoice")}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    e-Fatura
                                    <span className="ml-2 text-xs text-muted-foreground">(Kurumsal)</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button variant="outline" onClick={checkNesStatus} disabled={checkingStatus}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${checkingStatus ? 'animate-spin' : ''}`} />
                                Durum Güncelle
                            </Button>
                            <Button variant="outline" onClick={downloadNesPdf}>
                                <Download className="h-4 w-4 mr-2" />
                                PDF İndir
                            </Button>
                        </>
                    )}

                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Yazdır
                    </Button>
                    {invoice.status !== "paid" && (
                        <Button onClick={() => updateStatus("paid")} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Ödendi İşaretle
                        </Button>
                    )}
                </div>
            </div>

            {/* NES Info Alert */}
            {invoice.nesUuid && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                            <p className="font-medium text-blue-800">
                                {invoice.invoiceType === "einvoice" ? "e-Fatura" : "e-Arşiv Fatura"} Gönderildi
                            </p>
                            <p className="text-sm text-blue-600">
                                NES UUID: {invoice.nesUuid}
                                {invoice.nesSentAt && (
                                    <span className="ml-2">• Gönderim: {formatDate(invoice.nesSentAt)}</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Document */}
            <Card className="print:shadow-none print:border-0">
                <CardContent className="p-6 md:p-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-accent mb-2">AkıllıGaraj</h2>
                            <p className="text-sm text-muted-foreground">Nakliyat Yönetim Sistemi</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-4xl font-bold text-muted-foreground/20">FATURA</h3>
                            <p className="font-semibold text-lg">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">
                                Tarih: {formatDate(invoice.createdAt)}
                            </p>
                            {invoice.dueDate && (
                                <p className="text-sm text-muted-foreground">
                                    Vade: {formatDate(invoice.dueDate)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    {invoice.customerName && (
                        <div className="mb-10 p-4 bg-muted/50 rounded-lg">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Müşteri Bilgileri</h4>
                            <p className="font-semibold text-lg">{invoice.customerName}</p>
                            {invoice.customerTaxNumber && (
                                <p className="text-sm text-muted-foreground">
                                    V.D: {invoice.customerTaxOffice} / VKN: {invoice.customerTaxNumber}
                                </p>
                            )}
                            {invoice.customerPhone && (
                                <p className="text-sm text-muted-foreground">Tel: {invoice.customerPhone}</p>
                            )}
                            {invoice.customerAddress && (
                                <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
                            )}
                        </div>
                    )}

                    {/* Items Table */}
                    <div className="mb-10">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left py-3 px-2 font-semibold">Açıklama</th>
                                    <th className="text-center py-3 px-2 font-semibold w-24">Miktar</th>
                                    <th className="text-right py-3 px-2 font-semibold w-32">Birim Fiyat</th>
                                    <th className="text-right py-3 px-2 font-semibold w-32">Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index} className="border-b border-border">
                                        <td className="py-3 px-2">{item.description}</td>
                                        <td className="py-3 px-2 text-center">{item.quantity}</td>
                                        <td className="py-3 px-2 text-right">{formatCurrency(item.unitPrice.toString())}</td>
                                        <td className="py-3 px-2 text-right font-medium">{formatCurrency(item.total.toString())}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Ara Toplam</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">KDV (%{invoice.taxRate})</span>
                                <span>{formatCurrency(invoice.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between py-3 border-t-2 border-border">
                                <span className="font-bold text-lg">Genel Toplam</span>
                                <span className="font-bold text-xl text-accent">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mt-10 pt-6 border-t border-border">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Notlar</h4>
                            <p className="text-sm">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Payment Status */}
                    {invoice.status === "paid" && invoice.paidAt && (
                        <div className="mt-10 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="font-semibold text-green-700">Bu fatura ödenmiştir</p>
                            <p className="text-sm text-green-600">Ödeme tarihi: {formatDate(invoice.paidAt)}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

