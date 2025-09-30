// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

// Base API URL (Backend)
const API_URL = "https://ogivva-codebackend-production.up.railway.app";

// User role types
export type Role = "gifter" | "receiver" | "vendor" | null;

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Store state + actions
interface AuthState {
  // Onboarding
  selectedRole: Role | null;
  setRole: (role: Role) => void;
  clearOnboarding: () => void;

  // Session
  user: User | null;
  pendingEmail: string | null;
  sessionId: string | null;
  isLoading: boolean;

  // Error buckets
  signupError: string | null;
  loginError: string | null;
  verifyError: string | null;
  resetError: string | null;
  checkAuthError: string | null;
  signoutError: string | null;

  // Auth Actions
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendOtp: (type?: "email_verification" | "password_reset") => Promise<void>;

  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<string>;

  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  signout: () => Promise<void>;
}

// Zustand store with persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // -------------------- Onboarding --------------------
      selectedRole: null,
      setRole: (role) => set({ selectedRole: role }),
      clearOnboarding: () => set({ selectedRole: null }),

      // -------------------- Session --------------------
      user: null,
      pendingEmail: null,
      sessionId: null,
      isLoading: false,

      // -------------------- Errors --------------------
      signupError: null,
      loginError: null,
      verifyError: null,
      resetError: null,
      checkAuthError: null,
      signoutError: null,

      // -------------------- AUTH ROUTES --------------------

      // REGISTER
      signup: async (name, email, password, role) => {
        set({ isLoading: true, signupError: null, pendingEmail: email });
        try {
          const res = await axios.post<{ user?: User }>(
            `${API_URL}/v1/auth/register`,
            { name, email, password, role },
            { headers: { "Content-Type": "application/json" } }
          );
          if (res.data.user) set({ user: res.data.user, isLoading: false });
          else set({ isLoading: false });
        } catch (err) {
          let message = "Signup failed. Please try again.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ signupError: message, isLoading: false });
          throw new Error(message);
        }
      },

      // VERIFY EMAIL OTP
      verifyEmail: async (code: string) => {
        set({ isLoading: true, verifyError: null });
        try {
          const { pendingEmail } = get();
          if (!pendingEmail) throw new Error("No signup email found.");
          await axios.post(
            `${API_URL}/v1/auth/verify-otp`,
            { email: pendingEmail, code, type: "email_verification" },
            { headers: { "Content-Type": "application/json" } }
          );
          set({ isLoading: false });
        } catch (err) {
          let message = "Verification failed. Please try again.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ verifyError: message, isLoading: false });
          throw new Error(message);
        }
      },

      // RESEND OTP
      resendOtp: async (type: "email_verification" | "password_reset" = "email_verification") => {
        set({ isLoading: true, verifyError: null });
        try {
          const { pendingEmail } = get();
          if (!pendingEmail) throw new Error("No email found in session.");
          await axios.post(
            `${API_URL}/v1/auth/resend-otp`,
            { email: pendingEmail, type },
            { headers: { "Content-Type": "application/json" } }
          );
          set({ isLoading: false });
        } catch (err) {
          let message = "Failed to resend verification code.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ verifyError: message, isLoading: false });
          throw new Error(message);
        }
      },

      // -------------------- PASSWORD RESET --------------------

      forgotPassword: async (email: string) => {
        set({ isLoading: true, resetError: null, pendingEmail: email, sessionId: null });
        try {
          const res = await axios.post<{ sessionId: string }>(
            `${API_URL}/v1/auth/forgot-password`,
            { email },
            { headers: { "Content-Type": "application/json" } }
          );
          set({ sessionId: res.data.sessionId, isLoading: false });
        } catch (err) {
          let message = "Failed to send reset link.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ resetError: message, isLoading: false });
          throw new Error(message);
        }
      },

      verifyResetCode: async (code: string) => {
        set({ isLoading: true, resetError: null });
        try {
          const res = await axios.post<{ sessionId: string }>(
            `${API_URL}/v1/auth/verify-password-reset-otp`,
            { code },
            { headers: { "Content-Type": "application/json" } }
          );
          set({ isLoading: false, sessionId: res.data.sessionId });
        } catch (err) {
          let message = "Verification failed. Please try again.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ resetError: message, isLoading: false });
          throw new Error(message);
        }
      },

      resetPassword: async (newPassword: string) => {
        set({ isLoading: true, resetError: null });
        try {
          const { sessionId } = get();
          if (!sessionId) throw new Error("No reset session found.");
          const res = await axios.post<{ message: string }>(
            `${API_URL}/v1/auth/reset-password`,
            { sessionId, newPassword },
            { headers: { "Content-Type": "application/json" } }
          );
          set({ isLoading: false, sessionId: null, pendingEmail: null });
          return res.data.message || "Password reset successfully!";
        } catch (err) {
          let message = "Failed to reset password. Please try again.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ resetError: message, isLoading: false });
          throw new Error(message);
        }
      },

      // -------------------- LOGIN / SESSION --------------------

      login: async (email: string, password: string) => {
        set({ isLoading: true, loginError: null });
        try {
          const res = await axios.post<{ user: User; token: string }>(
            `${API_URL}/v1/auth/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
          );
          localStorage.setItem("jwt_token", res.data.token);
          set({ user: res.data.user, isLoading: false, pendingEmail: null });
        } catch (err) {
          let message = "Login failed. Please try again.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ loginError: message, isLoading: false });
          throw new Error(message);
        }
      },

      checkAuth: async () => {
        set({ isLoading: true, checkAuthError: null });
        try {
          const token = localStorage.getItem("jwt_token");
          if (!token) throw new Error("No token found.");
          const res = await axios.get<{ user: User }>(
            `${API_URL}/v1/auth/check-auth`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          set({ user: res.data.user, isLoading: false });
        } catch (err) {
          let message = "Not authenticated.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ user: null, checkAuthError: message, isLoading: false });
          throw new Error(message);
        }
      },

      signout: async () => {
        set({ isLoading: true, signoutError: null });
        try {
          const token = localStorage.getItem("jwt_token");
          if (!token) throw new Error("No token found.");
          await axios.post(
            `${API_URL}/v1/auth/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.removeItem("jwt_token");
          set({ user: null, pendingEmail: null, sessionId: null, isLoading: false });
        } catch (err) {
          let message = "Failed to sign out.";
          if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
          set({ signoutError: message, isLoading: false });
          throw new Error(message);
        }
      },
    }),
    {
      name: "ogivva-auth",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        user: state.user,
        pendingEmail: state.pendingEmail,
        sessionId: state.sessionId,
        selectedRole: state.selectedRole,
      }),
    }
  )
);
