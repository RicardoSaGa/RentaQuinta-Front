import { useState, useEffect, useRef } from "react";
import UbicacionSelector from "./UbicacionSelector";

function FiltersBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: "",
    maxPrecio: "",
    tour360: "todas",
  });

  // Evitar ejecutar filtros en el primer render
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onFilterChange(filters);
  }, [filters]);

  const handle = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center">

      {/* Buscar por nombre */}
      <input
        className="border rounded p-2 flex-1 min-w-[180px]"
        placeholder="Buscar nombre..."
        value={filters.nombre}
        onChange={(e) => handle("nombre", e.target.value)}
      />

      {/* Selector de ubicación */}
      <UbicacionSelector
        onSelect={(fullUbicacion) => handle("ubicacion", fullUbicacion)}
        onSelectText={filters.ubicacion}
      />

      {/* Capacidad */}
      <input
        type="number"
        className="border rounded p-2 w-32"
        placeholder="Capacidad"
        value={filters.capacidad}
        onChange={(e) => handle("capacidad", e.target.value)}
      />

      {/* Precio máximo */}
      <input
        type="number"
        className="border rounded p-2 w-32"
        placeholder="Precio máx"
        value={filters.maxPrecio}
        onChange={(e) => handle("maxPrecio", e.target.value)}
      />

      {/* Tour 360 */}
      <select
        className="border rounded p-2 w-32"
        value={filters.tour360}
        onChange={(e) => handle("tour360", e.target.value)}
      >
        <option value="todas">Tour 360</option>
        <option value="si">Con 360</option>
        <option value="no">Sin 360</option>
      </select>
    </div>
  );
}

export default FiltersBar;

