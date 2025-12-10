import { useState } from "react";
import Alert from "../ui/Alert";
import axios from "axios";

function StepConfirmacion({ quintaData, setQuintaData, setStep }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);

    const publicarQuinta = async () => {
        try {
            setLoading(true);
            setError("");

            const formData = new FormData();

            // Datos de texto
            const data = {
                nombre: quintaData.nombre,
                precio: quintaData.precio,
                capacidad: quintaData.capacidad,
                descripcion: quintaData.descripcion,
                direccion: quintaData.direccion,
                municipio: quintaData.municipio,
                lat: quintaData.lat,
                lng: quintaData.lng,

                // Alberca
                tieneAlberca: quintaData.tieneAlberca,
                tipoAlberca: quintaData.tipoAlberca,
                medidasAlberca: quintaData.medidasAlberca,
                profundidadMax: quintaData.profundidadMax,
                profundidadMin: quintaData.profundidadMin,
                calentador: quintaData.calentador,
                descripcionAlberca: quintaData.descripcionAlberca,

                // Servicios
                wifi: quintaData.wifi,
                palapa: quintaData.palapa,
                asador: quintaData.asador,
                estacionamiento: quintaData.estacionamiento,
                cocina: quintaData.cocina,
                banos: quintaData.banos,
                climas: quintaData.climas,
                petFriendly: quintaData.petFriendly,

                // Reglas
                ruidoHora: quintaData.ruidoHora,
                maxVehiculos: quintaData.maxVehiculos,
                noFumar: quintaData.noFumar,
                noVidrio: quintaData.noVidrio,
                supervisionNinos: quintaData.supervisionNinos,
                mascotas: quintaData.mascotas,
                reglasExtra: quintaData.reglasExtra,
            };

            formData.append("datos", JSON.stringify(data));

            // Fotos
            quintaData.fotos.forEach((file) => {
                formData.append("fotos", file);
            });

            // Llamada al backend

            const token = localStorage.getItem("token");

            const res = await axios.post(
                "https://rentaquinta.com/api/quintas/crear",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setExito(true);

            // Redirigir luego de publicar
            setTimeout(() => {
                window.location.href = "/dashboard/dueno";
            }, 2000);

        } catch (err) {
            setError("Ocurrió un problema al publicar la quinta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
                Confirmación final
            </h1>
            <p className="text-sm text-gray-600 mb-6">
                Revisa que toda la información sea correcta antes de publicar tu quinta.
            </p>

            {error && <Alert status="error">{error}</Alert>}
            {exito && <Alert status="success">Tu quinta se ha publicado correctamente.</Alert>}

            {/* RESUMEN */}
            <div className="space-y-6 p-5 bg-white border rounded-2xl shadow">

                {/* Datos generales */}
                <section>
                    <h2 className="font-semibold text-gray-700 mb-2">Información general</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Nombre:</span> {quintaData.nombre}</p>
                        <p><span className="font-medium">Precio:</span> ${quintaData.precio} MXN</p>
                        <p><span className="font-medium">Capacidad:</span> {quintaData.capacidad} personas</p>
                        <p><span className="font-medium">Descripción:</span> {quintaData.descripcion}</p>
                    </div>
                </section>

                {/* Ubicación */}
                <section>
                    <h2 className="font-semibold text-gray-700 mb-2">Ubicación</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Dirección:</span> {quintaData.direccion}</p>
                        <p><span className="font-medium">Municipio:</span> {quintaData.municipio}</p>
                        <p><span className="font-medium">Lat:</span> {quintaData.lat}</p>
                        <p><span className="font-medium">Lng:</span> {quintaData.lng}</p>
                    </div>
                </section>

                {/* Alberca */}
                {quintaData.tieneAlberca && (
                    <section>
                        <h2 className="font-semibold text-gray-700 mb-2">Alberca</h2>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Tipo:</span> {quintaData.tipoAlberca}</p>
                            <p><span className="font-medium">Medidas:</span> {quintaData.medidasAlberca}</p>
                            <p><span className="font-medium">Profundidad mínima:</span> {quintaData.profundidadMin} m</p>
                            <p><span className="font-medium">Profundidad máxima:</span> {quintaData.profundidadMax} m</p>
                            <p><span className="font-medium">Calentador:</span> {quintaData.calentador ? "Sí" : "No"}</p>
                        </div>
                    </section>
                )}

                {/* Servicios */}
                <section>
                    <h2 className="font-semibold text-gray-700 mb-2">Servicios</h2>
                    <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries({
                            wifi: "Wi-Fi",
                            palapa: "Palapa",
                            asador: "Asador",
                            estacionamiento: "Estacionamiento",
                            cocina: "Cocina",
                            banos: "Baños",
                            climas: "Climas",
                            petFriendly: "Pet Friendly",
                        }).map(([key, label]) =>
                            quintaData[key] ? <p key={key}>• {label}</p> : null
                        )}
                    </div>
                </section>

                {/* Reglas */}
                <section>
                    <h2 className="font-semibold text-gray-700 mb-2">Reglas</h2>

                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Ruido permitido hasta:</span> {quintaData.ruidoHora}</p>
                        <p><span className="font-medium">Máximo vehículos:</span> {quintaData.maxVehiculos}</p>

                        {quintaData.noFumar && <p>• Prohibido fumar</p>}
                        {quintaData.noVidrio && <p>• No vidrio en la alberca</p>}
                        {quintaData.supervisionNinos && <p>• Supervisión de niños obligatoria</p>}
                        {quintaData.mascotas && <p>• Se permiten mascotas</p>}

                        {quintaData.reglasExtra?.length > 0 && (
                            <>
                                <p className="font-medium mt-2">Reglas adicionales:</p>
                                {quintaData.reglasExtra.map((r, i) => (
                                    <p key={i}>• {r}</p>
                                ))}
                            </>
                        )}
                    </div>
                </section>

                {/* Fotos */}
                <section>
                    <h2 className="font-semibold text-gray-700 mb-2">Fotos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {quintaData.fotos.map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-full h-40 object-cover rounded-xl shadow"
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Botón publicar */}
            <div className="mt-10 flex justify-end">
                <button
                    onClick={publicarQuinta}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-semibold text-white shadow transition ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {loading ? "Publicando..." : "Publicar mi quinta"}
                </button>
            </div>
        </div>
    );
}

export default StepConfirmacion;
