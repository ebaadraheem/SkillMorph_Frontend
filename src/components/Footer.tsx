import { useNavigate, useLocation } from "react-router-dom";
import { ScrollTop } from "../Custom/Components";
import { useState, useEffect } from "react";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path
  const [activeNav, setActiveNav] = useState<string>("");

  const navigation = [
    { id: "about", label: "About" },
    { id: "privacypolicy", label: "Privacy Policy" },
    { id: "termsofservice", label: "Terms of Service" },
  ];

  // Update activeNav based on the current URL
  useEffect(() => {
    const currentPath = location.pathname.replace("/", ""); // Remove the "/" from path
    setActiveNav(currentPath || ""); // If home ("/"), reset activeNav
  }, [location.pathname]); // Run whenever URL changes

  const handlePageNavigation = (page: string) => {
    ScrollTop();
    navigate(`/${page}`);
  };

  return (
    <footer className="w-full bg-[#111827] text-white p-6 relative bottom-0">
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Logo */}
        <div className="text-lg sm:justify-start sm:w-56 font-semibold text-[#3B82F6] flex justify-center">
          <h1
            onClick={() => [
              ScrollTop(),
              navigate("/"),
            ]}
            className="cursor-pointer rounded-md"
          >
            SkillMorph
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex max-xs:text-sm items-center max-sm:gap-3 space-y-0 sm:space-x-6 justify-center sm:justify-start">
          {navigation.map((nav) => (
            <div
              key={nav.id}
              onClick={() => handlePageNavigation(nav.id)}
              className={`cursor-pointer transition-colors ${
                activeNav === nav.id ? "text-[#3B82F6]" : "hover:text-[#3B82F6]"
              }`}
            >
              {nav.label}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400 flex justify-center sm:justify-start">
          &copy; {new Date().getFullYear()} SkillMorph. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
