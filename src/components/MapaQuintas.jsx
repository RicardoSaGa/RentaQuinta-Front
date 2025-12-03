import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Fix de iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// -------------------------------------------------------
// 🟦 Componente interno que ajusta la vista del mapa
// -------------------------------------------------------
function AjustarVista({ quintas }) {
    const map = useMap();

    useEffect(() => {
        if (!quintas.length) return;

        // Solo una quinta → zoom directo
        if (quintas.length === 1) {
            const q = quintas[0];
            if (q.latitud && q.longitud) {
                map.setView([q.latitud, q.longitud], 14);
            }
            return;
        }

        // Varias quintas → ajustar bounds
        const coordenadasValidas = quintas
            .filter(q => q.latitud && q.longitud)
            .map(q => [q.latitud, q.longitud]);

        if (coordenadasValidas.length > 0) {
            map.fitBounds(coordenadasValidas, { padding: [50, 50] });
        }
    }, [quintas]);

    return null;
}

// -------------------------------------------------------

export default function MapaQuintas({ quintas }) {
    const navigate = useNavigate();

    const quintasConCoords = quintas.filter(
        q =>
            q.latitud !== null &&
            q.longitud !== null &&
            q.latitud !== undefined &&
            q.longitud !== undefined &&
            q.latitud !== "" &&
            q.longitud !== "" &&
            !isNaN(q.latitud) &&
            !isNaN(q.longitud)
    );

    return (
        <div className="w-full h-[75vh] rounded-2xl overflow-hidden shadow-lg">
            <MapContainer
                center={[25.6866, -100.3161]} // Monterrey por defecto
                zoom={11}
                className="w-full h-full"
            >
                {/* Ajustar vista dinámicamente */}
                <AjustarVista quintas={quintasConCoords} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {quintasConCoords.map((q) => (
                    <Marker key={q.id} position={[q.latitud, q.longitud]}>
                        <Popup maxWidth={250}>
                            <div className="w-[220px] rounded-xl overflow-hidden text-left">

                                {/* Foto */}
                                {q.foto ? (
                                    <img
                                        src={q.foto}
                                        className="w-full h-28 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-28 bg-gray-200 flex items-center justify-center text-gray-500">
                                        Sin foto
                                    </div>
                                )}

                                {/* Contenido */}
                                <div className="p-3">

                                    <h3 className="font-semibold text-base text-gray-900 leading-tight">
                                        {q.nombre}
                                    </h3>

                                    <p className="text-xs text-gray-600 mt-1">
                                        {q.ubicacion}
                                    </p>

                                    <p className="text-lg font-bold text-green-700 mt-2">
                                        ${q.precioBase} MXN
                                    </p>

                                    <button
                                        onClick={() => navigate(`/quintas/${q.id}`)}
                                        className="mt-3 w-full bg-gray-900 text-white text-sm py-1.5 rounded-lg hover:bg-gray-700 transition"
                                    >
                                        Ver Quinta
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
