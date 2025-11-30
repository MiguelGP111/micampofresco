import db from './db/Conexion.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import EnviarVendedorCorreoP from './EnviarVendedorCorreoP.js'; // Importación corregida
import twilio from 'twilio';
import jwt from 'jsonwebtoken';               // ✅ Importar jsonwebtoken
import { secret, expiresIn } from '../configuracion/ConfigJWT.js'; // ✅ Importar configuración

class LoginVendedorModelo {
  // 🔹 VALIDAR LOGIN
  static async login(email, contrasena) {
    if (!email?.trim() || !contrasena?.trim()) throw new Error('email y contraseña son requeridos');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email no válido');
    if (contrasena.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

    const query = 'SELECT * FROM vendedores WHERE email = $1 AND rol = $2';
    const result = await db.query(query, [email, 'vendedor']);

    if (result.rows.length === 0) throw new Error('Credenciales incorrectas');

    const vendedor = result.rows[0];
    const esValida = await bcrypt.compare(contrasena, vendedor.contrasena);
    if (!esValida) throw new Error('⚠️ La contraseña es incorrecta');

    // Eliminamos la contraseña antes de retornar
    const { contrasena: _, ...vendedorSeguro } = vendedor;

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: vendedorSeguro.idvendedor, email: vendedorSeguro.email, rol: vendedorSeguro.rol },
      secret,
      { expiresIn }
    );

    // Retornamos un objeto con mensaje, datos y token
    return {
      mensaje: 'Inicio de sesión exitoso',
      vendedor: vendedorSeguro,
      token // ✅ Token incluido
    }
  }

  // 🔹 OLVIDASTE CONTRASEÑA
  static async olvidasteContrasena(email, telefono, via = 'email') {
    if (via !== 'email' && via !== 'whatsapp') {
      throw new Error("La vía debe ser 'email' o 'whatsapp'");
    }
    if (via === 'email') {
      if (!email?.trim()) throw new Error('El email es requerido');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email no válido');
      return await this.solicitarRecuperacion(email, 'contrasena-fake', 'email');
    }
    if (via === 'whatsapp') {
      if (!telefono?.trim()) throw new Error('El número de teléfono es requerido');
      return await this.solicitarRecuperacion(email, 'contrasena-fake', 'whatsapp');
    }
  }

  // 🔹 SOLICITAR RECUPERACIÓN
  static async solicitarRecuperacion(email, contrasena, via = 'email') {
    if (!contrasena?.trim()) {
      throw new Error('Debe ingresar una nueva contraseña para poder actualizarla');
    }
    const query = 'SELECT * FROM vendedores WHERE email = $1';
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) throw new Error('El email no está registrado');
    const vendedor = result.rows[0];
    const codigo = crypto.randomInt(100000, 999999).toString();
    const expiracion = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    await db.query(
      'INSERT INTO recuperaciones (idvendedor, token, expira_en) VALUES ($1, $2, $3)',
      [vendedor.idvendedor, codigo, expiracion]
    );
    if (via === 'email') {
      if (!email) throw new Error('El email es requerido para esta vía');
      await this.enviarCorreo(email, codigo);
    } else if (via === 'whatsapp') {
      if (!vendedor.telefono) throw new Error('El número de teléfono no está registrado');
      await this.enviarWhatsApp(vendedor.telefono, codigo);
    } else {
      throw new Error("La vía debe ser 'email' o 'whatsapp'");
    }
    return { mensaje: 'Código de verificación enviado' };
  }

  // 🔹 CAMBIAR CONTRASEÑA
  static async cambiarContrasena(email, codigo, nuevaContra) {
    if (!email?.trim() || !codigo?.trim() || !nuevaContra?.trim()) {
      throw new Error('Todos los campos son requeridos');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email no válido');
    if (nuevaContra.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');
    const query = 'SELECT * FROM vendedores WHERE email = $1';
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) throw new Error('email no válido');
    const usuario = result.rows[0];
    const rec = await db.query(
      'SELECT * FROM recuperaciones WHERE idvendedor = $1 AND token = $2',
      [usuario.idvendedor, codigo]
    );
    if (rec.rows.length === 0) throw new Error('Código incorrecto');
    if (new Date() > new Date(rec.rows[0].expira_en)) throw new Error('Código expirado');
    const hash = await bcrypt.hash(nuevaContra, 10);
    await db.query('UPDATE vendedores SET contrasena = $1 WHERE email = $2', [hash, email]);
    await db.query('DELETE FROM recuperaciones WHERE idvendedor = $1', [usuario.idvendedor]);
    return { mensaje: 'Contraseña actualizada correctamente' };
  }

  // 🔹 FUNCIONES AUXILIARES
  static async enviarCorreo(email, codigo) {
    const urlVistaPrevia = await EnviarVendedorCorreoP(email, codigo);
    console.log('Ver email de prueba en navegador:', urlVistaPrevia);
  }

  static async enviarWhatsApp(telefono, codigo) {
    const regextelefono = /^\d{8,10}$/;
    if (!regextelefono.test(telefono)) throw new Error('Número de teléfono inválido');
    const regexCodigo = /^\d{4,8}$/;
    if (!regexCodigo.test(codigo)) throw new Error('Código de recuperación inválido');
    try {
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
        to: `whatsapp:${telefono}`,
        body: `Tu código de recuperación es: ${codigo}`,
      });
      console.log('Código enviado por WhatsApp correctamente.');
    } catch (error) {
      console.error('Error al enviar código por WhatsApp:', error.message);
    }
  }
}

export default LoginVendedorModelo;
