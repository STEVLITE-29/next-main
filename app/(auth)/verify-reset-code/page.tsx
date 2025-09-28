// app/auth/verify-code/page.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

import { useAuthStore } from "@/store/authStore";
import GivvaIcon from "@/public/GivvaLogo.svg";
import Link from "next/link";

export default function VerifyCode() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isCooldownActive, setIsCooldownActive] = useState(true);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const { pendingEmail, error, isLoading, verifyResetCode, resendOtp } =
    useAuthStore();

  const emailToShow = pendingEmail;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCooldownActive && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    } else if (resendCooldown === 0) {
      setIsCooldownActive(false);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, isCooldownActive]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newCode = Array(6).fill("").map((_, i) => pasted[i] || "");
    setCode(newCode);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyResetCode(verificationCode);
      sessionStorage.setItem("resetOtp", verificationCode);
      toast.success("Code verified!");
      router.push("/reset-password");
    } catch {
      toast.error("Verification failed. Try again.");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp("password_reset");
      toast.success("Code resent to your email.");
      setResendCooldown(60);
      setIsCooldownActive(true);
    } catch {
      toast.error("Failed to resend code.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header Logo */}
      <header className="py-4 flex justify-center md:justify-start">
        <Image src={GivvaIcon} alt="Givva Logo" className="w-28 ml-6" priority />
      </header>

      {/* Main Content */}
      <main className="md:w-[40%] w-[85%] mx-auto mt-10 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">
            We sent you a reset code
          </h1>
          <p className="text-card-foreground text-sm mb-2 font-medium">
            We’ve sent a password reset code to{" "}
            <strong className="text-foreground">{emailToShow}</strong>
          </p>
          <p className="text-card-foreground text-sm font-medium">
            Not your email?{" "}
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:underline font-medium"
            >
              Change email address
            </Link>
          </p>
        </div>

        {/* Code Input Form */}
        <form
          onSubmit={handleSubmit}
          className="w-[80%] mt-8 flex flex-col items-center gap-6"
        >
          {/* Inputs */}
          <div className="flex justify-center gap-3 w-full">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="min-w-12 aspect-square text-2xl text-center border rounded-lg border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 mt-2 rounded-md bg-destructive border border-red-200 px-3 py-2 text-sm text-foreground font-medium">
              <AlertTriangle className="w-4 h-4 text-foreground shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full py-3 rounded-lg text-sm font-semibold transition disabled:opacity-70 mt-2 ${
              code.every((digit) => digit !== "")
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-card-foreground"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading || !code.every((digit) => digit !== "")}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              "Verify Code"
            )}
          </motion.button>
        </form>

        {/* Resend + Cooldown */}
        <div className="text-center mt-6">
          <p className="text-xs text-card-foreground font-medium">
            You can resend a new code in{" "}
            <span className="font-semibold">
              {resendCooldown > 0
                ? `00:${resendCooldown.toString().padStart(2, "0")}`
                : "00:00"}
            </span>
          </p>
          <p className="text-sm font-medium mt-2">
            Didn’t get a code?{" "}
            <button
              type="button"
              className={`font-semibold ${
                isCooldownActive
                  ? "text-card-foreground cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
              onClick={handleResend}
              disabled={isCooldownActive}
            >
              Resend Code
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
