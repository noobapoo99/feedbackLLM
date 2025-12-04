import { useEffect, useState } from "react";
import axios from "axios";

export default function UploadCSV() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch products (admin only)
  useEffect(() => {
    axios
      .get("http://localhost:5001/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Upload file handler
  const handleUpload = async () => {
    if (!selectedProductId) {
      setMessage("Please select a product.");
      return;
    }

    if (!file) {
      setMessage("Please choose a CSV file.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("productId", selectedProductId);

      const res = await axios.post(
        "http://localhost:5001/admin/csv/upload",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowSuccess(true);

      setMessage(`Uploaded successfully: ${res.data.imported} reviews`);
    } catch (err: any) {
      console.error(err);
      setMessage("Upload failed. Check console.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload CSV Reviews</h1>

      {message && <p className="mb-4 text-primary">{message}</p>}

      <div className="mb-4">
        <label className="label font-semibold">Select Product</label>
        <select
          className="select select-bordered w-full"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- Choose Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.category})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label font-semibold">Choose CSV File</label>
        <input
          type="file"
          accept=".csv"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button className="btn btn-primary w-full" onClick={handleUpload}>
        Upload Reviews CSV
      </button>
      {showSuccess && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">CSV Upload Successful 🎉</h3>
            <p className="py-4">Your CSV has been imported successfully.</p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setShowSuccess(false)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
