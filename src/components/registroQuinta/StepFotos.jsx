import { useState, useRef } from "react";
import Alert from "../ui/Alert";

function StepFotos({ step, setStep, quintaData, setQuintaData }) {
  const [fotos, setFotos] = useState(quintaData.fotos || []);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const arr = Array.from(files);

    // Validar tipos
    const validImages = arr.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        file.type
      )
    );

    if (validImages.length === 0) {
      setError("Selecciona imágenes válidas.");
      return;
    }

    setFotos((prev) => [...prev, ...validImages]);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFoto = (index) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const continuar = () => {
    if (fotos.length < 3) {
      setError("Debes subir al menos 3 fotos para continuar.");
      return;
    }

    // Guardar fotos en estado global
    setQuintaData({
      ...quintaData,
      fotos,
    });

    setStep(10);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Fotos de la quinta
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Sube fotos claras y de buena calidad. Los clientes suelen decidir su reserva
        basándose en las imágenes.
      </p>

      {error && <Alert status="error">{error}</Alert>}

      {/* Zona Drag & Drop */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full p-10 border-2 border-dashed border-gray-300 rounded-2xl text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onClick={() => inputRef.current.click()}
      >
        <p className="text-gray-700">Arrastra tus fotos aquí o haz clic para seleccionar</p>
        <input
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Gallery */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {fotos.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-40 object-cover rounded-xl shadow-md"
              />

              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 px-2 py-1 rounded-lg text-xs font-semibold shadow transition"
                onClick={() => removeFoto(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón continuar */}
      <div className="mt-10 flex justify-end">
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

export default StepFotos;
