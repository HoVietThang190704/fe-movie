import { NextResponse, type NextRequest } from "next/server";
import { TokenManager, tokenType } from "./lib/token";
import jwt from "jsonwebtoken";

export async function proxy(request: NextRequest) {
  const token = await TokenManager.getToken(tokenType.ACCESS);
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  if (!verified) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
    matcher: "/",
};