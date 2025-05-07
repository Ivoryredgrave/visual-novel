import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/GameScreen.css';

export default function GameScreen({ initialScene = 'scene1', onMenuClick }) {
  const [sceneName, setSceneName] = useState(initialScene);
  const [sceneData, setSceneData] = useState(null);
  const [sceneMap, setSceneMap] = useState({});
  const [currentId, setCurrentId] = useState('start');
  const [isSceneFinished, setIsSceneFinished] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    import(`../data/${sceneName}.json`).then(data => {
      const json = data.default || data;
      const dialogue = json.dialogue || json;
      const map = dialogue.reduce((acc, line) => {
        acc[line.id] = line;
        return acc;
      }, {});
      setSceneData(json);
      setSceneMap(map);
      setCurrentId('start');
      setIsSceneFinished(false);
      setIsTransitioning(false); // una vez cargado, termina transición
    });
  }, [sceneName]);

  const currentLine = sceneMap[currentId];
  const background = sceneData?.background;

  if (!currentLine) return <div className="loading">Cargando...</div>;

  const handleNext = () => {
    if (currentLine.choices || isTransitioning) return;

    if (currentLine.next) {
      setCurrentId(currentLine.next);
    } else if (currentLine.nextScene) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSceneName(currentLine.nextScene);
      }, 500); // dura igual que el fade
    } else {
      setIsSceneFinished(true);
    }
  };

  const handleChoice = (choice) => {
    if (isTransitioning) return;
    if (choice.next) {
      setCurrentId(choice.next);
    } else if (choice.nextScene) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSceneName(choice.nextScene);
      }, 500);
    }
  };

  const handleBackToMenu = () => {
    if (onMenuClick) onMenuClick();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneName}
        className="game-screen"
        onClick={!currentLine.choices ? handleNext : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: background
          ? `url(${import.meta.env.BASE_URL}backgrounds/${background}.png)`
          : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="dialogue-box">
          <p className="dialogue-speaker">{currentLine.speaker}</p>
          <div className="dialogue-text">
            <span>{currentLine.text}</span>
            {!currentLine.choices && (
              <motion.span
                className="arrow-inline"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: 'easeInOut',
                }}
                onClick={handleNext}
              >
                →
              </motion.span>
            )}
          </div>

          {currentLine.choices && (
            <div>
              {currentLine.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="choice-button"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {isSceneFinished && (
          <div>
            <button onClick={handleBackToMenu} className="return-button">
              Volver al Menú
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
