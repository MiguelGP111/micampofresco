import LoginVendedorModelo from '../modelo/LoginVendedorModelo.js';

class LoginVendedorControlador {
  //  Login
  static async login(req, res) {
    try {
      const { email, contrasena } = req.body;
      const vendedor = await LoginVendedorModelo.login(email, contrasena);
      res.json(vendedor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  //  Solicitar recuperación de contraseña
  static async solicitarRecuperacion(req, res) {
    try {
      const { email, via } = req.body;
      const respuesta = await LoginVendedorModelo.olvidasteContrasena(email, via);
      res.json(respuesta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  //  Cambiar contraseña
  static async cambiarContrasena(req, res) {
    try {
      const { email, codigo, nuevaContra } = req.body;
      const respuesta = await LoginVendedorModelo.cambiarContrasena(email, codigo, nuevaContra);
      res.json(respuesta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default LoginVendedorControlador;
