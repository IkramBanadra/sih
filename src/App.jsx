import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import PostOfficeLogin from "./pages/PostOfficeLogin";
import PostOfficeRequest from "./pages/PostOfficeRequest";
import AdminSwachataDashboard from "./pages/AdminSwachataDashboard";
import Home from "./pages/Home";
import ImageProcess from "./pages/ImageProcess";
import Swachata from "./pages/Swachata";
// import LifePage from "./pages/LifePage";
import ImageUploadPage from "./pages/ImageUploadPage";
import PostOfficeInfo from "./pages/PostOfficeInfo";
import AdminLifeDashboard from "./pages/AdminLifeDashboard";
import AdminUsersDashboard from "./pages/AdminUsersDashboard";
import AdminNotification from "./pages/AdminNotification";
import AdminMonitoring from "./pages/AdminMonitoring";
import NotFoundPage from "./pages/NotFoundPage"; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/postOfficeLogin" element={<PostOfficeLogin />} />
        <Route path="/accessReq" element={<PostOfficeRequest />} />
        <Route path="/imgProcess" element={<ImageProcess />} />
        <Route path="/postOfficeSwachataPage" element={<Swachata />} />
        {/* <Route path="/postOfficeLifePage" element={<LifePage />} /> */}
        <Route path="/postOfficeImgUpload" element={<ImageUploadPage />} />
        <Route path="/postOfficeInfo" element={<PostOfficeInfo />} />
        <Route path="/adminSwachataDashboard" element={<AdminSwachataDashboard />} />
        <Route path="/adminLifeDashboard" element={<AdminLifeDashboard />} />
        <Route path="/adminUsersDashboard" element={<AdminUsersDashboard />} />
        <Route path="/adminNotification" element={<AdminNotification />} />
        <Route path="/adminMonitoring" element={<AdminMonitoring />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
