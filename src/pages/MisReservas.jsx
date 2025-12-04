import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await API.get("/quintas/mis-reservas");
        setReservas(res.data);
      } catch (err) {
        console.error("Error al obtener reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Cargando tus reservas...</p>
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">No tienes reservas</h2>
        <p className="text-gray-600">Cuando reserves una quinta aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

      <div className="grid grid-cols-1 gap-6">
        {reservas.map((r) => {
          const fechaInicio = new Date(r.inicio).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          const fechaFin = new Date(r.fin).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          const estadoClase = {
            CONFIRMADA: "text-green-700 bg-green-100",
            PENDIENTE: "text-yellow-700 bg-yellow-100",
            CANCELADA: "text-red-700 bg-red-100",
          };

          return (
            <div
              key={r.idReserva}
              className="bg-white shadow rounded-xl p-5 flex flex-col md:flex-row gap-5"
            >
              {/* Imagen principal */}
              <img
                src={r.fotoPrincipalQuinta}
                alt={r.nombreQuinta}
                className="w-full md:w-48 h-40 object-cover rounded-xl"
              />

              {/* Información */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold">{r.nombreQuinta}</h2>
                  <p className="text-gray-600 text-sm">{r.direccionQuinta}</p>

                  <p className="mt-2">
                    <span className="font-semibold">Entrada:</span> {fechaInicio}
                  </p>
                  <p>
                    <span className="font-semibold">Salida:</span> {fechaFin}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-sm font-semibold rounded-full ${estadoClase[r.estado]}`}
                  >
                    {r.estado}
                  </span>
                </div>

                {/* Botón ver detalles */}
                <div className="mt-4">
                  <Link
                    to={`/reserva/${r.idReserva}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
