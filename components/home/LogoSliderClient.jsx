"use client";

import Slider from "react-infinite-logo-slider";

export default function LogoSliderClient({ logoSliders }) {
  const items = Array.isArray(logoSliders) ? logoSliders : [];

  if (items.length === 1) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <img
          src={items[0].image}
          alt="logo"
          className="w-36"
          loading="lazy"
        />
      </div>
    );
  }

  if (items.length > 1) {
    return (
      <Slider
        width="250px"
        duration={40}
        pauseOnHover={false}
        blurBorders={false}
        blurBorderColor="#fff"
      >
        {items.map((logo) => (
          <Slider.Slide key={logo._id ?? logo.image}>
            <img
              src={logo.image}
              alt="logo"
              className="w-36"
              loading="lazy"
            />
          </Slider.Slide>
        ))}
      </Slider>
    );
  }

  return null;
}
