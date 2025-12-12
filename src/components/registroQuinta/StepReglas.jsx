import { useState } from "react";
import Alert from "../ui/Alert";

function StepReglas({ step, setStep, quintaData, setQuintaData }) {
  const [ruidoHora, setRuidoHora] = useState(
    quintaData.ruidoHora || ""
  );
  const [maxVehiculos, setMaxVehiculos] = useState(
    quintaData.maxVehiculos || ""
  );

  const [noFumar, setNoFumar] = useState(
    quintaData.noFumar ?? false
  );
  const [noVidrio, setNoVidrio] = useState(
    quintaData.noVidrio ?? false
  );
  const [supervisionNinos, setSupervisionNinos] = useState(
    quintaData.supervisionNinos ?? false
  );
  const [mascotas, setMascotas] = useState(
    quintaData.mascotas ?? false
  );

  const [reglasExtra, setReglasExtra] = useState(
    quintaData.reglasExtra || []
  );
  const [reglaNueva, setReglaNueva] = useState("");

  const [error, setError] = useState("");

  const agregarRegla = () => {
    if (!reglaNueva.trim()) return;
    setReglasExtra((prev) => [...prev, reglaNueva]);
    setReglaNueva("");
  };

  const eliminarRegla = (index) => {
    setReglasExtra((prev) => prev.filter((_, i) => i !== index));
  };

  const validar = () => {
    if (!ruidoHora.trim()) return "Ingresa una hora límite para el ruido.";
    if (!maxVehiculos.trim() || isNaN(maxVehiculos))
      return "Ingresa un número válido de vehículos permitidos.";
    return null;
  };

  const continuar = () => {
    const v = validar();
    if (v) {
      setError(v);
      return;
    }

    setQuintaData({
      ...quintaData,
      ruidoHora,
      maxVehiculos,
      noFumar,
      noVidrio,
      supervisionNinos,
      mascotas,
      reglasExtra,
    });

    setStep(9);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Reglas de la quinta
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Define las reglas que los huéspedes deben seguir durante su estancia.
      </p>

      {error && <Alert status="error">{error}</Alert>}

      {/* Límite de ruido */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hora límite para hacer ruido
        </label>
        <input
          type="time"
          className="w-full p-3 border border-gray-300 rounded-xl"
          value={ruidoHora}
          onChange={(e) => setRuidoHora(e.target.value)}
        />
      </div>

      {/* Máximo vehículos */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número máximo de vehículos
        </label>
        <input
          type="number"
          className="w-full p-3 border border-gray-300 rounded-xl"
          value={maxVehiculos}
          onChange={(e) => setMaxVehiculos(e.target.value)}
        />
      </div>

      {/* Checkbox de reglas */}
      <div className="mt-6 space-y-4">
        {/* No fumar */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={noFumar}
            onChange={() => setNoFumar(!noFumar)}
            className="w-5 h-5"
          />
          <span className="text-gray-700 text-sm">Prohibido fumar</span>
        </div>

        {/* No vidrio */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={noVidrio}
            onChange={() => setNoVidrio(!noVidrio)}
            className="w-5 h-5"
          />
          <span className="text-gray-700 text-sm">
            Prohibido ingresar vidrio a la alberca
          </span>
        </div>

        {/* Supervisión niños */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={supervisionNinos}
            onChange={() => setSupervisionNinos(!supervisionNinos)}
            className="w-5 h-5"
          />
          <span className="text-gray-700 text-sm">
            Niños deben estar siempre supervisados
          </span>
        </div>

        {/* Mascotas */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={mascotas}
            onChange={() => setMascotas(!mascotas)}
            className="w-5 h-5"
          />
          <span className="text-gray-700 text-sm">
            Se permiten mascotas
          </span>
        </div>
      </div>

      {/* Reglas personalizadas */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reglas adicionales
        </label>

        <div className="flex gap-3 mb-3">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-xl"
            placeholder="Ej. No brincar desde la palapa"
            value={reglaNueva}
            onChange={(e) => setReglaNueva(e.target.value)}
          />
          <button
            onClick={agregarRegla}
            type="button"
            className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {reglasExtra.map((regla, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 border rounded-xl text-sm bg-gray-50"
            >
              <span className="text-gray-700">{regla}</span>
              <button
                onClick={() => eliminarRegla(index)}
                className="text-red-500 text-xs hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

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

export default StepReglas;
