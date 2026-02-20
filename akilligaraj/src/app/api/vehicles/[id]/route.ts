import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const [vehicle] = await db
            .select()
            .from(vehicles)
            .where(and(eq(vehicles.id, id), eq(vehicles.userId, session.user.id)));

        if (!vehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        if (body.name) updateData.name = body.name;
        if (body.plate) updateData.plate = body.plate.toUpperCase();
        if (body.vehicleType) updateData.vehicleType = body.vehicleType;
        if (body.brand !== undefined) updateData.brand = body.brand || null;
        if (body.model !== undefined) updateData.model = body.model || null;
        if (body.year !== undefined) updateData.year = body.year ? parseInt(body.year) : null;
        if (body.insuranceExpiryDate !== undefined) {
            updateData.insuranceExpiryDate = body.insuranceExpiryDate ? new Date(body.insuranceExpiryDate) : null;
        }
        if (body.inspectionExpiryDate !== undefined) {
            updateData.inspectionExpiryDate = body.inspectionExpiryDate ? new Date(body.inspectionExpiryDate) : null;
        }
        if (body.notes !== undefined) updateData.notes = body.notes || null;

        const [updatedVehicle] = await db
            .update(vehicles)
            .set(updateData)
            .where(and(eq(vehicles.id, id), eq(vehicles.userId, session.user.id)))
            .returning();

        if (!updatedVehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json(updatedVehicle);
    } catch (error) {
        console.error("Error updating vehicle:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const [deletedVehicle] = await db
            .delete(vehicles)
            .where(and(eq(vehicles.id, id), eq(vehicles.userId, session.user.id)))
            .returning();

        if (!deletedVehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
