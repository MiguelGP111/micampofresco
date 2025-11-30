import PerfilVendedorModelo from '../modelo/PerfilVendedorModelo.js';

const VendorPerfilControlador = {

  async verPerfil(req, res) {
    try {
      const { id } = req.user || {};

      // Validación si no hay idvendedor
      if (!id) {
        console.log("❌ No se recibió el id del vendedor");
        return res.status(400).json({
          mensaje: "No se recibió el ID del vendedor. Debe iniciar sesión."
        });
      }

      const perfil = await PerfilVendedorModelo.obtenerPerfil(id);
      console.log("✔ Perfil obtenido:", perfil);
      res.json({
        mensaje: "Perfil obtenido correctamente",
        data: perfil
      });

    } catch (error) {
      console.error("❌ Error al obtener el perfil:", error);
      res.status(500).json({
        mensaje: "Error al obtener el Perfil",
        error: error.message
      });
    }
  },

  async actualizarPerfil(req, res) {
    try {
      const { id } = req.user || {};

      // Validación si no hay idvendedor
      if (!id) {
        console.log("❌ No se recibió el id del vendedor para  actualizar");
        return res.status(400).json({
          mensaje: "No se recibió el ID del vendedor. Debe iniciar sesión."
        });
      }

      const datos = req.body;
      const actualizado = await PerfilVendedorModelo.actualizarPerfil(id, datos);
      console.log("✔ Perfil actualizado:", actualizado);
      res.json({
        mensaje: "Perfil actualizado correctamente",
        perfil: actualizado
      });

    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      res.status(500).json({
        mensaje: "Error al actualizar el perfil",
        error: error.message
      });
    }
  }

};

export default VendorPerfilControlador;
