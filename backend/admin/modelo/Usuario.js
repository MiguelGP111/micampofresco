import { ejecutarConsulta } from '../configuracion/db.js';
import bcrypt from 'bcrypt';

class Usuario {
    constructor(datos) {
        this.id = datos.id || null;
        this.nombre = datos.nombre || '';
        this.email = datos.email || '';
        this.password = datos.password || null; // Password hash (nunca texto plano)
        this.rol = datos.rol || 'usuario';
        this.estado = datos.estado || 'activo';
        this.created_at = datos.created_at || null;
        this.updated_at = datos.updated_at || null;
    }

    // Obtener todos los usuarios
    static async obtenerTodos() {
        try {
            const consulta = `
                SELECT id, nombre, email, rol, estado, created_at, updated_at 
                FROM usuarios 
                ORDER BY created_at DESC
            `;
            const usuarios = await ejecutarConsulta(consulta);
            return usuarios.map(usuario => new Usuario(usuario));
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    // Obtener usuario por ID
    static async obtenerPorId(id) {
        try {
            const consulta = `
                SELECT id, nombre, email, rol, estado, created_at, updated_at 
                FROM usuarios 
                WHERE id = ?
            `;
            const resultados = await ejecutarConsulta(consulta, [id]);
            
            if (resultados.length === 0) {
                return null;
            }
            
            return new Usuario(resultados[0]);
        } catch (error) {
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }

    // Obtener usuario por email (sin password para uso general)
    static async obtenerPorEmail(email) {
        try {
            const consulta = `
                SELECT id, nombre, email, rol, estado, created_at, updated_at 
                FROM usuarios 
                WHERE email = ?
            `;
            const resultados = await ejecutarConsulta(consulta, [email]);
            
            if (resultados.length === 0) {
                return null;
            }
            
            return new Usuario(resultados[0]);
        } catch (error) {
            throw new Error(`Error al obtener usuario por email: ${error.message}`);
        }
    }

    // Obtener usuario por email incluyendo password (para login)
    static async obtenerPorEmailConPassword(email) {
        try {
            const consulta = `
                SELECT id, nombre, email, password, rol, estado, created_at, updated_at 
                FROM usuarios 
                WHERE email = ?
            `;
            const resultados = await ejecutarConsulta(consulta, [email]);
            
            if (resultados.length === 0) {
                return null;
            }
            
            return new Usuario(resultados[0]);
        } catch (error) {
            throw new Error(`Error al obtener usuario por email con password: ${error.message}`);
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

    // Crear nuevo usuario
    async crear() {
        try {
            // Validar que el email no exista
            const usuarioExistente = await Usuario.obtenerPorEmail(this.email);
            if (usuarioExistente) {
                throw new Error('El email ya está registrado');
            }

            // Cifrar password si se proporcionó
            let passwordHash = this.password;
            if (this.password && !this.password.startsWith('$2b$')) {
                // Si no es un hash bcrypt (no empieza con $2b$), cifrarlo
                passwordHash = await Usuario.generarHashPassword(this.password);
            }

            const consulta = `
                INSERT INTO usuarios (nombre, email, password, rol, estado) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const parametros = [this.nombre, this.email, passwordHash, this.rol, this.estado];
            
            const resultado = await ejecutarConsulta(consulta, parametros);
            this.id = resultado.insertId;
            
            // Obtener el usuario creado con todos los campos (sin password)
            const usuarioCreado = await Usuario.obtenerPorId(this.id);
            return usuarioCreado;
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Actualizar usuario
    async actualizar() {
        try {
            // Verificar que el usuario existe
            const usuarioExistente = await Usuario.obtenerPorId(this.id);
            if (!usuarioExistente) {
                throw new Error('Usuario no encontrado');
            }

            // Si se está cambiando el email, verificar que no exista
            if (this.email !== usuarioExistente.email) {
                const emailExistente = await Usuario.obtenerPorEmail(this.email);
                if (emailExistente) {
                    throw new Error('El email ya está registrado por otro usuario');
                }
            }

            const consulta = `
                UPDATE usuarios 
                SET nombre = ?, email = ?, rol = ?, estado = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            const parametros = [this.nombre, this.email, this.rol, this.estado, this.id];
            
            await ejecutarConsulta(consulta, parametros);
            
            // Obtener el usuario actualizado
            const usuarioActualizado = await Usuario.obtenerPorId(this.id);
            return usuarioActualizado;
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Eliminar usuario
    static async eliminar(id) {
        try {
            // Verificar que el usuario existe
            const usuarioExistente = await Usuario.obtenerPorId(id);
            if (!usuarioExistente) {
                throw new Error('Usuario no encontrado');
            }

            const consulta = 'DELETE FROM usuarios WHERE id = ?';
            await ejecutarConsulta(consulta, [id]);
            
            return { mensaje: 'Usuario eliminado correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    // Validar datos del usuario
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

        // Validar password solo si se está creando un nuevo usuario (no en actualización)
        if (!this.id && (!this.password || this.password.trim().length === 0)) {
            errores.push('La contraseña es requerida');
        } else if (this.password && this.password.length < 6 && !this.password.startsWith('$2b$')) {
            errores.push('La contraseña debe tener al menos 6 caracteres');
        }

        if (this.rol && !['admin', 'usuario', 'transportador', 'agricultor'].includes(this.rol)) {
            errores.push('El rol debe ser: admin, usuario, transportador o agricultor');
        }

        if (this.estado && !['activo', 'inactivo'].includes(this.estado)) {
            errores.push('El estado debe ser: activo o inactivo');
        }

        return errores;
    }

    // Validar formato de email
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Convertir a objeto JSON (sin exponer password)
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            rol: this.rol,
            estado: this.estado,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default Usuario;