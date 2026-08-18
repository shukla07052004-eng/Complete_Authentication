import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/ApiResponse";

export function apiResponse(data: ApiResponse) {
    return NextResponse.json<ApiResponse>(data);
}