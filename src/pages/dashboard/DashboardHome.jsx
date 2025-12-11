import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    aprobadas: 0,
    pendientes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "https://rentaquinta.com/api/owner/quintas/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(response.data);
      } catch (err) {
        console.log("Error cargando estadísticas", err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Hola, {user.nombre}
      </h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total de quintas</p>
          <p className="text-3xl font-semibold text-gray-800">{stats.total}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Aprobadas</p>
          <p className="text-3xl font-semibold text-green-600">
            {stats.aprobadas}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Pendientes de revisión</p>
          <p className="text-3xl font-semibold text-yellow-600">
            {stats.pendientes}
          </p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <Link
          to="/dashboard/nueva-quinta"
          className="p-8 bg-primary text-white rounded-xl text-center text-xl font-semibold shadow hover:bg-primary/90 transition"
        >
          Registrar nueva quinta
        </Link>

        <Link
          to="/dashboard/mis-quintas"
          className="p-8 bg-white border rounded-xl text-center text-xl font-semibold shadow hover:bg-gray-50 transition"
        >
          Ver mis quintas
        </Link>
      </div>
    </div>
  );
}
