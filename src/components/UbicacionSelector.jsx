import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function UbicacionSelector({ onSelect, onSelectText }) {
    const [open, setOpen] = useState(false);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [ubicaciones, setUbicaciones] = useState({});

    const ref = useRef();

    // Obtener lista dinámica de estados/municipios desde backend
    useEffect(() => {
        API.get("/quintas/ubicaciones")
            .then(res => setUbicaciones(res.data))
            .catch(console.error);
    }, []);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setEstadoSeleccionado(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const seleccionarMunicipio = (municipio) => {
        const full = `${estadoSeleccionado} - ${municipio}`;
        onSelect(full);
        setOpen(false);
        setEstadoSeleccionado(null);
    };

    return (
        <div className="relative" ref={ref}>
            {/* BOTÓN PRINCIPAL */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border px-4 py-2 rounded-full bg-white hover:shadow-md transition text-gray-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>

                <span>{onSelectText || "Ubicación"}</span>
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute top-12 left-0 bg-white shadow-xl rounded-2xl p-4 w-72 z-50 border border-gray-100 dropdown-fix">

                    {/* ESTADOS */}
                    {!estadoSeleccionado && (
                        <div className="space-y-2">
                            <div className="text-sm text-gray-400 mb-2">
                                Selecciona un estado
                            </div>

                            {Object.keys(ubicaciones).length === 0 && (
                                <div className="text-gray-500 text-sm">Cargando...</div>
                            )}

                            {Object.keys(ubicaciones).map((estado) => (
                                <button
                                    key={estado}
                                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition flex justify-between"
                                    onClick={() => setEstadoSeleccionado(estado)}
                                >
                                    {estado}
                                    <span className="text-gray-400">›</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* MUNICIPIOS */}
                    {estadoSeleccionado && (
                        <div>
                            <button
                                className="text-sm text-blue-600 mb-2"
                                onClick={() => setEstadoSeleccionado(null)}
                            >
                                ← Volver
                            </button>

                            <h3 className="font-semibold mb-2">{estadoSeleccionado}</h3>

                            <div className="space-y-2">
                                {ubicaciones[estadoSeleccionado]?.map((municipio) => (
                                    <button
                                        key={municipio}
                                        className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition"
                                        onClick={() => seleccionarMunicipio(municipio)}
                                    >
                                        {municipio}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default UbicacionSelector;

