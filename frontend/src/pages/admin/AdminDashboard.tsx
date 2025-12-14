import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { API } from "../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/analytics/summary", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setStats(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {!stats ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* USERS */}
          <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>

          {/* PRODUCTS */}
          <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>

          {/* REVIEWS */}
          <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
            <div className="stat-title">Total Reviews</div>
            <div className="stat-value">{stats.totalReviews}</div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
