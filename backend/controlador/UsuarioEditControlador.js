import UsuarioModelo from '../modelo/UsuarioEditModelo.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class UsuarioControlador {

  // editar usuario
  static async actualizarCuenta(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ mensaje: 'No autorizado' });

      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const usuarioId = payload.id;

      const { email, contrasena, celular } = req.body;
      const datosActualizar = {};

      if (email) datosActualizar.email = email;
      if (celular) datosActualizar.celular = celular;
      if (contrasena) datosActualizar.contrasena = await bcrypt.hash(contrasena, 10);

      const actualizado = await UsuarioModelo.actualizarUsuario(usuarioId, datosActualizar);
      if (!actualizado) return res.status(400).json({ mensaje: 'No hay datos para actualizar' });

      res.json({ mensaje: 'Perfil actualizado correctamente', usuario: actualizado });

    } catch (e) {
      if (e.name === 'JsonWebTokenError') return res.status(401).json({ mensaje: 'Token inválido' });
      if (e.name === 'TokenExpiredError') return res.status(401).json({ mensaje: 'Token expirado' });
      res.status(500).json({ error: e.message });
    }
  }

  // 🔹 Eliminar usuario
  static async eliminarCuenta(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ mensaje: 'No autorizado' });

      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const usuarioId = payload.id;

      const eliminado = await UsuarioModelo.eliminarUsuario(usuarioId);
      if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      res.json({ mensaje: 'Cuenta eliminada correctamente', usuario: eliminado });

    } catch (e) {
      if (e.name === 'JsonWebTokenError') return res.status(401).json({ mensaje: 'Token inválido' });
      if (e.name === 'TokenExpiredError') return res.status(401).json({ mensaje: 'Token expirado' });
      res.status(500).json({ error: e.message });
    }
  }

}

export default UsuarioControlador;