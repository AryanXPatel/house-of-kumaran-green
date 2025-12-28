/**
 * Admin Logout API Endpoint
 * POST /api/admin/logout
 * 
 * Clears the admin session cookie
 */

import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin-auth";

export async function POST() {
    try {
        await clearAdminSession();

        return NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Admin logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
