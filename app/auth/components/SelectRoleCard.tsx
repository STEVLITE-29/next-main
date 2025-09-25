import GiftIcon from "@/public/GiftIcon.svg";
import ReceiveIcon from "@/public/ReceiveIcon.svg";
import VendorIcon from "@/public/VendorIcon.svg";

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
    icon: GiftIcon,
    title: "Gifter",
    description:
      "Share joy with someone you know — or a stranger who needs it.",
  },
  {
    role: "receiver",
    icon: ReceiveIcon,
    title: "Receiver",
    description: "Lucky you! Claim your gift and see what surprises await.",
  },
  {
    role: "vendor",
    icon: VendorIcon,
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
    <div className="flex flex-col gap-2.5">
      {roles.map(({ role, icon, title, description }) => {
        const isSelected = selectedRole === role;

        return (
          <div
            key={role}
            onClick={() => onSelect(role)}
            className={`rounded-lg py-4 px-5 cursor-pointer flex items-center border transition-all
              ${
                isSelected
                  ? "bg-muted border-2 border-primary"
                  : "bg-card border hover:border-primary"
              }`}
          >
            <div className="flex items-start gap-4">
              <img src={icon} alt={`${title} Icon`} className="w-8" />
              <div className="max-w-[352px]">
                <h2 className="mb-1 text-foreground text-sm font-semibold">
                  {title}
                </h2>
                <p className="text-muted-foreground text-xs w-[300px] font-medium">
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
        className={`mt-3 w-full py-2.5 font-semibold rounded-xl text-center transition-all flex justify-center items-center gap-2
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
