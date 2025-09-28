"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import Image from "next/image";

import GivvaIcon from "@/public/GivvaLogo.svg";
import confettiIcon from "@/public/confetti.svg";

export default function EmailVerified() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [confettiActive, setConfettiActive] = useState(true);

  // Get window size for confetti
  const [width, height] = useWindowSize();

  useEffect(() => {
    // Redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/signin");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(confettiTimer);
    };
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Confetti (only for first 5s) */}
      {confettiActive && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={100}
          recycle={false}
        />
      )}

      {/* Header Logo */}
      <header className="py-4 flex justify-center md:justify-start">
        <Image
          src={GivvaIcon}
          alt="Givva Logo"
          className="w-28 ml-6"
          priority
        />
      </header>

      <main className="flex flex-col items-center mx-auto mt-8 w-[70%] md:w-[30%]">
        {/* Animated content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center my-auto"
        >
          <Image src={confettiIcon} alt="Confetti celebration" />

          <h1 className="mt-6 mb-4 text-center text-2xl font-semibold leading-tight text-foreground">
            Account created
            <br />
            successfully
          </h1>

          <p className="mb-10 w-80 text-center text-sm font-medium text-muted-foreground">
            Your email has been verified successfully. You will be redirected to
            the sign-in page in{" "}
            <span className="font-semibold text-foreground">
              {`00:${countdown.toString().padStart(2, "0")}`}
            </span>
          </p>

          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Proceed to dashboard
          </button>
        </motion.div>
      </main>
    </div>
  );
}
