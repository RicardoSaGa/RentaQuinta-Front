import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function DestacadasCarousel() {
  const [quintas, setQuintas] = useState([]);

  useEffect(() => {
    API.get("/quintas/destacadas")
      .then(res => setQuintas(res.data))
      .catch(err => console.log(err));
  }, []);

  if (quintas.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4">Destacadas</h2>

      <div className="flex overflow-x-auto gap-5 pb-4">
        {quintas.map((q) => (
          <Link
            key={q.id}
            to={`/quinta/${q.id}`}
            className="min-w-[230px] bg-white rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <img
              src={q.fotos?.length > 0 ? q.fotos[0].url : ""}
              className="h-40 w-full object-cover rounded-t-xl"
            />
            <div className="p-3">
              <p className="font-semibold text-lg">{q.nombre}</p>
              <p className="text-gray-600 text-sm">{q.ubicacion}</p>
              <p className="text-green-600 font-bold mt-1">
                {q.precioDesde ? `Desde $${q.precioDesde}` : "Sin tarifas"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DestacadasCarousel;
