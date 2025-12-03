import { Link } from "react-router-dom";

function Verificado() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">

                {/* Icono de éxito */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-12 h-12 text-green-600"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                    ¡Correo verificado!
                </h1>

                <p className="text-gray-600 mb-8">
                    Tu cuenta ha sido activada correctamente.
                    Ya puedes iniciar sesión para continuar explorando quintas.
                </p>

                {/* BOTÓN */}
                <Link to="/?showLogin=true"
                    className="block w-full bg-gray-900 hover:bg-gray-700 transition text-white font-medium py-3 rounded-xl"
                >
                    Iniciar sesión
                </Link>
            </div>
        </div>
    );
}

export default Verificado;
