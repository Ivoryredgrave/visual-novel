import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainMenu from './pages/MainMenu';
import GameScreen from './pages/GameScreen';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = () => {
    navigate('/'); // Volver al menú
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainMenu />} />
        <Route
          path="/game"
          element={<GameScreen initialScene="scene1" onMenuClick={handleMenuClick} />}
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
