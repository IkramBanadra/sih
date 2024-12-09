import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import PostOfficeLogin from "./pages/PostOfficeLogin";
import PostOfficeRequest from "./pages/PostOfficeRequest";
import AdminDashboard from "./pages/AdminDashboard";
import PostOfficeDashboard from "./pages/PostOfficeDashboard";
import Home from "./pages/Home";

function App() {

  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/postOfficeLogin" element={<PostOfficeLogin />} />
          <Route path="/postOfficeDashboard" element={<PostOfficeDashboard />} />
          <Route path="/accessReq" element={<PostOfficeRequest />} />
        </Routes>
        
    </>
  );
}

export default App;
