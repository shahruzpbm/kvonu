import { motion } from 'framer-motion';
import { type Character } from '../data/characters';

interface OrderScreenProps {
  character: Character;
  onRestart: () => void;
}

export default function OrderScreen({ character, onRestart }: OrderScreenProps) {
  const telegramUrl = `https://t.me/kvonu?text=${encodeURIComponent(
    '🎂 Привет! Я увидел(а) потрясающее поздравление от PixelFlow и тоже хочу заказать такой же крутой проект для своего друга/подруги! 🎉✨'
  )}`;

  return (
    <motion.div
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Celebration header */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-extrabold text-gradient-rainbow mb-3">
          Поздравление завершено!
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed max-w-xs mx-auto">
          Надеемся, тебе понравилось, <span className="font-bold text-pink-400">Kvonu</span>! 
          Ты — невероятная, и мы бесконечно рады, что смогли подарить тебе этот момент счастья! 💖
        </p>
      </motion.div>

      {/* Thank you card */}
      <motion.div
        className="w-full max-w-sm glass-card-strong rounded-3xl p-6 mb-6 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="avatar-ring" style={{ width: 56, height: 56 }}>
            <div className="w-full h-full rounded-full overflow-hidden">
              <img src={character.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">{character.name}</p>
            <p className="text-xs text-purple-300/60">{character.drama}</p>
          </div>
        </div>

        <p className="text-sm text-white/80 italic leading-relaxed mb-4">
          «Спасибо, что провела это время со мной, Kvonu. Ты сделала этот день особенным для нас обоих!
          Пусть каждый день твоей жизни будет наполнен такой же радостью!»
        </p>

        <div className="flex justify-center gap-2 text-2xl">
          {['💖', '🎂', '🌟', '🎊', '💫'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="w-full max-w-sm grid grid-cols-3 gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-gradient-gold">10</p>
          <p className="text-[9px] text-purple-300/60">Персонажей</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-gradient-pink">∞</p>
          <p className="text-[9px] text-purple-300/60">Пожеланий</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-gradient-rainbow">1</p>
          <p className="text-[9px] text-purple-300/60">Kvonu 💖</p>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="w-full max-w-sm space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* Want same */}
        <div className="glass-card-strong rounded-3xl p-5 text-center">
          <p className="text-base font-bold text-white mb-2">
            ✨ Хочешь такое же поздравление?
          </p>
          <p className="text-xs text-purple-200/70 mb-4 leading-relaxed">
            Закажи эксклюзивный интерактивный проект для своего друга или близкого человека!
            Мы создадим магию специально для него 🪄
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-2xl btn-magic text-white font-bold text-base shadow-lg active:scale-95 transition-transform"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Заказать в Telegram
            </span>
          </a>
        </div>

        {/* Restart */}
        <motion.button
          className="w-full py-3.5 rounded-2xl glass-card text-white/70 font-medium text-sm flex items-center justify-center gap-2"
          onClick={onRestart}
          whileTap={{ scale: 0.96 }}
        >
          <span>🔄</span>
          Выбрать другого персонажа
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <p className="text-[10px] text-purple-400/40 mb-1">
          Создано с 💜 командой PixelFlow
        </p>
        <p className="text-[9px] text-purple-400/30">
          © 2025 PixelFlow • Все права защищены
        </p>
      </motion.div>
    </motion.div>
  );
}
