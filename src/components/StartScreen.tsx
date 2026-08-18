import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { characters, type Character } from '../data/characters';

interface StartScreenProps {
  onSelectCharacter: (character: Character) => void;
}

export default function StartScreen({ onSelectCharacter }: StartScreenProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <motion.div
      className="relative z-10 min-h-screen flex flex-col items-center px-4 py-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo & Header */}
      <motion.div
        className="text-center mb-6 mt-2"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
      >
        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full glass-card">
          <span className="text-xs font-semibold tracking-widest text-purple-300 uppercase">PixelFlow</span>
          <span className="text-xs">✨</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-gradient-rainbow font-inter">
          С Днём Рождения!
        </h1>
        <motion.p
          className="text-4xl font-pacifico text-gradient-gold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Kvonu
        </motion.p>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <p className="text-sm text-purple-200/80 leading-relaxed max-w-xs mx-auto">
          🎬 Выбери своего любимого героя дорамы и получи персональное поздравление!
        </p>
      </motion.div>

      {/* Characters Grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {characters.map((char, index) => (
          <motion.button
            key={char.id}
            className="relative group"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.9 + index * 0.1,
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelectCharacter(char)}
            onTouchStart={() => setHoveredId(char.id)}
            onTouchEnd={() => setHoveredId(null)}
          >
            <div
              className="glass-card rounded-2xl p-3 flex flex-col items-center transition-all duration-300"
              style={{
                borderColor: hoveredId === char.id ? char.color + '80' : 'rgba(255,255,255,0.1)',
                boxShadow: hoveredId === char.id ? `0 0 30px ${char.color}40, inset 0 0 20px ${char.color}10` : 'none',
              }}
            >
              {/* Avatar */}
              <div className="avatar-ring mb-2 shrink-0" style={{ width: 72, height: 72 }}>
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>

              {/* Emoji badge */}
              <span className="text-lg mb-1">{char.emoji}</span>

              {/* Name */}
              <p className="text-xs font-bold text-white leading-tight text-center mb-0.5">
                {char.name}
              </p>

              {/* Drama name */}
              <p className="text-[10px] text-purple-300/70 text-center leading-tight">
                {char.dramaUz}
              </p>
            </div>

            {/* Selection indicator */}
            <AnimatePresence>
              {hoveredId === char.id && (
                <motion.div
                  className="absolute -inset-[1px] rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: `linear-gradient(135deg, ${char.color}30, transparent, ${char.color}20)`,
                    borderRadius: '1rem',
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        className="text-xs text-purple-300/50 text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        ☝️ Нажми на персонажа, чтобы начать
      </motion.p>
    </motion.div>
  );
}
