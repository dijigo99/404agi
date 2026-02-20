"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Receipt, Plus, Search, MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string | null;
    customerName: string | null;
    total: string;
    status: "draft" | "sent" | "paid" | "cancelled";
    dueDate: string | null;
    createdAt: string;
}

const statusConfig = {
    draft: { label: "Taslak", color: "bg-gray-100 text-gray-700", icon: Clock },
    sent: { label: "Gönderildi", color: "bg-blue-100 text-blue-700", icon: Clock },
    paid: { label: "Ödendi", color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { label: "İptal", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await fetch("/api/invoices");
            if (response.ok) {
                const data = await response.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setInvoices(invoices.map((inv) =>
                    inv.id === id ? { ...inv, status: status as Invoice["status"] } : inv
                ));
            }
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu faturayı silmek istediğinize emin misiniz?")) return;

        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setInvoices(invoices.filter((inv) => inv.id !== id));
            }
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
        }).format(parseFloat(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Faturalarım</h1>
                    <p className="text-muted-foreground">Faturalarınızı oluşturun ve yönetin</p>
                </div>
                <Button asChild className="bg-accent hover:bg-accent/90">
                    <Link href="/dashboard/invoices/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Fatura
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Fatura no veya müşteri ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "draft", "sent", "paid", "cancelled"].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className="text-sm"
                        >
                            {status === "all" ? "Tümü" : statusConfig[status as keyof typeof statusConfig].label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Invoice List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredInvoices.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Receipt className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">
                            {searchQuery || statusFilter !== "all" ? "Fatura bulunamadı" : "Henüz fatura yok"}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            {searchQuery || statusFilter !== "all"
                                ? "Arama veya filtre kriterlerinizi değiştirin"
                                : "İlk faturanızı oluşturarak başlayın"}
                        </p>
                        {!searchQuery && statusFilter === "all" && (
                            <Button asChild>
                                <Link href="/dashboard/invoices/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Fatura Oluştur
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredInvoices.map((invoice) => {
                        const StatusIcon = statusConfig[invoice.status].icon;
                        return (
                            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                                <Receipt className="h-6 w-6 text-accent" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[invoice.status].color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusConfig[invoice.status].label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {invoice.customerName || "Müşteri belirtilmedi"} • {formatDate(invoice.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatCurrency(invoice.total)}</p>
                                                {invoice.dueDate && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Vade: {formatDate(invoice.dueDate)}
                                                    </p>
                                                )}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Görüntüle
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {invoice.status !== "paid" && (
                                                        <DropdownMenuItem onClick={() => updateStatus(invoice.id, "paid")}>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Ödendi İşaretle
                                                        </DropdownMenuItem>
                                                    )}
                                                    {invoice.status !== "cancelled" && (
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => updateStatus(invoice.id, "cancelled")}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            İptal Et
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
