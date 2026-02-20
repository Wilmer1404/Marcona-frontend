import { useEffect, useState } from 'react';
import api from '../api/axios';
import { FileSearch } from 'lucide-react';
import { toast } from 'sonner';

const Bandeja = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarBandeja = async () => {
      try {
        const response = await api.get('/expedientes/bandeja');
        if (response.data.exito) {
          setExpedientes(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar expedientes", error);
        toast.error("No se pudo cargar la bandeja");
      } finally {
        setCargando(false);
      }
    };

    cargarBandeja();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bandeja de Entrada</h1>
      </div>

      {cargando ? (
        <div className="text-center py-10 text-gray-500">Cargando documentos...</div>
      ) : expedientes.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center">
          <FileSearch className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No hay expedientes pendientes en tu área.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Código</th>
                <th className="p-4 font-semibold">Asunto</th>
                <th className="p-4 font-semibold">Origen</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((exp) => (
                <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-marcona-600">{exp.codigo_expediente}</td>
                  <td className="p-4 text-gray-800">{exp.asunto}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {exp.departamento_origen}<br/>
                    <span className="text-xs text-gray-400">{exp.creador}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(exp.fecha_creacion).toLocaleDateString('es-PE')}
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-sm bg-blue-50 text-marcona-600 px-3 py-1 rounded hover:bg-blue-100 transition">
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bandeja;