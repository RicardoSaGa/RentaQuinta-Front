import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";


export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header global */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm min-h-[calc(100vh-64px)]">
          <nav className="p-6 space-y-4">
            <Link
              to="/dashboard"
              className="block text-gray-800 font-medium hover:text-primary transition"
            >
              Panel general
            </Link>

            <Link
              to="/dashboard/mis-quintas"
              className="block text-gray-800 font-medium hover:text-primary transition"
            >
              Mis quintas
            </Link>

            <Link
              to="/dashboard/reservas"
              className="block text-gray-800 font-medium hover:text-primary transition"
            >
              Reservas recibidas
            </Link>

            <Link
              to="/dashboard/nueva-quinta"
              className="block text-gray-800 font-medium hover:text-primary transition"
            >
              Registrar nueva quinta
            </Link>

            <Link
              to="/dashboard/soporte"
              className="block text-gray-800 font-medium hover:text-primary transition"
            >
              Soporte
            </Link>
          </nav>
        </aside>

        {/* Contenido dinámico */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
