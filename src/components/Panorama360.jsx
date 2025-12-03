import { useEffect, useRef } from "react";
// Importamos el JS de pannellum solo por efecto secundario
import "pannellum/build/pannellum.js";

// Pannellum vive en window
const pannellum = window.pannellum;

function Panorama360({ imageUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !imageUrl || !pannellum) return;

    pannellum.viewer(containerRef.current, {
      type: "equirectangular",
      panorama: imageUrl,
      autoLoad: true,
      autoRotate: -2,
      showControls: true,
      mouseZoom: true,
      hfov: 110,
      minHfov: 60,
      maxHfov: 120,
      pitch: 0,
      yaw: 0,
    });
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[450px] rounded-xl shadow border"
    ></div>
  );
}

export default Panorama360;
