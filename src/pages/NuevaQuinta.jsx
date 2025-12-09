import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';


export default function NuevaQuinta() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    ubicacion: "",
    capacidad: 0,
    precioBase: 0,
    latitud: "",
    longitud: "",
    premium: false,
    destacada: false,
    foto360: "",
    alberca: false,
    palapa: false,
    asador: false,
    wifi: false,
    estacionamiento: false,
    petFriendly: false,
    cocina: false,
    banos: false,
    climas: false,
  });

  const [fotos, setFotos] = useState([]);
  const [quintaId, setQuintaId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFotoChange = (e) => {
    setFotos(Array.from(e.target.files));
  };

  const crearQuinta = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://rentaquinta.com/api/owner/quintas",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuintaId(res.data.id);
      toast.success("Quinta creada, ahora sube fotos");
    } catch (err) {
      toast.error("Error creando quinta");
    } finally {
      setLoading(false);
    }
  };

  const subirFotos = async () => {
    if (!quintaId) {
      toast("Primero crea la quinta");
      return;
    }

    for (let i = 0; i < fotos.length; i++) {
      const formData = new FormData();
      formData.append("file", fotos[i]);
      formData.append("principal", i === 0); // primera foto = principal

      await axios.post(
        `https://rentaquinta.com/api/owner/quintas/${quintaId}/fotos/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    toast.success("Fotos subidas correctamente");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold">Crear Nueva Quinta</h1>

      <div className="mt-4 grid grid-cols-1 gap-4">
        
        <input className="border p-2" name="nombre" placeholder="Nombre" onChange={handleChange} />
        <textarea className="border p-2" name="descripcion" placeholder="Descripción" onChange={handleChange} />

        <input className="border p-2" name="direccion" placeholder="Dirección" onChange={handleChange} />
        <input className="border p-2" name="ubicacion" placeholder="Ubicación" onChange={handleChange} />

        <input className="border p-2" name="capacidad" type="number" onChange={handleChange} placeholder="Capacidad" />
        <input className="border p-2" name="precioBase" type="number" onChange={handleChange} placeholder="Precio base" />

        <input className="border p-2" name="latitud" placeholder="Latitud" onChange={handleChange} />
        <input className="border p-2" name="longitud" placeholder="Longitud" onChange={handleChange} />

        {/* Amenidades */}
        <div className="grid grid-cols-2 gap-2">
          {["alberca","palapa","asador","wifi","estacionamiento","petFriendly","cocina","banos","climas"].map(a => (
            <label key={a} className="flex gap-2 items-center">
              <input type="checkbox" name={a} onChange={handleChange} />
              {a}
            </label>
          ))}
        </div>
      </div>

      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={crearQuinta}
        disabled={loading}
      >
        Crear Quinta
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">Subir Fotos</h2>

      <input type="file" multiple onChange={handleFotoChange} className="mt-2 p-2" />

      <div className="flex gap-2 mt-2">
        {fotos.map((f, i) => (
          <img
            key={i}
            src={URL.createObjectURL(f)}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
        ))}
      </div>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={subirFotos}
      >
        Subir Fotos
      </button>
    </div>
  );
}
