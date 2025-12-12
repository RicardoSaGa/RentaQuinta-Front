import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const ReservasDueno = () => {
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        API.get("/owner/reservas")
            .then((res) => setReservas(res.data))
            .catch(() => toast.error("Error al cargar reservas"));
    }, []);

    const confirmarReserva = async (id) => {
        try {
            await API.put(`/owner/reservas/${id}/confirmar`);
            toast.success("Reserva confirmada");

            // Actualizar estado local
            setReservas((prev) =>
                prev.map((r) =>
                    r.id === id ? { ...r, estado: "CONFIRMADA" } : r
                )
            );
        } catch {
            toast.error("No se pudo confirmar la reserva");
        }
    };

    return (
        <div className="px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Reservas recibidas</h1>

            {reservas.length === 0 && (
                <p className="text-gray-500">Aún no tienes reservaciones.</p>
            )}

            <div className="space-y-6">
                {reservas.map((r) => {
                    const fechaInicio = new Date(r.fechaInicio).toLocaleDateString(
                        "es-MX",
                        { day: "numeric", month: "short", year: "numeric" }
                    );

                    const fechaFin = new Date(r.fechaFin).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });

                    const fotoPrincipal =
                        r.quinta?.fotos?.length > 0
                            ? r.quinta.fotos[0].url
                            : "https://via.placeholder.com/400x300?text=Sin+Foto";

                    return (
                        <div
                            key={r.id}
                            className="bg-white p-4 rounded-xl shadow border flex gap-4"
                        >
                            {/* Foto */}
                            <img
                                src={fotoPrincipal}
                                alt="Foto Quinta"
                                className="w-40 h-32 object-cover rounded-xl"
                            />

                            {/* Información */}
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">{r.quinta?.nombre}</h2>

                                <div className="mt-2 text-gray-700 space-y-1">
                                    <p>
                                        <span className="font-semibold">Cliente:</span>{" "}
                                        {r.nombreCliente}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Evento:</span>{" "}
                                        {r.tipoEvento?.replace("_", " ")}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Horas:</span> {r.horas}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Precio total:</span> $
                                        {r.precioTotal?.toLocaleString("es-MX")}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Entrada:</span>{" "}
                                        {fechaInicio}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Salida:</span> {fechaFin}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Estado:</span>{" "}
                                        <span
                                            className={
                                                r.estado === "CONFIRMADA"
                                                    ? "text-green-600 font-semibold"
                                                    : r.estado === "CANCELADA"
                                                        ? "text-red-600 font-semibold"
                                                        : "text-yellow-600 font-semibold"
                                            }
                                        >
                                            {r.estado}
                                        </span>
                                    </p>

                                    {/* Comprobante */}
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700">Comprobante:</p>

                                        {r.comprobanteUrl ? (
                                            <a
                                                href={r.comprobanteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 inline-block px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Ver comprobante
                                            </a>
                                        ) : (
                                            <p className="mt-1 text-gray-500">Pendiente de comprobante</p>
                                        )}
                                    </div>

                                    {/* Botón confirmar */}
                                    {r.estado !== "CONFIRMADA" && (
                                        <button
                                            onClick={() => confirmarReserva(r.id)}
                                            className="mt-3 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            Confirmar reserva
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReservasDueno;
