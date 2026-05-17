import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout01Icon,
  Settings01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

import type { AuthUser } from "../../types/auth";
import UserAvatar from "./UserAvatar";
import { cn } from "../../lib/utils";

type UserMenuProps = {
  user: AuthUser;
  onLogout: () => void | Promise<void>;
};

const menuItemClass =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100";

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-slate-300 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
        <span className="max-w-[9rem] truncate text-sm font-semibold text-slate-800">
          {user.name}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="animate-in fade-in zoom-in-95 absolute right-0 z-40 mt-2 w-56 origin-top-right rounded-xl border bg-white p-2 shadow-lg duration-200"
        >
          <div className="border-b px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>

          <div className="grid gap-0.5 py-1">
            <Link
              role="menuitem"
              to="/profile"
              onClick={() => setOpen(false)}
              className={menuItemClass}
            >
              <HugeiconsIcon icon={Settings01Icon} size={16} />
              Profile settings
            </Link>
            <Link
              role="menuitem"
              to="/orders"
              onClick={() => setOpen(false)}
              className={menuItemClass}
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
              My orders
            </Link>
          </div>

          <div className="border-t pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await onLogout();
              }}
              className={cn(menuItemClass, "w-full text-red-600 hover:bg-red-50")}
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
