// src/pages/RegistrarQuinta.jsx
import { useState } from "react";
import Sidebar from "../components/registroQuinta/Sidebar";
import StepOwner from "../components/registroQuinta/StepOwner";
import StepInfoGeneral from "../components/registroQuinta/StepInfoGeneral";
import StepAlberca from "../components/registroQuinta/StepAlberca";
import StepServicios from "../components/registroQuinta/StepServicios";
import StepReglas from "../components/registroQuinta/StepReglas";
import StepFotos from "../components/registroQuinta/StepFotos";
import StepConfirmacion from "../components/registroQuinta/StepConfirmacion";
import StepVerificar from "../components/registroQuinta/StepVerificar";

import StepVerificacionINE from "../components/registroQuinta/StepVerificacionINE";
import StepSelfieINE from "../components/registroQuinta/StepSelfieINE";

import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function RegistrarQuinta() {
    const { login } = useAuth();
    const [step, setStep] = useState(1);

    const [ownerData, setOwnerData] = useState({});
    const [quintaData, setQuintaData] = useState({});
    const [fotos, setFotos] = useState([]);

    const steps = {
        1: (
            <StepOwner
                step={step}
                setStep={setStep}
                ownerData={ownerData}
                setOwnerData={setOwnerData}
            />
        ),

        // 2: Verificar correo
        2: (
            <StepVerificar
                ownerData={ownerData}
                setOwnerData={setOwnerData}
                setStep={setStep}
                login={login}
            />
        ),

        // 3: INE (frente y reverso)
        3: (
            <StepVerificacionINE
                step={step}
                setStep={setStep}
                ownerData={ownerData}
                setOwnerData={setOwnerData}
            />
        ),

        // 4: Selfie con INE
        4: (
            <StepSelfieINE
                step={step}
                setStep={setStep}
                ownerData={ownerData}
                setOwnerData={setOwnerData}
            />
        ),

        5: (
            <StepInfoGeneral
                step={step}
                setStep={setStep}
                quintaData={quintaData}
                setQuintaData={setQuintaData}
            />
        ),

        6: (
            <StepAlberca
                step={step}
                setStep={setStep}
                quintaData={quintaData}
                setQuintaData={setQuintaData}
            />
        ),

        7: (
            <StepServicios
                step={step}
                setStep={setStep}
                quintaData={quintaData}
                setQuintaData={setQuintaData}
            />
        ),

        8: (
            <StepReglas
                step={step}
                setStep={setStep}
                quintaData={quintaData}
                setQuintaData={setQuintaData}
            />
        ),

        9: (
            <StepFotos
                step={step}
                setStep={setStep}
                quintaData={quintaData}
                setQuintaData={setQuintaData}
            />
        ),

        10: (
            <StepConfirmacion
                step={step}
                setStep={setStep}
                quintaData={quintaData}
                setQuintaData={setQuintaData}
            />
        ),
    };


    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar step={step} setStep={setStep} />

            <div className="flex-1 p-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default RegistrarQuinta;
