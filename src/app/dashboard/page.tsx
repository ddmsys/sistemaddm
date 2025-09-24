"use client";

import React, { useState, createContext, useContext, ReactNode } from "react";
// resto do código...
import CommercialDashboard from "@/components/dashboards/CommercialDashboard";

export default function DashboardPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Dashboard Comercial</h1>
      <CommercialDashboard />
    </main>
  );
}
