import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, isBefore, parseISO, differenceInDays } from "date-fns";
import API from "../services/api";
import { es } from "date-fns/locale";

function ReservaCalendar({ quintaId, onDateSelect }) {

  // Rango limpio, sin rangos locos
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [reservas, setReservas] = useState([]);

  // -------------------------
  // Cargar fechas ocupadas
  // -------------------------
  useEffect(() => {
    API.get(`/quintas/${quintaId}/fechas-ocupadas`)
      .then((res) => setReservas(res.data))
      .catch((err) => console.log(err));

    // Cada vez que cambia de quinta reseteamos rango
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  }, [quintaId]);

  // -------------------------
  // Generar disabled dates reales
  // -------------------------
  const disabledDates = reservas.flatMap((r) => {
    let list = [];
    let start = parseISO(r.inicio);
    let end = parseISO(r.fin);
    let d = start;

    while (!isBefore(end, d)) {
      list.push(new Date(d));
      d = addDays(d, 1);
    }

    return list;
  });

  // -------------------------
  // Manejo correcto del rango
  // -------------------------
  const handleChange = (ranges) => {
    const sel = ranges.selection;
    if (!sel) return;

    let start = sel.startDate;
    let end = sel.endDate;

    // Si da el mismo clic → 1 noche mínima
    if (differenceInDays(end, start) === 0) {
      end = addDays(start, 1);
    }

    const newRange = [{ ...sel, endDate: end }];
    setRange(newRange);
    onDateSelect(newRange[0]);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">

      <h3 className="text-2xl font-bold mb-4">Selecciona tus fechas</h3>

      <div className="border rounded-xl overflow-hidden">
        <DateRange
          locale={es}
          ranges={range}
          onChange={handleChange}
          minDate={new Date()}
          disabledDates={disabledDates}
          moveRangeOnFirstSelection={false}
          retainEndDateOnFirstSelection={false}
          editableDateInputs={false}
          fixedHeight={true}
          rangeColors={["#16a34a"]}
        />
      </div>

    </div>
  );
}

export default ReservaCalendar;
