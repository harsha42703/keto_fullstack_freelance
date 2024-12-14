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

const GraphFaculty: React.FC = () => {
  const dummyData = Array.from({ length: 15 }, (_, i) => ({
    subject: `Subject ${i + 1}`,
    averageScore: Math.floor(Math.random() * 100) + 1,
    classStrength: Math.floor(Math.random() * 60) + 10,
    lecturesTaken: Math.floor(Math.random() * 50) + 1,
  }));

  const subjects = dummyData.map((data) => data.subject);
  const averageScores = dummyData.map((data) => data.averageScore);
  const classStrength = dummyData.map((data) => data.classStrength);
  const lecturesTaken = dummyData.map((data) => data.lecturesTaken);

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

  const barData = {
    labels: subjects,
    datasets: [
      {
        label: "Average Scores",
        data: averageScores,
        backgroundColor: "#63B3ED",
        hoverBackgroundColor: "#3182CE",
        barThickness: 12,
      },
      {
        label: "Class Strength",
        data: classStrength,
        backgroundColor: "#48BB78",
        hoverBackgroundColor: "#2F855A",
        barThickness: 12,
      },
    ],
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

  const pieData = {
    labels: ["Lectures Taken", "Lectures Pending"],
    datasets: [
      {
        label: "Lecture Status",
        data: [
          dummyData.reduce((acc, data) => acc + data.lecturesTaken, 0),
          dummyData.reduce((acc, data) => acc + 60 - data.lecturesTaken, 0),
        ],
        backgroundColor: ["#F6AD55", "#63B3ED"],
        hoverBackgroundColor: ["#DD6B20", "#3182CE"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen border-gray-400 border rounded-lg shadow-lg">
      <h1 className="text-left text-gray-800 text-4xl font-bold mb-8">Faculty Performance</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Average Scores by Subject</h2>
          <Bar options={barOptions} data={barData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Lecture Statistics</h2>
          <Pie options={pieOptions} data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default GraphFaculty;