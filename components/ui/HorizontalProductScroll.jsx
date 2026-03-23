import { useRef } from "react";
import ProductCard from "./ProductCard.jsx";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./horizontalProductScroll.css";

const HorizontalProductScroll = ({ products, promo, nouveau }) => {
  const scrollRef = useRef(null);

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        freeMode={true}
        navigation={true}
        pagination={false}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        modules={[FreeMode, Pagination, Navigation]}
        className="products-Swiper h-[450px]"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index} className="h-auto">
            <div className="h-full">
              <ProductCard product={product} promo={promo} nouveau={nouveau} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default HorizontalProductScroll;
