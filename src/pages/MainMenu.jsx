import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/MainMenu.css';

export default function MainMenu() {
  return (
    <motion.div
      className="main-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="menu-title">Visual Novel</h1>

      <Link to="/game" className="btn-start">
        Comenzar
      </Link>

      <button className="btn-load" disabled>
        Cargar
      </button>

      <button className="btn-options">
        Opciones
      </button>

      <button className="btn-load">
        Salir
      </button>
    </motion.div>
  );
}
