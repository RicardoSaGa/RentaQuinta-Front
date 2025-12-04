import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function ReservaView() {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const res = await API.get(`/quintas/reservas/${id}`);
        setReserva(res.data);
      } catch (error) {
        console.error("Error cargando la reserva:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Cargando reserva...</p>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600 text-lg">No se encontró esta reserva.</p>
      </div>
    );
  }

  // Fechas en formato mexicano
  const fechaInicio = new Date(reserva.inicio).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fechaFin = new Date(reserva.fin).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Diferencia de noches
  const d1 = new Date(reserva.inicio);
  const d2 = new Date(reserva.fin);
  const diffMs = d2 - d1;
  const noches = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));



  const estadoClase = {
    CONFIRMADA: "text-green-700 bg-green-100",
    PENDIENTE: "text-yellow-700 bg-yellow-100",
    CANCELADA: "text-red-700 bg-red-100",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* FOTO PRINCIPAL */}
      <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 shadow">
        <img
          src={reserva.fotoPrincipalQuinta}
          alt={reserva.nombreQuinta}
          className="w-full h-full object-cover"
        />
      </div>

      {/* TITULO Y ESTADO */}
      <h1 className="text-3xl font-bold">{reserva.nombreQuinta}</h1>
      <p className="text-gray-600 text-lg">{reserva.direccionQuinta}</p>

      <span
        className={`inline-block mt-3 px-3 py-1 text-sm font-semibold rounded-full ${estadoClase[reserva.estado]}`}
      >
        {reserva.estado}
      </span>

      {/* SECCION FECHAS */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
        <h2 className="text-xl font-bold mb-2">Fechas</h2>
        <p>
          <span className="font-semibold">Entrada:</span> {fechaInicio}
        </p>
        <p>
          <span className="font-semibold">Salida:</span> {fechaFin}
        </p>
      </div>

      {/* SECCION INFORMACION DEL CLIENTE */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
        <h2 className="text-xl font-bold mb-2">Tus datos</h2>
        <p>
          <span className="font-semibold">Nombre:</span>{" "}
          {reserva.nombreCliente}
        </p>
        <p>
          <span className="font-semibold">Teléfono:</span>{" "}
          {reserva.telefonoCliente}
        </p>
        <p>
          <span className="font-semibold">Correo:</span>{" "}
          {reserva.emailCliente}
        </p>
      </div>

      {/* MENSAJE */}
      {reserva.mensajeCliente && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
          <h2 className="text-xl font-bold mb-2">Mensaje enviado</h2>
          <p className="text-gray-700">{reserva.mensajeCliente}</p>
        </div>
      )}

      {/* ANFITRIÓN / DUEÑO */}
      <div className="mt-8 p-5 rounded-xl border bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-3">Anfitrión</h2>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
            {reserva.nombreDueno?.charAt(0).toUpperCase()}
          </div>

          {/* Info del anfitrión */}
          <div>
            <p className="text-lg font-semibold">
              {reserva.nombreDueno}
            </p>
            <p className="text-gray-600">
              Teléfono: {reserva.telefonoDueno}
            </p>
          </div>
        </div>

        {/* RESUMEN DE PAGO */}
        <div className="mt-8 p-5 rounded-xl border bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">Resumen del pago</h2>

          <div className="flex justify-between mb-2">
            <span className="text-gray-700">
              {noches} noche{noches > 1 ? "s" : ""} en {reserva.nombreQuinta}
            </span>
            <span className="font-semibold">
              ${reserva.precioTotal?.toLocaleString("es-MX")}
            </span>
          </div>

          {/* Comisión opcional (tu parte o Stripe) */}
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Comisión</span>
            <span className="font-semibold">$0</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total pagado</span>
            <span>${reserva.precioTotal?.toLocaleString("es-MX")}</span>
          </div>
        </div>


        {/* Botón WhatsApp */}
        <a
          href={`https://wa.me/52${reserva.telefonoDueno}?text=Hola%20${encodeURIComponent(
            reserva.nombreDueno
          )},%20tengo%20una%20pregunta%20sobre%20mi%20reserva%20(${encodeURIComponent(
            reserva.nombreQuinta
          )}).`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Contactar por WhatsApp
        </a>
      </div>

      {/* ACCIONES */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">

        {/* BOTON MAPA */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            reserva.direccionQuinta
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg w-full md:w-auto font-semibold hover:bg-blue-700 transition text-center"
        >
          Ver en Google Maps
        </a>
      </div>
    </div>
  );
}