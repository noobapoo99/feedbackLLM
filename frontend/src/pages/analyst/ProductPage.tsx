import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnalystLayout from "../../layouts/AnalystLayout";
import { API } from "../../utils/api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setProduct(res.data.product);
      setReviews(res.data.reviews);
    });
  }, []);

  const sentimentColor = (s: string) => {
    switch (s) {
      case "POSITIVE":
        return "badge-success";
      case "NEGATIVE":
        return "badge-error";
      default:
        return "badge-warning";
    }
  };

  return (
    <AnalystLayout>
      {!product ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <button
              className="btn btn-primary"
              onClick={() =>
                (document.getElementById("addReviewModal") as any).showModal()
              }
            >
              Add Review
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Reviews</h2>

          <div className="space-y-4">
            {reviews.map((r: any) => (
              <div
                key={r.id}
                className="p-5 bg-base-100 rounded-xl shadow border border-base-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="badge badge-lg">{r.rating}★</div>
                  <div className={`badge ${sentimentColor(r.sentiment)}`}>
                    {r.sentiment}
                  </div>
                </div>
                <p>{r.content}</p>
              </div>
            ))}
          </div>

          {/* Add Review Modal */}
          <dialog id="addReviewModal" className="modal">
            <form
              method="dialog"
              className="modal-box"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="font-bold text-lg mb-4">Add Review</h3>

              <AddReview productId={id!} setReviews={setReviews} />

              <button className="btn mt-4" onClick={() => {}}>
                Close
              </button>
            </form>
          </dialog>
        </>
      )}
    </AnalystLayout>
  );
}
