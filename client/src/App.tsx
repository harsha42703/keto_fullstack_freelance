import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeProvider";
import { useUser } from "./Context/userContext";
import ThemePicker from "./ThemePicker";
import DashboardLayout from "./UI/layouts/DashboardLayout";
import { AdminDashboard } from "./UI/dashboards/AdminDashboard";
import { TeacherDashboard } from "./UI/dashboards/TeacherDashboard";
import { StudentDashboard } from "./UI/dashboards/StudentDashboard";
import { ParentDashboard } from "./UI/dashboards/ParentDasboard";
import Login from "./UI/Login";
import ProtectedRoute from "./UI/ProtectedRoute";
import ExamCreation from "./UI/ExamCreation";
import MemberRegister from "./UI/MemberRegister";
import RegisterExternal from "./UI/pages/RegisterExternal";
import RegistrationRequests from "./UI/pages/RegistrationRequests";
import StudentExams from "./UI/pages/StudentExams";
import RegisteredStudentExams from "./UI/pages/RegisteredStudentExams";
import ExamAttempt from "./UI/pages/ExamAttempt";

// Dummy components
const ManageUsers = () => <div>Manage Users</div>;
const ViewReports = () => <div>View Reports</div>;
const CreateExam = () => <div>Create Exam</div>;
const ViewExams = () => <div>View Exams</div>;

const ProgressReport = () => <div>Progress Report</div>;
const StudentProfile = () => <div>Student Profile</div>;
const ParentProfile = () => <div>Parent Profile</div>;
const ParentViewStudentProgress = () => <div>View Student Progress</div>;
const TeacherProfile = () => <div>Teacher Profile</div>;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            email: data.user.email,
            name: data.user.name,
            role: data.role,
          });
        } else {
          setUser({
            email: "",
            name: "",
            role: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({
          email: "",
          name: "",
          role: "",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App bg-theme-500">
          {/* <ThemePicker /> */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DashboardLayout role="ADMIN">
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-user"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DashboardLayout role="ADMIN">
                    <MemberRegister />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/registration-requests"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DashboardLayout role="ADMIN">
                    <RegistrationRequests />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-reports"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DashboardLayout role="ADMIN">
                    <ViewReports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <DashboardLayout role="TEACHER">
                    <TeacherDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/create-exam"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <DashboardLayout role="TEACHER">
                    <ExamCreation />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/view-exams"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <DashboardLayout role="TEACHER">
                    <ViewExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/dashboard/profile"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <DashboardLayout role="TEACHER">
                    <TeacherProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <DashboardLayout role="STUDENT">
                    <StudentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exams"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <DashboardLayout role="STUDENT">
                    <StudentExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/registered"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <DashboardLayout role="STUDENT">
                    <RegisteredStudentExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attempt/:id"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <DashboardLayout role="STUDENT">
                    <ExamAttempt />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/progress-report"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <DashboardLayout role="STUDENT">
                    <ProgressReport />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard/profile"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <DashboardLayout role="STUDENT">
                    <StudentProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Parent Routes */}
            <Route
              path="/parent/dashboard"
              element={
                <ProtectedRoute requiredRole="PARENT">
                  <DashboardLayout role="PARENT">
                    <ParentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/view-student-progress"
              element={
                <ProtectedRoute requiredRole="PARENT">
                  <DashboardLayout role="PARENT">
                    <ProgressReport />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/dashboard/profile"
              element={
                <ProtectedRoute requiredRole="PARENT">
                  <DashboardLayout role="PARENT">
                    <ParentProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<RegisterExternal />} />

            {/* 404 Route */}
            <Route
              path="*"
              element={<div className="text-7xl">404 not found</div>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
