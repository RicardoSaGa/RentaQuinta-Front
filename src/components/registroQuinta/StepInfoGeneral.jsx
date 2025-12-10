import { useEffect, useState } from "react";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import Alert from "../ui/Alert";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function StepInfoGeneral({ step, setStep, quintaData, setQuintaData }) {
    const [nombre, setNombre] = useState(quintaData.nombre || "");
    const [precio, setPrecio] = useState(quintaData.precio || "");
    const [capacidad, setCapacidad] = useState(quintaData.capacidad || "");
    const [descripcion, setDescripcion] = useState(quintaData.descripcion || "");
    const [direccion, setDireccion] = useState(quintaData.direccion || "");
    const [municipio, setMunicipio] = useState(quintaData.municipio || "");

    const [lat, setLat] = useState(quintaData.lat || 25.6866);
    const [lng, setLng] = useState(quintaData.lng || -100.3161);

    const [sugerencias, setSugerencias] = useState([]);
    const [error, setError] = useState("");

    // buscar direcciones en Mapbox
    const buscarDireccion = async (texto) => {
        if (texto.length < 3) {
            setSugerencias([]);
            return;
        }

        const resp = await geocodingClient
            .forwardGeocode({
                query: texto,
                autocomplete: true,
                limit: 5,
                countries: ["mx"],
            })
            .send();

        const matches = resp.body.features || [];
        setSugerencias(matches);
    };

    // cuando el usuario elige una sugerencia
    const seleccionarDireccion = (item) => {
        setDireccion(item.place_name);

        const [lngSel, latSel] = item.center;
        setLat(latSel);
        setLng(lngSel);

        setSugerencias([]);
    };

    // pin arrastrable — actualiza ubicación
    function PinMovible() {
        useMapEvents({
            dragend() { },
        });

        // Componente para mover la cámara del mapa cuando cambian lat/lng
        function ActualizarMapa({ center }) {
            const map = useMap();
            useEffect(() => {
                map.setView(center, 15); // 15 es el zoom
            }, [center, map]);
            return null;
        }

        return (
            <Marker
                position={[lat, lng]}
                icon={markerIcon}
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const marker = e.target;
                        const pos = marker.getLatLng();
                        setLat(pos.lat);
                        setLng(pos.lng);
                    },
                }}
            />
        );
    }

    function ActualizarMapa({ center }) {
        const map = useMap();
        useEffect(() => {
            map.setView(center, 15);
        }, [center, map]);
        return null;
    }

    const validar = () => {
        if (!nombre.trim()) return "El nombre es obligatorio.";
        if (!precio.trim() || isNaN(precio)) return "El precio debe ser un número.";
        if (!capacidad.trim() || isNaN(capacidad)) return "La capacidad debe ser un número.";
        if (!descripcion.trim() || descripcion.length < 20)
            return "Describe tu quinta con al menos 20 caracteres.";
        if (!direccion.trim()) return "Selecciona una dirección válida.";
        return null;
    };

    const continuar = () => {
        const v = validar();
        if (v) {
            setError(v);
            return;
        }

        // guardar en estado global
        setQuintaData({
            ...quintaData,
            nombre,
            precio,
            capacidad,
            descripcion,
            direccion,
            municipio,
            lat,
            lng,
        });

        setStep(3);
    };

    return (
        <div className="max-w-3xl">

            <h1 className="text-2xl font-bold text-gray-800 mb-3">
                Información general de la quinta
            </h1>
            <p className="text-sm text-gray-600 mb-6">
                Introduce la información principal de tu quinta para que los clientes la conozcan.
            </p>

            {error && <Alert status="error">{error}</Alert>}

            {/* Nombre */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la quinta</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>

            {/* Precio */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio por noche (MXN)</label>
                <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
            </div>

            {/* Capacidad */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad máxima</label>
                <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                />
            </div>

            {/* Descripción */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl h-32"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
            </div>

            {/* Dirección con autocompletado */}
            <div className="mt-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={direccion}
                    onChange={(e) => {
                        setDireccion(e.target.value);
                        buscarDireccion(e.target.value);
                    }}
                />

                {sugerencias.length > 0 && (
                    <div className="absolute left-0 right-0 bg-white border rounded-xl shadow mt-1 z-20">
                        {sugerencias.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => seleccionarDireccion(item)}
                                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            >
                                {item.place_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Municipio */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                />
            </div>

            {/* Mapa */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación en el mapa</label>

                <MapContainer
                    center={[lat, lng]}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: "350px", width: "100%", borderRadius: "15px" }}
                >
                    <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
                    />

                    <ActualizarMapa center={[lat, lng]} />

                    <PinMovible />
                </MapContainer>

                <p className="text-xs text-gray-500 mt-2">
                    Puedes mover el pin para ajustar la ubicación exacta.
                </p>
            </div>

            {/* Botón continuar */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={continuar}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}

export default StepInfoGeneral;
