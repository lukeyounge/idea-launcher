import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RocketShipProps {
  problemLocked: boolean;
  peopleLocked: boolean;
  solutionLocked: boolean;
  onLaunch?: () => void;
}

export const RocketShip: React.FC<RocketShipProps> = ({
  problemLocked,
  peopleLocked,
  solutionLocked,
  onLaunch,
}) => {
  const allLocked = problemLocked && peopleLocked && solutionLocked;
  const sectionFilled = [problemLocked, peopleLocked, solutionLocked].filter(Boolean).length;

  const rocketStage = useMemo(() => {
    if (!problemLocked && !peopleLocked && !solutionLocked) return 'build';
    if (problemLocked && !peopleLocked && !solutionLocked) return 'foundation';
    if (problemLocked && peopleLocked && !solutionLocked) return 'crew';
    return 'ready';
  }, [problemLocked, peopleLocked, solutionLocked]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Rocket SVG */}
      <motion.svg
        viewBox="0 0 200 500"
        className="w-48 md:w-64 h-auto"
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(251, 113, 133, 0.15))',
        }}
        animate={{
          y: allLocked ? [0, -10, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: allLocked ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Nose Cone (Solution - Top) */}
        <motion.g>
          <motion.defs>
            <linearGradient id="noseConeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff4081" />
              <stop offset="100%" stopColor="#e91e63" />
            </linearGradient>
          </motion.defs>
          <motion.polygon
            points="100,20 130,80 70,80"
            fill={solutionLocked ? 'url(#noseConeGradient)' : '#cbd5e1'}
            stroke={solutionLocked ? '#ff4081' : '#cbd5e1'}
            strokeWidth={solutionLocked ? '2.5' : '1.5'}
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={{
              opacity: solutionLocked ? 1 : 0.3,
              scale: solutionLocked ? 1 : 0.8,
            }}
            transition={{ duration: 0.5 }}
          />
          {/* Glow when locked */}
          {solutionLocked && (
            <motion.polygon
              points="100,20 130,80 70,80"
              fill="none"
              stroke="#ff4081"
              strokeWidth="4"
              opacity="0.6"
              animate={{
                opacity: [0.6, 0.3, 0.6],
                strokeWidth: ['4', '6', '4'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          )}
          {/* Label */}
          <text
            x="100"
            y="55"
            textAnchor="middle"
            fill={solutionLocked ? '#fff' : '#94a3b8'}
            fontSize="11"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            {solutionLocked ? 'S' : '?'}
          </text>
        </motion.g>

        {/* Main Body - Crew Cabin (People - Middle) */}
        <motion.g>
          <motion.defs>
            <linearGradient id="cabinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="100%" stopColor="#ff1493" />
            </linearGradient>
          </motion.defs>
          <motion.rect
            x="60"
            y="80"
            width="80"
            height="120"
            fill={peopleLocked ? 'url(#cabinGradient)' : '#cbd5e1'}
            stroke={peopleLocked ? '#ff1493' : '#cbd5e1'}
            strokeWidth={peopleLocked ? '2.5' : '1.5'}
            rx="12"
            initial={{ opacity: 0.3, scaleY: 0.8 }}
            animate={{
              opacity: peopleLocked ? 1 : 0.3,
              scaleY: peopleLocked ? 1 : 0.8,
            }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{ originY: '80px' }}
          />
          {/* Glow when locked */}
          {peopleLocked && (
            <motion.rect
              x="60"
              y="80"
              width="80"
              height="120"
              fill="none"
              stroke="#ff1493"
              strokeWidth="4"
              rx="12"
              opacity="0.6"
              animate={{
                opacity: [0.6, 0.3, 0.6],
                strokeWidth: ['4', '6', '4'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.3,
              }}
            />
          )}
          {/* Windows */}
          <circle cx="85" cy="110" r="5" fill={peopleLocked ? '#fff' : '#e2e8f0'} opacity={peopleLocked ? 0.8 : 0.4} />
          <circle cx="115" cy="110" r="5" fill={peopleLocked ? '#fff' : '#e2e8f0'} opacity={peopleLocked ? 0.8 : 0.4} />
          <circle cx="85" cy="160" r="5" fill={peopleLocked ? '#fff' : '#e2e8f0'} opacity={peopleLocked ? 0.8 : 0.4} />
          <circle cx="115" cy="160" r="5" fill={peopleLocked ? '#fff' : '#e2e8f0'} opacity={peopleLocked ? 0.8 : 0.4} />
          {/* Label */}
          <text
            x="100"
            y="145"
            textAnchor="middle"
            fill={peopleLocked ? '#fff' : '#94a3b8'}
            fontSize="13"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            {peopleLocked ? 'P' : '?'}
          </text>
        </motion.g>

        {/* Engine/Foundation (Problem - Bottom) */}
        <motion.g>
          <motion.defs>
            <linearGradient id="engineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="100%" stopColor="#ff1493" />
            </linearGradient>
          </motion.defs>
          <motion.rect
            x="70"
            y="200"
            width="60"
            height="100"
            fill={problemLocked ? 'url(#engineGradient)' : '#cbd5e1'}
            stroke={problemLocked ? '#ff1493' : '#cbd5e1'}
            strokeWidth={problemLocked ? '2.5' : '1.5'}
            rx="10"
            initial={{ opacity: 0.3, scaleY: 0.8 }}
            animate={{
              opacity: problemLocked ? 1 : 0.3,
              scaleY: problemLocked ? 1 : 0.8,
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ originY: '200px' }}
          />
          {/* Glow when locked */}
          {problemLocked && (
            <motion.rect
              x="70"
              y="200"
              width="60"
              height="100"
              fill="none"
              stroke="#ff1493"
              strokeWidth="4"
              rx="10"
              opacity="0.6"
              animate={{
                opacity: [0.6, 0.3, 0.6],
                strokeWidth: ['4', '6', '4'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.6,
              }}
            />
          )}
          {/* Label */}
          <text
            x="100"
            y="255"
            textAnchor="middle"
            fill={problemLocked ? '#fff' : '#94a3b8'}
            fontSize="13"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            {problemLocked ? 'E' : '?'}
          </text>
        </motion.g>

        {/* Fins */}
        <motion.polygon
          points="50,280 40,350 70,320"
          fill={problemLocked ? '#ff6b9d' : '#cbd5e1'}
          stroke={problemLocked ? '#ff1493' : '#cbd5e1'}
          strokeWidth={problemLocked ? '2' : '1.5'}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: problemLocked ? 1 : 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        <motion.polygon
          points="150,280 160,350 130,320"
          fill={problemLocked ? '#ff6b9d' : '#cbd5e1'}
          stroke={problemLocked ? '#ff1493' : '#cbd5e1'}
          strokeWidth={problemLocked ? '2' : '1.5'}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: problemLocked ? 1 : 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Exhaust nozzle */}
        <rect x="85" y="300" width="30" height="40" fill={problemLocked ? '#ff1493' : '#cbd5e1'} stroke={problemLocked ? '#ff1493' : '#cbd5e1'} strokeWidth={problemLocked ? '2' : '1'} rx="4" opacity={problemLocked ? 1 : 0.3} />
      </motion.svg>

      {/* Flame animation - only when problem is locked */}
      {problemLocked && (
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
          {/* Flame 1 */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-12 h-24 rounded-t-full origin-bottom pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(251, 146, 60, 0.8), rgba(249, 115, 22, 0.6), transparent)',
            }}
            animate={{
              height: [80, 100, 85, 95, 80],
              opacity: [0.6, 1, 0.7, 0.9, 0.6],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Flame 2 */}
          <motion.div
            className="absolute -left-4 w-8 h-16 rounded-t-full origin-bottom pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(244, 63, 94, 0.7), rgba(251, 113, 133, 0.4), transparent)',
            }}
            animate={{
              height: [60, 75, 65, 70, 60],
              opacity: [0.4, 0.8, 0.5, 0.7, 0.4],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.1,
            }}
          />
          {/* Flame 3 */}
          <motion.div
            className="absolute right-0 w-8 h-16 rounded-t-full origin-bottom pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(244, 63, 94, 0.7), rgba(251, 113, 133, 0.4), transparent)',
            }}
            animate={{
              height: [60, 70, 65, 75, 60],
              opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
            }}
            transition={{
              duration: 0.65,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.15,
            }}
          />
        </div>
      )}

      {/* Status text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-24 md:mt-32 text-center"
      >
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
          {allLocked ? '🚀 Ready for Launch!' : `Building Your Rocket (${sectionFilled}/3)`}
        </h3>
        <p className="text-slate-400 text-sm">
          {!problemLocked && 'Lock The Struggle to power the engine'}
          {problemLocked && !peopleLocked && 'Lock The Crowd to bring your crew aboard'}
          {problemLocked && peopleLocked && !solutionLocked && 'Lock The Big Idea to aim for the stars'}
          {allLocked && 'All systems go. Time to launch your idea into the world.'}
        </p>
      </motion.div>

      {/* Launch button */}
      {allLocked && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLaunch}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold uppercase tracking-[0.15em] text-sm rounded-full shadow-[0_0_40px_rgba(251,113,133,0.4)] hover:shadow-[0_0_60px_rgba(251,113,133,0.6)] transition-all"
        >
          Launch →
        </motion.button>
      )}
    </div>
  );
};
