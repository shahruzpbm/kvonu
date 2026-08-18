import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated rings */}
      <div className="relative mb-8 flex items-center justify-center">
        <motion.div
          className="absolute -inset-8 rounded-full border border-purple-500/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute -inset-16 rounded-full border border-pink-500/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div
          className="absolute -inset-24 rounded-full border border-cyan-500/5"
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
        />

        {/* Rotating gradient border container */}
        <div className="relative w-24 h-24 rounded-full p-[3px] flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #ec4899, #a855f7, #22d3ee, #fbbf24, #ec4899)',
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner static badge with pulsing cake */}
          <div className="relative z-10 w-full h-full rounded-full bg-[#0a0015] flex items-center justify-center">
            <motion.span
              className="text-4xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🎂
            </motion.span>
          </div>
        </div>
      </div>

      {/* Brand */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-bold tracking-[0.3em] text-purple-300/60 mb-2">PIXELFLOW</p>
        <h1 className="text-2xl font-extrabold text-gradient-rainbow mb-2">
          Happy Birthday
        </h1>
        <motion.p
          className="text-3xl font-pacifico text-gradient-gold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Kvonu
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="mt-10 w-48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7, #22d3ee)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            onAnimationComplete={onComplete}
          />
        </div>
        <motion.p
          className="text-[10px] text-purple-400/40 text-center mt-3"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Подготовка волшебства...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
