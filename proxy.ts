import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const cookies = request.cookies.get("token");
    if (!cookies) {
        console.log("No token found in cookies");
    }
}

export const config = {
    matcher: "/",
};