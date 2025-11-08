// Módulo temporal - RF18: Estimación de costo de envío (pendiente de integración final)

/**
 * Controlador de Estimación de Costo de Envío
 * RF18 - Estimación de costo de envío
 * 
 * Maneja las solicitudes relacionadas con la estimación de costo de envío
 * entre vendedor y usuario.
 */

import Estimacion from '../modelo/Estimacion.js';

class EstimacionController {
    
    /**
     * GET /api/temp/estimacion/:idAgricultor/:idDistribuidor
     * Calcula la estimación del costo de envío entre vendedor y usuario
     * 
     * Nota: Los parámetros de ruta mantienen nombres antiguos (idAgricultor, idDistribuidor)
     * para compatibilidad con Postman, pero internamente se mapean a idVendedor e idUsuario.
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async calcularEstimacion(req, res) {
        try {
            // Mapear parámetros de ruta (compatibilidad Postman) a variables internas
            const { idAgricultor, idDistribuidor } = req.params;
            const idVendedor = idAgricultor; // Mapeo: idAgricultor → idVendedor
            const idUsuario = idDistribuidor; // Mapeo: idDistribuidor → idUsuario

            // Validar parámetros
            if (!idVendedor || !idUsuario) {
                return res.status(400).json({
                    exito: false,
                    error: 'Parámetros incompletos',
                    mensaje: 'El ID del vendedor y del usuario son requeridos',
                    codigo: 'RF18_001'
                });
            }

            // Validar que sean números
            if (isNaN(idVendedor) || isNaN(idUsuario)) {
                return res.status(400).json({
                    exito: false,
                    error: 'Parámetros inválidos',
                    mensaje: 'Los IDs deben ser números válidos',
                    codigo: 'RF18_002'
                });
            }

            // Calcular estimación usando los IDs mapeados
            const resultado = await Estimacion.calcularEstimacion(
                parseInt(idVendedor),
                parseInt(idUsuario)
            );

            // Respuesta exitosa con los nuevos nombres de campos
            res.status(200).json({
                exito: true,
                mensaje: 'Estimación calculada correctamente',
                datos: {
                    idVendedor: resultado.estimacion.idVendedor,
                    idUsuario: resultado.estimacion.idUsuario,
                    ubicacionVendedor: resultado.ubicacionVendedor,
                    ubicacionUsuario: resultado.ubicacionUsuario,
                    distanciaKm: resultado.detalles.distanciaKm,
                    tarifaBase: resultado.detalles.tarifaBase,
                    costoPorKm: resultado.detalles.costoPorKm,
                    costoEstimado: resultado.detalles.costoEstimado,
                    formula: resultado.detalles.formula,
                    moneda: 'COP',
                    estado: 'estimado'
                },
                codigo: 'RF18_SUCCESS'
            });

        } catch (error) {
            console.error('Error en calcularEstimacion:', error);

            // Manejar diferentes tipos de errores
            if (error.message.includes('ubicación') || error.message.includes('Ubicación')) {
                return res.status(404).json({
                    exito: false,
                    error: 'Ubicación incorrecta',
                    mensaje: 'No se pudieron obtener las ubicaciones del vendedor o usuario',
                    detalle: error.message,
                    codigo: 'RF18_003'
                });
            }

            if (error.message.includes('distancia') || error.message.includes('Distancia')) {
                return res.status(400).json({
                    exito: false,
                    error: 'Error en el cálculo',
                    mensaje: 'Error al calcular la distancia entre las ubicaciones',
                    detalle: error.message,
                    codigo: 'RF18_004'
                });
            }

            if (error.message.includes('cálculo') || error.message.includes('calcular')) {
                return res.status(500).json({
                    exito: false,
                    error: 'Error en el cálculo',
                    mensaje: 'Error al calcular la estimación del costo de envío',
                    detalle: error.message,
                    codigo: 'RF18_005'
                });
            }

            // Error genérico
            res.status(500).json({
                exito: false,
                error: 'Error interno del servidor',
                mensaje: 'Error al procesar la solicitud de estimación',
                detalle: error.message,
                codigo: 'RF18_000'
            });
        }
    }

    /**
     * POST /api/temp/estimacion/confirmar
     * Ajusta el costo final al confirmar el pedido
     * 
     * Body esperado:
     * {
     *   costoEstimado: number,
     *   ajustes?: {
     *     descuento?: number,
     *     porcentajeDescuento?: number,
     *     recargo?: number,
     *     porcentajeRecargo?: number
     *   }
     * }
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async confirmarCosto(req, res) {
        try {
            const { costoEstimado, ajustes = {} } = req.body;

            // Validar que se proporcione el costo estimado
            if (!costoEstimado || isNaN(costoEstimado)) {
                return res.status(400).json({
                    exito: false,
                    error: 'Datos incompletos',
                    mensaje: 'El costo estimado es requerido y debe ser un número válido',
                    codigo: 'RF18_006'
                });
            }

            // Validar que el costo estimado sea positivo
            if (parseFloat(costoEstimado) < 0) {
                return res.status(400).json({
                    exito: false,
                    error: 'Costo mal estimado',
                    mensaje: 'El costo estimado no puede ser negativo',
                    codigo: 'RF18_007'
                });
            }

            // Validar ajustes si se proporcionan
            if (ajustes.descuento && (isNaN(ajustes.descuento) || ajustes.descuento < 0)) {
                return res.status(400).json({
                    exito: false,
                    error: 'Ajustes inválidos',
                    mensaje: 'El descuento debe ser un número positivo o cero',
                    codigo: 'RF18_008'
                });
            }

            if (ajustes.porcentajeDescuento && 
                (isNaN(ajustes.porcentajeDescuento) || 
                 ajustes.porcentajeDescuento < 0 || 
                 ajustes.porcentajeDescuento > 100)) {
                return res.status(400).json({
                    exito: false,
                    error: 'Ajustes inválidos',
                    mensaje: 'El porcentaje de descuento debe ser un número entre 0 y 100',
                    codigo: 'RF18_009'
                });
            }

            if (ajustes.recargo && (isNaN(ajustes.recargo) || ajustes.recargo < 0)) {
                return res.status(400).json({
                    exito: false,
                    error: 'Ajustes inválidos',
                    mensaje: 'El recargo debe ser un número positivo o cero',
                    codigo: 'RF18_010'
                });
            }

            if (ajustes.porcentajeRecargo && 
                (isNaN(ajustes.porcentajeRecargo) || ajustes.porcentajeRecargo < 0)) {
                return res.status(400).json({
                    exito: false,
                    error: 'Ajustes inválidos',
                    mensaje: 'El porcentaje de recargo debe ser un número positivo o cero',
                    codigo: 'RF18_011'
                });
            }

            // Calcular costo final ajustado
            const costoFinal = Estimacion.ajustarCostoFinal(
                parseFloat(costoEstimado),
                ajustes
            );

            // Validar que el costo final sea razonable
            if (costoFinal <= 0) {
                return res.status(400).json({
                    exito: false,
                    error: 'Costo mal estimado',
                    mensaje: 'El costo final no puede ser cero o negativo después de los ajustes',
                    codigo: 'RF18_012'
                });
            }

            // Construir detalle de ajustes aplicados
            const detallesAjustes = [];
            if (ajustes.descuento) {
                detallesAjustes.push(`Descuento fijo: -${ajustes.descuento} COP`);
            }
            if (ajustes.porcentajeDescuento) {
                detallesAjustes.push(`Descuento porcentual: -${ajustes.porcentajeDescuento}%`);
            }
            if (ajustes.recargo) {
                detallesAjustes.push(`Recargo fijo: +${ajustes.recargo} COP`);
            }
            if (ajustes.porcentajeRecargo) {
                detallesAjustes.push(`Recargo porcentual: +${ajustes.porcentajeRecargo}%`);
            }

            // Respuesta exitosa
            res.status(200).json({
                exito: true,
                mensaje: 'Costo ajustado correctamente',
                datos: {
                    costoEstimado: parseFloat(costoEstimado),
                    costoFinal: costoFinal,
                    diferencia: costoFinal - parseFloat(costoEstimado),
                    ajustesAplicados: detallesAjustes.length > 0 ? detallesAjustes : ['Sin ajustes'],
                    moneda: 'COP',
                    estado: 'confirmado',
                    fechaConfirmacion: new Date().toISOString()
                },
                codigo: 'RF18_CONFIRM_SUCCESS'
            });

        } catch (error) {
            console.error('Error en confirmarCosto:', error);

            // Manejar errores de cálculo
            if (error.message.includes('calcular') || error.message.includes('ajustar')) {
                return res.status(500).json({
                    exito: false,
                    error: 'Error en el cálculo',
                    mensaje: 'Error al ajustar el costo final',
                    detalle: error.message,
                    codigo: 'RF18_013'
                });
            }

            // Error genérico
            res.status(500).json({
                exito: false,
                error: 'Error interno del servidor',
                mensaje: 'Error al procesar la confirmación del costo',
                detalle: error.message,
                codigo: 'RF18_014'
            });
        }
    }

    /**
     * GET /api/temp/estimacion/health
     * Endpoint de verificación de salud del módulo
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async healthCheck(req, res) {
        try {
            res.status(200).json({
                exito: true,
                mensaje: 'Módulo de estimación de costo de envío operativo',
                codigo: 'RF18_HEALTH_OK',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                error: 'Error en health check',
                mensaje: error.message,
                codigo: 'RF18_HEALTH_ERROR'
            });
        }
    }
}

export default EstimacionController;