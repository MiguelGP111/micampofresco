import LoginAgricultorModelo from '../modelo/LoginAgricultorModelo.js';

class LoginAgricultorControlador {
  // 🔹 Login
  static async login(req, res) {
    try {
      const { correo, llave } = req.body;
      const usuario = await LoginAgricultorModelo.login(correo, llave);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 🔹 Solicitar recuperación de contraseña
  static async solicitarRecuperacion(req, res) {
    try {
      const { correo, via } = req.body;
      const respuesta = await LoginAgricultorModelo.olvidasteContrasena(correo, via);
      res.json(respuesta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 🔹 Cambiar contraseña
  static async cambiarContrasena(req, res) {
    try {
      const { correo, codigo, nuevaLlave } = req.body;
      const respuesta = await LoginAgricultorModelo.cambiarContrasena(correo, codigo, nuevaLlave);
      res.json(respuesta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default LoginAgricultorControlador;
