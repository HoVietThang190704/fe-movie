"use server";

import { AuthService } from "@/service/auth.service";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const response = await AuthService.getInstance().login(email, password);
  console.log("Login response:", response);
}