import { useState } from "react";
import API from "../../services/api";

function StepVerificacionINE({ setStep }) {
  const [ineFrente, setIneFrente] = useState(null);
  const [ineReverso, setIneReverso] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChangeFrente = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIneFrente(file);
    setError("");
  };

  const handleFileChangeReverso = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIneReverso(file);
    setError("");
  };

  const handleDropFrente = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setIneFrente(file);
    setError("");
  };

  const handleDropReverso = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setIneReverso(file);
    setError("");
  };

  const preventDefault = (e) => e.preventDefault();

  const handleNext = async () => {
    if (!ineFrente || !ineReverso) {
      setError("Debes subir ambas fotos de la INE (frente y reverso).");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para subir tu INE.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("ineFrente", ineFrente);
      formData.append("ineReverso", ineReverso);

      await API.post("/owner/verificar-documentos/ine", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Si todo salió bien, avanzamos al siguiente paso (Selfie con INE)
      setStep((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      setError("No se pudo subir la INE. Verifica tu sesión o intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Verificación: INE
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Sube fotografías claras de tu INE por ambos lados. Esta información se
        usará únicamente para verificar tu identidad como dueño, no se mostrará
        a los clientes.
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frente */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            INE Frente
          </p>
          <label
            onDragOver={preventDefault}
            onDrop={handleDropFrente}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl px-4 py-8 cursor-pointer bg-gray-50 hover:border-green-500 hover:bg-green-50 transition"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChangeFrente}
            />
            <span className="text-sm font-semibold text-gray-700">
              Arrastra aquí la foto del frente
            </span>
            <span className="mt-1 text-xs text-gray-500">
              o haz clic para seleccionar un archivo
            </span>

            {ineFrente && (
              <div className="mt-3 text-xs text-gray-600 text-center">
                <p className="font-medium">Archivo seleccionado:</p>
                <p className="truncate">{ineFrente.name}</p>
              </div>
            )}
          </label>
        </div>

        {/* Reverso */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            INE Reverso
          </p>
          <label
            onDragOver={preventDefault}
            onDrop={handleDropReverso}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl px-4 py-8 cursor-pointer bg-gray-50 hover:border-green-500 hover:bg-green-50 transition"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChangeReverso}
            />
            <span className="text-sm font-semibold text-gray-700">
              Arrastra aquí la foto del reverso
            </span>
            <span className="mt-1 text-xs text-gray-500">
              o haz clic para seleccionar un archivo
            </span>

            {ineReverso && (
              <div className="mt-3 text-xs text-gray-600 text-center">
                <p className="font-medium">Archivo seleccionado:</p>
                <p className="truncate">{ineReverso.name}</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Asegúrate de que los datos sean legibles y que la INE no esté tapada ni
        recortada. Por seguridad, no podrás eliminar estos documentos después
        de enviarlos.
      </p>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={loading}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md
            ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
            disabled:opacity-60 disabled:cursor-not-allowed transition`}
        >
          {loading ? "Subiendo..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}

export default StepVerificacionINE;
