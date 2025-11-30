// src/controlador/CrearVendedorControlador.js
import Vendedor from '../modelo/CrearVendedorModelo.js';
import bcrypt from 'bcrypt';
import ValidacionVendedor from '../modelo/ValidacionVendedor.js';

export const CrearVendedorControlador = {

  // GET /vendedores
  async listar(req, res) {
    try {
      const model = new Vendedor();
      const vendedores = await model.mostrarTodos();

      return res.status(200).json({
        mensaje: "Vendedores encontrados correctamente",
        vendedores
      });
    } catch (error) {
      console.error('Error al listar vendedores:', error);
      res.status(500).json({ mensaje: 'Error al obtener los vendedores' });
    }
  },

  // GET /vendedores/:id
  async obtenerVendedorId(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }

    try {
      const model = new Vendedor();
      const vendedorEncontrado = await model.buscarVendedorId(id);

      if (!vendedorEncontrado) {
        return res.status(404).json({ mensaje: 'Vendedor no encontrado' });
      }
      return res.status(200).json({
        mensaje: "Vendedor encontrado correctamente",
        vendedor: vendedorEncontrado
      });

    } catch (error) {
      console.error('Error al obtener vendedor por ID:', error);
      return res.status(500).json({ mensaje: 'Error al obtener el vendedor' });
    }
  },

  // POST /vendedores
  async crear(req, res) {
  const { t1: tipoDoc, t2: documento, t3: edad, t4: nombre_completo, t5: telefono, t6: direccion, t7: email, t8: contrasena, t9: horario } = req.body || {};

  // Validación de campos obligatorios
  if (!tipoDoc || !documento || !edad || !nombre_completo || !telefono || !direccion || !email || !contrasena || !horario) {
    return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados' });
  }

  // Validaciones existentes
  const errorCampos = ValidacionVendedor.verCampos(tipoDoc, documento, edad, nombre_completo, telefono, direccion, email, contrasena, horario);
  if (errorCampos) return res.status(400).json({ error: errorCampos });

  const errorTipoDoc = ValidacionVendedor.verTipoDoc(tipoDoc);
  if (errorTipoDoc) return res.status(400).json({ error: errorTipoDoc });

  const errorDocumento = ValidacionVendedor.verDoc(documento);
  if (errorDocumento) return res.status(400).json({ error: errorDocumento });

  const errorEdad = ValidacionVendedor.verEdad(edad);
  if (errorEdad) return res.status(400).json({ error: errorEdad });

  const errorNombre = ValidacionVendedor.verNom(nombre_completo);
  if (errorNombre) return res.status(400).json({ error: errorNombre });

  const errorTelefono = ValidacionVendedor.verTel(telefono);
  if (errorTelefono) return res.status(400).json({ error: errorTelefono });

  const errorDireccion = ValidacionVendedor.verDir(direccion);
  if (errorDireccion) return res.status(400).json({ error: errorDireccion });

  const errorEmail = ValidacionVendedor.verCor(email);
  if (errorEmail) return res.status(400).json({ error: errorEmail });

  const errorContrasena = ValidacionVendedor.verContr(contrasena);
  if (errorContrasena) return res.status(400).json({ error: errorContrasena });

  const errorHorario = ValidacionVendedor.verHor(horario);
  if (errorHorario) return res.status(400).json({ error: errorHorario });

  try {
    // Validaciones de unicidad
    const existeDocumento = await Vendedor.buscarPorDocumento(documento);
    if (existeDocumento) return res.status(400).json({ mensaje: 'El documento ya está registrado' });

    const existeEmail = await Vendedor.buscarPorEmail(email);
    if (existeEmail) return res.status(400).json({ mensaje: 'El email ya está registrado' });

    const existeTelefono = await Vendedor.buscarPorTelefono(telefono);
    if (existeTelefono) return res.status(400).json({ mensaje: 'El teléfono ya está registrado' });

    // Hash de contraseña
    const hashedContrasena = await bcrypt.hash(contrasena, 10);

    const nuevoVendedor = new Vendedor(
      tipoDoc,
      documento,
      edad,
      nombre_completo,
      telefono,
      direccion,
      email,
      hashedContrasena,
      horario
    );

    const vendedorGuardado = await nuevoVendedor.guardarVendedor();

    res.status(201).json({
      mensaje: 'Vendedor creado correctamente',
      vendedor: vendedorGuardado
    });

  } catch (error) {
    console.error('Error al crear vendedor:', error);
    res.status(500).json({ mensaje: 'Error al crear el vendedor' });
  }
},

  // PUT /vendedores/:id
  async actualizar(req, res) {
    const { id } = req.params;
    const { t1: tipoDoc, t2: documento, t3: edad, t4: nombre_completo, t5: telefono, t6: direccion, t7: email, t8: contrasena, t9: horario } = req.body || {};

    if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

    const datosActualizar = {};
    if (tipoDoc) datosActualizar.tipoDoc = tipoDoc;
    if (documento) datosActualizar.documento = documento;
    if (edad) datosActualizar.edad = edad;
    if (nombre_completo) datosActualizar.nombre_completo = nombre_completo;
    if (telefono) datosActualizar.telefono = telefono;
    if (direccion) datosActualizar.direccion = direccion;
    if (email) datosActualizar.email = email;
    if (contrasena) datosActualizar.contrasena = await bcrypt.hash(contrasena, 10);
    if (horario) datosActualizar.horario = horario;

    if (Object.keys(datosActualizar).length === 0) return res.status(400).json({ mensaje: 'No hay datos para actualizar' });

    try {
      const model = new Vendedor();
      const vendedorExistente = await model.buscarVendedorId(id);

      if (!vendedorExistente) return res.status(404).json({ mensaje: 'Vendedor no encontrado' });

      const vendedorActualizado = await model.editarVendedor(id, datosActualizar);
      res.status(200).json({
        mensaje: 'Vendedor actualizado correctamente',
        vendedor: vendedorActualizado
      });

    } catch (error) {
      console.error('Error al actualizar vendedor:', error);
      res.status(500).json({ mensaje: 'Error al actualizar el vendedor' });
    }
  },

  // DELETE /vendedores/:id
  async eliminar(req, res) {
    const { id } = req.params;
    if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

    try {
      const model = new Vendedor();
      const vendedorEliminado = await model.eliminarVendedor(id);

      if (!vendedorEliminado) return res.status(404).json({ mensaje: 'Vendedor no encontrado' });

      res.status(200).json({
        mensaje: 'Vendedor eliminado correctamente',
        vendedor: vendedorEliminado
      });

    } catch (error) {
      console.error('Error al eliminar vendedor:', error);
      res.status(500).json({ mensaje: 'Error al eliminar el vendedor' });
    }
  }
};

export default CrearVendedorControlador;
