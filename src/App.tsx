import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import SkillsDashboard from "./Pages/SkillsDashboard";
import { useEffect } from "react";
import { useAuthenticationStore } from "./store/AuthStore";
import About from "./Pages/About";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import ForgotPassword from "./Pages/forgot_pass";
import Reset_Password from "./Pages/reset_password";

function App() {
  const { authenticateUser } = useAuthenticationStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authenticateUser(token);
    } 
  }, []);

  
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<Reset_Password />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/skillsdashboard" element={<SkillsDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/termsofservice" element={<TermsOfService />} />
      </Routes>
    </>
  );
}

export default App;
