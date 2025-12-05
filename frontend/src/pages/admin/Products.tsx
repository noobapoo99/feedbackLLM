import { useEffect, useState, useContext } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";

export default function Products() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) return; // wait until logged in

    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5001/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data);
        console.log("Loaded:", res.data);
      });
  }, [user]); // run only after user is available

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-5">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <div
            key={p.id}
            className="card bg-base-100 shadow-xl p-5 rounded-xl border border-base-300"
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="opacity-70 mb-3">{p.category}</p>

            {/* <div className="badge badge-accent">
              {p.reviewsCount || 0} reviews
            </div> */}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
