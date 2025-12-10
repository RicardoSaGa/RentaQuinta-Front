import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle } from "react-icons/fi";

const variants = {
    success: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: <FiCheckCircle className="text-green-600 text-xl" />,
    },
    warning: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: <FiAlertTriangle className="text-yellow-600 text-xl" />,
    },
    error: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: <FiXCircle className="text-red-600 text-xl" />,
    },
    info: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: <FiInfo className="text-blue-600 text-xl" />,
    },
};

function Alert({ status = "info", children }) {
    const v = variants[status];

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${v.bg} ${v.border} ${v.text}`}>
            {v.icon}
            <p className="text-sm font-medium">{children}</p>
        </div>
    );
}

export default Alert;
