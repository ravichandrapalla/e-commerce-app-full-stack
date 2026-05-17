import { cn } from "../../lib/utils";

type UserAvatarProps = {
  name?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
};

const getInitials = (name?: string) => {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "?";
};

export default function UserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const label = name?.trim() || "User";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${label} avatar`}
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 font-semibold text-white ring-2 ring-white shadow-sm",
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
