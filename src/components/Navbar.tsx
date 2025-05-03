import { useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../store/AuthStore";
import { useInstructorCoursesStore } from "../store/InstructorStore";
import { useEffect, useRef } from "react";
import { ScrollTop } from "../Custom/Components";
import { useState } from "react";
const Navbar = () => {
  const { user, logout } = useAuthenticationStore();
  const { setInstructorCourses } = useInstructorCoursesStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const LogOut = async () => {
    logout();
    setInstructorCourses([]);
    ScrollTop();
    navigate("/");
  };
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside of the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  return (
    <div className="sticky top-0 z-50">
      <header className="w-full  flex justify-between items-center p-5 bg-[#111827] text-white">
        <h1
          onClick={() => {
            ScrollTop();
            navigate("/");
          }}
          className="text-2xl cursor-pointer rounded-lg font-bold text-[#3B82F6]"
        >
          SkillMorph
        </h1>

        <div>
          {user ? (
           <div className="relative">
           {/* Profile Button */}
           <div
             className="text-white text-sm cursor-pointer hover:bg-gray-700 rounded-full p-1 flex items-center transition-all duration-200 ease-in-out"
             onClick={() => setIsDropdownOpen(prev => !prev)}
           >
             <img className="w-8 h-8 rounded-full" src="/account.svg" alt="Profile" />
           </div>
         
           {/* Dropdown Menu */}
           {isDropdownOpen && (
             <div
             ref={dropdownRef}
              className="absolute right-0 top-10 w-40 bg-[#1f2937] border border-gray-600 rounded-md shadow-lg z-10">
               <div className="p-3 text-sm text-white border-b border-gray-600">
                 {user.username}
               </div>
               <div className="p-3 text-sm text-white border-b break-words border-gray-600">
                 {user.email}
               </div>
               <div
                 onClick={() => {
                   ScrollTop();
                   setIsDropdownOpen(false); // close dropdown
                   navigate("/skillsdashboard?view=enrolled");
                 }}
                 className="p-3 text-sm text-white border-b border-gray-600 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
               >
                 Enrolled
               </div>
               <div
                 onClick={() => {
                   setIsDropdownOpen(false); // close dropdown
                   LogOut();
                 }}
                 className="p-3 text-sm text-red-400 rounded-b-md hover:text-red-300 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
               >
                 Log Out
               </div>
             </div>
           )}
         </div>
         
          ) : (
            <div className="flex  flex-col xs:flex-row items-center sm:justify-between space-y-2 xs:space-y-0 xs:space-x-4">
              <button
                aria-label="Navigate to Login Page"
                onClick={() => [ScrollTop(), navigate("/login")]}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 hover:scale-105 transition-all"
              >
                LOGIN
              </button>
              <button
                aria-label="Navigate to Sign-Up Page"
                onClick={() => {
                  ScrollTop();
                  navigate("/register");
                }}
                className="px-4 py-2 hover:from-[#60A5FA] hover:to-[#34D399] hover:scale-105 transition-all bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
