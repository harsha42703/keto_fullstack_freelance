// src/components/layouts/DashboardLayout.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation, Outlet,matchPath  } from "react-router-dom";
import { Layout, LogOut, User, BookOpen, LineChart, Menu } from "lucide-react";
import { PiExam } from "react-icons/pi";


interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT"; // Pass role as a prop
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const location = useLocation();
  const isExamAttemptPage = matchPath("/student/attempt/:id", location.pathname);




  // Define navigation links based on the user role
  const links = [
    {
      to: `/${role.toLowerCase()}/dashboard`,
      label: "Dashboard",
      icon: <Layout className="w-5 h-5 mr-4" />,
    },
    role === "STUDENT" && {
      to: `/${role.toLowerCase()}/exams`,
      label: "Enroll",
      icon: <BookOpen className="w-5 h-5 mr-4" />,
    },
    role === "STUDENT" && {
      to: `/${role.toLowerCase()}/registered`,
      label: "Exams",
      icon: <BookOpen className="w-5 h-5 mr-4" />,
    },
    role === "ADMIN" && {
      to: "/admin/dashboard/reports",
      label: "Reports",
      icon: <LineChart className="w-5 h-5 mr-4" />,
    },
    role === "ADMIN" && {
      to: "/admin/dashboard/registration-requests",
      label: "Registration Requests",
      icon: <LineChart className="w-5 h-5 mr-4" />,
    },
    role === "ADMIN" && {
      to: "/admin/create-user",
      label: "Create User",
      icon: <User className="w-5 h-5 mr-4" />,
    },
    role === "TEACHER" && {
      to: "/teacher/create-exam",
      label: "Create Exam",
      icon: <PiExam className="w-5 h-5 mr-4" />,
    },
    {
      to: `/${role.toLowerCase()}/dashboard/profile`,
      label: "Profile",
      icon: <User className="w-5 h-5 mr-4" />,
    },
  ].filter(Boolean);

  return (
    <section>
      {/* Mobile Navbar */}
      <div className="bg-gray-200 w-full h-16 fixed block z-10 sm:hidden md:hidden lg:hidden">
        <div className="p-4">
          <h3 className="text-2xl font-bold">
            <span className="text-cyan-700">K</span>eto
            <span className="text-cyan-700">.</span>
          </h3>
        </div>
      </div>
  
      <div className="min-h-screen bg-gray-50 flex">
        {/* Toggle Button for Sidebar */}
        {!isExamAttemptPage && (
          <button
            onClick={toggleSidebar}
            className={`p-4 sm:hidden lg:hidden md:hidden z-50 fixed top-0 right-0 rounded-full inline-block ${
              isSidebarOpen ? "blur-md opacity-30 md:blur-0" : ""
            }`}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-8 h-8 text-gray-700" />
          </button>
        )}
  
        {/* Sidebar */}
        {!isExamAttemptPage && (
          <div
            ref={sidebarRef}
            className={`fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-lg transform transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          >
            <div className="p-6">
              <h3 className="text-5xl font-bold">
                <span className="text-cyan-700">K</span>eto
                <span className="text-cyan-700">.</span>
              </h3>
              <span className="text-cyan-800">Examination Portal</span>
            </div>
            <nav className="mt-6">
              <div className="px-4 space-y-2">
                {links.map(
                  (link) =>
                    link && (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          `flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg ${
                            isActive ? "bg-gray-200" : ""
                          }`
                        }
                        onClick={closeSidebar}
                      >
                        {link.icon}
                        {link.label}
                      </NavLink>
                    )
                )}
              </div>
            </nav>
            <div className="absolute bottom-0 w-full p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5 mr-4" />
                Logout
              </button>
            </div>
          </div>
        )}
  
        {/* Main Content */}
        <div
          className={`ml-0 ${
            !isExamAttemptPage ? "md:ml-64 p-8" : "overflow-hidden w-screen h-screen"
          }  transition-all duration-300 ${
            isSidebarOpen ? "blur-md z-50 opacity-25 md:blur-0" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );  
};

export default DashboardLayout;
