import {
  Wifi,
  Car,
  Umbrella,
  Flame,
  PawPrint,
  Home,
  Bath,
  Wind,
  Users,
  Trees,
  Mountain
} from "lucide-react";

function Amenidades({ quinta }) {
  if (!quinta) return null;

  const items = [
    { key: "alberca", label: "Alberca", icon: Umbrella },
    { key: "palapa", label: "Palapa", icon: Trees },
    { key: "asador", label: "Asador", icon: Flame },
    { key: "wifi", label: "WiFi", icon: Wifi },
    { key: "estacionamiento", label: "Estacionamiento", icon: Car },
    { key: "petFriendly", label: "Pet Friendly", icon: PawPrint },
    { key: "cocina", label: "Cocina equipada", icon: Home },
    { key: "banos", label: "Baños", icon: Bath },
    { key: "climas", label: "Aire acondicionado", icon: Wind },
    { key: "capacidad", label: `${quinta.capacidad} personas`, icon: Users }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Lo que ofrece esta quinta</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {items.map(({ key, label, icon: Icon }) => {
          if (!quinta[key]) return null;

          return (
            <div
              key={key}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <Icon className="w-6 h-6 text-green-700" />
              <span className="text-gray-800 font-medium">{label}</span>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Amenidades;
