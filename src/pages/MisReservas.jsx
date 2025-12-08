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
        <p className="text-textc/70">Cargando tus reservas...</p>
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-textc mb-3">
          No tienes reservas aún
        </h2>
        <p className="text-textc/70">
          Cuando reserves una quinta aparecerá aquí.
        </p>
      </div>
    );
  }

  const estadoClase = {
    CONFIRMADA: "text-green-700 bg-green-100",
    PENDIENTE: "text-yellow-700 bg-yellow-100",
    CANCELADA: "text-red-700 bg-red-100",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-textc">
        Mis Reservas
      </h1>

      <div className="grid grid-cols-1 gap-7">
        {reservas.map((r) => {
          const fechaInicio = new Date(r.inicio).toLocaleDateString(
            "es-MX",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          );

          const fechaFin = new Date(r.fin).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={r.idReserva}
              className="bg-white border border-muted/40 rounded-2xl p-5 flex flex-col md:flex-row gap-6 shadow-md hover:shadow-lg transition"
            >
              <img
                src={r.fotoPrincipalQuinta}
                alt={r.nombreQuinta}
                className="w-full md:w-48 h-40 object-cover rounded-xl shadow-sm"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-textc">
                    {r.nombreQuinta}
                  </h2>

                  <p className="text-textc/70 text-sm mt-1">
                    {r.direccionQuinta}
                  </p>

                  <div className="mt-3 space-y-1 text-textc/80">
                    <p>
                      <span className="font-semibold">Entrada:</span>{" "}
                      {fechaInicio}
                    </p>
                    <p>
                      <span className="font-semibold">Salida:</span>{" "}
                      {fechaFin}
                    </p>
                  </div>

                  <span
                    className={`inline-block mt-4 px-3 py-1 text-sm font-semibold rounded-full ${estadoClase[r.estado]}`}
                  >
                    {r.estado}
                  </span>
                </div>

                <div className="mt-5">
                  <Link
                    to={`/reserva/${r.idReserva}`}
                    className="inline-block bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-accent transition"
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
