import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import AssignProducts from "./pages/admin/AssginProducts";
import AnalystDashboard from "./pages/analyst/AnalystDashboard";
import ProductPage from "./pages/analyst/ProductPage";
import ProductAnalytics from "./pages/analyst/ProductAnalytics";

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
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
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
