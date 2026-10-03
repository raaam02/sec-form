import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-[16px]",
    md: "text-[19px]",
    lg: "text-[23px]",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Aesthetic New Mark: The Prism F */}
      <div className={`relative shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Ambient Radial Core Glow */}
            <radialGradient id="logo-ambient-glow" cx="50%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#9333EA" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
            
            {/* Deep Obsidian Background */}
            <linearGradient id="logo-container-bg" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#0B0F1D" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Specular Beveled Rim Stroke */}
            <linearGradient id="logo-rim-light" x1="12" y1="4" x2="88" y2="94" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#C084FC" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#F43F5E" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.35" />
            </linearGradient>

            {/* F Ribbon Flow: Cyan to Indigo to Purple */}
            <linearGradient id="logo-f-spine" x1="26" y1="22" x2="70" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="32%" stopColor="#6366F1" />
              <stop offset="72%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Interactive Form Slider: Rose/Coral Glow */}
            <linearGradient id="logo-slider-bar" x1="36" y1="44" x2="68" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>

          {/* Squircle Base Container */}
          <rect width="96" height="96" rx="24" fill="url(#logo-container-bg)" />
          <rect width="96" height="96" rx="24" fill="url(#logo-ambient-glow)" />
          <rect x="0.75" y="0.75" width="94.5" height="94.5" rx="23.25" stroke="url(#logo-rim-light)" strokeWidth="1.5" />

          {/* Main F Spine & Top Arm */}
          <path
            d="M28 70C28 71.6569 29.3431 73 31 73H36C37.6569 73 39 71.6569 39 70V34.5H63C65.8954 34.5 68.25 32.1454 68.25 29.25C68.25 26.3546 65.8954 24 63 24H34.5C30.9101 24 28 26.9101 28 30.5V70Z"
            fill="url(#logo-f-spine)"
          />

          {/* Top Edge Specular Glaze */}
          <path
            d="M34.5 24.5H63C65.5 24.5 67.5 26.5 67.5 29C67.5 27.8 65.5 25.2 63 25.2H34.5C31.3 25.2 28.5 27.8 28.4 31C28.5 28 31.3 24.5 34.5 24.5Z"
            fill="#FFFFFF"
            fillOpacity="0.55"
          />

          {/* Floating Form Toggle / Crossbar with Inner Sheen */}
          <rect x="35" y="44" width="30" height="10.5" rx="5.25" fill="url(#logo-slider-bar)" />
          <rect x="35.5" y="44.5" width="29" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Modern Wordmark */}
      {showText && (
        <span className={`font-outfit font-black tracking-tight text-foreground flex items-center ${textSizes[size]}`}>
          Formu
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 font-extrabold ml-0.5">
            .AI
          </span>
        </span>
      )}
    </div>
  );
}
