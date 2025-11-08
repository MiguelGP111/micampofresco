import { ejecutarConsulta } from '../configuracion/db.js';
import bcrypt from 'bcrypt';

/**
 * Modelo para administradores del sistema MiCampoFresco
 * Atributos: id, nombre, email, password_hash, rol
 */
class Admin {
    constructor(datos) {
        this.id = datos.id || null;
        this.nombre = datos.nombre || '';
        this.email = datos.email || '';
        this.password = datos.password|| null;
        this.rol = datos.rol || 'admin';
        this.created_at = datos.created_at || null;
        this.updated_at = datos.updated_at || null;
    }

    /**
     * Obtener administrador por email
     * @param {string} email - Email del administrador
     * @returns {Admin|null} - Instancia de Admin o null si no existe
     */
    static async obtenerPorEmail(email) {
        try {
            const consulta = `
                SELECT id, nombre, email, password, rol, created_at, updated_at 
                FROM usuarios
                WHERE email = ?
            `;
            const resultados = await ejecutarConsulta(consulta, [email]);
            
            if (resultados.length === 0) {
                return null;
            }
            
            return new Admin(resultados[0]);
        } catch (error) {
            throw new Error(`Error al obtener administrador por email: ${error.message}`);
        }
    }

    /**
     * Obtener administrador por ID
     * @param {number} id - ID del administrador
     * @returns {Admin|null} - Instancia de Admin o null si no existe
     */
    static async obtenerPorId(id) {
        try {
            const consulta = `
                SELECT id, nombre, email, password, rol, created_at, updated_at 
                FROM usuarios 
                WHERE id = ?
            `;
            const resultados = await ejecutarConsulta(consulta, [id]);
            
            if (resultados.length === 0) {
                return null;
            }
            
            return new Admin(resultados[0]);
        } catch (error) {
            throw new Error(`Error al obtener administrador por ID: ${error.message}`);
        }
    }

    /**
     * Verificar contraseña contra el hash almacenado
     * @param {string} password - Contraseña en texto plano
     * @returns {boolean} - True si la contraseña es correcta
     */
    async verificarPassword(password) {
        try {
            if (!this.password) {
                return false;
            }
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error(`Error al verificar contraseña: ${error.message}`);
        }
    }

    /**
     * Generar hash de contraseña
     * @param {string} password - Contraseña en texto plano
     * @returns {string} - Hash de la contraseña
     */
    static async generarHashPassword(password) {
        try {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            throw new Error(`Error al generar hash de contraseña: ${error.message}`);
        }
    }

    /**
     * Validar datos del administrador
     * @returns {Array<string>} - Array de errores de validación
     */
    validar() {
        const errores = [];

        if (!this.nombre || this.nombre.trim().length === 0) {
            errores.push('El nombre es requerido');
        }

        if (!this.email || this.email.trim().length === 0) {
            errores.push('El email es requerido');
        } else if (!this.validarEmail(this.email)) {
            errores.push('El formato del email no es válido');
        }

        return errores;
    }

    /**
     * Validar formato de email
     * @param {string} email - Email a validar
     * @returns {boolean} - True si el formato es válido
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Convertir a objeto JSON (sin exponer password_hash)
     * @returns {Object} - Objeto con los datos del administrador
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            rol: this.rol,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default Admin;

