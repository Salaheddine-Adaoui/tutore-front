// src/components/Dashboard.tsx

"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
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

// Register Chart.js modules
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

type MonthData = { month: string; count: number };
type CatData = { category: string; count: number };

export default function Dashboard() {
  // Get the logged‐in student ID (ensure you set this on login!)

  // const etudiantId = parseInt(localStorage.getItem("id_etudiant") || "0", 10);
  const etudiantId =2
  
  // Totals
  const [totals, setTotals] = useState({
    total_formations: 0,
    visited_count: 0,
    liked_count: 0,
  });

  // Breakdown data
  const [visitsByMonth, setVisitsByMonth] = useState<MonthData[]>([]);
  const [likesByCat, setLikesByCat] = useState<CatData[]>([]);
  const [visitsByCat, setVisitsByCat] = useState<CatData[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    if (!etudiantId) return;
    api
      .get(`/dashboard/${etudiantId}`)
      .then((res) => {
        const d = res.data;
        setTotals({
          total_formations: d.total_formations,
          visited_count: d.visited_count,
          liked_count: d.liked_count,
        });
        setVisitsByMonth(d.visits_by_month);
        setLikesByCat(d.likes_by_category);
        setVisitsByCat(d.visits_by_category);
      })
      .catch((err) => console.error("Failed to load dashboard stats", err));
  }, [etudiantId]);

  // Color palette for pie chart
  const pieColors = [
    "#93C5FD", // light blue
    "#60A5FA", // medium blue
    "#3B82F6", // darker blue
    "#2563EB",
    "#1E40AF",
    "#1E3A8A",
  ];

  // 1) Visits over time (Line)
  const lineData = {
    labels: visitsByMonth.map((d) => d.month),
    datasets: [
      {
        label: "Visites mensuelles",
        data: visitsByMonth.map((d) => d.count),
        borderColor: "#38BDF8",
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
      title: {
        display: true,
        text: "Nombre de visites par mois",
        color: "#fff",
      },
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

  // 2) Likes by category (Bar)
  const barData = {
    labels: likesByCat.map((d) => d.category),
    datasets: [
      {
        label: "Likes",
        data: likesByCat.map((d) => d.count),
        backgroundColor: "#60A5FA",
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: {
        display: true,
        text: "Nombre de formations aimées par catégorie",
        color: "#fff",
      },
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

  // 3) Visits by category (Pie) with explicit colors
  const pieData = {
    labels: visitsByCat.map((d) => d.category),
    datasets: [
      {
        data: visitsByCat.map((d) => d.count),
        backgroundColor: visitsByCat.map((_, idx) => pieColors[idx % pieColors.length]),
        hoverOffset: 4,
      },
    ],
  };
  const pieOptions = {
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: {
        display: true,
        text: "Nombre de visites par catégorie",
        color: "#fff",
      },
      tooltip: { bodyColor: "#000", backgroundColor: "#fff" },
    },
  };

  return (
    <section className="bg-gradient-to-r from-[#0B0D17] to-[#111827] text-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Dashboard</h2>

        {/* Totals */}
        <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Formations disponibles</h3>
            <p className="text-4xl font-bold">{totals.total_formations}</p>
          </div>
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Formations visitées</h3>
            <p className="text-4xl font-bold">{totals.visited_count}</p>
          </div>
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Formations aimées</h3>
            <p className="text-4xl font-bold">{totals.liked_count}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md h-96">
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md h-96">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="bg-[#1C1F29] rounded-lg p-6 shadow-md h-96">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
