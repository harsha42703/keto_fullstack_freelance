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

const GraphStudent: React.FC = () => {
  // Dummy data
  const dummyData = Array.from({ length: 20 }, (_, i) => ({
    examName: `Exam ${i + 1}`,
    examDate: new Date(2024, 11, i + 1).toLocaleDateString(),
    score: Math.floor(Math.random() * 100) + 1,
    attempted: Math.random() > 0.5,
  }));

  // Processed data
  const examNames = dummyData.map((data) => data.examName);
  const scores = dummyData.map((data) => data.score);
  const examDates = dummyData.map((data) => data.examDate);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const averageScoresArray = Array(scores.length).fill(averageScore);
  const attemptedCount = dummyData.filter((data) => data.attempted).length;
  const notAttemptedCount = dummyData.length - attemptedCount;

  // Bar Chart Options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#4A5568", // Dark gray for labels
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#EDF2F7", // Light tooltip background
        titleColor: "#2D3748", // Dark tooltip text
        bodyColor: "#2D3748",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#4A5568", // Dark gray ticks
        },
        grid: {
          color: "#CBD5E0", // Light gray gridlines
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
    labels: examNames,
    datasets: [
      {
        label: "Scores",
        data: scores,
        backgroundColor: "#63B3ED", // Light blue bars
        hoverBackgroundColor: "#3182CE", // Darker blue hover
        barThickness: 12,
      },
      {
        label: "Average Score",
        data: averageScoresArray,
        type: "line" as const,
        borderColor: "#48BB78", // Green line
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  // Pie Chart Options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#4A5568", // Dark gray labels
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
    labels: ["Attempted", "Not Attempted"],
    datasets: [
      {
        label: "Attempts",
        data: [attemptedCount, notAttemptedCount],
        backgroundColor: ["#F6AD55", "#63B3ED"], // Orange and blue
        hoverBackgroundColor: ["#DD6B20", "#3182CE"],
      },
    ],
  };

  // Line Chart Options
  const lineOptions = {
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

  const lineData = {
    labels: examDates,
    datasets: [
      {
        label: "Scores",
        data: scores,
        borderColor: "#3182CE", // Blue line
        backgroundColor: "rgba(99, 179, 237, 0.2)", // Transparent blue fill
        pointBackgroundColor: "#3182CE",
        pointBorderColor: "#2D3748",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen border-gray-400 border rounded-lg shadow-lg">
      <h1 className="text-left text-gray-800 text-4xl font-bold mb-8">Your Performance</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Exam Scores with Average</h2>
          <Bar options={barOptions} data={barData} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-700 text-xl font-semibold mb-4">Attempted vs Not Attempted</h2>
          <Pie options={pieOptions} data={pieData} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-gray-700 text-xl font-semibold mb-4">Scores by Exam Date</h2>
        <Line options={lineOptions} data={lineData} />
      </div>
    </div>
  );
};

export default GraphStudent;
