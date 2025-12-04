import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PagoExito() {
  const [params] = useSearchParams();
  const idReserva = params.get("idReserva");
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  // Confirmar la reserva en backend
  useEffect(() => {
    if (idReserva) {
      API.put(`/quintas/confirmar/${idReserva}`)
        .then(() => console.log("Reserva confirmada"))
        .catch(err => console.log(err));
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeInUp">
        
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          ¡Pago exitoso!
        </h1>

        <p className="text-gray-700 mb-6">
          Tu reservación ha sido confirmada correctamente.  
          Recibirás un correo con los detalles en unos momentos.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition font-semibold"
        >
          Volver al inicio
        </button>

      </div>
    </div>
  );
}