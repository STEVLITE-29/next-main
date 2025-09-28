// app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoaderCircle, Repeat } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import GivvaIcon from "@/public/GivvaLogo.svg";
import { useAuthStore } from "@/store/authStore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  const { forgotPassword, resendOtp, error, isLoading } = useAuthStore();
  const router = useRouter();

  // Handle first request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("Reset code sent. Please check your email.");
      setLinkSent(true);

      // Navigate to verification step
      router.push("/verify-reset-code");
    } catch {
      toast.error("Failed to send reset code.");
      setLinkSent(false);
    }
  };

  // Handle resending reset code
  const handleResend = async () => {
    try {
      await resendOtp("password_reset");
      toast.success("Reset code resent to your email.");
    } catch {
      toast.error("Failed to resend reset code.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Logo */}
      <header className="py-4 flex justify-center md:justify-start">
        <Image src={GivvaIcon} alt="Givva Logo" className="w-28 ml-6" priority />
      </header>

      <main className="flex flex-col justify-center mx-auto w-[85%] md:w-[40%] mt-6 md:mt-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-1">Forgot your password?</h1>
          <p className="text-card-foreground text-sm mb-5 font-medium">
            Enter your email address and we’ll send you a reset code.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 px-2 md:px-4 text-sm"
        >
          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">
              Email
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2.5 bg-muted focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition">
              <input
                type="email"
                id="email"
                placeholder="e.g. example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground"
                required
                disabled={linkSent}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-destructive text-xs font-semibold">{error}</p>
          )}

          {/* Action buttons */}
          {!linkSent ? (
            <motion.button
              type="submit"
              className="mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm transition hover:bg-primary/90 flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin w-4 h-4" />
              ) : (
                "Send Reset Code"
              )}
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleResend}
              className="mt-4 border border-primary text-primary py-3 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 hover:bg-primary/10"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <Repeat className="w-4 h-4" />
                  Resend Code
                </>
              )}
            </motion.button>
          )}

          {/* Back to Login */}
          <motion.button
            type="button"
            onClick={() => router.push("/auth/signin")}
            className="mt-2 bg-muted text-primary py-3 rounded-lg font-semibold text-sm transition hover:bg-muted/80"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Back to Login
          </motion.button>
        </form>
      </main>
    </div>
  );
}
