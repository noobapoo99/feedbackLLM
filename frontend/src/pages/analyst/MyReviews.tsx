import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AnalystLayout from "../../layouts/AnalystLayout";

export default function MyReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sentimentFilter, setSentimentFilter] = useState<
    "positive" | "negative" | "neutral" | null
  >(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const sentimentColor = (sentiment: string) => {
    if (sentiment === "positive") return "badge-success";
    if (sentiment === "negative") return "badge-error";
    return "badge-neutral";
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5001/reviews/my-reviews",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const action = e.detail;
      if (!action?.type) return;

      if (action.type === "filter_sentiment") {
        setSentimentFilter(action.sentiment ?? null);
      }

      if (action.type === "sort_by_rating") {
        setSortOrder(action.order ?? null);
      }

      if (action.type === "reset_reviews") {
        setSentimentFilter(null);
        setSortOrder(null);
      }
    };

    window.addEventListener("ai:reviews", handler);
    return () => window.removeEventListener("ai:reviews", handler);
  }, []);

  const visibleReviews = useMemo(() => {
    let out = [...reviews];

    if (sentimentFilter) {
      out = out.filter((r) => r.sentiment === sentimentFilter);
    }

    if (sortOrder) {
      out = [...out].sort((a, b) =>
        sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      );
    }

    return out;
  }, [reviews, sentimentFilter, sortOrder]);

  return (
    <AnalystLayout>
      <h1 className="text-3xl font-bold mb-6">My Assigned Reviews</h1>

      {(sentimentFilter || sortOrder) && (
        <div className="mb-4 text-sm opacity-70">
          AI view
          {sentimentFilter && ` · sentiment=${sentimentFilter}`}
          {sortOrder && ` · rating=${sortOrder}`}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : visibleReviews.length === 0 ? (
        <p className="text-gray-500 text-lg">No reviews match this view.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleReviews.map((r) => (
            <div
              key={r.id}
              className="card bg-base-100 shadow-md border border-base-300 p-5 rounded-xl"
            >
              <div className="flex justify-between mb-2">
                <span className={`badge ${sentimentColor(r.sentiment)}`}>
                  {r.sentiment.toUpperCase()}
                </span>
                <span className="badge badge-info">⭐ {r.rating}</span>
              </div>

              <p className="text-sm opacity-80 mb-3">{r.content}</p>

              <p className="text-xs opacity-60">
                Product:{" "}
                <span className="font-semibold">
                  {r.product?.name ?? "N/A"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </AnalystLayout>
  );
}
