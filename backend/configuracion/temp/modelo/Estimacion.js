// Módulo temporal - RF18: Estimación de costo de envío (pendiente de integración final)

/**
 * Modelo de Estimación de Costo de Envío
 * RF18 - Estimación de costo de envío
 * 
 * Simula el cálculo de costo de envío basado en distancia y tarifa base
 * entre vendedor y usuario.
 */

class Estimacion {
    constructor(datos) {
        this.id = datos.id || null;
        this.idVendedor = datos.idVendedor || datos.idAgricultor || null; // Compatibilidad con rutas antiguas
        this.idUsuario = datos.idUsuario || datos.idDistribuidor || null; // Compatibilidad con rutas antiguas
        this.distanciaKm = datos.distanciaKm || 0;
        this.tarifaBase = datos.tarifaBase || 5000; // Tarifa base en pesos colombianos
        this.costoPorKm = datos.costoPorKm || 1500; // Costo por kilómetro en pesos
        this.costoEstimado = datos.costoEstimado || 0;
        this.costoFinal = datos.costoFinal || null; // Costo ajustado al confirmar pedido
        this.estado = datos.estado || 'estimado'; // 'estimado', 'confirmado', 'cancelado'
        this.created_at = datos.created_at || null;
        this.updated_at = datos.updated_at || null;
    }

    /**
     * Obtener ubicación simulada de un vendedor
     * @param {number} idVendedor - ID del vendedor
     * @returns {Object} - Ubicación con latitud y longitud
     */
    static async obtenerUbicacionVendedor(idVendedor) {
        try {
            // Simulación: En un sistema real, esto consultaría la base de datos
            // Por ahora, generamos ubicaciones basadas en el ID para mantener consistencia
            const ubicacionesSimuladas = {
                1: { latitud: 4.6097, longitud: -74.0817, ciudad: 'Bogotá' }, // Bogotá
                2: { latitud: 6.2476, longitud: -75.5658, ciudad: 'Medellín' }, // Medellín
                3: { latitud: 3.4516, longitud: -76.5320, ciudad: 'Cali' }, // Cali
                4: { latitud: 10.9639, longitud: -74.7964, ciudad: 'Barranquilla' }, // Barranquilla
                5: { latitud: 4.8133, longitud: -75.6961, ciudad: 'Pereira' } // Pereira
            };

            const ubicacion = ubicacionesSimuladas[idVendedor] || 
                { latitud: 4.6097 + (idVendedor * 0.1), longitud: -74.0817 + (idVendedor * 0.1), ciudad: 'Ubicación Genérica' };

            return ubicacion;
        } catch (error) {
            throw new Error(`Error al obtener ubicación del vendedor: ${error.message}`);
        }
    }

    /**
     * Obtener ubicación simulada de un usuario
     * @param {number} idUsuario - ID del usuario
     * @returns {Object} - Ubicación con latitud y longitud
     */
    static async obtenerUbicacionUsuario(idUsuario) {
        try {
            // Simulación: En un sistema real, esto consultaría la base de datos
            const ubicacionesSimuladas = {
                1: { latitud: 4.7110, longitud: -74.0721, ciudad: 'Bogotá Norte' },
                2: { latitud: 6.2442, longitud: -75.5812, ciudad: 'Medellín Centro' },
                3: { latitud: 3.4841, longitud: -76.5225, ciudad: 'Cali Norte' },
                4: { latitud: 10.9685, longitud: -74.7813, ciudad: 'Barranquilla Sur' },
                5: { latitud: 4.8133, longitud: -75.6961, ciudad: 'Pereira Centro' }
            };

            const ubicacion = ubicacionesSimuladas[idUsuario] || 
                { latitud: 4.7110 + (idUsuario * 0.1), longitud: -74.0721 + (idUsuario * 0.1), ciudad: 'Ubicación Genérica' };

            return ubicacion;
        } catch (error) {
            throw new Error(`Error al obtener ubicación del usuario: ${error.message}`);
        }
    }

    /**
     * Calcular distancia entre dos puntos usando fórmula de Haversine
     * @param {Object} ubicacion1 - Primera ubicación {latitud, longitud}
     * @param {Object} ubicacion2 - Segunda ubicación {latitud, longitud}
     * @returns {number} - Distancia en kilómetros
     */
    static calcularDistancia(ubicacion1, ubicacion2) {
        try {
            const R = 6371; // Radio de la Tierra en kilómetros
            const dLat = this.gradosARadianes(ubicacion2.latitud - ubicacion1.latitud);
            const dLon = this.gradosARadianes(ubicacion2.longitud - ubicacion1.longitud);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.gradosARadianes(ubicacion1.latitud)) *
                Math.cos(this.gradosARadianes(ubicacion2.latitud)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distancia = R * c;

            // Redondear a 2 decimales
            return Math.round(distancia * 100) / 100;
        } catch (error) {
            throw new Error(`Error al calcular distancia: ${error.message}`);
        }
    }

    /**
     * Convertir grados a radianes
     * @param {number} grados - Grados a convertir
     * @returns {number} - Radianes
     */
    static gradosARadianes(grados) {
        return grados * (Math.PI / 180);
    }

