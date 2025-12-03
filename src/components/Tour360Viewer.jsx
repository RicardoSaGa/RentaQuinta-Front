import { useEffect, useRef, useState } from "react";
import "pannellum/build/pannellum.js"; // igual, carga el script

function Tour360Viewer({ tour }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(tour.startScene);

  const loadScene = (sceneId) => {
    const scene = tour.scenes[sceneId];
    if (!scene || !viewerRef.current) return;

    viewerRef.current.loadScene(sceneId);
    setCurrentScene(sceneId);
  };

  useEffect(() => {
    if (!containerRef.current || !window.pannellum) return;

    const scenesConfig = Object.fromEntries(
      Object.entries(tour.scenes).map(([id, sc]) => [
        id,
        {
          title: sc.title,
          type: "equirectangular",
          panorama: sc.panorama,
          hotSpots: sc.hotSpots?.map((h) => ({
            ...h,
            clickHandlerFunc: () => {
              if (h.type === "scene") {
                loadScene(h.sceneId);
              }
            },
          })),
        },
      ])
    );

    viewerRef.current = window.pannellum.viewer(containerRef.current, {
      default: {
        firstScene: tour.startScene,
        sceneFadeDuration: 1000,
      },
      scenes: scenesConfig,
    });
  }, [tour]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Tour virtual: {tour.scenes[currentScene].title}
      </h2>
      <div
        ref={containerRef}
        className="w-full h-[550px] rounded-xl shadow border"
      ></div>
    </div>
  );
}

export default Tour360Viewer;
