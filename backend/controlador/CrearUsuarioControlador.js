import CrearUsuarioModelo from '../modelo/CrearUsuarioModelo.js';
import bcrypt from 'bcrypt';
import ValidacionUsuario from '../modelo/ValidacionUsuario.js';

export const CrearUsuarioControlador = {

  async listar(req, res) {
    try {
      const model = new CrearUsuarioModelo();
      const usuarios = await model.mostrarTodos();

      return res.status(200).json({
        mensaje: "Usuarios encontrados correctamente",
        usuarios
      });

    } catch (error) {
      console.error('Error al listar usuarios:', error);
      res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
  },

  async obtenerUsuarioId(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }

    try {
      const model = new CrearUsuarioModelo();
      const usuarioEncontrado = await model.buscarUsuarioId(id);

      if (!usuarioEncontrado) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      return res.status(200).json({
        mensaje: "Usuario encontrado correctamente",
        usuario: usuarioEncontrado
      });

    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }
  },

  async crear(req, res) {
    const { t1: tipoDoc, t2: documento, t3: edad, t4: nombre_completo,
            t5: telefono, t6: direccion, t7: email, t8: contrasena } = req.body || {};

    if (!tipoDoc || !documento || !edad || !nombre_completo || !telefono || !direccion || !email || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados' });
    }

    const { t1, t2, t3, t4, t5, t6, t7, t8 } = req.body;
    const errorCampos = ValidacionUsuario.verCampos(t1, t2, t3, t4, t5, t6, t7, t8);
    if (errorCampos) return res.status(400).json({ error: errorCampos });

    const errorTipoDoc = ValidacionUsuario.verTipoDoc(tipoDoc);
    if (errorTipoDoc) return res.status(400).json({ error: errorTipoDoc });

    const errorDocumento = ValidacionUsuario.verDoc(documento);
    if (errorDocumento) return res.status(400).json({ error: errorDocumento });

    const errorEdad = ValidacionUsuario.verEdad(edad);
    if (errorEdad) return res.status(400).json({ error: errorEdad });

    const errorNombre = ValidacionUsuario.verNom(nombre_completo);
    if (errorNombre) return res.status(400).json({ error: errorNombre });

    const errorTelefono = ValidacionUsuario.verTel(telefono);
    if (errorTelefono) return res.status(400).json({ error: errorTelefono });

    const errorDireccion = ValidacionUsuario.verDir(direccion);
    if (errorDireccion) return res.status(400).json({ error: errorDireccion });

    const errorEmail = ValidacionUsuario.verCor(email);
    if (errorEmail) return res.status(400).json({ error: errorEmail });

    const errorContrasena = ValidacionUsuario.verContr(contrasena);
    if (errorContrasena) return res.status(400).json({ error: errorContrasena });

    try {
      const hashedContrasena = await bcrypt.hash(contrasena, 10);

      const nuevoUsuario = new CrearUsuarioModelo(
        tipoDoc,
        documento,
        edad,
        nombre_completo,
        telefono,
        direccion,
        email,
        hashedContrasena
      );

      const usuarioGuardado = await nuevoUsuario.guardarUsuario();

      res.status(201).json({
        mensaje: 'Usuario creado correctamente',
        usuario: usuarioGuardado
      });

    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
  },

  async actualizar(req, res) {
    const { id } = req.params;
    const { t1: tipoDoc, t2: documento, t3: edad, t4: nombre_completo,
            t5: telefono, t6: direccion, t7: email, t8: contrasena } = req.body || {};

    if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

    const datosActualizar = {};
    if (tipoDoc) datosActualizar.tipo_doc = tipoDoc;
    if (documento) datosActualizar.documento = documento;
    if (edad) datosActualizar.edad = edad;
    if (nombre_completo) datosActualizar.nombre_completo = nombre_completo;
    if (telefono) datosActualizar.telefono = telefono;
    if (direccion) datosActualizar.direccion = direccion;
    if (email) datosActualizar.email = email;
    if (contrasena) datosActualizar.contrasena = await bcrypt.hash(contrasena, 10);

    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({ mensaje: 'No hay datos para actualizar' });
    }

    try {
      const model = new CrearUsuarioModelo();
      const usuarioExistente = await model.buscarUsuarioId(id);

      if (!usuarioExistente) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      const usuarioActualizado = await model.editarUsuario(id, datosActualizar);

      res.status(200).json({
        mensaje: 'Usuario actualizado correctamente',
        usuario: usuarioActualizado
      });

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
    }
  },

  async eliminar(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

    try {
      const model = new CrearUsuarioModelo();
      const usuarioEliminado = await model.eliminarUsuario(id);

      if (!usuarioEliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      res.status(200).json({
        mensaje: 'Usuario eliminado correctamente',
        usuario: usuarioEliminado
      });

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
  }
};

export default CrearUsuarioControlador;

