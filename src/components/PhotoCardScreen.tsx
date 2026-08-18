import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { type Character } from '../data/characters';

interface PhotoCardScreenProps {
  character: Character;
  onContinue: () => void;
}

export default function PhotoCardScreen({ character, onContinue }: PhotoCardScreenProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [cardStyle, setCardStyle] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    { bg: 'from-purple-900 via-pink-900 to-indigo-900', border: 'border-pink-400/30', label: '💜 Магия' },
    { bg: 'from-amber-900 via-orange-900 to-red-900', border: 'border-amber-400/30', label: '🔥 Огонь' },
    { bg: 'from-cyan-900 via-blue-900 to-purple-900', border: 'border-cyan-400/30', label: '🌊 Океан' },
  ];

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUserPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#0a0015',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `PixelFlow_Birthday_Kvonu_${character.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setCaptured(true);
    } catch (err) {
      console.error('Capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  }, [character.name]);

  const currentStyle = styles[cardStyle];

  return (
    <motion.div
      className="relative z-10 min-h-screen flex flex-col items-center px-4 py-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-5"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-extrabold text-gradient-rainbow mb-1">
          📸 Праздничная открытка
        </h2>
        <p className="text-xs text-purple-300/70">
          Загрузи фото и создай открытку для Stories!
        </p>
      </motion.div>

      {/* Style switcher */}
      <motion.div
        className="flex gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {styles.map((s, i) => (
          <button
            key={i}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              cardStyle === i
                ? 'bg-white/20 text-white ring-1 ring-white/30'
                : 'bg-white/5 text-white/50'
            }`}
            onClick={() => setCardStyle(i)}
          >
            {s.label}
          </button>
        ))}
      </motion.div>

      {/* Card Preview */}
      <motion.div
        className="w-full max-w-sm mb-5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div
          ref={cardRef}
          className={`relative bg-gradient-to-br ${currentStyle.bg} rounded-3xl p-4 border ${currentStyle.border} overflow-hidden`}
          style={{ aspectRatio: '9/16' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-4 left-4 text-2xl opacity-30">✨</div>
            <div className="absolute top-6 right-6 text-xl opacity-20">💫</div>
            <div className="absolute bottom-20 left-6 text-lg opacity-25">⭐</div>
            <div className="absolute bottom-32 right-4 text-2xl opacity-20">🌟</div>
            {[
              { w: 3, l: 12, t: 15 }, { w: 5, l: 45, t: 8 }, { w: 2, l: 78, t: 22 },
              { w: 4, l: 25, t: 55 }, { w: 3, l: 88, t: 42 }, { w: 5, l: 60, t: 70 },
              { w: 2, l: 35, t: 85 }, { w: 4, l: 72, t: 60 }, { w: 3, l: 15, t: 75 },
              { w: 5, l: 50, t: 35 }, { w: 2, l: 92, t: 88 }, { w: 4, l: 8, t: 45 },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: dot.w + 'px',
                  height: dot.w + 'px',
                  left: dot.l + '%',
                  top: dot.t + '%',
                  background: 'white',
                  opacity: 0.15 + (i % 3) * 0.1,
                }}
              />
            ))}
          </div>

          {/* PixelFlow branding */}
          <div className="relative z-10 flex items-center justify-center mb-3">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-widest text-white/80">PIXELFLOW</span>
            </div>
          </div>

          {/* Birthday text */}
          <div className="relative z-10 text-center mb-3">
            <p className="text-lg font-extrabold text-white">С Днём Рождения!</p>
            <p className="text-2xl font-pacifico text-gradient-gold">Kvonu</p>
          </div>

          {/* Photo + Character section */}
          <div className="relative z-10 flex items-center justify-center gap-3 mb-4">
            {/* Character */}
            <div className="flex flex-col items-center">
              <div
                className="rounded-2xl overflow-hidden border-2 shadow-lg"
                style={{
                  width: 120,
                  height: 150,
                  borderColor: character.color + '60',
                  boxShadow: `0 0 20px ${character.color}30`,
                }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="text-[10px] font-bold text-white/80 mt-1">{character.name}</p>
              <p className="text-[8px] text-white/50">{character.emoji} {character.dramaUz}</p>
            </div>

            {/* Heart between */}
            <div className="text-2xl">❤️</div>

            {/* User photo or upload placeholder */}
            <div className="flex flex-col items-center">
              <div
                className="rounded-2xl overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer"
                style={{
                  width: 120,
                  height: 150,
                  borderColor: userPhoto ? character.color + '60' : 'rgba(255,255,255,0.3)',
                  boxShadow: userPhoto ? `0 0 20px ${character.color}30` : 'none',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <p className="text-3xl mb-1">📷</p>
                    <p className="text-[9px] text-white/50">Нажми, чтобы загрузить фото</p>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-bold text-white/80 mt-1">Kvonu</p>
              <p className="text-[8px] text-white/50">⭐ Именинница</p>
            </div>
          </div>

          {/* Quote */}
          <div className="relative z-10 text-center mb-3 px-2">
            <p className="text-xs text-white/80 italic leading-relaxed">
              «{character.scenario[character.scenario.length - 1].text.replace(/[🎂🔥❤️💜💙💚🦈🐺⚔️✨🧟🗣️💛🌸💖🎵]/g, '').trim()}»
            </p>
          </div>

          {/* Decorative bottom */}
          <div className="relative z-10 flex justify-center gap-1 mb-2">
            {['🎂', '🎉', '🎊', '💖', '✨', '🎁'].map((e, i) => (
              <span key={i} className="text-lg">{e}</span>
            ))}
          </div>

          {/* Bottom branding */}
          <div className="relative z-10 text-center">
            <p className="text-[8px] text-white/40">Создано с любовью • PixelFlow • t.me/kvonu</p>
          </div>
        </div>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3 mb-6">
        {/* Upload photo button */}
        <motion.button
          className="w-full py-3.5 rounded-2xl glass-card text-white font-semibold text-sm flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-lg">📷</span>
          {userPhoto ? 'Изменить фото' : 'Загрузить своё фото'}
        </motion.button>

        {/* Download button */}
        <motion.button
          className="w-full py-4 rounded-2xl btn-magic text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleDownload}
          disabled={isCapturing}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isCapturing ? (
            <>
              <span className="animate-spin">⏳</span>
              Создаём...
            </>
          ) : captured ? (
            <>
              <span>✅</span>
              Скачано! Скачать ещё раз
            </>
          ) : (
            <>
              <span>💾</span>
              Скачать открытку
            </>
          )}
        </motion.button>

        {/* Continue button */}
        <motion.button
          className="w-full py-3 rounded-2xl bg-white/5 text-white/70 font-medium text-sm"
          onClick={onContinue}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Продолжить →
        </motion.button>
      </div>

      {/* Share hint */}
      <AnimatePresence>
        {captured && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs text-purple-300/60">
              📲 Поделись в Stories и отметь @pixelflow!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
