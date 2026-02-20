"use client";

import { useState, useEffect } from "react";
import { Car, Plus, AlertTriangle, Calendar, MoreHorizontal, Pencil, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Vehicle {
    id: string;
    name: string;
    plate: string;
    vehicleType: string;
    brand: string | null;
    model: string | null;
    year: number | null;
    insuranceExpiryDate: string | null;
    inspectionExpiryDate: string | null;
    notes: string | null;
    createdAt: string;
}

const vehicleTypes = [
    { value: "truck", label: "Kamyon" },
    { value: "tir", label: "TIR" },
    { value: "pickup", label: "Kamyonet" },
    { value: "van", label: "Panelvan" },
    { value: "minibus", label: "Minibüs" },
    { value: "other", label: "Diğer" },
];

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        plate: "",
        vehicleType: "",
        brand: "",
        model: "",
        year: "",
        insuranceExpiryDate: "",
        inspectionExpiryDate: "",
        notes: "",
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch("/api/vehicles");
            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch("/api/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newVehicle = await response.json();
                setVehicles([newVehicle, ...vehicles]);
                setIsDialogOpen(false);
                setFormData({
                    name: "",
                    plate: "",
                    vehicleType: "",
                    brand: "",
                    model: "",
                    year: "",
                    insuranceExpiryDate: "",
                    inspectionExpiryDate: "",
                    notes: "",
                });
            }
        } catch (error) {
            console.error("Error creating vehicle:", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu aracı silmek istediğinize emin misiniz?")) return;

        try {
            const response = await fetch(`/api/vehicles/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setVehicles(vehicles.filter((v) => v.id !== id));
            }
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    const getDaysUntil = (dateString: string | null): number | null => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getExpiryStatus = (days: number | null): { color: string; label: string } | null => {
        if (days === null) return null;
        if (days < 0) return { color: "bg-red-100 text-red-700", label: "Süresi dolmuş!" };
        if (days <= 7) return { color: "bg-red-100 text-red-700", label: `${days} gün kaldı` };
        if (days <= 30) return { color: "bg-yellow-100 text-yellow-700", label: `${days} gün kaldı` };
        return { color: "bg-green-100 text-green-700", label: `${days} gün` };
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getVehicleTypeName = (type: string): string => {
        const found = vehicleTypes.find((v) => v.value === type);
        return found ? found.label : type;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Araçlarım</h1>
                    <p className="text-muted-foreground">Araç filonuzu yönetin</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent hover:bg-accent/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Yeni Araç
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Yeni Araç Ekle</DialogTitle>
                            <DialogDescription>
                                Araç bilgilerini girin. Yıldızlı alanlar zorunludur.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Araç Adı *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Örn: Beyaz TIR"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="plate">Plaka *</Label>
                                        <Input
                                            id="plate"
                                            value={formData.plate}
                                            onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                            placeholder="34 ABC 123"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="vehicleType">Araç Tipi *</Label>
                                    <Select
                                        value={formData.vehicleType}
                                        onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Araç tipi seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicleTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="brand">Marka</Label>
                                        <Input
                                            id="brand"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            placeholder="Mercedes"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input
                                            id="model"
                                            value={formData.model}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            placeholder="Actros"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="year">Yıl</Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            placeholder="2022"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="insuranceExpiryDate">Sigorta Bitiş</Label>
                                        <Input
                                            id="insuranceExpiryDate"
                                            type="date"
                                            value={formData.insuranceExpiryDate}
                                            onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="inspectionExpiryDate">Muayene Bitiş</Label>
                                        <Input
                                            id="inspectionExpiryDate"
                                            type="date"
                                            value={formData.inspectionExpiryDate}
                                            onChange={(e) => setFormData({ ...formData, inspectionExpiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    İptal
                                </Button>
                                <Button type="submit" disabled={formLoading}>
                                    {formLoading ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Vehicle List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            ) : vehicles.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Henüz araç yok</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            İlk aracınızı ekleyerek başlayın
                        </p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Araç Ekle
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {vehicles.map((vehicle) => {
                        const insuranceDays = getDaysUntil(vehicle.insuranceExpiryDate);
                        const inspectionDays = getDaysUntil(vehicle.inspectionExpiryDate);
                        const insuranceStatus = getExpiryStatus(insuranceDays);
                        const inspectionStatus = getExpiryStatus(inspectionDays);
                        const hasWarning = (insuranceDays !== null && insuranceDays <= 30) ||
                            (inspectionDays !== null && inspectionDays <= 30);

                        return (
                            <Card key={vehicle.id} className={`hover:shadow-md transition-shadow ${hasWarning ? "border-yellow-300" : ""}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`h-14 w-14 rounded-lg flex items-center justify-center flex-shrink-0 ${hasWarning ? "bg-yellow-100" : "bg-accent/10"}`}>
                                                {hasWarning ? (
                                                    <AlertTriangle className="h-7 w-7 text-yellow-600" />
                                                ) : (
                                                    <Car className="h-7 w-7 text-accent" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                                                <p className="text-sm font-mono font-semibold text-accent">{vehicle.plate}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {getVehicleTypeName(vehicle.vehicleType)}
                                                    {vehicle.brand && ` • ${vehicle.brand}`}
                                                    {vehicle.model && ` ${vehicle.model}`}
                                                    {vehicle.year && ` (${vehicle.year})`}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Düzenle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(vehicle.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Expiry Dates */}
                                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Sigorta</p>
                                                <p className="text-sm font-medium">
                                                    {formatDate(vehicle.insuranceExpiryDate)}
                                                </p>
                                                {insuranceStatus && (
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${insuranceStatus.color}`}>
                                                        {insuranceStatus.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Muayene</p>
                                                <p className="text-sm font-medium">
                                                    {formatDate(vehicle.inspectionExpiryDate)}
                                                </p>
                                                {inspectionStatus && (
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${inspectionStatus.color}`}>
                                                        {inspectionStatus.label}
                                                    </span>
                                                )}
                                            </div>
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
