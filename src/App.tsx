import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MagicBackground from './components/MagicBackground';
import SplashScreen from './components/SplashScreen';
import StartScreen from './components/StartScreen';
import ScenarioScreen from './components/ScenarioScreen';
import PhotoCardScreen from './components/PhotoCardScreen';
import OrderScreen from './components/OrderScreen';
import { type Character } from './data/characters';

type Phase = 'splash' | 'start' | 'scenario' | 'photo' | 'order';

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSplashComplete = useCallback(() => {
    setPhase('start');
  }, []);

  const handleSelectCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setPhase('scenario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleScenarioComplete = useCallback(() => {
    setPhase('photo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePhotoContinue = useCallback(() => {
    setPhase('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRestart = useCallback(() => {
    setSelectedCharacter(null);
    setPhase('start');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const bgPhase = phase === 'start' || phase === 'splash' ? 'start' : phase === 'scenario' ? 'scenario' : 'photo';

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {phase !== 'splash' && <MagicBackground activePhase={bgPhase} />}
      
      <AnimatePresence mode="wait">
        {phase === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {phase === 'start' && (
          <StartScreen
            key="start"
            onSelectCharacter={handleSelectCharacter}
          />
        )}
        
        {phase === 'scenario' && selectedCharacter && (
          <ScenarioScreen
            key="scenario"
            character={selectedCharacter}
            onComplete={handleScenarioComplete}
          />
        )}
        
        {phase === 'photo' && selectedCharacter && (
          <PhotoCardScreen
            key="photo"
            character={selectedCharacter}
            onContinue={handlePhotoContinue}
          />
        )}
        
        {phase === 'order' && selectedCharacter && (
          <OrderScreen
            key="order"
            character={selectedCharacter}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
