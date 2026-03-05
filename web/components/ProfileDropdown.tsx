"use client";
import { useState, useRef, useEffect } from "react"
import { signOut } from "@/app/auth/logout/action";

interface ProfileDropdownProps {
  name: string;
  initials: string;
}

const ProfileDropdown = ({ name, initials }: ProfileDropdownProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={profileRef} className="relative">
      <div
        onClick={() => setProfileOpen(!profileOpen)}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer select-none"
        style={{ background: "linear-gradient(135deg, #D4700A, #F4A261)" }}
      >
        {initials}
      </div>

      {/* Dropdown */}
      <div
        className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-stone-100 shadow-xl z-50 overflow-hidden"
        style={{
          transformOrigin: "top right",
          transform: profileOpen ? "scale(1)" : "scale(0.95)",
          opacity: profileOpen ? 1 : 0,
          pointerEvents: profileOpen ? "auto" : "none",
          transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease",
        }}
      >
        {/* User info header */}
        <div className="px-4 py-3.5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
              style={{ background: "linear-gradient(135deg, #D4700A, #F4A261)" }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-stone-900 truncate">{name}</div>       
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1.5">
          <button
            onClick={() => setProfileOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              className="shrink-0 text-stone-400"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </button>

          <div className="my-1 border-t border-stone-100" />

      

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              className="shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;