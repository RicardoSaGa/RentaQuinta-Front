import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import FiltersBar from "../components/FiltersBar";
import MapaQuintas from "../components/MapaQuintas";

function Home() {
  const [quintas, setQuintas] = useState([]);
  const [filters, setFilters] = useState({});
  const [vista, setVista] = useState("lista"); // vista actual

  // Cargar quintas según filtros
  useEffect(() => {
    const hasRealFilters =
      filters &&
      Object.values(filters).some(
        (v) => v !== null && v !== "" && v !== undefined && v !== 0
      );

    if (!hasRealFilters) {
      API.get("/quintas")
        .then((res) => {
          console.log("Backend quintas:", res.data);
          setQuintas(res.data);
        })
        .catch(console.error);
    } else {
      API.get("/quintas/search", { params: filters })
        .then((res) => {
          console.log("Backend quintas filtradas:", res.data);
          setQuintas(res.data);
        })
        .catch(console.error);
    }
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* HERO */}
      <section className="w-full h-[320px] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold tracking-tight">
          Encuentra tu Quinta Ideal
        </h1>
      </section>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-semibold mb-6">
          Quintas disponibles
        </h2>

        {/* BARRA DE FILTROS */}
        <FiltersBar onFilterChange={setFilters} />

        {/* BOTONES DE VISTA */}
        <div className="flex justify-end mt-6 mb-6">
          <button
            onClick={() => setVista("lista")}
            className={`px-4 py-2 border rounded-l-lg ${vista === "lista" ? "bg-gray-300" : "bg-white"}`}
          >
            Ver listado
          </button>
          <button
            onClick={() => setVista("mapa")}
            className={`px-4 py-2 border rounded-r-lg flex items-center gap-2 ${vista === "mapa" ? "bg-gray-300" : "bg-white"
              }`}
          >

            Ver mapa
            {/* Icono de ubicación */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </button>
        </div>

        {/* CAMBIO DE VISTAS */}
        {vista === "lista" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {quintas.map((q) => (
              <Link
                key={q.id}
                to={`/quintas/${q.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={q.fotos?.length > 0 ? q.fotos[0].url : "https://placehold.co/600x400?text=Sin+Foto&font=roboto"}
                    alt={q.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {q.premium && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-yellow-700 border border-yellow-300 shadow">
                      Premium ⭐
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {q.nombre}
                  </h3>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-700"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>

                    <span>{q.ubicacion}</span>
                  </div>

                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {q.descripcion}
                  </p>

                  <p className="mt-3 font-bold text-green-700 text-lg">
                    ${q.precioBase} MXN
                  </p>

                  <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition">
                    Ver más
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {vista === "mapa" && <MapaQuintas quintas={quintas} />}
      </div>
    </div>
  );
}

export default Home;
