import { useEffect, useState } from "react";
import axios from "axios";
import AnalystLayout from "../../layouts/AnalystLayout";
import { useNavigate } from "react-router-dom";

export default function AnalystDashboard() {
  const [assigned, setAssigned] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5001/products/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssigned(res.data));
  }, []);

  return (
    <AnalystLayout>
      <h1 className="text-3xl font-bold mb-6">Your Assigned Products</h1>

      {assigned.length === 0 ? (
        <p>No products assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assigned.map((p: any) => (
            <div
              key={p.id}
              className="card bg-base-100 shadow-xl p-6 cursor-pointer hover:shadow-2xl transition rounded-xl"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="opacity-70">{p.category}</p>
              <div className="badge badge-accent mt-3">
                {p.reviews?.length || 0} reviews
              </div>
            </div>
          ))}
        </div>
      )}
    </AnalystLayout>
  );
}
