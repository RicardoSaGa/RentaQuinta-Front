import { useState } from "react";
import API from "../../services/api";
import Alert from "../ui/Alert";

function StepVerificar({ ownerData, setOwnerData, setStep, login }) {
    const [checking, setChecking] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);
    const [resendLoading, setResendLoading] = useState(false);


    const verificar = async () => {
        setChecking(true);
        try {
            const res = await API.get(`/auth/check-verified?email=${encodeURIComponent(ownerData.email)}`);

            if (res.data.verified === true) {

                // iniciar sesión
                await login(ownerData.email, ownerData.password);

                // limpiar contraseña del estado (seguridad + mejor práctica)
                setOwnerData(prev => ({
                    ...prev,
                    password: undefined
                }));

                // avanzar al paso 3 del registro (INE)
                setStep(3);


            }
            else {
                setStatusMsg("Tu correo aún no aparece como verificado.");
            }
        } catch (e) {
            setStatusMsg("Hubo un problema verificando tu cuenta.");
        } finally {
            setChecking(false);
        }
    };

    const reenviarCorreo = async () => {
        setStatusMsg(null);
        setResendLoading(true);

        try {
            await API.post("/auth/resend-verification", {
                email: ownerData.email,
            });

            setStatusMsg(
                "Te enviamos un nuevo correo de verificación. Revisa tu bandeja de entrada y la carpeta de spam."
            );
        } catch (e) {
            setStatusMsg(
                "No se pudo reenviar el correo en este momento. Inténtalo de nuevo en unos minutos."
            );
        } finally {
            setResendLoading(false);
        }
    };


    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Verifica tu correo para continuar
            </h1>
            <p className="text-gray-600 mb-6">
                Te enviamos un enlace de verificación a <strong>{ownerData.email}</strong>.
                Una vez que confirmes, podrás continuar registrando tu quinta.
            </p>

            {statusMsg && (
                <Alert status="warning">{statusMsg}</Alert>
            )}

            <div className="flex gap-3 mt-6">
                <button
                    onClick={verificar}
                    disabled={checking}
                    className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow disabled:opacity-60"
                >
                    {checking ? "Verificando..." : "Ya verifiqué mi correo"}
                </button>

                <button
                    onClick={reenviarCorreo}
                    disabled={resendLoading || checking}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-60"
                >
                    {resendLoading ? "Reenviando..." : "Reenviar correo"}
                </button>
            </div>

        </div>
    );
}

export default StepVerificar;
