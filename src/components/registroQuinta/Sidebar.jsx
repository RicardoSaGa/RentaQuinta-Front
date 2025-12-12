import {
  FiUser,
  FiCreditCard,
  FiCamera,
  FiMail,
  FiHome,
  FiDroplet,
  FiCheckSquare,
  FiFileText,
  FiImage,
  FiCheckCircle,
} from "react-icons/fi";


// Nuevo orden de pasos completo
const stepsConfig = [
  { id: 1, label: "Datos del dueño", icon: FiUser },
  { id: 2, label: "Verificar correo", icon: FiMail },
  { id: 3, label: "INE (Frente y Reverso)", icon: FiCreditCard },
  { id: 4, label: "Selfie con INE", icon: FiCamera },
  { id: 5, label: "Información general", icon: FiHome },
  { id: 6, label: "Alberca", icon: FiDroplet },
  { id: 7, label: "Servicios", icon: FiCheckSquare },
  { id: 8, label: "Reglas", icon: FiFileText },
  { id: 9, label: "Fotos", icon: FiImage },
  { id: 10, label: "Confirmación", icon: FiCheckCircle },
];


function Sidebar({ step, setStep }) {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Registrar mi quinta
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Completa los pasos para publicar tu quinta en la plataforma.
      </p>

      <nav className="space-y-2">
        {stepsConfig.map(({ id, label, icon: Icon }) => {
          const isCompleted = id !== step && step > id;
          const isActive = id === step;
          const isDisabled = step < id; // no permitir saltar hacia adelante

          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (!isDisabled) {
                  setStep(id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition
                ${isActive ? "bg-green-50 text-green-700 border border-green-200" : ""}
                ${!isActive && !isDisabled ? "hover:bg-gray-50 text-gray-700" : ""}
                ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""}
              `}
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full border text-xs
                  ${isActive ? "border-green-500 text-green-600" : ""}
                  ${isCompleted ? "bg-green-500 text-white border-green-500" : ""}
                  ${!isActive && !isCompleted ? "border-gray-300" : ""}
                `}
              >
                {isCompleted ? "✓" : id}
              </span>

              <span className="flex items-center gap-2">
                <Icon className="text-base" />
                <span>{label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 text-xs text-gray-400">
        Puedes volver a pasos anteriores en cualquier momento.
      </div>
    </aside>
  );
}

export default Sidebar;
