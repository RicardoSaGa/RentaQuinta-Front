export const exampleTour = {
  startScene: "entrada",

  scenes: {
    entrada: {
      title: "Entrada principal",
      panorama: "URL_DE_TU_FOTO_360_1",
      hotSpots: [
        {
          pitch: 0,
          yaw: 30,
          type: "scene",
          text: "Ir al jardín",
          sceneId: "jardin"
        }
      ]
    },

    jardin: {
      title: "Jardín",
      panorama: "URL_DE_TU_FOTO_360_2",
      hotSpots: [
        {
          pitch: 0,
          yaw: -45,
          type: "scene",
          text: "Regresar a entrada",
          sceneId: "entrada"
        },
        {
          pitch: -2,
          yaw: 90,
          type: "scene",
          text: "Ir a la alberca",
          sceneId: "alberca"
        }
      ]
    },

    alberca: {
      title: "Alberca",
      panorama: "URL_DE_TU_FOTO_360_3",
      hotSpots: [
        {
          pitch: 0,
          yaw: 180,
          type: "scene",
          text: "Regresar al jardín",
          sceneId: "jardin"
        }
      ]
    }
  }
};
