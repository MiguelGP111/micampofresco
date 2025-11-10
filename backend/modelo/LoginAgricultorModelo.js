import db from './db/Conexion.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import enviarCorreoP from './enviarCorreoP.js'; // Importación corregida
import twilio from 'twilio';
import jwt from 'jsonwebtoken';               // ✅ Importar jsonwebtoken
import { secret, expiresIn } from '../configuracion/ConfigJWT.js'; // ✅ Importar configuración

class LoginAgricultorModelo {
  // 🔹 VALIDAR LOGIN
  static async login(correo, llave) {
    if (!correo?.trim() || !llave?.trim()) throw new Error('Correo y contraseña son requeridos');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('Correo no válido');
    if (llave.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

    const query = 'SELECT * FROM agricultores WHERE correo = $1 AND rol = $2';
    const result = await db.query(query, [correo, 'agricultor']);

    if (result.rows.length === 0) throw new Error('Credenciales incorrectas');

    const agricultor = result.rows[0];
    const esValida = await bcrypt.compare(llave, agricultor.llave);
    if (!esValida) throw new Error('⚠️ La contraseña es incorrecta');

    // Eliminamos la contraseña antes de retornar
    const { llave: _, ...agricultorSeguro } = agricultor;

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: agricultorSeguro.idagricultor, correo: agricultorSeguro.correo, rol: agricultorSeguro.rol },
      secret,
      { expiresIn }
    );

    // Retornamos un objeto con mensaje, datos y token
    return {
      mensaje: 'Inicio de sesión exitoso',
      agricultor: agricultorSeguro,
      token // ✅ Token incluido
    }
  }

  // 🔹 OLVIDASTE CONTRASEÑA
  static async olvidasteContrasena(correo, telefono, via = 'correo') {
    if (via !== 'correo' && via !== 'whatsapp') {
      throw new Error("La vía debe ser 'correo' o 'whatsapp'");
    }
    if (via === 'correo') {
      if (!correo?.trim()) throw new Error('El correo es requerido');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('Correo no válido');
      return await this.solicitarRecuperacion(correo, 'llave-fake', 'correo');
    }
    if (via === 'whatsapp') {
      if (!telefono?.trim()) throw new Error('El número de teléfono es requerido');
      return await this.solicitarRecuperacion(correo, 'llave-fake', 'whatsapp');
    }
  }

  // 🔹 SOLICITAR RECUPERACIÓN
  static async solicitarRecuperacion(correo, llave, via = 'correo') {
    if (!llave?.trim()) {
      throw new Error('Debe ingresar una nueva contraseña para poder actualizarla');
    }
    const query = 'SELECT * FROM agricultores WHERE correo = $1';
    const result = await db.query(query, [correo]);
    if (result.rows.length === 0) throw new Error('El correo no está registrado');
    const agricultor = result.rows[0];
    const codigo = crypto.randomInt(100000, 999999).toString();
    const expiracion = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    await db.query(
      'INSERT INTO recuperaciones (idagricultor, token, expira_en) VALUES ($1, $2, $3)',
      [agricultor.idagricultor, codigo, expiracion]
    );
    if (via === 'correo') {
      if (!correo) throw new Error('El correo es requerido para esta vía');
      await this.enviarCorreo(correo, codigo);
    } else if (via === 'whatsapp') {
      if (!agricultor.telefono) throw new Error('El número de teléfono no está registrado');
      await this.enviarWhatsApp(agricultor.telefono, codigo);
    } else {
      throw new Error("La vía debe ser 'correo' o 'whatsapp'");
    }
    return { mensaje: 'Código de verificación enviado' };
  }

  // 🔹 CAMBIAR CONTRASEÑA
  static async cambiarContrasena(correo, codigo, nuevaLlave) {
    if (!correo?.trim() || !codigo?.trim() || !nuevaLlave?.trim()) {
      throw new Error('Todos los campos son requeridos');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('Correo no válido');
    if (nuevaLlave.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');
    const query = 'SELECT * FROM agricultores WHERE correo = $1';
    const result = await db.query(query, [correo]);
    if (result.rows.length === 0) throw new Error('Correo no válido');
    const usuario = result.rows[0];
    const rec = await db.query(
      'SELECT * FROM recuperaciones WHERE idagricultor = $1 AND token = $2',
      [usuario.idagricultor, codigo]
    );
    if (rec.rows.length === 0) throw new Error('Código incorrecto');
    if (new Date() > new Date(rec.rows[0].expira_en)) throw new Error('Código expirado');
    const hash = await bcrypt.hash(nuevaLlave, 10);
    await db.query('UPDATE agricultores SET llave = $1 WHERE correo = $2', [hash, correo]);
    await db.query('DELETE FROM recuperaciones WHERE idagricultor = $1', [usuario.idagricultor]);
    return { mensaje: 'Contraseña actualizada correctamente' };
  }

  // 🔹 FUNCIONES AUXILIARES
  static async enviarCorreo(correo, codigo) {
    const urlVistaPrevia = await enviarCorreoP(correo, codigo);
    console.log('Ver correo de prueba en navegador:', urlVistaPrevia);
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

export default LoginAgricultorModelo;
