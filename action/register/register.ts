"use server";

import { AuthService } from "@/service/auth.service";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const response = await AuthService.getInstance().register(username, name, email, password, confirmPassword);
  if (response.success) {
    redirect("/login");
  } else {
    console.error("Registration failed:", response.message);
  } 
}