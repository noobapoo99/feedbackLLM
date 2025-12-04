import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex bg-base-200 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-base-100 shadow-lg p-5 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          <Link className="btn btn-ghost justify-start" to="/admin">
            Dashboard
          </Link>
          <Link className="btn btn-ghost justify-start" to="/admin/users">
            Users
          </Link>
          <Link className="btn btn-ghost justify-start" to="/admin/products">
            Products
          </Link>
          <Link className="btn btn-ghost justify-start" to="/admin/assign">
            Assign Products
          </Link>
          <Link className="btn btn-ghost justify-start" to="/admin/analytics">
            Global Analytics
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
