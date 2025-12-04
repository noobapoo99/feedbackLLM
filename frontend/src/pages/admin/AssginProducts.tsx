import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";

export default function AssignProducts() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5001/admin/analysts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data));

    axios
      .get("http://localhost:5001/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data));
  }, []);

  const assign = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5001/assign",
      {
        userId: selectedUser,
        productId: selectedProduct,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Product assigned successfully!");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-5">Assign Products to Analysts</h1>

      <div className="bg-base-100 p-6 rounded-xl shadow-lg max-w-md space-y-4">
        <select
          className="select select-bordered w-full"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option>Select Analyst</option>
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option>Select Product</option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary w-full" onClick={assign}>
          Assign
        </button>
      </div>
    </AdminLayout>
  );
}
