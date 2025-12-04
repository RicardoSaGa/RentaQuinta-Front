import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Panorama360 from "../components/Panorama360";
import ReservaCalendar from "../components/ReservaCalendar";
import Amenidades from "../components/Amenidades";
import ModalReserva from "../components/ModalReserva";


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icon personalizado
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

// Extraer coordenadas desde lat/lng
function extraerCoordenadas(quinta) {
  if (!quinta.latitud || !quinta.longitud) return [25.6866, -100.3161];
  return [Number(quinta.latitud), Number(quinta.longitud)];
}

// Modal de galería fullscreen
function ModalGaleria({ fotos, onClose, indexInicial }) {
  const [index, setIndex] = useState(indexInicial);

  const siguiente = () => setIndex((prev) => (prev + 1) % fotos.length);
  const anterior = () =>
    setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl font-bold"
      >
        ✕
      </button>

      <button
        onClick={anterior}
        className="absolute left-5 text-white text-5xl"
      >
        ‹
      </button>

      <img
        src={fotos[index].url}
        className="max-h-[90%] max-w-[90%] rounded-xl shadow-xl"
      />

      <button
        onClick={siguiente}
        className="absolute right-5 text-white text-5xl"
      >
        ›
      </button>
    </div>
  );
}

function QuintaView() {

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalMensaje, setModalMensaje] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [quinta, setQuinta] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [fotoInicial, setFotoInicial] = useState(0);

  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [mensajeCliente, setMensajeCliente] = useState("");
  const [idReserva, setIdReserva] = useState(null);


  // Cargar info de la quinta
  useEffect(() => {
    API.get(`/quintas/${id}`)
      .then((res) => setQuinta(res.data))
      .catch((err) => console.log(err));
  }, [id]);

    const pagarConStripe = async () => {
    if (!idReserva) {
      return alert("No se encontró la reserva. Intenta reservar de nuevo.");
    }

    try {
      const res = await API.post("/pagos/stripe/checkout", null, {
        params: { idReserva },
      });

      if (res.data && res.data.url) {
        window.location.href = res.data.url; // redirige al Checkout de Stripe
      } else {
        alert("No se pudo obtener la URL de pago.");
      }
    } catch (err) {
      console.log(err);
      alert("Ocurrió un problema al iniciar el pago con tarjeta.");
    }
  };
  
  const pagarPorTransferencia = () => {
    // Aquí después mostrarás datos bancarios o redirigirás a una página de instrucciones
    console.log("Mostrar instrucciones de transferencia bancaria.");
  };


  const reservar = () => {
    if (!selectedRange) {
      return alert("Selecciona un rango de fechas para reservar.");
    }

    if (!nombreCliente || !telefonoCliente || !emailCliente) {
      return alert("Por favor completa los datos obligatorios.");
    }

    API.post(`/quintas/${id}/reservar`, {
      inicio: selectedRange.startDate.toISOString().slice(0, 10),
      fin: selectedRange.endDate.toISOString().slice(0, 10),
      nombreCliente,
      telefonoCliente,
      emailCliente,
      mensajeCliente,
    })
      .then((res) => {
        // Guardamos el id de la reserva para usarlo al pagar
        setIdReserva(res.data.id);

        setModalTitulo("Reserva creada");
        setModalMensaje("Selecciona tu método de pago para continuar.");
        setModalOpen(true);
      })
      .catch((err) => console.log(err));
  };

  if (!quinta) return <div className="p-10">Cargando...</div>;

  const fotos = quinta.fotos || [];

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-10">
      {/* Encabezado */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{quinta.nombre}</h1>

        <div className="flex items-center gap-2 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          {quinta.ubicacion}
        </div>
      </div>

      {/* Galería PRO tipo Airbnb */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-xl h-[420px]">
        {/* Foto principal */}
        <div className="lg:col-span-2 relative h-full">
          <img
            src={fotos[0]?.url}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              setFotoInicial(0);
              setMostrarGaleria(true);
            }}
          />

          <button
            onClick={() => {
              setFotoInicial(0);
              setMostrarGaleria(true);
            }}
            className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm"
          >
            Ver fotos
          </button>
        </div>

        {/* Columnas derechas */}
        <div className="grid grid-rows-2 gap-3 h-full">
          <img
            src={fotos[1]?.url || fotos[0]?.url}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              setFotoInicial(1);
              setMostrarGaleria(true);
            }}
          />

          <img
            src={fotos[2]?.url || fotos[0]?.url}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              setFotoInicial(2);
              setMostrarGaleria(true);
            }}
          />
        </div>
      </div>

      {/* Información */}
      <p className="text-lg text-gray-700">{quinta.descripcion}</p>

      <div className="flex gap-6 text-lg">
        <span>
          Capacidad: <b>{quinta.capacidad}</b> personas
        </span>
        <span>
          Precio base: <b>${quinta.precioBase}</b> MXN
        </span>
      </div>

      <Amenidades quinta={quinta} />

      {/* Mapa + Reserva */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lado izquierdo */}
        <div className="lg:col-span-2 space-y-10">
          {/* Mapa */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Ubicación</h2>

            <MapContainer
              center={extraerCoordenadas(quinta)}
              zoom={15}
              scrollWheelZoom={false}
              className="h-[300px] w-full rounded-xl overflow-hidden shadow"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={extraerCoordenadas(quinta)} icon={icon}>
                <Popup>
                  {quinta.nombre}
                  <br />
                  {quinta.ubicacion}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Tour 360 */}
          <div className="rounded-xl shadow bg-white p-4">
            <h3 className="text-xl font-bold mb-2">Vista 360°</h3>
            <Panorama360 imageUrl={quinta.foto360} />
          </div>
        </div>

        {/* Caja de reserva estilo Airbnb */}
        <div className="sticky top-24 bg-white border rounded-2xl shadow-xl p-6 space-y-5">
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold">${quinta.precioBase}</div>
            <div className="text-gray-600">MXN / noche</div>
          </div>

          <ReservaCalendar
            quintaId={id}
            onDateSelect={(sel) => setSelectedRange(sel)}
          />

          {/* FORMULARIO DE DATOS DEL CLIENTE */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Tu teléfono"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
            />

            <input
              type="email"
              placeholder="Tu correo"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              value={emailCliente}
              onChange={(e) => setEmailCliente(e.target.value)}
            />

            <textarea
              placeholder="Mensaje opcional (¿motivo de la renta?, ¿número de personas?, ¿evento?)"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24"
              value={mensajeCliente}
              onChange={(e) => setMensajeCliente(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={reservar}
            className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-green-700"
          >
            Reservar ahora
          </button>
        </div>
      </div>

      {/* Modal */}
      {mostrarGaleria && (
        <ModalGaleria
          fotos={fotos}
          indexInicial={fotoInicial}
          onClose={() => setMostrarGaleria(false)}
        />
      )}
      <ModalReserva
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo={modalTitulo}
        mensaje={modalMensaje}
        onPagarStripe={pagarConStripe}
        onPagarTransferencia={pagarPorTransferencia}
      />

    </div>

  );

}

export default QuintaView;
