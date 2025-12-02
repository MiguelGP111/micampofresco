import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsuarioModelo from '../modelo/usuarioLoginModelo.js';
import dotenv from 'dotenv';
dotenv.config();

class LoginControlador {

  // LOGIN NORMAL
  static async login(req, res) {
    try {
      const { email, contrasena } = req.body;

      const usuario = await UsuarioModelo.buscarPorEmail(email);
      if (!usuario) return res.status(400).json({ mensaje: 'Usuario no existe' });

      const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!coincide) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({ mensaje: 'Login exitoso', token });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // envio de correo
  static async enviarRecuperacion(req, res) {
    try {
      const { email } = req.body;

      const usuario = await UsuarioModelo.buscarPorEmail(email);
      if (!usuario) return res.status(400).json({ mensaje: 'Usuario no existe' });

      // GENERA EL TOKEN REAL (como antes)
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_RECUPERACION,
        { expiresIn: '15m' }
      );

      // Simulación del link (no envía correo)
      const link = `http://localhost:3000/api/reset/${token}`;

      res.json({
        mensaje: 'Simulación de recuperación exitosa.',
        instrucciones: 'Usa este link en Postman para resetear la contraseña:',
        link,
        token
      });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // RESETEAR CONTRASEÑA CON TOKEN
  static async resetearContrasena(req, res) {
  try {
      const { token } = req.params;
      const { nueva } = req.body;

      console.log('TOKEN RECIBIDO:', token);
      console.log('SECRET QUE USA:', process.env.JWT_RECUPERACION);

      const verificado = jwt.verify(token, process.env.JWT_RECUPERACION);

      console.log('VERIFICADO OK:', verificado);

      const hash = await bcrypt.hash(nueva, 10);

      await UsuarioModelo.actualizarContrasena(verificado.id, hash);

      res.json({ mensaje: 'Contraseña actualizada' });

  } catch (e) {
      console.log('ERROR AL VERIFICAR TOKEN:', e);
      res.status(400).json({ error: 'Token inválido o expirado' });
  }
}

}

export default LoginControlador;
