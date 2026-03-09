"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { CarFront, Cog } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const AnimatedBackground = ({
  count = 20,
  minSize = 30,
  maxSize = 72,
  color = "rgba(148,163,184,0.25)",
  preferImageIcons = true,
  useLucide = false,
  lucideIcons = [],
  preferredImageNames = [],
  imageOnly = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Static icon lists (avoid hydration mismatch)
  const imageIconUrlsLite = useMemo(
    () => [
      "/lite_icons/0b8897cf-e1e1-4058-a293-ad47d2de06c9.jpeg",
      "/lite_icons/254b70ce-14b7-445b-a64a-0d1c0883e182.jpeg",
      "/lite_icons/32657e35-96d0-4ecb-925f-095f8db25621.jpeg",
      "/lite_icons/4ab721c6-ec52-4893-a1eb-37ef4a87c8da.jpeg",
      "/lite_icons/51a32135-d70b-405d-8c8d-a7ff6368b42c.jpeg",
      "/lite_icons/852f661f-d09e-4102-8bb1-85653d8407b9.jpeg",
      "/lite_icons/8ad7ecd3-849c-4b06-8b21-a14631e0864f.jpeg",
      "/lite_icons/d29aff07-0e22-4e8b-a246-f5519f6543d6.jpeg",
      "/lite_icons/f14e596f-638b-40ce-bc65-bb92afdad8a7.jpeg",
    ],
    [],
  );

  const imageIconUrlsDark = useMemo(
    () => [
      "/dark_icons/air.png",
      "/dark_icons/amortisseur2.png",
      "/dark_icons/frein-a-disque.png",
      "/dark_icons/huile-de-voiture.png",
      "/dark_icons/huile-moteur.png",
      "/dark_icons/jantes-en-alliage.png",
      "/dark_icons/piston.png",
      "/dark_icons/pneu.png",
      "/dark_icons/radiateur-de-voiture.png",
      "/dark_icons/turbo.png",
    ],
    [],
  );

  // Unified list used by the renderer logic below
  let imageIconUrls = theme === "dark" ? imageIconUrlsDark : imageIconUrlsLite;

  // Reorder and amplify preferred images if provided (e.g., amortisseur.png)
  if (
    preferredImageNames &&
    preferredImageNames.length > 0 &&
    imageIconUrls.length > 0
  ) {
    const names = preferredImageNames.map((s) => String(s).toLowerCase());
    const preferred = [];
    const others = [];
    for (const url of imageIconUrls) {
      const lower = url.toLowerCase();
      if (names.some((n) => lower.includes(n))) preferred.push(url);
      else others.push(url);
    }
    // Duplicate preferred to increase frequency
    const amplified = preferred.flatMap((u) => [u, u, u]); // 3x
    imageIconUrls = amplified.concat(others);
  }

  // Choose renderers: Lucide > images > fallback inline SVGs
  const Renderers = useMemo(() => {
    // Image-only mode
    if (imageOnly && imageIconUrls.length > 0) {
      return imageIconUrls.map((url) => ({ size }) => (
        <img
          src={url}
          width={size}
          height={size}
          alt="bg icon"
          style={{ display: "block" }}
        />
      ));
    }
    if (useLucide) {
      const set =
        Array.isArray(lucideIcons) && lucideIcons.length > 0
          ? lucideIcons
          : [Car, CarFront, Truck, Gauge, Wrench, Cog, Bolt, Fan, Battery];
      return set.map((IconCmp) => ({ size }) => (
        <IconCmp
          size={size}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth={1.5}
        />
      ));
    }
    if (preferImageIcons && imageIconUrls.length > 0) {
      return imageIconUrls.map((url) => ({ size }) => (
        <img
          src={url}
          width={size}
          height={size}
          alt="bg icon"
          style={{ display: "block" }}
        />
      ));
    }
    return [
      ({ size }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      ),
      ({ size }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      ({ size }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <polygon points="12,2 22,20 2,20" />
        </svg>
      ),
    ];
  }, [useLucide, lucideIcons, preferImageIcons, imageIconUrls, theme]);
  const items = useMemo(() => {
    if (!isClient) return [];
    return Array.from({ length: count }).map((_, i) => {
      const Icon = Renderers[i % Renderers.length];
      const size = Math.round(random(minSize, maxSize));
      const top = random(0, 100);
      const left = random(0, 100);
      const duration = random(12, 28).toFixed(2) + "s";
      const delay = (-random(0, 20)).toFixed(2) + "s"; // negative for desync
      const rotate = Math.round(random(-20, 20));
      const floatAmp = random(10, 40); // px
      const blur = Math.random() < 0.25 ? 2 : 0;

      return { Icon, size, top, left, duration, delay, rotate, floatAmp, blur };
    });
  }, [isClient, count, minSize, maxSize, Renderers, theme]);

  return (
    <div
      className={`animated-bg-container blur-[3px] relative ${
        theme === "dark" ? "bg-secondary-900" : "bg-gray-50"
      }`}
      aria-hidden
    >
      {/* Vertical accent bands (blue on the left, red on the right) */}
      <div className="pointer-events-none absolute inset-y-0 left-[10%] flex items-stretch gap-6">
        <div
          className={`w-[20px] h-full ${
            theme === "dark" ? "bg-[#003b78]" : "bg-[#60a5fa]"
          }`}
        />
        <div
          className={`w-[20px] h-full ${
            theme === "dark" ? "bg-[#003b78]" : "bg-[#60a5fa]"
          }`}
        />
        {/* <div className="w-[3px] h-full bg-[#2b6cb0]/35 blur-[0.6px] shadow-[0_0_18px_rgba(43,108,176,0.35)]" />
        <div className="w-[2px] h-full bg-[#60a5fa]/25 blur-[1px]" /> */}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-[10%] flex items-stretch gap-6">
        <div
          className={`w-[20px] h-full ${
            theme === "dark" ? "bg-[#9b111e]" : "bg-[#f87171]"
          }`}
        />
        <div
          className={`w-[20px] h-full ${
            theme === "dark" ? "bg-[#9b111e]" : "bg-[#f87171]"
          }`}
        />
        {/* <div className="w-[3px] h-full bg-[#ef4444]/30 blur-[0.6px] shadow-[0_0_18px_rgba(239,68,68,0.3)]" />
        <div className="w-[2px] h-full bg-[#fca5a5]/20 blur-[1px]" /> */}
      </div>

      {items.map((item, i) => (
        <div
          key={i}
          className="animated-bg-item"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            width: item.size,
            height: item.size,
            filter: item.blur ? `blur(${item.blur}px)` : undefined,
            // CSS custom props consumed by animations
            "--d": item.duration,
            "--delay": item.delay,
            "--amp": `${Math.round(item.floatAmp)}px`,
            "--left": `${item.left}%`,
          }}
        >
          <div style={{ transform: `rotate(${item.rotate}deg)` }}>
            {/* For <img> renderers, only size is used. Inline SVGs also use color. */}
            <item.Icon size={item.size} color={color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
