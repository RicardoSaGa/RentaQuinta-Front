import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, isBefore, parseISO, differenceInDays } from "date-fns";
import API from "../services/api";
import { es } from "date-fns/locale";

function ReservaCalendar({ quintaId, tipoEvento, onDateSelect }) {

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

  // Hacer llamada al backend para obtener días sin tarifas
  useEffect(() => {
    if (!tipoEvento) return;

    API.get(`/quintas/${quintaId}/dias-disponibles`, {
      params: { tipoEvento }
    })
      .then((res) => {
        // res.data = lista de días disponibles, ej: [1,2,3,5]
        const diasDisponibles = res.data;

        const hoy = new Date();
        const limite = addDays(hoy, 180); // 6 meses, editable

        let diasNoDisp = [];
        let cursor = new Date(hoy);

        while (cursor <= limite) {
          const dow = cursor.getDay(); // 0-6
          if (!diasDisponibles.includes(dow)) {
            diasNoDisp.push(
              new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())
            );
          }
          cursor = addDays(cursor, 1);
        }

        setDiasSinDisponibilidad(diasNoDisp);
      })
      .catch((err) => console.log(err));
  }, [quintaId, tipoEvento]);


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

  const [firstInteraction, setFirstInteraction] = useState(false);

  const [diasSinDisponibilidad, setDiasSinDisponibilidad] = useState([]);

  const handleChange = (ranges) => {

    if (!firstInteraction) {
      setFirstInteraction(true);

      // GOOGLE ANALYTICS | EVENTO GA4: Calendario abierto / primera interacción
      if (window.gtag) {
        window.gtag("event", "open_calendar", {
          quinta_id: quintaId,
        });
      }
    }

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
          disabledDates={[...disabledDates, ...diasSinDisponibilidad]}
          moveRangeOnFirstSelection={false}
          retainEndDateOnFirstSelection={false}
          editableDateInputs={false}
          fixedHeight={true}
          rangeColors={["#16a34a"]}

          dayContentRenderer={(date) => {
            const isDisabled = [...disabledDates, ...diasSinDisponibilidad].some(
              (d) =>
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
            );

            return (
              <div
                style={{
                  opacity: isDisabled ? 0.35 : 1,
                  pointerEvents: isDisabled ? "none" : "auto",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                {date.getDate()}
              </div>
            );
          }}
        />
      </div>

    </div>
  );
}

export default ReservaCalendar;
