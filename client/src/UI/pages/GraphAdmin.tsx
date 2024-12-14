import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const GraphAdmin: React.FC = () => {
  const dummyData = Array.from({ length: 20 }, (_, i) => ({
    department: `Department ${i + 1}`,
    totalStudents: Math.floor(Math.random() * 500) + 100,
    facultyCount: Math.floor(Math.random() * 50) + 10,
    parentFeedback: Math.floor(Math.random() * 100),
    studentPerformance: Math.floor(Math.random() * 100),
    examsConducted: Math.floor(Math.random() * 20) + 5,
  }));

  const departments = dummyData.map((data) => data.department);
  const totalStudents = dummyData.map((data) => data.totalStudents);
  const facultyCount = dummyData.map((data) => data.facultyCount);
  const parentFeedback = dummyData.map((data) => data.parentFeedback);
  const studentPerformance = dummyData.map((data) => data.studentPerformance);
  const examsConducted = dummyData.map((data) => data.examsConducted);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#4A5568",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#EDF2F7",
        titleColor: "#2D3748",
        bodyColor: "#2D3748",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#4A5568",
        },
        grid: {
          color: "#CBD5E0",
        },
      },
      y: {
        ticks: {
          color: "#4A5568",
        },
        grid: {
          color: "#CBD5E0",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#4A5568",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "#EDF2F7",
        titleColor: "#2D3748",
        bodyColor: "#2D3748",
      },
    },
  };

  const barData = {
    labels: departments,
    datasets: [
      {
        label: "Total Students",
        data: totalStudents,
        backgroundColor: "#63B3ED",
        hoverBackgroundColor: "#3182CE",
        barThickness: 12,
      },
      {
        label: "Faculty Count",
        data: facultyCount,
        backgroundColor: "#48BB78",
        hoverBackgroundColor: "#2F855A",
        barThickness: 12,
      },
    ],
  };

  const performanceData = {
    labels: departments,
    datasets: [
      {
        label: "Parent Feedback",
        data: parentFeedback,
        backgroundColor: "#F6AD55",
        hoverBackgroundColor: "#DD6B20",
        barThickness: 12,
      },
      {
        label: "Student Performance",
        data: studentPerformance,
        backgroundColor: "#805AD5",
        hoverBackgroundColor: "#6B46C1",
        barThickness: 12,
      },
    ],
  };

  const pieData = {
    labels: ["Students", "Exams Conducted"],
    datasets: [
      {
        label: "Admin Statistics",
        data: [
          dummyData.reduce((acc, data) => acc + data.totalStudents, 0),
          dummyData.reduce((acc, data) => acc + data.examsConducted, 0),
        ],
        backgroundColor: ["#F6AD55", "#63B3ED"],
        hoverBackgroundColor: ["#DD6B20", "#3182CE"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen border-gray-400 border rounded-lg shadow-lg">
      <h1 className="text-left text-gray-800 text-4xl font-bold mb-8">Admin Control Panel</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Student and Faculty Overview</h2>
          <Bar options={barOptions} data={barData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Performance Metrics</h2>
          <Bar options={barOptions} data={performanceData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Student and Exam Statistics</h2>
          <Pie options={pieOptions} data={pieData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Faculty Distribution</h2>
          <Pie
            options={pieOptions}
            data={{
              labels: ["Engineering", "Science", "Arts", "Management"],
              datasets: [
                {
                  data: [120, 80, 150, 90],
                  backgroundColor: ["#4FD1C5", "#63B3ED", "#F6AD55", "#68D391"],
                  hoverBackgroundColor: ["#2C7A7B", "#3182CE", "#DD6B20", "#2F855A"],
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Parent Feedback Scores</h2>
          <Line
            options={barOptions}
            data={{
              labels: departments,
              datasets: [
                {
                  label: "Feedback Score",
                  data: parentFeedback,
                  backgroundColor: "#4299E1",
                  borderColor: "#3182CE",
                  fill: false,
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Overall Exam Trends</h2>
          <Line
            options={barOptions}
            data={{
              labels: departments,
              datasets: [
                {
                  label: "Exams Conducted",
                  data: examsConducted,
                  backgroundColor: "#F56565",
                  borderColor: "#C53030",
                  fill: false,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphAdmin;
