import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnalystLayout from "../../layouts/AnalystLayout";
import axios from "axios";
import RatingChart from "../../components/charts/RatingChart.tsx";
import SentimentPie from "../../components/charts/SentimentPie.tsx";

export default function ProductAnalytics() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5001/analytics/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <AnalystLayout>
      {!data ? (
        <div className="p-8">Loading analytics...</div>
      ) : (
        <div className="space-y-6">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Analytics — {data.productName}
            </h1>
            <div className="text-sm opacity-70">
              Total reviews: {data.totalReviews}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <RatingChart productId={id!} />
            </div>

            <div>
              <div className="bg-base-100 shadow-xl rounded-xl p-5 mb-6">
                <h3 className="font-semibold mb-2">Overview</h3>
                <div className="text-2xl font-bold">{data.avgRating} / 5</div>
                <div className="opacity-70 mt-2">
                  Positive: {data.sentimentBreakdown.positive} • Negative:{" "}
                  {data.sentimentBreakdown.negative} • Neutral:{" "}
                  {data.sentimentBreakdown.neutral}
                </div>
              </div>

              <SentimentPie sentiment={data.sentimentBreakdown} />
            </div>
          </div>
        </div>
      )}
    </AnalystLayout>
  );
}
