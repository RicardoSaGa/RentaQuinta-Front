import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import FiltersBar from "../components/FiltersBar";
import MapaQuintas from "../components/MapaQuintas";
import Button from "../components/Button";

function Home() {
  const [quintas, setQuintas] = useState([]);
  const [filters, setFilters] = useState({});
  const [vista, setVista] = useState("lista");

  useEffect(() => {
    const hasRealFilters =
      filters &&
      Object.values(filters).some(
        (v) => v !== null && v !== "" && v !== undefined && v !== 0
      );

    const endpoint = hasRealFilters ? "/quintas/search" : "/quintas";

    API.get(endpoint, { params: filters })
      .then((res) => {
        setQuintas(res.data);
      })
      .catch(console.error);
  }, [filters]);

  return (
    <div className="min-h-screen bg-bg text-textc">

      {/* HERO ACTUALIZADO */}
      <section className="w-full h-[360px] bg-gradient-to-br from-primary to-[#0f3f36] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm tracking-tight">
          Encuentra el espacio perfecto
        </h1>
        <p className="text-white/90 mt-3 text-lg md:text-xl">
          Quintas confiables, espaciosas y listas para disfrutar.
        </p>

        <Button className="mt-6" variant="secondary">
          Buscar Quintas
        </Button>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Quintas disponibles
        </h2>

        {/* FILTROS */}
        <FiltersBar onFilterChange={setFilters} />

        {/* BOTONES DE VISTA */}
        <div className="flex justify-end mt-6 mb-6 gap-3">
          <Button
            variant={vista === "lista" ? "primary" : "secondary"}
            onClick={() => setVista("lista")}
            className="rounded-full"
          >
            Ver listado
          </Button>

          <Button
            variant={vista === "mapa" ? "primary" : "secondary"}
            onClick={() => setVista("mapa")}
            className="flex items-center gap-2 rounded-full"
          >
            Ver mapa
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </Button>
        </div>

        {/* LISTADO DE QUINTAS */}
        {vista === "lista" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {quintas.map((q) => (
              <Link
                key={q.id}
                to={`/quintas/${q.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-muted/40"
              >
                {/* IMAGEN */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={q.fotos?.length > 0 ? q.fotos[0].url : "/noimage.png"}
                    alt={q.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {q.premium && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-yellow-700 border border-yellow-300 shadow">
                      Premium ⭐
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-textc">
                    {q.nombre}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-textc/70 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-textc/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>

                    <span className="truncate">{q.ubicacion}</span>
                  </div>


                  <p className="text-sm text-textc mt-1 line-clamp-2">
                    {q.descripcion}
                  </p>

                  <p className="mt-3 font-bold text-primary text-lg">
                    ${q.precioBase} MXN
                  </p>

                  <Button variant="primary" className="w-full mt-4">
                    Ver más
                  </Button>
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
