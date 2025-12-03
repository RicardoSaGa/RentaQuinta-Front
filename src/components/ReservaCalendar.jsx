import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, isBefore, parseISO } from "date-fns";
import API from "../services/api";
import { es } from "date-fns/locale";


function ReservaCalendar({ quintaId, onDateSelect }) {
  const [reservas, setReservas] = useState([]);
  const [range, setRange] = useState([{
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
    key: "selection"
  }]);

  // Cargar reservas ocupadas desde el backend
  useEffect(() => {

    setRange([{
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 2),
      key: "selection"
    }]);

    API.get(`/quintas/${quintaId}/fechas-ocupadas`)
      .then(res => setReservas(res.data))
      .catch(err => console.log(err));
  }, [quintaId]);

  // Generar una lista de fechas deshabilitadas
  const disabledDates = reservas.flatMap(r => {
    let dates = [];
    let start = parseISO(r.inicio);
    let end = parseISO(r.fin);
    let d = start;

    while (!isBefore(end, d)) {
      dates.push(new Date(d));
      d = addDays(d, 1);
    }
    return dates;
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-2xl font-bold mb-4">Selecciona tus fechas</h3>

      <DateRange
        locale={es}
        ranges={range}
        onChange={(ranges) => {
          const selection = ranges.selection || ranges.range1;
          if (!selection) return;

          setRange([selection]);
          onDateSelect(selection);
        }}
        minDate={new Date()}
        disabledDates={disabledDates}
        moveRangeOnFirstSelection={false}
        retainEndDateOnFirstSelection={false}
        editableDateInputs={true}
        fixedHeight={true}
        rangeColors={["#16a34a"]}
      />
    </div>
  );
}

export default ReservaCalendar;
