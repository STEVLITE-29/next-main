"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import GivvaLogo from "@/public/GivvaLogo.svg";

export default function VerifyEmail() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(true);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const { pendingEmail, error, isLoading, verifyEmail, resendOtp } =
    useAuthStore();

  // Redirect if no pending email
  useEffect(() => {
    if (!pendingEmail) router.push("/signup");
  }, [pendingEmail, router]);

  // Autofocus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCooldownActive && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    } else if (resendCooldown <= 0) {
      setIsCooldownActive(false);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, isCooldownActive]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newCode = Array(6)
      .fill("")
      .map((_, i) => pasted[i] || "");
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Submit verification
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified!");
      router.push("/email-verified");
    } catch {
      toast.error("Verification failed. Try again.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await resendOtp("email_verification");
      toast.success("Verification code resent!");
      setResendCooldown(60);
      setIsCooldownActive(true);
    } catch {
      toast.error("Failed to resend code");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header Logo */}
      <header className="py-4 mt-0 flex justify-center md:justify-start">
        <Image
          src={GivvaLogo}
          alt="Givva Logo"
          className="w-28 ml-6"
          priority
        />
      </header>

      {/* Main Content */}
      <main className="md:w-[45%] w-[80%] mx-auto mt-8 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Verify email address</h1>
          <p className="text-muted-foreground text-sm mb-2 font-medium">
            We’ve sent a 6-digit verification code to{" "}
            <strong className="text-foreground">{pendingEmail}</strong>
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            Not your email?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Change email address
            </Link>
          </p>
        </div>

        {/* Code Input Form */}
        <form
          onSubmit={handleSubmit}
          className="w-[76%] mt-8 flex flex-col items-center gap-6"
        >
          <div className="flex justify-center gap-4 w-full">
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
                className="min-w-12 aspect-square text-2xl text-center border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-semibold bg-card"
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 mt-2 rounded-md bg-destructive border border-red-200 px-3 py-2 text-sm text-foreground font-medium">
              <AlertTriangle className="w-4 h-4 text-foreground shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full py-3 rounded-xl text-sm transition disabled:opacity-70 mt-2 font-semibold ${
              code.every((digit) => digit !== "")
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
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

        {/* Resend */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground font-medium">
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
                  ? "text-muted-foreground cursor-not-allowed"
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
