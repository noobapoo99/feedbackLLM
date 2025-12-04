import { useState } from "react";
import axios from "axios";

export default function AddReview({
  productId,
  setReviews,
}: {
  productId: string;
  setReviews: any;
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const submit = async () => {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5001/reviews",
      { rating, content, productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReviews((prev: any) => [...prev, res.data.review]);
    setLoading(false);

    (document.getElementById("addReviewModal") as any).close();
  };

  return (
    <div className="space-y-4">
      <select
        className="select select-bordered w-full"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Stars
          </option>
        ))}
      </select>

      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Write your review here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <button
        className="btn btn-primary w-full"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
