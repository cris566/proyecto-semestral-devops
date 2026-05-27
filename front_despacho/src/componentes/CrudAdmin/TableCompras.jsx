import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import axios from "axios";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // CORRECCIÓN: Limpieza de Async/Await + Manejo de errores básico
  const compras = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_VENTAS}/api/v1/ventas`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log(response.data);
      setVentas(response.data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  };

  // Llamada a la función cuando el componente se monta
  useEffect(() => {
    compras();
  }, []);

  const handleAbrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow h-full overflow-hidden">
            <table className="table-fixed w-full"> {/* Añadido w-full para mejor layout */}
              <thead>
                <tr className="py-10 border-b border-gray-100">
                  <th className="pr-10 py-4">Orden de compra</th>
                  <th className="pr-10 py-4">Dirección</th>
                  <th className="pr-10 py-4">Fecha de compra</th>
                  <th className="pr-10 py-4">Valor total</th>
                  <th className="pr-10 py-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {ventas
                  .filter((venta) => !venta.despachoGenerado)
                  .map((venta) => (
                    <tr key={venta.idVenta} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                      <td className="pr-10 py-6 text-center">{venta.idVenta}</td>
                      <td className="pr-10 py-6 text-center">{venta.direccionCompra}</td>
                      <td className="pr-10 py-6 text-center">{venta.fechaCompra}</td>
                      <td className="pr-10 py-6 text-center">${venta.valorCompra}</td>
                      <td className="py-6 text-center">
                        <button
                          onClick={() => handleAbrirModal(venta)}
                          className="py-2 bg-orange-200 px-6 rounded-xl shadow-md hover:bg-orange-300 transition-all duration-300 font-medium text-sm text-orange-900"
                        >
                          Generar Despacho
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
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => {
              // CORRECCIÓN: Separación de ejecuciones limpia con punto y coma
              setOpenModal(false);
              compras(); 
            }}
          />
        )}
      </Modal>
    </>
  );
};