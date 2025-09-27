"use client";

import Image from "next/image";
import React from "react"; // Added React import

interface Role {
  role: string;
  icon: string;
  title: string;
  description: string;
}

interface RoleCardProps {
  onSelect: (role: string) => void;
  selectedRole: string | null;
  onContinue: () => void;
}

const roles: Role[] = [
  {
    role: "gifter",
    icon: "/GiftIcon.svg",
    title: "Gifter",
    description:
      "Share joy with someone you know — or a stranger who needs it.",
  },
  {
    role: "receiver",
    icon: "/ReceiveIcon.svg",
    title: "Receiver",
    description: "Lucky you! Claim your gift and see what surprises await.",
  },
  {
    role: "vendor",
    icon: "/VendorIcon.svg",
    title: "Vendor",
    description:
      "Reach new customers, fulfill meaningful orders, and grow your impact.",
  },
];

const RoleCardList: React.FC<RoleCardProps> = ({
  onSelect,
  selectedRole,
  onContinue,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {roles.map(({ role, icon, title, description }) => {
        const isSelected = selectedRole === role;

        return (
          <div
            key={role}
            onClick={() => onSelect(role)}
            className={`rounded-lg py-4 px-4 sm:px-5 cursor-pointer flex items-center border transition-all
              ${
                isSelected
                  ? "bg-muted border-2 border-primary"
                  : "bg-card border hover:border-primary"
              }`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <Image
                src={icon}
                alt={`${title} Icon`}
                width={32}
                height={32}
                className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" 
              />
              <div className="flex-1">
                <h2 className="mb-1 text-foreground text-sm sm:text-base font-semibold">
                  {title}
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-snug h-10 flex items-center">
                  {description}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <button
        onClick={onContinue}
        disabled={!selectedRole}
        className={`mt-4 w-full py-2.5 sm:py-3 font-semibold rounded-xl text-center transition-all flex justify-center items-center gap-2 text-sm sm:text-base
          ${
            selectedRole
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-accent text-muted-foreground cursor-not-allowed"
          }`}
      >
        Continue
      </button>
    </div>
  );
};

export default RoleCardList;