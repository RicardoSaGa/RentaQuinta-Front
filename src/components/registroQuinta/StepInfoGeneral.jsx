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

    // === NUEVO: esquema de precios y tarifas personalizadas ===
    const [esquemaPrecios, setEsquemaPrecios] = useState(
        quintaData.esquemaPrecios || "SENCILLO"
    );

    const [tarifas, setTarifas] = useState(quintaData.tarifasPersonalizadas || []);

    const [tarifaTemp, setTarifaTemp] = useState({
        diaSemana: "",
        tipoEvento: "",
        horas: "",
        precio: "",
    });

    const [diasSeleccionados, setDiasSeleccionados] = useState([]);


    const diasSemana = [
        { value: "1", label: "Lunes" },
        { value: "2", label: "Martes" },
        { value: "3", label: "Miércoles" },
        { value: "4", label: "Jueves" },
        { value: "5", label: "Viernes" },
        { value: "6", label: "Sábado" },
        { value: "7", label: "Domingo" },
    ];

    const tiposEvento = ["NORMAL", "INFANTIL", "XV", "BODA", "OTRO"];

    const agregarTarifa = () => {
        if (
            diasSeleccionados.length === 0 ||
            !tarifaTemp.tipoEvento ||
            !tarifaTemp.horas ||
            !tarifaTemp.precio
        ) {
            setError("Selecciona al menos un día y completa todos los campos de la tarifa.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const nuevasTarifas = diasSeleccionados.map((dia) => ({
            diaSemana: dia,
            tipoEvento: tarifaTemp.tipoEvento,
            horas: tarifaTemp.horas,
            precio: tarifaTemp.precio,
        }));

        setTarifas((prev) => [...prev, ...nuevasTarifas]);

        setTarifaTemp({
            diaSemana: "",
            tipoEvento: "",
            horas: "",
            precio: "",
        });
        setDiasSeleccionados([]);
    };


    const eliminarTarifa = (index) => {
        setTarifas((prev) => prev.filter((_, i) => i !== index));
    };

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

        function ActualizarMapaInterno({ center }) {
            const map = useMap();
            useEffect(() => {
                map.setView(center, 15);
            }, [center, map]);
            return null;
        }

        return (
            <>
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
                <ActualizarMapaInterno center={[lat, lng]} />
            </>
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

        if (esquemaPrecios === "AVANZADO" && tarifas.length === 0) {
            return "Agrega al menos una tarifa personalizada para el esquema avanzado.";
        }

        return null;
    };

    const continuar = () => {
        const v = validar();
        if (v) {
            setError(v);
            window.scrollTo({ top: 0, behavior: "smooth" });
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
            esquemaPrecios,
            tarifasPersonalizadas: tarifas,
        });

        setStep(6);
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la quinta
                </label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>

            {/* Precio base (simple) */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por noche (MXN)
                </label>
                <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
            </div>

            {/* ESQUEMA DE PRECIOS */}
            <div className="mt-4 border rounded-xl p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">
                    Esquema de precios
                </p>

                <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="esquemaPrecios"
                            value="SENCILLO"
                            checked={esquemaPrecios === "SENCILLO"}
                            onChange={() => setEsquemaPrecios("SENCILLO")}
                        />
                        <span>Usar solo el precio por noche como tarifa general.</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="esquemaPrecios"
                            value="AVANZADO"
                            checked={esquemaPrecios === "AVANZADO"}
                            onChange={() => setEsquemaPrecios("AVANZADO")}
                        />
                        <span>Configurar precios por día y tipo de evento.</span>
                    </label>
                </div>

                {esquemaPrecios === "AVANZADO" && (
                    <div className="mt-4 space-y-3">
                        <p className="text-xs text-gray-600">
                            Agrega tarifas específicas. Por ejemplo: sábado, boda, 10 horas, $6,500.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Días aplicables
                                </label>
                                <div className="border border-gray-300 rounded-lg p-2 text-xs max-h-32 overflow-y-auto bg-white">
                                    {diasSemana.map((d) => {
                                        const checked = diasSeleccionados.includes(d.value);
                                        return (
                                            <label
                                                key={d.value}
                                                className="flex items-center gap-2 mb-1 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-3 w-3"
                                                    checked={checked}
                                                    onChange={() => {
                                                        setDiasSeleccionados((prev) => {
                                                            if (prev.includes(d.value)) {
                                                                return prev.filter((v) => v !== d.value);
                                                            }
                                                            return [...prev, d.value];
                                                        });
                                                    }}
                                                />
                                                <span>{d.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tipo de evento
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    value={tarifaTemp.tipoEvento}
                                    onChange={(e) =>
                                        setTarifaTemp({ ...tarifaTemp, tipoEvento: e.target.value })
                                    }
                                >
                                    <option value="">Seleccionar</option>
                                    {tiposEvento.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Horas incluidas
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    value={tarifaTemp.horas}
                                    onChange={(e) =>
                                        setTarifaTemp({ ...tarifaTemp, horas: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Precio (MXN)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    value={tarifaTemp.precio}
                                    onChange={(e) =>
                                        setTarifaTemp({ ...tarifaTemp, precio: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={agregarTarifa}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                Agregar tarifa
                            </button>
                        </div>

                        {tarifas.length > 0 && (
                            <div className="mt-3 border rounded-lg divide-y bg-white">
                                {tarifas.map((t, idx) => {
                                    const dia = diasSemana.find((d) => d.value === t.diaSemana);
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between px-3 py-2 text-sm"
                                        >
                                            <span>
                                                {dia ? dia.label : "Día"} — {t.tipoEvento} — {t.horas} hrs — $
                                                {t.precio}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => eliminarTarifa(idx)}
                                                className="text-red-600 text-xs hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Capacidad */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad máxima
                </label>
                <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                />
            </div>

            {/* Descripción */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl h-32"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
            </div>

            {/* Dirección con autocompletado */}
            <div className="mt-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Municipio
                </label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                />
            </div>

            {/* Mapa */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación en el mapa
                </label>

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
