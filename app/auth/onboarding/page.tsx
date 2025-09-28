"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import GivvaIcon from "@/public/GivvaLogo.svg";
import PhotoSlider from "@/app/auth/components/PhotoSlider";
import RoleCardList from "@/app/auth/components/SelectRoleCard";
import { useAuthStore } from "@/store/authStore";

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedRole, setRole } = useAuthStore();

  const handleSelectRole = (role: string) => {
    console.log("Selected role:", role);
    setRole(role as never);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    console.log("Continue with role:", selectedRole);

    if (selectedRole === "vendor") {
      router.push("/signup/vendor");
    } else {
      router.push("/signup");
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid lg:grid-cols-[45%_55%]">
      {/* Left Section - MODIFIED PADDING HERE */}
      <div className="px-6 py-2 lg:py-8 flex flex-col justify-center sm:px-10 lg:px-16">
        <Image
          src={GivvaIcon}
          alt="Givva Logo"
          className="mt-4 mb-6 w-24 sm:w-28 mx-auto"
        />

        <h1 className="text-lg sm:text-xl text-center font-semibold text-foreground mb-2 tracking-tight">
          Let’s get you started
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base mb-6 text-center font-medium">
          Tell us what you’d like to do on GIVVA. You can always switch roles
          later.
        </p>

        <RoleCardList
          onSelect={handleSelectRole}
          selectedRole={selectedRole}
          onContinue={handleContinue}
        />

        <p className="text-muted-foreground text-xs sm:text-sm mt-6 font-medium text-center">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-primary hover:underline font-semibold"
          >
            Sign In
          </a>
        </p>
      </div>

      {/* Right Section (only on large screens) */}
      <div className="hidden lg:block">
        <PhotoSlider />
      </div>
    </main>
  );
}