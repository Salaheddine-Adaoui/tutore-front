// src/components/Dashboard.tsx

"use client"; // Only needed if you use Next.js App Router and require client-side rendering.

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register Chart.js modules (includes additional modules for Bar and Pie charts)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // Line Chart Data (Revenue Growth)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales",
        data: [150, 200, 300, 250, 450, 500, 600],
        borderColor: "#38BDF8", // Tailwind sky-400
        backgroundColor: "rgba(56, 189, 248, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: { display: true, text: "Revenue Growth (2025)", color: "#fff" },
      tooltip: { bodyColor: "#000", backgroundColor: "#fff" },
    },
    scales: {
      x: {
        ticks: { color: "#A3A3A3" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#A3A3A3" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  // Bar Chart Data (Monthly Purchases) with blue color replacing yellow
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Purchases",
        data: [80, 120, 160, 140, 190, 220],
        backgroundColor: "#60A5FA", // Different blue (Tailwind blue-400)
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: { display: true, text: "Monthly Purchases", color: "#fff" },
      tooltip: { bodyColor: "#000", backgroundColor: "#fff" },
    },
    scales: {
      x: {
        ticks: { color: "#A3A3A3" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#A3A3A3" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  // Pie Chart Data (User Distribution) with three different shades of blue
  const pieData = {
    labels: ["Desktop", "Mobile", "Tablet"],
    datasets: [
      {
        label: "User Devices",
        data: [55, 30, 15],
        backgroundColor: ["#93C5FD", "#60A5FA", "#3B82F6"], // Three blue shades
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: { display: true, text: "User Device Distribution", color: "#fff" },
      tooltip: { bodyColor: "#000", backgroundColor: "#fff" },
    },
  };

  return (
    <section className="bg-gradient-to-r from-[#0B0D17] to-[#111827] text-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Dashboard</h2>

        {/* Simple Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Users</h3>
            <p className="text-4xl font-bold">1,234</p>
          </div>
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Active Sessions</h3>
            <p className="text-4xl font-bold">120</p>
          </div>
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Monthly Revenue</h3>
            <p className="text-4xl font-bold">$4,560</p>
          </div>
        </div>

        {/* Charts in a Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md h-96">
            <Line data={lineData} options={lineOptions} />
          </div>
          {/* Bar Chart */}
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md h-96">
            <Bar data={barData} options={barOptions} />
          </div>
          {/* Pie Chart */}
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md h-96">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
