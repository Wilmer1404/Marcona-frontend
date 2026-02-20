import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext'; // <--- Importación clave
import api from '../api/axios';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return (token && storedUser) ? JSON.parse(storedUser) : null;
  });

  const login = async (correo, password) => {
    const response = await api.post('/auth/login', { correo, password });
    if (response.data.exito) {
      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      setUser(usuario);
      return { success: true };
    }
    return { success: false, mensaje: response.data.mensaje };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const authValue = useMemo(() => ({
    user, login, logout
  }), [user]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};