import { useState } from "react";
import Alert from "../ui/Alert";

function StepAlberca({ step, setStep, quintaData, setQuintaData }) {
  // Inicializar valores desde el estado global
  const [tieneAlberca, setTieneAlberca] = useState(
    quintaData.tieneAlberca ?? false
  );

  const [tipo, setTipo] = useState(quintaData.tipoAlberca || "");
  const [medidas, setMedidas] = useState(quintaData.medidasAlberca || "");
  const [profMax, setProfMax] = useState(quintaData.profundidadMax || "");
  const [profMin, setProfMin] = useState(quintaData.profundidadMin || "");
  const [calentador, setCalentador] = useState(
    quintaData.calentador ?? false
  );
  const [descripcion, setDescripcion] = useState(
    quintaData.descripcionAlberca || ""
  );

  const [error, setError] = useState("");

  const validar = () => {
    if (!tieneAlberca) return null;

    if (!tipo.trim()) return "Selecciona el tipo de alberca.";
    if (!medidas.trim()) return "Indica las medidas de la alberca.";
    if (!profMax.trim() || isNaN(profMax))
      return "La profundidad máxima debe ser un número.";
    if (!profMin.trim() || isNaN(profMin))
      return "La profundidad mínima debe ser un número.";
    return null;
  };

  const continuar = () => {
    const v = validar();
    if (v) {
      setError(v);
      return;
    }

    // Guardar los datos en el estado global
    setQuintaData({
      ...quintaData,
      tieneAlberca,
      tipoAlberca: tipo,
      medidasAlberca: medidas,
      profundidadMax: profMax,
      profundidadMin: profMin,
      calentador,
      descripcionAlberca: descripcion,
    });

    setStep(4);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Detalles de la alberca
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Si tu quinta cuenta con alberca, describe sus características para
        que los clientes sepan exactamente qué esperar.
      </p>

      {error && <Alert status="error">{error}</Alert>}

      {/* Checkbox principal */}
      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="tieneAlberca"
          checked={tieneAlberca}
          onChange={() => setTieneAlberca(!tieneAlberca)}
          className="w-5 h-5"
        />
        <label htmlFor="tieneAlberca" className="text-gray-800 text-sm">
          Mi quinta tiene alberca
        </label>
      </div>

      {/* Campos solo si tiene alberca */}
      {tieneAlberca && (
        <div className="mt-6 space-y-5">

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de alberca
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl bg-white"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecciona</option>
              <option value="Familiar estándar">Familiar estándar</option>
              <option value="Chapoteadero">Chapoteadero</option>
              <option value="Semi-olímpica">Semi-olímpica</option>
              <option value="Jacuzzi">Jacuzzi</option>
            </select>
          </div>

          {/* Medidas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medidas de la alberca
            </label>
            <input
              type="text"
              placeholder="Ej. 8m x 4m x 1.4m"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={medidas}
              onChange={(e) => setMedidas(e.target.value)}
            />
          </div>

          {/* Profundidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profundidad mínima (m)
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-xl"
                value={profMin}
                onChange={(e) => setProfMin(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profundidad máxima (m)
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-xl"
                value={profMax}
                onChange={(e) => setProfMax(e.target.value)}
              />
            </div>
          </div>

          {/* Calentador */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="calentador"
              checked={calentador}
              onChange={() => setCalentador(!calentador)}
              className="w-5 h-5"
            />
            <label htmlFor="calentador" className="text-gray-800 text-sm">
              La alberca tiene calentador
            </label>
          </div>

          {/* Descripción opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción adicional (opcional)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl h-24"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>
        </div>
      )}

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

export default StepAlberca;
