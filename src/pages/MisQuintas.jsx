import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MisQuintas() {
  const { token } = useAuth();
  const [quintas, setQuintas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://rentaquinta.com/api/owner/quintas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuintas(res.data);
      })
      .catch(() => {
        console.error("Error cargando las quintas");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Quintas</h1>

      <Link
        to="/dashboard/nueva-quinta"
        className="bg-green-600 text-white py-2 px-4 rounded mb-4 inline-block"
      >
        + Nueva Quinta
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {quintas.length === 0 && <p>No has creado ninguna quinta aún.</p>}

        {quintas.map((q) => (
          <div
            key={q.id}
            className="border rounded-lg overflow-hidden shadow"
          >
            <img
              src={q.fotoPrincipal || "/noimage.png"}
              alt={q.nombre}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-xl font-semibold">{q.nombre}</h2>
              <p className="text-sm text-gray-600">{q.ubicacion}</p>

              <Link
                to={`/dashboard/quinta/${q.id}`}
                className="bg-blue-600 text-white py-1 px-3 rounded text-center mt-2"
              >
                Administrar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
