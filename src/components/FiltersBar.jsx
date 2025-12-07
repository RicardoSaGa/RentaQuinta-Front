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
    <div className="bg-white border border-muted/40 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center">

      {/* Buscar nombre */}
      <input
        className="border border-muted/60 focus:border-primary focus:ring-primary/40 rounded-full px-4 py-2 w-full sm:flex-1 text-textc placeholder:text-muted outline-none transition"
        placeholder="Buscar nombre..."
        value={filters.nombre}
        onChange={(e) => handle("nombre", e.target.value)}
      />

      {/* Selector de ubicación */}
      <div className="w-full sm:w-auto">
        <UbicacionSelector
          onSelect={(fullUbicacion) => handle("ubicacion", fullUbicacion)}
          onSelectText={filters.ubicacion}
          className="rounded-full"
        />
      </div>

      {/* Capacidad */}
      <input
        type="number"
        className="border border-muted/60 focus:border-primary focus:ring-primary/40 rounded-full px-4 py-2 w-32 text-textc placeholder:text-muted outline-none transition"
        placeholder="Capacidad"
        value={filters.capacidad}
        onChange={(e) => handle("capacidad", e.target.value)}
      />

      {/* Precio máximo */}
      <input
        type="number"
        className="border border-muted/60 focus:border-primary focus:ring-primary/40 rounded-full px-4 py-2 w-32 text-textc placeholder:text-muted outline-none transition"
        placeholder="Precio máx"
        value={filters.maxPrecio}
        onChange={(e) => handle("maxPrecio", e.target.value)}
      />

      {/* Tour 360 */}
      <select
        className="border border-muted/60 focus:border-primary focus:ring-primary/40 rounded-full px-4 py-2 w-36 text-textc bg-white outline-none transition"
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
