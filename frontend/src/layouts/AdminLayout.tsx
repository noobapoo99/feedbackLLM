import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Share2,
  BarChart3,
  UploadCloud,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import AIChat from "../components/ai-chat/AIChat";
import { API } from "../utils/api";
function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useContext(AuthContext);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-circle"
      >
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <User size={18} />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-3
            w-44
            bg-base-100
            rounded-xl
            shadow-xl
            border border-base-300
            z-[9999]
          "
        >
          <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-base-200 rounded-t-xl">
            <User size={14} />
            Profile
          </button>

          <button
            className="w-full px-4 py-2 flex items-center gap-2 text-error hover:bg-error/10 rounded-b-xl"
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                API.post("/auth/logout", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                });
              } catch (err) {
                // ignore errors, still proceed to clear client state
              }

              // use AuthContext logout to clear local user state/storage
              try {
                logout();
              } catch {}

              window.location.href = "/login";
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navItem = (to: string, label: string, Icon: React.ElementType) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all
          ${
            active
              ? "bg-primary/20 text-primary shadow-md backdrop-blur-xl"
              : "hover:bg-base-200/40"
          }
        `}
      >
        <Icon size={18} className="opacity-80" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* SIDEBAR */}
      <aside
        className="
          w-64 h-screen sticky top-0
          bg-base-100/60 backdrop-blur-xl
          border-r border-base-300/40
          shadow-xl
          px-5 py-6
          flex flex-col
        "
      >
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-xs text-base-content/60 mt-1">
            Control & Analytics
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItem("/admin", "Dashboard", LayoutDashboard)}
          {navItem("/admin/users", "Users", Users)}
          {navItem("/admin/products", "Products", Package)}
          {navItem("/admin/assign", "Assign Products", Share2)}
          {navItem("/admin/analytics", "Global Analytics", BarChart3)}
          {navItem("/admin/upload", "Upload Data", UploadCloud)}
        </nav>

        <div className="mt-auto pt-6 border-t border-base-300/40 text-xs text-base-content/50">
          © 2025 Admin Console
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header
          className="
    sticky top-0 z-40
    h-16 px-6
    flex items-center justify-between
    bg-base-100/60 backdrop-blur-xl
    border-b border-base-300/40
  "
        >
          <div className="text-sm text-base-content/70">
            Welcome back {useContext(AuthContext).user?.name ?? "User"}
          </div>

          <ProfileDropdown />
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-base-100/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* FLOATING AI CHAT */}
      <div className="fixed bottom-6 right-6 z-50">
        <AIChat />
      </div>
    </div>
  );
}
