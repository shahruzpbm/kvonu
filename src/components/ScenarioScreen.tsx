import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Character } from '../data/characters';

interface ScenarioScreenProps {
  character: Character;
  onComplete: () => void;
}

export default function ScenarioScreen({ character, onComplete }: ScenarioScreenProps) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmotion, setShowEmotion] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const scenario = character.scenario;
  const isIntro = currentStep === -1;
  const step = !isIntro ? scenario[currentStep] : null;
  const isLast = currentStep === scenario.length - 1;

  // Generate sparkles
  const generateSparkles = useCallback(() => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 2000);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (isIntro) return;
    if (!step) return;

    setShowText(false);
    setTypedText('');
    setIsTyping(true);
    setShowEmotion(false);

    const text = step.text;
    let i = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      setShowText(true);
      intervalId = setInterval(() => {
        if (i < text.length) {
          setTypedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
          setShowEmotion(true);
          if (step.type === 'effect' || step.type === 'gift' || step.type === 'final') {
            generateSparkles();
          }
        }
      }, 30);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentStep, isIntro, step, generateSparkles]);

  const handleNext = () => {
    if (isTyping) return;
    
    if (isIntro) {
      setCurrentStep(0);
      return;
    }

    if (isLast) {
      onComplete();
      return;
    }

    setCurrentStep(prev => prev + 1);
    generateSparkles();
  };

  const getStepBg = () => {
    if (!step) return '';
    switch (step.type) {
      case 'action': return 'from-purple-900/40 to-indigo-900/40';
      case 'gift': return 'from-amber-900/40 to-orange-900/40';
      case 'final': return 'from-pink-900/40 to-rose-900/40';
      default: return 'from-gray-900/40 to-purple-900/40';
    }
  };

  const getStepIcon = () => {
    if (!step) return '💬';
    switch (step.type) {
      case 'action': return '✨';
      case 'gift': return '🎁';
      case 'final': return '🎂';
      default: return '💬';
    }
  };

  return (
    <motion.div
      className="relative z-10 min-h-screen flex flex-col items-center justify-between px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Sparkles overlay */}
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            className="fixed pointer-events-none z-50"
            style={{ left: s.x + '%', top: s.y + '%' }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: s.delay }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Top bar */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2" style={{ borderColor: character.color, outline: `2px solid ${character.color}` }}>
              <img src={character.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{character.name}</p>
              <p className="text-[10px] text-purple-300/60">{character.drama}</p>
            </div>
          </div>
          {!isIntro && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-purple-300/60">
                {currentStep + 1}/{scenario.length}
              </span>
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: character.color }}
                  animate={{ width: `${((currentStep + 1) / scenario.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          {isIntro ? (
            <motion.div
              key="intro"
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {/* Character avatar large */}
              <motion.div
                className="mx-auto mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="avatar-ring mx-auto" style={{ width: 140, height: 140 }}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src={character.image} alt={character.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </div>
                </div>
              </motion.div>

              <motion.h2
                className="text-2xl font-extrabold mb-2"
                style={{ color: character.color }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {character.name}
              </motion.h2>

              <motion.p
                className="text-sm text-purple-300/70 mb-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                «{character.drama}» • {character.dramaUz}
              </motion.p>

              <motion.div
                className="text-4xl mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {character.emoji}
              </motion.div>

              {/* Greeting messages */}
              <div className="space-y-3 mb-8">
                {character.greeting.map((line, i) => (
                  <motion.p
                    key={i}
                    className="text-sm text-purple-100/90 leading-relaxed"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.3 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              className={`w-full glass-card-strong rounded-3xl p-5 bg-gradient-to-br ${getStepBg()}`}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              {/* Step type badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{getStepIcon()}</span>
                <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: character.color }}>
                  {step?.type === 'dialogue' ? 'Реплика' :
                   step?.type === 'action' ? 'Действие' :
                   step?.type === 'gift' ? 'Подарок' :
                   step?.type === 'final' ? 'Финал' : ''}
                </span>
              </div>

              {/* Character mini avatar for dialogues */}
              {step?.type === 'dialogue' && (
                <div className="flex items-start gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2" style={{ borderColor: character.color }}>
                     <img src={character.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold mb-1" style={{ color: character.color }}>{character.name}</p>
                    <motion.p
                      className="text-sm text-white/90 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {showText ? typedText : ''}
                      {isTyping && <span className="animate-pulse ml-0.5">|</span>}
                    </motion.p>
                  </div>
                </div>
              )}

              {/* Action / Gift / Final text */}
              {step?.type !== 'dialogue' && (
                <div className="text-center py-2">
                  {step?.type === 'gift' && (
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      🎁
                    </motion.div>
                  )}
                  {step?.type === 'final' && (
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🎂
                    </motion.div>
                  )}
                  <motion.p
                    className={`text-sm leading-relaxed ${
                      step?.type === 'action' ? 'text-purple-200/80 italic' :
                      step?.type === 'final' ? 'text-lg font-bold text-white' :
                      'text-amber-200/90'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {showText ? typedText : ''}
                    {isTyping && <span className="animate-pulse ml-0.5">|</span>}
                  </motion.p>
                </div>
              )}

              {/* Emotion reaction */}
              <AnimatePresence>
                {showEmotion && step?.emotion && (
                  <motion.div
                    className="flex justify-end mt-3"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <span className="text-2xl">{step.emotion}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="w-full max-w-sm mt-6">
        <motion.button
          className="w-full py-4 rounded-2xl btn-magic text-white font-bold text-base shadow-lg disabled:opacity-50"
          onClick={handleNext}
          disabled={isTyping}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isIntro ? 1.8 : 0.3 }}
        >
          {isIntro ? (
            <span className="flex items-center justify-center gap-2">
              Начать поздравление ✨
            </span>
          ) : isLast ? (
            <span className="flex items-center justify-center gap-2">
              Создать открытку 📸
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Далее →
            </span>
          )}
        </motion.button>

        {/* Skip hint */}
        {!isIntro && !isLast && (
          <motion.p
            className="text-center text-[10px] text-purple-400/40 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {currentStep + 1} из {scenario.length}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
