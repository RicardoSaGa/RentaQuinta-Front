import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Destacadas() {
  const [quintas, setQuintas] = useState([]);

  useEffect(() => {
    API.get("/quintas/destacadas")
      .then(res => setQuintas(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quintas destacadas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quintas.map(q => (
          <Link 
            key={q.id}
            to={`/quinta/${q.id}`}
            className="bg-white rounded-xl shadow hover:shadow-xl transition"
          >
            <img 
              src={q.fotos?.length > 0 ? q.fotos[0].url : ""}
              className="h-56 w-full object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{q.nombre}</h2>
              <p className="text-gray-600">{q.ubicacion}</p>
              <p className="font-bold text-green-600 mt-2">${q.precioBase}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Destacadas;
