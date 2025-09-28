"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import FacebookIcon from "@/public/Facebook.svg";
import GoogleIcon from "@/public/Google.svg";
import PhotoSlider from "../components/PhotoSlider";
import GivvaLogo from "@/public/GivvaLogo.svg";
import { useAuthStore } from "@/store/authStore";

export default function SignIn() {
  const router = useRouter();
  const { login, isLoading, loginError } = useAuthStore();

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        console.error("Login error:", err);
      } else {
        toast.error("Login failed");
        console.error("Unknown error:", err);
      }
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
      {/* Left Side: Form */}
      <div className="flex flex-col px-8 md:px-20 py-6 lg:px-10 bg-background text-foreground">
        {/* Logo */}
        <Image
          src={GivvaLogo}
          alt="Givva Logo"
          className="mt-8 mb-5 w-28 mx-auto"
          priority
        />

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-card-foreground text-center">
          New to Ogivva?{" "}
          <Link
            href="/onboarding"
            className="text-primary font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>

        {/* Form */}
        <form
          onSubmit={handleSignIn}
          className="flex flex-col gap-3 text-sm flex-grow justify-center px-5 mt-6"
        >
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-foreground">
              Email
            </label>
            <div className="flex items-center border rounded-md px-3 py-3 bg-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-background transition">
              <input
                type="email"
                id="email"
                placeholder="e.g example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-foreground"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-foreground"
            >
              Password
            </label>
            <div className="flex items-center border rounded-md px-3 py-3 bg-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-background transition">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-card-foreground text-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-card-foreground ml-2"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between mt-2 text-card-foreground">
            <label className="flex items-center gap-2 font-medium text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-primary"
              />
              Remember Me
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary font-semibold"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm transition hover:bg-primary-hover"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin mx-auto" size={20} />
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Error */}
          {loginError && (
            <div className="flex items-center gap-2 mt-2 rounded-md bg-destructive border border-red-200 px-3 py-2 text-sm text-foreground font-medium">
              <AlertTriangle className="w-4 h-4 text-foreground shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-grow border-t border-border" />
            <span className="text-xs text-card-foreground">or</span>
            <hr className="flex-grow border-t border-border" />
          </div>

          {/* Social Logins */}
          <a
            href="https://ogivva-codebackend-production.up.railway.app/v1/auth/google"
            className="w-full border border-border flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm hover:bg-accent transition"
          >
            <Image src={GoogleIcon} alt="Google icon" className="w-4 h-4" />
            Continue with Google
          </a>

          <a
            href="https://ogivva-codebackend-production.up.railway.app/v1/auth/facebook"
            className="w-full border border-border flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm hover:bg-accent transition"
          >
            <Image src={FacebookIcon} alt="Facebook icon" className="w-4 h-4" />
            Continue with Facebook
          </a>
        </form>
      </div>

      {/* Right Side: Photo Slider (only lg+) */}
      <div className="hidden lg:block">
        <PhotoSlider />
      </div>
    </main>
  );
}
