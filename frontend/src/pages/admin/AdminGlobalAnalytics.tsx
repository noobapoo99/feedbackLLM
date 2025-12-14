import { useEffect, useState } from "react";
//import { useAiActions } from "../../utils/useAiActions";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminGlobalAnalytics() {
  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any>(null);
  const [trend, setTrend] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5001/analytics/global/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setSummary(r.data));
    axios
      .get("http://localhost:5001/analytics/global/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setCategories(r.data));
    axios
      .get("http://localhost:5001/analytics/global/top-products?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setTopProducts(r.data));
    axios
      .get("http://localhost:5001/analytics/global/trend?days=30&group=day", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setTrend(r.data));
  }, []);

  /* useAiActions({
    setChart: (chart) => {
      setSelectedChart(chart);
      setTimeout(() => setSelectedChart(null), 3500);
    },
  }); */

  const pieData = summary
    ? [
        { name: "Positive", value: summary.sentiment.positive },
        { name: "Negative", value: summary.sentiment.negative },
        { name: "Neutral", value: summary.sentiment.neutral },
      ]
    : [];

  const colors = ["#4ade80", "#f87171", "#fbbf24"];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Global Analytics</h1>

      {!summary ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
              <div className="stat-title">Users</div>
              <div className="stat-value">{summary.totalUsers}</div>
            </div>
            <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
              <div className="stat-title">Products</div>
              <div className="stat-value">{summary.totalProducts}</div>
            </div>
            <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
              <div className="stat-title">Reviews</div>
              <div className="stat-value">{summary.totalReviews}</div>
            </div>
            <div className="stat bg-base-100 shadow-lg rounded-xl p-5">
              <div className="stat-title">Assignments</div>
              <div className="stat-value">{summary.totalAssignments}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-base-100 shadow-xl rounded-xl p-4">
              <h3 className="font-semibold mb-3">Sentiment Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <div
                  className={
                    selectedChart === "pie"
                      ? "ring-4 ring-primary rounded-xl p-2"
                      : ""
                  }
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={colors[idx]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </ResponsiveContainer>
            </div>

            <div className="col-span-2 bg-base-100 shadow-xl rounded-xl p-4">
              <h3 className="font-semibold mb-3">
                Review Volume (last 30 days)
              </h3>
              {!trend ? (
                <p>Loading...</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <div
                    className={
                      selectedChart === "line"
                        ? "ring-4 ring-primary rounded-xl p-2"
                        : ""
                    }
                  >
                    <LineChart
                      data={trend.labels.map((l: any, i: number) => ({
                        label: l,
                        count: trend.counts[i],
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </div>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-base-100 shadow-xl rounded-xl p-4">
              <h3 className="font-semibold mb-3">Category Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <div
                  className={
                    selectedChart === "bar"
                      ? "ring-4 ring-primary rounded-xl p-2"
                      : ""
                  }
                >
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalReviews" fill="#60a5fa" />
                  </BarChart>
                </div>
              </ResponsiveContainer>
            </div>

            <div className="bg-base-100 shadow-xl rounded-xl p-4">
              <h3 className="font-semibold mb-3">Top / Bottom Products</h3>
              <div>
                <h4 className="font-semibold mt-2">Top products</h4>
                <ul className="list-disc pl-5">
                  {topProducts?.top.map((p: any) => (
                    <li key={p.id}>
                      {p.name} — {p.avgRating} ({p.totalReviews} reviews)
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold mt-4">Bottom products</h4>
                <ul className="list-disc pl-5">
                  {topProducts?.bottom.map((p: any) => (
                    <li key={p.id}>
                      {p.name} — {p.avgRating} ({p.totalReviews} reviews)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
