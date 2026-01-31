import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingBubbleProps {
  id: string;
  text: string;
  colorClass: string;
  glowColor: string;
  isSelected: boolean;
  onSelect: () => void;
  position: { x: number; y: number };
  size: number;
}

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  id,
  text,
  colorClass,
  glowColor,
  isSelected,
  onSelect,
  position,
  size,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [localPosition, setLocalPosition] = useState(position);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef({ x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.3 });
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  // Physics animation loop
  useEffect(() => {
    let animationId: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      setLocalPosition((prev) => {
        let newX = prev.x + velocityRef.current.x;
        let newY = prev.y + velocityRef.current.y;

        // Bounce off edges
        if (newX < 0 || newX > window.innerWidth - 80) {
          velocityRef.current.x *= -1;
          newX = Math.max(0, Math.min(window.innerWidth - 80, newX));
        }
        if (newY < 0 || newY > window.innerHeight - 80) {
          velocityRef.current.y *= -1;
          newY = Math.max(0, Math.min(window.innerHeight - 80, newY));
        }

        // Damping
        velocityRef.current.x *= 0.98;
        velocityRef.current.y *= 0.98;

        return { x: newX, y: newY };
      });

      phaseRef.current += deltaTime * 0.5;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Wobble animation
  const wobbleX = Math.sin(phaseRef.current) * 2;
  const wobbleY = Math.cos(phaseRef.current * 0.7) * 2;

  return (
    <motion.div
      ref={bubbleRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isSelected ? 0 : isHovering ? 0.85 : 0.6,
        scale: isHovering ? 1.1 : 1,
      }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        position: 'fixed',
        left: localPosition.x + wobbleX,
        top: localPosition.y + wobbleY,
        width: size,
        height: size,
        cursor: 'pointer',
        zIndex: isHovering ? 20 : 10,
      }}
      className="transition-all duration-300"
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-40"
        style={{
          background: glowColor,
          filter: `blur(${isHovering ? 20 : 15}px)`,
        }}
      />

      {/* Main bubble */}
      <div
        className={`
          absolute inset-0 rounded-full backdrop-blur-md border
          ${isHovering ? 'border-white/60' : 'border-white/40'}
          transition-all duration-300 flex items-center justify-center
        `}
        style={{
          background: `radial-gradient(135deg, ${glowColor}60 0%, ${glowColor}20 50%, ${glowColor}05 100%)`,
          boxShadow: `inset 0 1px 20px ${glowColor}80, 0 0 ${isHovering ? 30 : 20}px ${glowColor}40`,
        }}
      >
        {/* Inner glow core */}
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: size * 0.4,
            height: size * 0.4,
            background: glowColor,
            filter: 'blur(8px)',
          }}
        />

        {/* Text - visible on hover, fully visible when selected */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0.4 }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
        >
          <p className="text-white text-sm font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {text}
          </p>
        </motion.div>

        {/* Selected checkmark indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
          >
            <span className="text-slate-900 font-bold text-sm">✓</span>
          </motion.div>
        )}

        {/* Pulse ring animation */}
        {!isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{
              scale: [1, 1.3],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};
