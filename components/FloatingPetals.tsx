"use client"; // Framer Motion runs in the browser, so this component can't be server-rendered

import { motion } from "framer-motion";

// Each shape gets its own size, position, color, and timing —
// randomizing these is what makes the drift feel organic instead of mechanical.
const shapes = [
  { size: 18, left: "8%", color: "#111111", duration: 14, delay: 0 },
  { size: 12, left: "22%", color: "#6B6B6B", duration: 18, delay: 2 },
  { size: 24, left: "40%", color: "#111111", duration: 16, delay: 1 },
  { size: 10, left: "58%", color: "#6B6B6B", duration: 20, delay: 3 },
  { size: 20, left: "72%", color: "#111111", duration: 15, delay: 0.5 },
  { size: 14, left: "88%", color: "#6B6B6B", duration: 19, delay: 2.5 },
];

export default function FloatingPetals() {
  return (
    // aria-hidden: this is decorative, so we hide it from screen readers —
    // it shouldn't be announced as content.
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {shapes.map((shape, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full opacity-20 blur-[1px]"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            backgroundColor: shape.color,
            top: "-5%",
          }}
          // animate: moves the shape down and slightly sideways, like it's drifting/falling
          animate={{
            y: ["0vh", "110vh"],
            x: [0, 20, -15, 0],
            opacity: [0, 0.2, 0.2, 0],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity, // loops forever
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
