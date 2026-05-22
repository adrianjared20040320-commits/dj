import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing pública */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<div style={{ padding: "2rem", color: "#888" }}>Dashboard — próximamente</div>} />

        {/* 404 → inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
