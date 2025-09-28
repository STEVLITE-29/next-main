"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import PasswordMeter from "../components/PasswordMeter";
import { useAuthStore } from "@/store/authStore";

import GivvaIcon from "@/public/GivvaLogo.svg";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const { isLoading, resetPassword, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      const message = await resetPassword(password);
      toast.success(message);
      router.push("/reset-successful");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header Logo */}
      <header className="py-4 flex justify-center md:justify-start">
        <Image
          src={GivvaIcon}
          alt="Givva Logo"
          className="w-28 ml-6"
          priority
        />
      </header>

      <main className="flex flex-col justify-center mx-auto w-[80%] md:w-[45%] mt-6 md:mt-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-1">Create new password</h1>
          <p className="text-card-foreground text-sm mb-5 font-medium">
            No worries – it happens to the best of us.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 text-sm flex-grow justify-center"
        >
          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-foreground"
            >
              Password
            </label>
            <div className="flex items-center border border-border bg-muted rounded-md px-3 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-background transition">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-sm font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground ml-1"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error / Password strength */}
          {error && (
            <div className="flex items-center gap-2 mt-2 rounded-md bg-destructive border border-red-200 px-3 py-2 text-sm text-foreground font-medium">
              <AlertTriangle className="w-4 h-4 text-foreground shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {localError && (
            <p className="text-destructive text-xs font-semibold">
              {localError}
            </p>
          )}
          {password.length > 0 && <PasswordMeter password={password} />}

          {/* Confirm Password */}
          <div className="flex flex-col mt-3">
            <label
              htmlFor="confirmPassword"
              className="mb-1 font-medium text-foreground"
            >
              Confirm Password
            </label>
            <div className="flex items-center border border-border bg-muted rounded-md px-3 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-background transition">
              <input
                type={showSecondPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="*************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-sm font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowSecondPassword(!showSecondPassword)}
                className="text-foreground ml-1"
              >
                {showSecondPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin mx-auto" size={24} />
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </main>
    </div>
  );
}
