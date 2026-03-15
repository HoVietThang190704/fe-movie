import { BaseResponse } from "@/lib/interface/baseresponse";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";

type LoginResponse = {
  token: string;
};

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(
    email: string,
    password: string,
  ): Promise<BaseResponse<LoginResponse>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.AUTH)
        .addParam("login")
        .build();

      const resonse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      return await resonse.json();
    } catch (error) {
      console.error("Error during login:", error);
      return {
        message: "Login failed",
        success: false,
      };
    }
  }

  async register (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<BaseResponse<null>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.AUTH)
        .addParam("register")
        .build();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        message: "Registration failed",
        success: false,
      };
    }
  }
}
