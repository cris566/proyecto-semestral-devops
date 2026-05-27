import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  // CORRECCIÓN: Estructura Async/Await limpia con manejo de errores
  const obtenerDespachos = async () => {
    try {
      const response = await axios.get(`http://10.0.2.24:8081/api/v1/despachos`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log(response.data);
      setDespachos(response.data);
    } catch (error) {
      console.error("Error al obtener los despachos:", error);
    }
  };

  useEffect(() => {
    obtenerDespachos();
  }, []);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow h-full overflow-hidden">
            <table className="table-fixed w-full">
              <thead>
                <tr className="py-10 border-b border-gray-100">
                  <th className="pr-10 py-4">Orden de despacho</th>
                  <th className="pr-10 py-4">Orden de compra</th>
                  <th className="pr-10 py-4">Dirección de entrega</th>
                  <th className="pr-10 py-4">Fecha despacho</th>
                  <th className="pr-10 py-4">Patente Camión</th>
                  <th className="pr-10 py-4">Estado</th>
                  <th className="pr-10 py-4">Intentos</th>
                  <th className="py-4">Acción</th> {/* CORRECCIÓN: Añadida la 8va columna en el header */}
                </tr>
              </thead>
              <tbody>
                {despachos.map((despacho) => (
                  <tr key={despacho.idDespacho} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                    <td className="pr-10 py-6 text-center">{despacho.idDespacho}</td>
                    <td className="pr-10 py-6 text-center">{despacho.idCompra}</td>
                    <td className="pr-10 py-6 text-center">{despacho.direccionCompra}</td>
                    <td className="pr-10 py-6 text-center">{despacho.fechaDespacho}</td>
                    <td className="pr-10 py-6 text-center">{despacho.patenteCamion}</td>
                    <td className="pr-10 py-6 text-center font-medium">
                      {despacho.despachado ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">Entregado</span>
                      ) : (
                        <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Pendiente</span>
                      )}
                    </td>
                    <td className="pr-10 py-6 text-center">{despacho.intento}</td>
                    <td className="py-6 text-center">
                      <button
                        onClick={() => handleAbrirModal(despacho)}
                        disabled={despacho.despachado} // Deshabilita el botón si ya está cerrado
                        className={`py-2 px-6 rounded-xl shadow-md transition-all duration-300 font-medium text-sm ${
                          despacho.despachado
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                            : "bg-orange-200 text-orange-900 hover:bg-orange-300"
                        }`}
                      >
                        {despacho.despachado ? "Cerrado" : "Cerrar despacho"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        onClose={() => setOpenModal(false)}
        open={openModal}
      >
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              // CORRECCIÓN: Separación estricta de las funciones
              setOpenModal(false);
              setDespachoSeleccionado(null);
              obtenerDespachos();
            }}
          />
        )}
      </Modal>
    </>
  );
};