import { AuthService } from "@/service/auth.service";
import { TokenManager, tokenType } from "./token";
import { User } from "./interface/user.interface";

export async function getSession(): Promise<User | null> {
  try {
    const token = await TokenManager.getToken(tokenType.ACCESS);
    if (!token) {
      return null;
    }
    const user = await AuthService.getInstance().getCurrentUser(token);
    const userData = user.data;
    return userData || null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}