    /**
     * Calcular costo estimado de envío
     * @param {number} distanciaKm - Distancia en kilómetros
     * @param {number} tarifaBase - Tarifa base en pesos
     * @param {number} costoPorKm - Costo por kilómetro en pesos
     * @returns {number} - Costo estimado en pesos
     */
    static calcularCostoEstimado(distanciaKm, tarifaBase = 5000, costoPorKm = 1500) {
        try {
            // Validar que la distancia sea válida
            if (distanciaKm < 0) {
                throw new Error('La distancia no puede ser negativa');
            }

            // Calcular costo: tarifa base + (distancia * costo por km)
            let costo = tarifaBase + (distanciaKm * costoPorKm);

            // Aplicar descuentos según distancia (más distancia, menor costo por km)
            if (distanciaKm > 100) {
                costo = tarifaBase + (100 * costoPorKm) + ((distanciaKm - 100) * (costoPorKm * 0.8));
            } else if (distanciaKm > 50) {
                costo = tarifaBase + (50 * costoPorKm) + ((distanciaKm - 50) * (costoPorKm * 0.9));
            }

            // Redondear al múltiplo de 100 más cercano
            return Math.round(costo / 100) * 100;
        } catch (error) {
            throw new Error(`Error al calcular costo estimado: ${error.message}`);
        }
    }

    /**
     * Calcular estimación de costo de envío entre vendedor y usuario
     * @param {number} idVendedor - ID del vendedor
     * @param {number} idUsuario - ID del usuario
     * @returns {Object} - Objeto con la estimación completa
     */
    static async calcularEstimacion(idVendedor, idUsuario) {
        try {
            // Validar IDs
            if (!idVendedor || !idUsuario) {
                throw new Error('El ID del vendedor y del usuario son requeridos');
            }

            if (isNaN(idVendedor) || isNaN(idUsuario)) {
                throw new Error('Los IDs deben ser números válidos');
            }

            // Obtener ubicaciones
            const ubicacionVendedor = await this.obtenerUbicacionVendedor(parseInt(idVendedor));
            const ubicacionUsuario = await this.obtenerUbicacionUsuario(parseInt(idUsuario));

            // Validar que las ubicaciones sean válidas
            if (!ubicacionVendedor || !ubicacionUsuario) {
                throw new Error('No se pudieron obtener las ubicaciones');
            }

            // Calcular distancia
            const distanciaKm = this.calcularDistancia(ubicacionVendedor, ubicacionUsuario);

            // Validar distancia (no puede ser 0 o negativa)
            if (distanciaKm <= 0) {
                throw new Error('La distancia calculada no es válida');
            }

            // Calcular costo estimado
            const tarifaBase = 5000;
            const costoPorKm = 1500;
            const costoEstimado = this.calcularCostoEstimado(distanciaKm, tarifaBase, costoPorKm);

            // Crear objeto de estimación
            const estimacion = new Estimacion({
                idVendedor: parseInt(idVendedor),
                idUsuario: parseInt(idUsuario),
                distanciaKm,
                tarifaBase,
                costoPorKm,
                costoEstimado,
                estado: 'estimado'
            });

            return {
                estimacion,
                ubicacionVendedor,
                ubicacionUsuario,
                detalles: {
                    distanciaKm,
                    tarifaBase,
                    costoPorKm,
                    costoEstimado,
                    formula: `Costo = ${tarifaBase} + (${distanciaKm} km × ${costoPorKm}) = ${costoEstimado} COP`
                }
            };
        } catch (error) {
            throw new Error(`Error al calcular estimación: ${error.message}`);
        }
    }

    /**
     * Ajustar costo final al confirmar pedido
     * @param {number} costoEstimado - Costo estimado original
     * @param {Object} ajustes - Objetos con ajustes opcionales
     * @returns {number} - Costo final ajustado
     */
    static ajustarCostoFinal(costoEstimado, ajustes = {}) {
        try {
            let costoFinal = costoEstimado;

            // Aplicar descuentos
            if (ajustes.descuento && ajustes.descuento > 0) {
                costoFinal -= ajustes.descuento;
            }

            // Aplicar porcentaje de descuento
            if (ajustes.porcentajeDescuento && ajustes.porcentajeDescuento > 0) {
                costoFinal = costoFinal * (1 - ajustes.porcentajeDescuento / 100);
            }

            // Aplicar recargos
            if (ajustes.recargo && ajustes.recargo > 0) {
                costoFinal += ajustes.recargo;
            }

            // Aplicar porcentaje de recargo
            if (ajustes.porcentajeRecargo && ajustes.porcentajeRecargo > 0) {
                costoFinal = costoFinal * (1 + ajustes.porcentajeRecargo / 100);
            }

            // Validar que el costo final sea positivo
            if (costoFinal < 0) {
                costoFinal = 0;
            }

            // Redondear al múltiplo de 100 más cercano
            return Math.round(costoFinal / 100) * 100;
        } catch (error) {
            throw new Error(`Error al ajustar costo final: ${error.message}`);
        }
    }

    /**
     * Validar datos de la estimación
     * @returns {Array} - Array de errores (vacío si no hay errores)
     */
    validar() {
        const errores = [];

        if (!this.idVendedor || isNaN(this.idVendedor)) {
            errores.push('El ID del vendedor es requerido y debe ser un número válido');
        }

        if (!this.idUsuario || isNaN(this.idUsuario)) {
            errores.push('El ID del usuario es requerido y debe ser un número válido');
        }

        if (this.distanciaKm < 0) {
            errores.push('La distancia no puede ser negativa');
        }

        if (this.costoEstimado < 0) {
            errores.push('El costo estimado no puede ser negativo');
        }

        if (this.estado && !['estimado', 'confirmado', 'cancelado'].includes(this.estado)) {
            errores.push('El estado debe ser: estimado, confirmado o cancelado');
        }

        return errores;
    }

    /**
     * Convertir a objeto JSON
     * @returns {Object} - Objeto JSON
     */
    toJSON() {
        return {
            id: this.id,
            idVendedor: this.idVendedor,
            idUsuario: this.idUsuario,
            distanciaKm: this.distanciaKm,
            tarifaBase: this.tarifaBase,
            costoPorKm: this.costoPorKm,
            costoEstimado: this.costoEstimado,
            costoFinal: this.costoFinal,
            estado: this.estado,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default Estimacion;