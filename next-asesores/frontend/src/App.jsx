import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacto from './pages/Contacto';
import Calendario from './pages/Calendario';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/contacto" replace />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="*" element={<Navigate to="/contacto" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
