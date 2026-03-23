"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Battery,
  Bolt,
  Car,
  CarFront,
  Cog,
  Fan,
  Gauge,
  Truck,
  Wrench,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

import lite0 from "../../lite_icons/0b8897cf-e1e1-4058-a293-ad47d2de06c9.jpeg";
import lite1 from "../../lite_icons/254b70ce-14b7-445b-a64a-0d1c0883e182.jpeg";
import lite2 from "../../lite_icons/32657e35-96d0-4ecb-925f-095f8db25621.jpeg";
import lite3 from "../../lite_icons/4ab721c6-ec52-4893-a1eb-37ef4a87c8da.jpeg";
import lite4 from "../../lite_icons/51a32135-d70b-405d-8c8d-a7ff6368b42c.jpeg";
import lite5 from "../../lite_icons/852f661f-d09e-4102-8bb1-85653d8407b9.jpeg";
import lite6 from "../../lite_icons/8ad7ecd3-849c-4b06-8b21-a14631e0864f.jpeg";
import lite7 from "../../lite_icons/d29aff07-0e22-4e8b-a246-f5519f6543d6.jpeg";
import lite8 from "../../lite_icons/f14e596f-638b-40ce-bc65-bb92afdad8a7.jpeg";

import dark0 from "../../dark_icons/air.png";
import dark1 from "../../dark_icons/amortisseur2.png";
import dark2 from "../../dark_icons/frein-a-disque.png";
import dark3 from "../../dark_icons/huile-de-voiture.png";
import dark4 from "../../dark_icons/huile-moteur.png";
import dark5 from "../../dark_icons/jantes-en-alliage.png";
import dark6 from "../../dark_icons/piston.png";
import dark7 from "../../dark_icons/pneu.png";
import dark8 from "../../dark_icons/radiateur-de-voiture.png";
import dark9 from "../../dark_icons/turbo.png";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const AnimatedBackground = ({
  count = 20,
  minSize = 24,
  maxSize = 72,
  color = "rgba(148,163,184,0.25)", // silhouette/fill color for fallback SVGs
  preferImageIcons = true,
  useLucide = false,
  lucideIcons = [], // array of Lucide components e.g. [Car, Truck]
  // Prefer certain image filenames (substring match, case-insensitive). Example: ['amortisseur']
  preferredImageNames = [],
  // If true, force using images only (no lucide/fallback). If no images found, nothing will render.
  imageOnly = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Next.js doesn't support Vite's import.meta.glob. We import icons explicitly.
  const imageIconUrlsLite = [
    lite0?.src ?? lite0,
    lite1?.src ?? lite1,
    lite2?.src ?? lite2,
    lite3?.src ?? lite3,
    lite4?.src ?? lite4,
    lite5?.src ?? lite5,
    lite6?.src ?? lite6,
    lite7?.src ?? lite7,
    lite8?.src ?? lite8,
  ].filter(Boolean);
  const imageIconUrlsDark = [
    dark0?.src ?? dark0,
    dark1?.src ?? dark1,
    dark2?.src ?? dark2,
    dark3?.src ?? dark3,
    dark4?.src ?? dark4,
    dark5?.src ?? dark5,
    dark6?.src ?? dark6,
    dark7?.src ?? dark7,
    dark8?.src ?? dark8,
    dark9?.src ?? dark9,
  ].filter(Boolean);

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
    // Fallback: Lucide set
    return [Car, CarFront, Truck, Gauge, Wrench, Cog, Bolt, Fan, Battery].map(
      (IconCmp) =>
        ({ size }) => (
          <IconCmp
            size={size}
            stroke="rgba(148,163,184,0.35)"
            strokeWidth={1.5}
          />
        ),
    );
  }, [useLucide, lucideIcons, preferImageIcons, imageIconUrls]);
  const items = useMemo(() => {
    if (!isClient) return [];
    if (!Renderers || Renderers.length === 0) return [];
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
  }, [isClient, count, minSize, maxSize, Renderers]);

  return (
    <div className="animated-bg-container blur-[3px]" aria-hidden>
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
