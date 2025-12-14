import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import AssignProducts from "./pages/admin/AssginProducts";
import AnalystDashboard from "./pages/analyst/AnalystDashboard";
import ProductPage from "./pages/analyst/ProductPage";
import ProductAnalytics from "./pages/analyst/ProductAnalytics";
import AdminGlobalAnalytics from "./pages/admin/AdminGlobalAnalytics";
import CsvUpload from "./pages/admin/csvUploader";
import MyReviews from "./pages/analyst/MyReviews";
import AnalyticsChat from "./pages/AnalyticsChat";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="ANALYST">
                <AnalystDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute role="ANALYST">
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id/analytics"
            element={
              <ProtectedRoute role="ANALYST">
                <ProductAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute role="ANALYST">
                <MyReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics/chat"
            element={
              <ProtectedRoute>
                <AnalyticsChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminGlobalAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute role="ADMIN">
                <CsvUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="ADMIN">
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="ADMIN">
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assign"
            element={
              <ProtectedRoute role="ADMIN">
                <AssignProducts />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
