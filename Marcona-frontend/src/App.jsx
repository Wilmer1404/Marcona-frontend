import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { Toaster } from 'sonner';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Aquí agregaremos la ruta de la bandeja pronto */}
          <Route path="/bandeja" element={<div className="p-10 text-2xl">Bandeja de Entrada (Próximamente)</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;