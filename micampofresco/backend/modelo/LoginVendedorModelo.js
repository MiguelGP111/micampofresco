import { ejecutarConsulta } from '../configuracion/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import EnviarVendedorCorreoP from './EnviarVendedorCorreoP.js';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION } from '../middleware/verificarToken.js';

class LoginVendedorModelo {

  // ============================================
  //  LOGIN
  // ============================================
  static async login(email, contrasena) {
    if (!email?.trim() || !contrasena?.trim()) throw new Error('email y contraseña son requeridos');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email no válido');
    if (contrasena.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

    const query = 'SELECT * FROM vendedores WHERE email = $1 AND rol = $2';
    const result = await ejecutarConsulta(query, [email, 'vendedor']);

    if (result.rows.length === 0) throw new Error('Credenciales incorrectas');

    const vendedor = result.rows[0];
    const esValida = await bcrypt.compare(contrasena, vendedor.contrasena);

    if (!esValida) throw new Error(' La contraseña es incorrecta');

    // Quitamos la contraseña antes de enviar al frontend
    const { contrasena: _, ...vendedorSeguro } = vendedor;

    // Generamos token
    const token = jwt.sign(
      {
        id: vendedorSeguro.idvendedor,
        email: vendedorSeguro.email,
        rol: vendedorSeguro.rol
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return {
      mensaje: 'Inicio de sesión exitoso',
      vendedor: vendedorSeguro,
      token
    };
  }

  // ============================================
  // 🔹 OLVIDASTE CONTRASEÑA
  // ============================================
  static async olvidasteContrasena(email, telefono, via = 'email') {
    if (via !== 'email' && via !== 'whatsapp') {
      throw new Error("La vía debe ser 'email' o 'whatsapp'");
    }

    if (via === 'email') {
      if (!email?.trim()) throw new Error('El email es requerido');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email no válido');

      return await this.solicitarRecuperacion(email, via);
    }

    if (via === 'whatsapp') {
      if (!telefono?.trim()) throw new Error('El número de teléfono es requerido');

      return await this.solicitarRecuperacion(email, via, telefono);
    }
  }

  // ============================================
  // 🔹 GENERAR CÓDIGO DE RECUPERACIÓN
  // ============================================
  static async solicitarRecuperacion(email, via, telefono = null) {
    const query = 'SELECT * FROM vendedores WHERE email = $1';
    const result = await ejecutarConsulta(query, [email]);

    if (result.rows.length === 0) throw new Error('El email no está registrado');

    const vendedor = result.rows[0];

    // Generar código
    const codigo = crypto.randomInt(100000, 999999).toString();
    const expiracion = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Guardamos en la tabla
    await ejecutarConsulta(
      'INSERT INTO recuperaciones (idvendedor, token, expira_en) VALUES ($1, $2, $3)',
      [vendedor.idvendedor, codigo, expiracion]
    );

    // Enviar por email
    if (via === 'email') {
      await this.enviarCorreo(email, codigo);
    }

    // Enviar por WhatsApp
    if (via === 'whatsapp') {
      if (!telefono) throw new Error('El número de teléfono no está registrado');
      await this.enviarWhatsApp(telefono, codigo);
    }

    return { mensaje: 'Código de verificación enviado' };
  }

  // ============================================
  // 🔹 CAMBIAR CONTRASEÑA
  // ============================================
  static async cambiarContrasena(email, codigo, nuevaContra) {
    if (!email?.trim() || !codigo?.trim() || !nuevaContra?.trim()) {
      throw new Error('Todos los campos son requeridos');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email no válido');
    if (nuevaContra.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

    // Buscar vendedor
    const userResult = await ejecutarConsulta('SELECT * FROM vendedores WHERE email = $1', [email]);
    if (userResult.rows.length === 0) throw new Error('email no válido');

    const vendedor = userResult.rows[0];

    // Buscar token
    const rec = await ejecutarConsulta(
      'SELECT * FROM recuperaciones WHERE idvendedor = $1 AND token = $2',
      [vendedor.idvendedor, codigo]
    );

    if (rec.rows.length === 0) throw new Error('Código incorrecto');
    if (new Date() > new Date(rec.rows[0].expira_en)) throw new Error('Código expirado');

    // Hash password
    const hash = await bcrypt.hash(nuevaContra, 10);

    // Update password
    await ejecutarConsulta(
      'UPDATE vendedores SET contrasena = $1 WHERE email = $2',
      [hash, email]
    );

    // Eliminar tokens usados
    await ejecutarConsulta('DELETE FROM recuperaciones WHERE idvendedor = $1', [vendedor.idvendedor]);

    return { mensaje: 'Contraseña actualizada correctamente' };
  }

  // ============================================
  // 🔹 ENVIAR EMAIL
  // ============================================
  static async enviarCorreo(email, codigo) {
    const urlVistaPrevia = await EnviarVendedorCorreoP(email, codigo);
    console.log('📧 Email de prueba:', urlVistaPrevia);
  }

  // ============================================
  // 🔹 ENVIAR WHATSAPP
  // ============================================
  static async enviarWhatsApp(telefono, codigo) {
    if (!/^\d{8,10}$/.test(telefono)) throw new Error('Número de teléfono inválido');
    if (!/^\d{6}$/.test(codigo)) throw new Error('Código inválido');

    try {
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
        to: `whatsapp:${telefono}`,
        body: `Tu código de recuperación es: ${codigo}`,
      });

      console.log('📲 Código enviado por WhatsApp');
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error.message);
    }
  }
}

export default LoginVendedorModelo;