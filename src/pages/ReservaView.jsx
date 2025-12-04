import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function ReservaView() {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const res = await API.get(`/quintas/reservas/${id}`);
        setReserva(res.data);
      } catch (err) {
        setError("No se pudo cargar la reservación.");
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-gray-600">Cargando reserva...</p>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Ya tenemos los datos de la reserva
  const {
    id: idReserva,
    fechaInicio,
    fechaFin,
    quinta,
    estado,
    precioTotal
  } = reserva;

  const googleMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    quinta.direccion
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Reserva #{idReserva}
      </h1>

      {/* Foto principal */}
      <img
        src={quinta.fotoPrincipal}
        alt={quinta.nombre}
        className="w-full h-72 object-cover rounded-xl mb-6 shadow"
      />

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {quinta.nombre}
        </h2>

        <p className="text-gray-600 mb-4">{quinta.direccion}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <div>
            <p className="font-semibold">Entrada:</p>
            <p>{fechaInicio}</p>
          </div>

          <div>
            <p className="font-semibold">Salida:</p>
            <p>{fechaFin}</p>
          </div>

          <div>
            <p className="font-semibold">Estado de la reserva:</p>
            <p
              className={`font-bold ${
                estado === "CONFIRMADA"
                  ? "text-green-600"
                  : estado === "PENDIENTE"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {estado}
            </p>
          </div>

          <div>
            <p className="font-semibold">Precio total:</p>
            <p>${precioTotal} MXN</p>
          </div>

        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-6">
          <a
            href={googleMaps}
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Ver en Google Maps
          </a>

          <a
            href={`https://wa.me/${quinta.telefonoDueno}?text=Hola, tengo una duda sobre mi reservación #${idReserva}`}
            target="_blank"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}