"use client"
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import { getSliders } from "../../services/sliderService";
import SliderSkeleton from "../ui/SliderSkeleton.jsx";

import "./style.css";

export default function FeaturedSlider() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSliders = async () => {
      setLoading(true);
      try {
        const data = await getSliders();
        setSliders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Échec de la récupération des sliders:", error);
        setSliders([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // During SSR and the very first client render, render a skeleton to match markup
  if (!isClient) {
    return (
      <div className="FeaturedSlider !h-[237px] md:!h-[350px] py-5">
        <SliderSkeleton />
      </div>
    );
  }

  return (
    <div className="FeaturedSlider !h-[237px] md:!h-[350px] py-5">
      {loading ? (
        <SliderSkeleton />
      ) : sliders.length > 0 ? (
        <>
          <Swiper
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            // loop={true}
            speed={1000}
            modules={[EffectCoverflow, Autoplay]}
            className="mySwiper h-full"
          >
            {sliders.map((slider, index) => (
              <SwiperSlide key={slider._id}>
                <img src={slider.image} alt={`Slider image ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <SliderSkeleton />
      )}
    </div>
  );
}
