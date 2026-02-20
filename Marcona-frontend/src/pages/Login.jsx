import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(correo, password);
      if (result.success) {
        toast.success('¡Bienvenido al sistema!');
        navigate('/bandeja');
      } else {
        toast.error(result.mensaje || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error durante el login:', error); // 1. Usamos la variable error
      toast.error('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-marcona-500">SGD Marcona</h2>
          <p className="text-gray-500 mt-2">Sistema de Gestión Documental</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* 2. Vinculamos label con el input mediante htmlFor e id */}
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700">
              Correo Institucional
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-input"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-marcona-500 focus:border-marcona-500"
                placeholder="usuario@marcona.gob.pe"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password-input"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-marcona-500 focus:border-marcona-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-marcona-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marcona-500 transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" /> Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;