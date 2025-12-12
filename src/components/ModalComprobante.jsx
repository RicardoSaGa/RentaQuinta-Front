import { useState } from "react";

export default function ModalComprobante({ open, onClose, onEnviar }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setArchivo(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const subir = () => {
    if (!archivo) return;
    onEnviar(archivo);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-3">Subir comprobante</h2>

        <p className="text-gray-700 mb-4">
          Realiza tu transferencia y sube aquí el comprobante. El dueño validará tu pago.
        </p>

        <label className="block mb-4">
          <span className="text-gray-600">Selecciona tu archivo:</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="mt-2 block w-full border rounded-lg px-3 py-2"
          />
        </label>

        {preview && (
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Vista previa:</p>
            <img
              src={preview}
              alt="preview"
              className="max-h-48 rounded-lg shadow"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={subir}
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90"
          >
            Enviar comprobante
          </button>
        </div>
      </div>
    </div>
  );
}
