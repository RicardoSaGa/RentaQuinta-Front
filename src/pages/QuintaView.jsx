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

  if (!fotos || fotos.length === 0) return null;

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
        className="max-h-[90%] max-w-[90%] rounded-xl shadow-xl object-contain"
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

  // GOOGLE ANALYTICS
  useEffect(() => {
    if (quinta && window.gtag) {
      window.gtag("event", "view_quinta", {
        quinta_id: quinta.id,
        nombre: quinta.nombre,
        ubicacion: quinta.ubicacion,
      });
    }
  }, [quinta]);

  const pagarConStripe = async () => {
    if (!idReserva) {
      return alert("No se encontró la reserva. Intenta reservar de nuevo.");
    }

    if (window.gtag) {
      window.gtag("event", "checkout_started", {
        reserva_id: idReserva,
        quinta_id: quinta.id,
      });
    }


    try {
      const res = await API.post("/pagos/stripe/checkout", null, {
        params: { idReserva },
      });

      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("No se pudo obtener la URL de pago.");
      }
    } catch (err) {
      console.log(err);
      alert("Ocurrió un problema al iniciar el pago con tarjeta.");
    }
  };

  const pagarPorTransferencia = () => {
    console.log("Mostrar instrucciones de transferencia bancaria.");
  };

  const reservar = () => {
    if (!selectedRange) {
      return alert("Selecciona un rango de fechas para reservar.");
    }

    if (!nombreCliente || !telefonoCliente || !emailCliente) {
      return alert("Por favor completa los datos obligatorios.");
    }

    // GOOGLE ANALYTICS | EVENTO GA4: intentar reservar
    if (window.gtag) {
      window.gtag("event", "attempt_reserve", {
        quinta_id: quinta.id,
        fecha_inicio: selectedRange.startDate.toISOString().slice(0, 10),
        fecha_fin: selectedRange.endDate.toISOString().slice(0, 10),
      });
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

        if (window.gtag) {
          window.gtag("event", "reserva_creada", {
            reserva_id: res.data.id,
            quinta_id: id,
          });
        }

        setIdReserva(res.data.id);
        setModalTitulo("Reserva creada");
        setModalMensaje("Selecciona tu método de pago para continuar.");
        setModalOpen(true);
      })
      .catch((err) => console.log(err));
  };

  if (!quinta) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-textc/70">
        Cargando...
      </div>
    );
  }

  const fotos = quinta.fotos || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Encabezado */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-textc tracking-tight">
            {quinta.nombre}
          </h1>

          <div className="flex items-center gap-2 text-textc/70 text-sm md:text-base">
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
            <span>{quinta.ubicacion}</span>
          </div>
        </div>

        {/* Galería tipo Airbnb */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-xl h-[380px] md:h-[420px] bg-muted/20">
          {/* Foto principal */}
          <div className="lg:col-span-2 relative h-full">
            <img
              src={fotos[0]?.url || "/noimage.png"}
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
              className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
            >
              Ver todas las fotos
            </button>
          </div>

          {/* Columnas derechas */}
          <div className="grid grid-rows-2 gap-3 h-full">
            <img
              src={fotos[1]?.url || fotos[0]?.url || "/noimage.png"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setFotoInicial(1);
                setMostrarGaleria(true);
              }}
            />

            <img
              src={fotos[2]?.url || fotos[0]?.url || "/noimage.png"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setFotoInicial(2);
                setMostrarGaleria(true);
              }}
            />
          </div>
        </div>

        {/* Descripción + datos + amenidades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Columna izquierda: descripción, capacidad, amenidades */}
          <div className="lg:col-span-2 space-y-6">
            <p className="text-base md:text-lg text-textc/80 leading-relaxed">
              {quinta.descripcion}
            </p>

            <div className="flex flex-wrap gap-4 text-sm md:text-base text-textc/80">
              <span>
                Capacidad: <b>{quinta.capacidad}</b> personas
              </span>
              <span>
                Precio base:{" "}
                <b className="text-primary">${quinta.precioBase}</b> MXN
              </span>
            </div>

            <div className="mt-4">
              <Amenidades quinta={quinta} />
            </div>

            {/* Mapa */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-3 text-textc">
                Ubicación
              </h2>

              <MapContainer
                center={extraerCoordenadas(quinta)}
                zoom={15}
                scrollWheelZoom={false}
                className="h-[280px] w-full rounded-xl overflow-hidden shadow-md"
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
            <div className="mt-8 rounded-xl shadow-md bg-white border border-muted/40 p-4">
              <h3 className="text-xl font-semibold mb-2 text-textc">
                Vista 360°
              </h3>
              <Panorama360 imageUrl={quinta.foto360} />
            </div>
          </div>

          {/* Columna derecha: caja de reserva estilo Airbnb */}
          <div className="sticky top-24 bg-white border border-muted/40 rounded-2xl shadow-xl p-6 space-y-5 h-fit">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold text-textc">
                  ${quinta.precioBase}
                </div>
                <div className="text-textc/70 text-sm">MXN / noche</div>
              </div>
            </div>

            <ReservaCalendar
              quintaId={id}
              onDateSelect={(sel) => setSelectedRange(sel)}
            />

            {/* FORMULARIO DE DATOS DEL CLIENTE */}
            <div className="space-y-4 mt-2">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full border border-muted/60 rounded-full px-4 py-2 text-textc focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Tu teléfono"
                className="w-full border border-muted/60 rounded-full px-4 py-2 text-textc focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
              />

              <input
                type="email"
                placeholder="Tu correo"
                className="w-full border border-muted/60 rounded-full px-4 py-2 text-textc focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
              />

              <textarea
                placeholder="Mensaje opcional (motivo, número de personas, evento...)"
                className="w-full border border-muted/60 rounded-xl px-4 py-2 text-textc focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 resize-none h-24"
                value={mensajeCliente}
                onChange={(e) => setMensajeCliente(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={reservar}
              className="w-full bg-primary text-white text-base font-semibold py-3 rounded-full hover:bg-accent transition shadow-sm"
            >
              Reservar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Modal de fotos */}
      {mostrarGaleria && (
        <ModalGaleria
          fotos={fotos}
          indexInicial={fotoInicial}
          onClose={() => setMostrarGaleria(false)}
        />
      )}

      {/* Modal de reserva */}
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
