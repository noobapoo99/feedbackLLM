import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RatingChart({ productId }: { productId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5001/analytics/product/${productId}/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const formatted = Object.keys(res.data).map((key) => ({
          rating: key,
          count: res.data[key],
        }));
        setData(formatted);
      })
      .catch((err) => console.error(err));
  }, [productId]);

  return (
    <div className="bg-base-100 shadow-xl rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-3">Rating Distribution</h2>

      {!data ? (
        <div>Loading chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="rating" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
