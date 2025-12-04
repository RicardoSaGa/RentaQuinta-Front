import { useSearchParams } from "react-router-dom";

export default function PagoCancelado() {
  const [params] = useSearchParams();
  const idReserva = params.get("idReserva");

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">Pago cancelado</h1>
      <p className="mt-4 text-gray-700">
        No se completó el pago{ idReserva ? ` de la reserva #${idReserva}` : "" }.
      </p>
      <a
        href="/"
        className="inline-block mt-6 px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Volver al inicio
      </a>
    </div>
  );
}
