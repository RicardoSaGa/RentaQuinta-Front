import { useState } from "react";
import Alert from "../ui/Alert";

function StepServicios({ step, setStep, quintaData, setQuintaData }) {
  const initialServices = {
    wifi: quintaData.wifi ?? false,
    palapa: quintaData.palapa ?? false,
    asador: quintaData.asador ?? false,
    estacionamiento: quintaData.estacionamiento ?? false,
    cocina: quintaData.cocina ?? false,
    banos: quintaData.banos ?? false,
    climas: quintaData.climas ?? false,
    petFriendly: quintaData.petFriendly ?? false,
  };

  const [services, setServices] = useState(initialServices);
  const [error, setError] = useState("");

  const toggle = (key) => {
    setServices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const continuar = () => {
    // Guardar estado global
    setQuintaData({
      ...quintaData,
      ...services,
    });

    setStep(8);
  };

  const SERVICIOS_LISTA = [
    { key: "wifi", label: "Wi-Fi" },
    { key: "palapa", label: "Palapa" },
    { key: "asador", label: "Asador" },
    { key: "estacionamiento", label: "Estacionamiento" },
    { key: "cocina", label: "Cocina equipada" },
    { key: "banos", label: "Baños" },
    { key: "climas", label: "Climas" },
    { key: "petFriendly", label: "Pet Friendly" },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Servicios y amenidades
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Selecciona los servicios que ofrece tu quinta. Esto ayuda a los clientes a saber
        exactamente qué incluye su reserva.
      </p>

      {error && <Alert status="error">{error}</Alert>}

      {/* GRID DE SERVICIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
        {SERVICIOS_LISTA.map((item) => {
          const active = services[item.key];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggle(item.key)}
              className={`border rounded-xl p-4 text-left transition shadow-sm 
              ${active ? "bg-green-50 border-green-500" : "bg-white border-gray-300"}
              hover:border-green-500`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(item.key)}
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* BOTÓN CONTINUAR */}
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

export default StepServicios;
