import React from "react";

export default function ModalReserva({
  open,
  onClose,
  titulo,
  mensaje,
  onPagarStripe,
  onTransferencia,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeInUp">

        <h2 className="text-2xl font-bold mb-3">{titulo}</h2>
        <p className="text-gray-700 mb-6">{mensaje}</p>

        <div className="space-y-3 mb-4">

          {onPagarStripe && (
            <button
              onClick={onPagarStripe}
              className="w-full border border-gray-900 text-gray-900 font-semibold py-2.5 rounded-xl hover:bg-gray-900 hover:text-white transition"
            >
              Pagar con tarjeta (Stripe)
            </button>
          )}

          {onTransferencia && (
            <button
              onClick={onTransferencia}
              className="w-full border border-gray-300 text-gray-800 font-medium py-2.5 rounded-xl hover:bg-gray-100 transition"
            >
              Pagar por transferencia bancaria
            </button>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
