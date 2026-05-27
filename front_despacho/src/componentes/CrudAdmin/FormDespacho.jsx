import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log("onSubmit ejecutado");
    
    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      entregado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
    };

    const jsonDataSales = {
      despachoGenerado: true,
    };

    try {
      // 1. Intentamos actualizar el estado de la venta
      await axios.put(
        `${import.meta.env.VITE_API_VENTAS}/api/v1/ventas/${venta.idVenta}`,
        jsonDataSales,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // 2. Solo si el PUT fue exitoso, procedemos a crear el despacho
      await axios.post(
        `${import.meta.env.VITE_API_DESPACHOS}/api/v1/despachos`, 
        jsonData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // 3. Alerta de éxito controlada
      Swal.fire({
        title: "Despacho registrado 🛻!",
        text: "El despacho ha sido generado con éxito en la base de datos",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        onClose(); // Se cierra de manera segura solo al dar clic en Aceptar
      });

    } catch (error) {
      console.error("Error en la transacción de despacho:", error);
      
      // Alerta de error clara para el usuario
      Swal.fire({
        title: "Error en el proceso",
        text: "Hubo un problema al comunicar los servicios. Los cambios no se guardaron.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center text-center px-24 text-xl"
      >
        <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">
          Ingreso de orden de despacho
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Fecha de despacho</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg block w-full p-1"
            {...register("fechaDespacho", { required: true })}
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Patente de camión</label>
          <input
            type="text"
            placeholder="Elige patente de camión"
            className="border border-gray-300 rounded-lg block w-full p-1"
            {...register("patenteCamion", { required: true })}
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">
            Orden de compra asociado
          </label>
          <input
            type="number"
            disabled={true}
            value={venta.idVenta}
            className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1 bg-gray-100"
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Dirección de entrega</label>
          <input
            type="text"
            disabled={true}
            value={venta.direccionCompra}
            className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1 bg-gray-100"
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Valor de compra</label>
          <input
            type="number"
            value={venta.valorCompra}
            className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1 bg-gray-100"
            disabled={true}
          />
        </div>

        <button
          className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14 hover:bg-teal-700 transition-colors"
          type="submit"
        >
          Asignar despacho
        </button>
      </form>
    </>
  );
};