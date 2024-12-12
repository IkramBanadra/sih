import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import PostOfficeLogin from "./pages/PostOfficeLogin";
import PostOfficeRequest from "./pages/PostOfficeRequest";
import AdminSwachataDashboard from "./pages/AdminSwachataDashboard";
import Home from "./pages/Home";
// import ImageProcess from "./pages/ImageProcess";
import Swachata from "./pages/Swachata";
import ImageUploadPage from "./pages/ImageUploadPage";
import PostOfficeInfo from "./pages/PostOfficeInfo";
import AdminUsersDashboard from "./pages/AdminUsersDashboard";
import AdminMonitoring from "./pages/AdminMonitoring";
import NotFoundPage from "./pages/NotFoundPage";
import PostOfficeNotification from "./pages/PostOfficeNotification";
import AdminPostOfficeCheck from "./pages/AdminPostOfficeCheck";
import AdminAccess from "./pages/AdminAccess";
import AdminNotifications from "./pages/AdminNotifications";
import AdminUserFeedback from "./pages/AdminUserFeedback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/postOfficeLogin" element={<PostOfficeLogin />} />
      <Route path="/accessReq" element={<PostOfficeRequest />} />
      {/* <Route path="/imgProcess" element={<ImageProcess />} /> */}

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/adminSwachataDashboard" element={<AdminSwachataDashboard />} />
        <Route path="/adminUsersDashboard" element={<AdminUsersDashboard />} />
        <Route path="/adminMonitoring" element={<AdminMonitoring />} />
        <Route path="/adminPostOfficeCheck" element={<AdminPostOfficeCheck />} />
        <Route path="/adminNotifications" element={<AdminNotifications />} />
        <Route path="/adminFeedbackRequests" element={<AdminUserFeedback />} />
        <Route path="/adminAccess" element={<AdminAccess />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['postOffice']} />}>
        <Route path="/postOfficeSwachataPage" element={<Swachata />} />
        <Route path="/postOfficeImgUpload" element={<ImageUploadPage />} />
        <Route path="/postOfficeInfo" element={<PostOfficeInfo />} />
        <Route path="/postOfficeNotification" element={<PostOfficeNotification />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;