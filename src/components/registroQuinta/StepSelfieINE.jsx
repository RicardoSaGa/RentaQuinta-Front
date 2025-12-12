import { useState } from "react";
import API from "../../services/api";

function StepSelfieINE({ setStep }) {
  const [selfie, setSelfie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selfie) {
      setError("Debes subir tu selfie sosteniendo la INE.");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para subir tu selfie.");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("selfieIne", selfie);

      await API.post("/owner/verificar-documentos/selfie", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

       setStep((prev) => prev + 1);
    } catch (err) {
      setError("No se pudo subir la selfie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Verificación: Selfie con INE</h1>

      <div className="space-y-4">
        <input type="file" onChange={(e) => setSelfie(e.target.files[0])} />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Subiendo..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}

export default StepSelfieINE;
