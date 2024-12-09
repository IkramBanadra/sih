import AdminSidebar from '../components/AdminSidebar'
import { Route, Routes } from "react-router-dom";
import OverviewPage from "./OverviewPage";
import LifePage from "./LifePage";
import ImageUploadPage from "./ImageUploadPage";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <AdminSidebar />

      <Routes>
        <Route path="/adminOverview" element={<OverviewPage />} />
        <Route path="/products" element={<LifePage />} />
        <Route path="/image" element={<ImageUploadPage />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
