import { useState,useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthenticationStore } from "../store/AuthStore";
import { ScrollTop } from "../Custom/Components";
import Courses from "../components/Courses";
import Created from "../components/Created";
import Enrolled from "../components/Enrolled";
import CreatorDashboard from "../components/CreaterDashboard";

type ViewType = "allcourses" | "enrolled" | "created" | "payments";

interface NavItem {
  id: ViewType;
  label: string;
  requiresAuth?: boolean;
  requiresInstructor?: boolean;
}

const navigation: NavItem[] = [
  { id: "allcourses", label: "Courses" },
  { id: "enrolled", label: "Enrolled"},
  {
    id: "created",
    label: "Created",
    requiresInstructor: true,
  },
  { id: "payments", label: "Payments", requiresInstructor: true },
];

const SkillsDashboard = () => {
  const { user } = useAuthenticationStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<ViewType>(
    (searchParams.get("view") as ViewType) || "allcourses"
  );

  useEffect(() => {
    const view = searchParams.get("view") as ViewType;
    if (view && view !== activeComponent) {
      setActiveComponent(view);
    }
  }, [searchParams]);

  const handleSetActive = (component: ViewType) => {
    if (component === activeComponent) return;

    ScrollTop();
    setActiveComponent(component);
    setSearchParams({ view: component }, { replace: true });
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const LoginMessage = () => (
    <div className="flex h-[74vh] items-center justify-center p-8">
      <h1>Please Log In to view this page</h1>
    </div>
  );
  const renderContent = () => {
    switch (activeComponent) {
      case "created":
        return user?.role === "instructor" ? <Created  /> : <LoginMessage />;
      case "enrolled":
        return user ? <Enrolled /> : <LoginMessage />;
      case "payments":
        return user?.role==="instructor" ? (
          <CreatorDashboard creatorId={user?.user_id} creatorEmail={user?.email} />
        ) : (
          <LoginMessage />
        );

      default:
        return <Courses />;
    }
  };

  const isNavItemVisible = (item: NavItem) => {
    if (item.requiresAuth && !user) return false;
    if (item.requiresInstructor && user?.role !== "instructor") return false;
    return true;
  };

  return (
    <>
      <div className="min-h-[80vh] bg-[#F9FAFB] flex relative">
        {/* Background overlay for mobile sidebar */}
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity ${
            isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          } md:hidden`}
          aria-hidden={!isSidebarOpen}
          onClick={toggleSidebar} // Close sidebar when clicking outside
        />

        {/* Sidebar */}
        <div
          className={`fixed ${
            !user ? "max-xs:top-28" : "max-xs:top-20"
          } top-20 left-0 z-50 w-64 max-md:h-full bg-gray-900 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
          aria-hidden={!isSidebarOpen}
        >
          <div className="p-2 flex justify-between">
            {/* Navigation Menu */}
            <nav>
              <ul className="space-y-4 my-4 ml-4">
                {navigation.map((item) =>
                  isNavItemVisible(item) ? (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSetActive(item.id)}
                        className={`text-left transition-colors ${
                          activeComponent === item.id
                            ? "text-blue-500"
                            : "text-white hover:text-blue-500"
                        }`}
                        aria-current={
                          activeComponent === item.id ? "page" : undefined
                        }
                      >
                        {item.label}
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
            </nav>

            {/* Close Button (Visible only on mobile) */}
            <button
              onClick={toggleSidebar}
              className="md:hidden flex"
              aria-label="Close sidebar"
            >
              <img
                src="Cross.svg"
                alt="Close menu"
                className="w-7 h-7 hover:brightness-125 transition-all"
              />
            </button>
          </div>
        </div>

        {/* Sidebar Background - Desktop */}
        <div className="bg-gray-900 max-md:hidden absolute w-64 h-full" />

        {/* Main Content */}
        <main className="flex-1 relative ml-0 p-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden max-xs:top-8 top-24 z-10 left-4 bg-white p-2 rounded-full shadow-lg hover:brightness-125 transition-all"
            aria-expanded={isSidebarOpen}
            aria-label="Toggle menu"
          >
            <img src="menu.png" alt="Menu" className="w-6 h-6" />
          </button>

          {/* Content Area */}
          <div className="md:ml-64 ">{renderContent()}</div>
        </main>
      </div>
    </>
  );
};

export default SkillsDashboard;
