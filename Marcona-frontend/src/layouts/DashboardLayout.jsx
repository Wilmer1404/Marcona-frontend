import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Inbox, FileText } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-64 bg-marcona-700 text-white flex flex-col">
        <div className="p-6 text-center border-b border-marcona-600">
          <h2 className="text-2xl font-bold">SGD Marcona</h2>
          <p className="text-sm text-marcona-100 mt-2">Área: {user?.departamento_id || 'Sin Asignar'}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center space-x-3 bg-marcona-600 p-3 rounded-lg text-white hover:bg-marcona-500 transition">
            <Inbox className="w-5 h-5" />
            <span>Bandeja de Entrada</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-marcona-100 hover:bg-marcona-600 transition">
            <FileText className="w-5 h-5" />
            <span>Nuevo Expediente</span>
          </button>
        </nav>

        <div className="p-4 border-t border-marcona-600">
          <p className="text-sm mb-4">Hola, <br/><b>{user?.nombres}</b></p>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 p-2 rounded-lg text-white hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal (Aquí se inyectan las demás pantallas) */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;