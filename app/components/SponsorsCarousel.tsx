"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

const sponsors = [
  { name: "Caja Pupular Marabatío", logo: "/sponsors/cajaMara.jpeg" },
  { name: "Cecyte", logo: "/sponsors/cecyte.jpeg" },
  { name: "El Profe", logo: "/sponsors/elProfe.png" },
  { name: "Muebles Vega", logo: "/sponsors/MueblesVega.png" },
];

export default function SponsorsCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={40}
      slidesPerView={2}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      loop={true}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
    >
      {sponsors.map((sponsor) => (
        <SwiperSlide key={sponsor.name}>
          <div className="flex items-center justify-center h-36 opacity-70 hover:opacity-100 transition duration-300">
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={120}
              height={30}
              className="object-contain grayscale hover:grayscale-0 transition"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
