import { ejecutarConsulta } from '../configuracion/db.js';
import bcrypt from 'bcrypt';

class Admin {
constructor(datos) {
    this.id = datos.idusuario || null;
    this.nombre = datos.nombre || '';
    this.email = datos.email || '';
    this.password = datos.password || null;
    this.rol = datos.rol || 'admin';
    this.created_at = datos.created_at || null;
    this.updated_at = datos.updated_at || null;
}


    static async obtenerPorEmail(email) {
        try {
            const consulta = `
                SELECT idusuario, nombre, email, password, rol, created_at, updated_at
                FROM usuarios
                WHERE email = $1
            `;
            const resultados = await ejecutarConsulta(consulta, [email]);

            if (resultados.length === 0) return null;

            return new Admin(resultados[0]);
        } catch (error) {
            throw new Error(`Error al obtener administrador por email: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
    try {
        const consulta = `
            SELECT idusuario, nombre, email, password, rol, created_at, updated_at 
            FROM usuarios 
            WHERE idusuario = $1
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


    async verificarPassword(password) {
        try {
            if (!this.password) return false;
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error(`Error al verificar contraseña: ${error.message}`);
        }
    }

    static async generarHashPassword(password) {
        try {
            return await bcrypt.hash(password, 10);
        } catch (error) {
            throw new Error(`Error al generar hash: ${error.message}`);
        }
    }

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

