import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast from 'react-hot-toast';

export default function QuintaAdmin() {
    const { id } = useParams();

    const [quinta, setQuinta] = useState({
        nombre: "",
        descripcion: "",
        direccion: "",
        precioBase: "",
        fotos: [],
    });

    const [fotos, setFotos] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tab, setTab] = useState("info");

    // ============================
    // Cargar quinta y fotos
    // ============================
    const fetchQuinta = async () => {
        try {
            const { data } = await api.get(`/owner/quintas/${id}`);
            setQuinta(data);
            setFotos(data.fotos);
        } catch (err) {
            console.error("Error cargando quinta:", err);
        }
    };

    /*
        const cargarFotos = async () => {
            try {
                const res = await api.get(`/owner/quintas/${id}/fotos`);
                setFotos(res.data); // ← fotos reales del backend
            } catch (err) {
                console.error("Error cargando fotos:", err);
            }
        };
    */
    useEffect(() => {
        fetchQuinta();
        // cargarFotos(); 
    }, [id]);

    // ============================
    // Subir foto
    // ============================
    const handleUploadPhoto = async () => {
        if (!selectedFile) return toast("Selecciona una foto");

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("principal", false);

        try {
            const res = await api.post(
                `/owner/quintas/${id}/fotos/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            // agregar foto nueva al estado
            setFotos(prev => [...prev, res.data]);

            setSelectedFile(null);
            toast.success("Foto subida correctamente");
        } catch (err) {
            toast.error("Error subiendo foto:");
            toast.error("No se pudo subir la foto");
        }
    };


    // ============================
    // Eliminar foto (por ID)
    // ============================
    const handleDeletePhoto = async (fotoId) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta foto?")) return;

        try {
            await api.delete(`/owner/fotos/${fotoId}`);

            setFotos(prev => prev.filter(f => f.id !== fotoId));

            toast.success("Foto eliminada correctamente");
        } catch (error) {
            toast.error("Error eliminando foto:");
            toast.error("No se pudo eliminar la foto");
        }
    };





    // ============================
    // Render
    // ============================
    return (
        <div className="p-4 md:p-10">
            <h2 className="text-3xl font-bold mb-4">Administrar Quinta</h2>

            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${tab === "info" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("info")}
                >
                    Información
                </button>

                <button
                    className={`px-4 py-2 rounded ${tab === "fotos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("fotos")}
                >
                    Fotos
                </button>

                <button
                    className={`px-4 py-2 rounded ${tab === "precios" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("precios")}
                >
                    Precios por día
                </button>
            </div>

            {/* PESTAÑA: INFORMACIÓN */}
            {tab === "info" && (
                <div className="bg-white shadow rounded p-4 mb-6">
                    <h3 className="text-xl font-semibold">{quinta.nombre}</h3>
                    <p className="text-gray-600">{quinta.descripcion}</p>

                    <p className="mt-2">
                        <strong>Dirección:</strong> {quinta.direccion}
                    </p>

                    <p>
                        <strong>Precio base:</strong> ${quinta.precioBase}
                    </p>
                </div>
            )}


            {/* PESTAÑA: FOTOS */}
            {tab === "fotos" && (
                <>
                    {/* SUBIR FOTO */}
                    <div className="bg-white shadow rounded p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Agregar Foto</h3>

                        <input
                            type="file"
                            className="form-control mb-3"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />

                        <button
                            onClick={handleUploadPhoto}
                            className="btn btn-primary"
                        >
                            Subir Foto
                        </button>
                    </div>

                    {/* LISTA DE FOTOS */}
                    <h3 className="text-xl font-semibold mb-3">Fotos</h3>

                    <div className="row mt-3">
                        {fotos.length === 0 && <p>No hay fotos aún</p>}

                        {fotos.map((foto) => (
                            <div key={foto.id} className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3">
                                    <img
                                        src={foto.url}
                                        alt="foto"
                                        className="img-fluid rounded"
                                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                    />

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="badge bg-primary">
                                            {foto.principal ? "Principal" : "Foto"}
                                        </span>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeletePhoto(foto.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* PESTAÑA: PRECIOS POR DÍA */}
            {tab === "precios" && (
                <PreciosDia quintaId={id} />
            )}

        </div>
    );
}
