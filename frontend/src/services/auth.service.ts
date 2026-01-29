import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
} from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data,
    );

    return response.data.data;
  },
};
