import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function QuintaGallery({ fotos }) {
  if (!fotos || fotos.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-xl">
        Sin fotos disponibles
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
        className="w-full h-full"
      >
        {fotos.map((foto) => (
          <SwiperSlide key={foto.id || foto.url}>
            <img
              src={foto.url}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
