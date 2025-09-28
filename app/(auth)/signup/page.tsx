"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordMeter from "../components/PasswordMeter";
import { useAuthStore } from "@/store/authStore";

import GivvaLogo from "@/public/GivvaLogo.svg";
import FacebookIcon from "@/public/Facebook.svg";
import GoogleIcon from "@/public/Google.svg";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { signup, error, isLoading, selectedRole } = useAuthStore();
  const router = useRouter();

  // Redirect if no role is selected
  useEffect(() => {
    if (!selectedRole) {
      router.replace("/onboarding");
    }
  }, [selectedRole, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      await signup(name, email, password, selectedRole);
      if (!useAuthStore.getState().error) {
        router.push("/verify-email");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedRole) {
    return null; // Don’t render until role is set
  }

  return (
    <div className="flex flex-col bg-background justify-center">
      {/* Header */}
      <header className="py-4 flex justify-center md:justify-start">
        <Image src={GivvaLogo} alt="Givva Logo" className="w-28 ml-6" />
      </header>

      {/* Main Content */}
      <main className="md:w-[45%] md:mt-10 w-[80%] flex flex-col justify-center mx-auto mt-2 text-foreground">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Create an account with Ogivva
          </h1>
          <p className="text-muted-foreground text-sm mb-5 font-medium">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignUp}
          className="flex flex-col gap-2 text-xs flex-grow justify-center text-foreground"
        >
          {/* Name Input */}
          <div className="flex flex-col text-xs">
            <label htmlFor="name" className="mb-1 font-medium text-foreground">
              Name
            </label>
            <div
              className={`flex items-center border border-border bg-input rounded-md px-3 py-3 
                        focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 focus-within:bg-background transition`}
            >
              <input
                type="text"
                id="name"
                placeholder="e.g Bon Jovi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-sm font-medium text-foreground"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col text-xs">
            <label htmlFor="email" className="mb-1 font-medium text-foreground">
              Email
            </label>
            <div
              className={`flex items-center border border-border bg-input rounded-md px-3 py-3 
                        focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 focus-within:bg-background transition`}
            >
              <input
                type="email"
                id="email"
                placeholder="e.g example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-sm font-medium text-foreground"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col text-xs">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-foreground"
            >
              Password
            </label>
            <div
              className={`flex items-center border border-border bg-input rounded-md px-3 py-3 
                        focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 focus-within:bg-background transition`}
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-sm font-medium text-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground ml-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            <p className="text-destructive text-xs font-semibold mt-[2px]">
              {error}
            </p>
          )}
          {password.length > 0 && <PasswordMeter password={password} />}

          {/* Terms */}
          <div className="flex items-center gap-2 text-xs mt-1.5">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 accent-primary rounded-sm"
              required
            />
            <label
              htmlFor="terms"
              className="text-muted-foreground leading-snug font-medium"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="mt-2 bg-primary text-primary-foreground py-3 rounded-[12px] font-medium text-sm transition"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin mx-auto" size={24} />
            ) : (
              "Create an Account"
            )}
          </motion.button>
        </form>

        {/* Social buttons */}
        <AnimatePresence>
          <motion.div
            key="social-buttons"
            className="flex flex-col gap-2 mt-2 mb-7 text-foreground font-semibold"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 my-3">
              <hr className="flex-grow border-t border-border" />
              <span className="text-xs text-muted-foreground/50">or</span>
              <hr className="flex-grow border-t border-border" />
            </div>
            <a
              href={`https://ogivva-codebackend-production.up.railway.app/v1/auth/google?role=${selectedRole}`}
              className={`w-full border border-accent flex items-center justify-center gap-2 py-2 rounded-[12px] text-sm hover:bg-muted ${
                !selectedRole ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Image
                src={GoogleIcon}
                alt="Google icon"
                width={20}
                height={20}
              />
              Sign up with Google
            </a>
            <a
              href={`https://ogivva-codebackend-production.up.railway.app/v1/auth/facebook?role=${selectedRole}`}
              className={`w-full border border-accent flex items-center justify-center gap-2 py-2 rounded-[12px] text-sm hover:bg-muted ${
                !selectedRole ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Image
                src={FacebookIcon}
                alt="Facebook icon"
                width={20}
                height={20}
              />
              Sign up with Facebook
            </a>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
