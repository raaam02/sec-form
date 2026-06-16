/**
 * Reusable hand-drawn SVG decorations for the Landing page.
 * All components are purely presentational.
 */

import React from "react";

export const ScribbleUnderline = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 12"
    fill="none"
    className={`absolute -bottom-1 left-0 w-full pointer-events-none ${className}`}
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      d="M2 8 C20 4, 48 10, 72 6 C96 2, 115 9, 140 7 C160 5, 180 9, 198 5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      className="opacity-75"
    />
  </svg>
);

export const MarkerCircle = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 54"
    fill="none"
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    preserveAspectRatio="none"
    aria-hidden
  >
    <ellipse
      cx="60"
      cy="27"
      rx="57"
      ry="22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="5 2"
      className="opacity-60"
    />
  </svg>
);

export const BrushStroke = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 300 40"
    fill="none"
    className={`absolute -bottom-2 left-0 w-full pointer-events-none ${className}`}
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      d="M5 30 C30 10, 80 35, 130 18 C175 5, 220 32, 295 14"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      fill="none"
      className="opacity-12"
    />
  </svg>
);

export const WiggleArrow = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 70 44"
    fill="none"
    className={`w-16 h-10 pointer-events-none ${className}`}
    aria-hidden
  >
    <path
      d="M4 22 C12 8, 24 6, 34 16 C44 26, 54 8, 64 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      className="opacity-55"
    />
    <path
      d="M59 11 L64 18 L55 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="opacity-55"
    />
  </svg>
);

export const OrganicBlob = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    fill="currentColor"
    className={`absolute pointer-events-none select-none ${className}`}
    aria-hidden
  >
    <path
      d="M44.5,-76.3C56.2,-69.9,62.5,-54,67.8,-39.1C73.2,-24.3,77.7,-10.4,76.5,2.8C75.3,16.1,68.5,28.7,60.3,40.5C52.1,52.3,42.7,63.3,30.5,70.4C18.4,77.5,3.6,80.8,-10.9,79.3C-25.4,77.8,-39.5,71.5,-50.5,61.8C-61.5,52.2,-69.5,39.2,-73.3,24.9C-77.1,10.6,-76.7,-5,-72.6,-19.3C-68.5,-33.5,-60.7,-46.4,-49.6,-53.6C-38.5,-60.7,-24.1,-62.1,-8.5,-63.8C7.1,-65.5,32.9,-82.8,44.5,-76.3Z"
      transform="translate(100 100)"
    />
  </svg>
);

export const SquiggleDivider = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 1200 30"
    fill="none"
    className={`w-full h-8 text-border/30 pointer-events-none ${className}`}
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      d="M0 15 C100 5, 200 25, 300 15 C400 5, 500 25, 600 15 C700 5, 800 25, 900 15 C1000 5, 1100 25, 1200 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/** Highlight an inline word/phrase with a scribble underline */
export const HighlightedWord = ({
  children,
  className = "text-primary",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={`relative inline-block ${className}`}>
    {children}
    <ScribbleUnderline className={className} />
  </span>
);

/** Wrap a word in a marker-style circle */
export const CircledWord = ({
  children,
  circleClass = "text-primary",
}: {
  children: React.ReactNode;
  circleClass?: string;
}) => (
  <span className={`relative inline-block px-3 ${circleClass}`}>
    {children}
    <MarkerCircle className={circleClass} />
  </span>
);
