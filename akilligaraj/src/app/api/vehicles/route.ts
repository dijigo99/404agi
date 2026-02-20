import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const vehicleList = await db
            .select()
            .from(vehicles)
            .where(eq(vehicles.userId, session.user.id))
            .orderBy(desc(vehicles.createdAt));

        return NextResponse.json(vehicleList);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, plate, vehicleType, brand, model, year, insuranceExpiryDate, inspectionExpiryDate, notes } = body;

        if (!name || !plate || !vehicleType) {
            return NextResponse.json({ error: "Name, plate and vehicle type are required" }, { status: 400 });
        }

        const [newVehicle] = await db
            .insert(vehicles)
            .values({
                userId: session.user.id,
                name,
                plate: plate.toUpperCase(),
                vehicleType,
                brand: brand || null,
                model: model || null,
                year: year ? parseInt(year) : null,
                insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
                inspectionExpiryDate: inspectionExpiryDate ? new Date(inspectionExpiryDate) : null,
                notes: notes || null,
            })
            .returning();

        return NextResponse.json(newVehicle, { status: 201 });
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
