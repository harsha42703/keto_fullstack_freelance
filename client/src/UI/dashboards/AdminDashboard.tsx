import { DashboardSection } from "../DashboardSection";
import ExamApprove from "../ExamApprove";
import GraphAdmin from "../pages/GraphAdmin";
import { StatCard } from "../StatCard";
import { Users, BookOpen, Clock, Activity } from "lucide-react";

export const AdminDashboard = () => {
  return (
    <div className="space-y-6 sm:mt-0 md:mt-0 lg:mt-0 mt-12">
      {/* Header */}

      {/* Title */}
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stat Cards Section */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <StatCard
            title="My Exams"
            value={12}
            icon={BookOpen}
            color="cyan"
            description="Total exams created"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <StatCard
            title="Active Exams"
            value={3}
            color="green"
            icon={Clock}
            description="Currently ongoing"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <StatCard
            title="Students"
            color="yellow"
            value={150}
            icon={Users}
            description="Enrolled students"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <StatCard
            title="Avg Performance"
            color="blue"
            value="82%"
            icon={Activity}
            description="Student average"
          />
        </div>
      </div>

      {/* Upcoming Exams Section */}
      <GraphAdmin/>
      <DashboardSection
        title="Upcoming Exams"
        description="Scheduled examinations"
      />
      <ExamApprove />
    </div>
  );
};
