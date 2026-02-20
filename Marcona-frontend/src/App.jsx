import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'sonner';

// Pantallas y Layouts
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Bandeja from './pages/Bandeja';

// Componente Guardián para proteger rutas privadas
const RutaPrivada = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Privadas (Protegidas por el Guardián y envueltas en el Layout) */}
          <Route path="/" element={<RutaPrivada><DashboardLayout /></RutaPrivada>}>
            <Route index element={<Navigate to="/bandeja" />} />
            <Route path="bandeja" element={<Bandeja />} />
            {/* Aquí luego agregaremos la ruta de "Nuevo Expediente" */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;